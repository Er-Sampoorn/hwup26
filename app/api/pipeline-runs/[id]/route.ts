import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pipelineRun = await db.pipelineRun.findUnique({
      where: { id: params.id },
      include: {
        location: {
          select: { id: true, name: true, code: true },
        },
      },
    });

    if (!pipelineRun) {
      return NextResponse.json({ error: 'Pipeline run not found' }, { status: 404 });
    }

    const agentRuns = await db.agentRun.findMany({
      where: { pipelineRunId: params.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      pipelineRun,
      agentRuns,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch pipeline status' }, { status: 500 });
  }
}
