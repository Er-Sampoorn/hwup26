import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const locationId = params.id;
    const location = await db.location.findUnique({
      where: { id: locationId },
      include: {
        owner: true,
        violations: {
          include: {
            standard: true,
            evidences: { include: { mediaAsset: true } },
            correctiveActions: true,
          },
          orderBy: [{ isRecurring: 'desc' }, { createdAt: 'desc' }],
        },
        mediaAssets: {
          include: { analysis: true },
          orderBy: { capturedAt: 'desc' },
        },
        correctiveActions: {
          include: { violation: { include: { standard: true } }, reinspections: true },
          orderBy: { createdAt: 'desc' },
        },
        customerFeedbacks: {
          orderBy: { processedAt: 'desc' },
        },
        riskScores: {
          orderBy: { calculatedAt: 'desc' },
          take: 5,
        },
        pipelineRuns: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    const openViolations = location.violations.filter((v) => v.status !== 'RESOLVED' && v.status !== 'REJECTED').length;
    const recurringViolations = location.violations.filter((v) => v.isRecurring && v.status !== 'RESOLVED').length;
    const pendingActions = location.correctiveActions.filter((a) => a.status === 'PENDING' || a.status === 'OVERDUE').length;

    return NextResponse.json({
      location,
      stats: {
        openViolations,
        recurringViolations,
        pendingActions,
        riskScore: location.riskScore,
        riskCategory: location.riskCategory,
        complianceScore: location.complianceScore,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch location details' }, { status: 500 });
  }
}
