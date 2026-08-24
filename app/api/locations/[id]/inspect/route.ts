import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RocketRideService } from '@/lib/rocketride';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const locationId = params.id;
    const location = await db.location.findUnique({ where: { id: locationId } });

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    const rocketride = new RocketRideService();
    const pipelineRunId = await rocketride.executeLocationAuditPipeline(locationId);

    return NextResponse.json({
      success: true,
      message: 'RocketRide location audit pipeline started',
      pipelineRunId,
    });
  } catch (err: any) {
    console.error('API Location Inspect error:', err);
    return NextResponse.json({ error: err.message || 'Failed to start location audit' }, { status: 500 });
  }
}
