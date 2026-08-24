import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { seedDemoDatabase } from '@/demo/seed';

export async function GET(req: NextRequest) {
  try {
    let projects = await db.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { requirements: true },
        },
      },
    });

    if (projects.length === 0) {
      await seedDemoDatabase();
      projects = await db.project.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { requirements: true },
          },
        },
      });
    }

    return NextResponse.json({ projects });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, customer, deadline, rfpType, description } = body;

    if (!name || !customer) {
      return NextResponse.json({ error: 'Name and Customer are required' }, { status: 400 });
    }

    let org = await db.organization.findFirst();
    if (!org) {
      org = await db.organization.create({
        data: { name: 'Default Enterprise Org', slug: 'default-org' },
      });
    }

    const project = await db.project.create({
      data: {
        name,
        customer,
        deadline: deadline ? new Date(deadline) : null,
        rfpType: rfpType || 'RFP',
        description,
        organizationId: org.id,
      },
    });

    await db.auditLog.create({
      data: {
        projectId: project.id,
        action: 'PROJECT_CREATED',
        details: `Created new project: ${name} for ${customer}`,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create project' }, { status: 500 });
  }
}
