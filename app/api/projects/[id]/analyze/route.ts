import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RocketRideService } from '@/lib/rocketride';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const rocketride = new RocketRideService();
    const pipelineRunId = await rocketride.executeFullRfpPipeline(projectId, project.organizationId);

    return NextResponse.json({
      success: true,
      message: 'RocketRide RFP analysis pipeline started',
      pipelineRunId,
    });
  } catch (err: any) {
    console.error('API Analyze error:', err);
    return NextResponse.json({ error: err.message || 'Failed to start RFP analysis' }, { status: 500 });
  }
}
