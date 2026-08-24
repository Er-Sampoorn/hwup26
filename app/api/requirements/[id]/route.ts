import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { findEvidenceForQuestion } from '@/lib/evidence-engine';
import { SpecialistAgentOrchestrator } from '@/lib/agents';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const requirement = await db.requirement.findUnique({
      where: { id: params.id },
      include: {
        evidences: {
          include: {
            chunk: {
              include: { document: true },
            },
          },
        },
        reviews: {
          include: { reviewer: true, comments: true },
          orderBy: { createdAt: 'desc' },
        },
        outputs: {
          include: { validations: true, agentRun: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!requirement) {
      return NextResponse.json({ error: 'Requirement not found' }, { status: 404 });
    }

    return NextResponse.json({ requirement });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch requirement details' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { action, editedAnswer, comment, reviewerId } = body;
    // Actions: APPROVE, EDIT, REJECT, REGENERATE

    const requirement = await db.requirement.findUnique({
      where: { id: params.id },
      include: { project: true },
    });

    if (!requirement) {
      return NextResponse.json({ error: 'Requirement not found' }, { status: 404 });
    }

    let user = null;
    if (reviewerId) {
      user = await db.user.findUnique({ where: { id: reviewerId } });
    }
    if (!user) {
      user = await db.user.findFirst();
    }

    const previousAnswer = requirement.answer;

    if (action === 'APPROVE') {
      await db.requirement.update({
        where: { id: requirement.id },
        data: {
          status: 'verified',
          confidence: Math.max(90, requirement.confidence),
          risk: 'low',
        },
      });
    } else if (action === 'EDIT') {
      await db.requirement.update({
        where: { id: requirement.id },
        data: {
          answer: editedAnswer || requirement.answer,
          status: 'verified',
          confidence: 95.0,
          reasoningSummary: `Manually verified and updated by reviewer ${user?.name || 'Reviewer'}.`,
        },
      });
    } else if (action === 'REJECT') {
      await db.requirement.update({
        where: { id: requirement.id },
        data: {
          status: 'unsupported',
          risk: 'high',
          answer: 'Rejected by reviewer: Insufficient or non-compliant evidence provided.',
        },
      });
    } else if (action === 'REGENERATE') {
      const evidence = await findEvidenceForQuestion(
        requirement.question,
        requirement.category || 'General',
        requirement.project.organizationId,
        requirement.projectId
      );

      const orchestrator = new SpecialistAgentOrchestrator();
      const result = await orchestrator.processRequirement(
        requirement.reqCode,
        requirement.question,
        requirement.category || 'General',
        requirement.mandatory,
        evidence
      );

      await db.requirement.update({
        where: { id: requirement.id },
        data: {
          answer: result.answer,
          confidence: result.confidence,
          risk: result.risk,
          status: result.status,
          reasoningSummary: result.reasoningSummary,
        },
      });
    }

    // Save Review Audit Record
    const review = await db.review.create({
      data: {
        requirementId: requirement.id,
        reviewerId: user?.id || 'system-user',
        action,
        previousAnswer,
        newAnswer: editedAnswer || requirement.answer,
        reason: comment || `Reviewer action: ${action}`,
      },
    });

    if (comment) {
      await db.reviewComment.create({
        data: {
          reviewId: review.id,
          userId: user?.id || 'system-user',
          comment,
        },
      });
    }

    await db.auditLog.create({
      data: {
        projectId: requirement.projectId,
        userId: user?.id,
        action: `REVIEWER_${action}`,
        details: `Reviewer ${user?.name || 'User'} performed action ${action} on requirement ${requirement.reqCode}.`,
      },
    });

    const updatedReq = await db.requirement.findUnique({
      where: { id: params.id },
      include: { evidences: { include: { chunk: { include: { document: true } } } } },
    });

    return NextResponse.json({ success: true, requirement: updatedReq });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to process review action' }, { status: 500 });
  }
}
