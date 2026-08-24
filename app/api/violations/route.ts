import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'ALL'; // ALL, CRITICAL, RECURRING, NEEDS_REVIEW
    const locationId = searchParams.get('locationId');

    const where: any = {};
    if (locationId) where.locationId = locationId;

    if (filter === 'CRITICAL') {
      where.severity = 'CRITICAL';
    } else if (filter === 'RECURRING') {
      where.isRecurring = true;
    } else if (filter === 'NEEDS_REVIEW') {
      where.status = 'NEEDS_REVIEW';
    }

    const violations = await db.violation.findMany({
      where,
      orderBy: [{ isRecurring: 'desc' }, { severity: 'desc' }, { createdAt: 'desc' }],
      include: {
        location: true,
        standard: true,
        evidences: { include: { mediaAsset: true } },
        correctiveActions: true,
        reviews: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    return NextResponse.json({ violations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch violations' }, { status: 500 });
  }
}
