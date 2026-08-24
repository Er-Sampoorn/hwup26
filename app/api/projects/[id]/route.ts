import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        rfp: {
          include: { documents: true },
        },
        pipelineRuns: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        evidenceDocuments: {
          include: { chunks: true },
        },
        _count: {
          select: {
            requirements: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const requirements = await db.requirement.findMany({
      where: { projectId },
    });

    const totalReqs = requirements.length;
    const verified = requirements.filter((r) => r.status === 'verified').length;
    const needsReview = requirements.filter((r) => r.status === 'needs_review').length;
    const unsupported = requirements.filter((r) => r.status === 'unsupported').length;
    const mandatory = requirements.filter((r) => r.mandatory).length;

    const avgConfidence = totalReqs > 0
      ? (requirements.reduce((acc, r) => acc + r.confidence, 0) / totalReqs).toFixed(1)
      : '0.0';

    const coveragePct = totalReqs > 0
      ? (((verified + needsReview) / totalReqs) * 100).toFixed(1)
      : '0.0';

    const totalCost = project.pipelineRuns.reduce((acc, r) => acc + r.estimatedCost, 0).toFixed(4);

    return NextResponse.json({
      project,
      stats: {
        totalReqs,
        verified,
        needsReview,
        unsupported,
        mandatory,
        avgConfidence: parseFloat(avgConfidence),
        coveragePct: parseFloat(coveragePct),
        totalCost: parseFloat(totalCost),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch project details' }, { status: 500 });
  }
}
