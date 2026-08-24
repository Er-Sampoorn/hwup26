import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { seedDemoDatabase } from '@/demo/seed';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get('region');
    const risk = searchParams.get('risk');
    const search = searchParams.get('search');

    const where: any = {};
    if (region && region !== 'ALL') where.region = region;
    if (risk && risk !== 'ALL') where.riskCategory = risk;
    if (search) {
      where.OR = [
        { code: { contains: search } },
        { name: { contains: search } },
        { city: { contains: search } },
        { manager: { contains: search } },
      ];
    }

    let locations = await db.location.findMany({
      where,
      orderBy: [{ riskScore: 'desc' }, { code: 'asc' }],
      include: {
        owner: true,
        _count: {
          select: { violations: true, mediaAssets: true, correctiveActions: true },
        },
      },
    });

    if (locations.length === 0 && !region && !risk && !search) {
      await seedDemoDatabase();
      locations = await db.location.findMany({
        orderBy: [{ riskScore: 'desc' }, { code: 'asc' }],
        include: {
          owner: true,
          _count: {
            select: { violations: true, mediaAssets: true, correctiveActions: true },
          },
        },
      });
    }

    return NextResponse.json({ locations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, name, address, city, state, region, manager } = body;

    if (!code || !name || !address) {
      return NextResponse.json({ error: 'Code, Name, and Address are required' }, { status: 400 });
    }

    let org = await db.organization.findFirst();
    if (!org) {
      org = await db.organization.create({
        data: { name: 'BurgerCraft Corporate', slug: 'burgercraft-corporate' },
      });
    }

    const location = await db.location.create({
      data: {
        code,
        name,
        address,
        city: city || 'San Francisco',
        state: state || 'CA',
        region: region || 'West Coast',
        manager: manager || 'Manager',
        organizationId: org.id,
      },
    });

    await db.auditLog.create({
      data: {
        locationId: location.id,
        action: 'LOCATION_CREATED',
        details: `Created new franchise location ${code}: ${name}`,
      },
    });

    return NextResponse.json({ location }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create location' }, { status: 500 });
  }
}
