import { NextResponse } from 'next/server';
import { RocketRideStagingService } from '@/lib/rocketride-staging';

const stagingService = new RocketRideStagingService();

/**
 * GET /api/rocketride/staging
 * Returns current health, staging connection status, and list of pipelines ready for staging.
 */
export async function GET() {
  try {
    const health = stagingService.getStagingHealth();
    return NextResponse.json({
      success: true,
      ...health,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to fetch staging health status.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/rocketride/staging
 * Triggers deployment and synchronization of all declarative .pipe files to staging.rocketride.ai
 */
export async function POST() {
  try {
    const result = await stagingService.deployToStaging();
    return NextResponse.json({
      success: true,
      message: `Successfully deployed ${result.pipesCount} pipelines to ${result.stagingUrl}`,
      deployment: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to deploy pipelines to RocketRide Staging.',
      },
      { status: 500 }
    );
  }
}
