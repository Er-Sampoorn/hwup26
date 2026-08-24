import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyLocationRemediation } from '@/lib/reinspection-engine';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const violation = await db.violation.findUnique({
      where: { id: params.id },
      include: {
        location: { include: { owner: true } },
        standard: true,
        evidences: { include: { mediaAsset: true } },
        correctiveActions: { include: { reinspections: true } },
        reviews: { include: { reviewer: true, comments: true }, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!violation) {
      return NextResponse.json({ error: 'Violation not found' }, { status: 404 });
    }

    return NextResponse.json({ violation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch violation details' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { action, reason, reviewerId, proofMediaUrl, remediationNotes } = body;
    // Actions: APPROVE, EDIT, REJECT, REINSPECT, CURE_NOTICE_ISSUED

    const violation = await db.violation.findUnique({
      where: { id: params.id },
      include: { location: true, standard: true, correctiveActions: true },
    });

    if (!violation) {
      return NextResponse.json({ error: 'Violation not found' }, { status: 404 });
    }

    let user = reviewerId ? await db.user.findUnique({ where: { id: reviewerId } }) : await db.user.findFirst();

    if (action === 'APPROVE' || action === 'CURE_NOTICE_ISSUED') {
      await db.violation.update({
        where: { id: violation.id },
        data: {
          status: 'ESCALATED',
        },
      });

      // Send Cure Notice Notification
      if (user) {
        await db.notification.create({
          data: {
            userId: user.id,
            title: `Formal Cure Notice Issued: ${violation.location.name}`,
            message: `Issued formal default warning for recurring violation of Standard [${violation.standard.code}] ${violation.standard.title}.`,
            type: 'CURE_NOTICE',
          },
        });
      }
    } else if (action === 'REJECT') {
      await db.violation.update({
        where: { id: violation.id },
        data: {
          status: 'REJECTED',
        },
      });
    } else if (action === 'REINSPECT' && violation.correctiveActions.length > 0) {
      const actionObj = violation.correctiveActions[0];
      await verifyLocationRemediation(actionObj.id, proofMediaUrl || 'remediation_proof.jpg', remediationNotes);
    }

    // Save Review Audit Record
    await db.review.create({
      data: {
        violationId: violation.id,
        reviewerId: user?.id || 'system-user',
        action,
        reason: reason || `Reviewer action: ${action}`,
      },
    });

    await db.auditLog.create({
      data: {
        locationId: violation.locationId,
        userId: user?.id,
        action: `REVIEWER_${action}`,
        details: `Reviewer ${user?.name || 'User'} performed action ${action} on violation ${violation.violationCode}.`,
      },
    });

    const updatedViolation = await db.violation.findUnique({
      where: { id: params.id },
      include: { location: true, standard: true, evidences: { include: { mediaAsset: true } } },
    });

    return NextResponse.json({ success: true, violation: updatedViolation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to process violation action' }, { status: 500 });
  }
}
