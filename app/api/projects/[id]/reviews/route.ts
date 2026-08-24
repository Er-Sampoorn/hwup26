import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'ALL'; // ALL, HIGH_RISK, MISSING_EVIDENCE, MANDATORY, LOW_CONFIDENCE

    const where: any = {
      projectId,
      status: { in: ['needs_review', 'unsupported'] },
    };

    if (filter === 'HIGH_RISK') {
      where.risk = 'high';
    } else if (filter === 'MISSING_EVIDENCE') {
      where.status = 'unsupported';
    } else if (filter === 'MANDATORY') {
      where.mandatory = true;
    } else if (filter === 'LOW_CONFIDENCE') {
      where.confidence = { lte: 75.0 };
    }

    const reviewItems = await db.requirement.findMany({
      where,
      orderBy: [{ risk: 'desc' }, { confidence: 'asc' }],
      include: {
        evidences: {
          include: {
            chunk: {
              include: { document: true },
            },
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json({ reviewItems });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch review inbox' }, { status: 500 });
  }
}
