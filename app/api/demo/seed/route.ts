import { NextResponse } from 'next/server';
import { seedDemoDatabase } from '@/demo/seed';

export async function POST() {
  try {
    const result = await seedDemoDatabase();
    return NextResponse.json({
      success: true,
      message: 'FranchiseGuard AI demo dataset seeded successfully!',
      heroLocationId: result.heroLocationId,
      locationCount: result.locationCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to seed demo dataset' }, { status: 500 });
  }
}
