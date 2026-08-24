import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const { searchParams } = new URL(req.url);

    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const risk = searchParams.get('risk');
    const mandatory = searchParams.get('mandatory');
    const search = searchParams.get('search');

    const where: any = { projectId };

    if (category && category !== 'ALL') {
      where.category = category;
    }
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (risk && risk !== 'ALL') {
      where.risk = risk;
    }
    if (mandatory === 'true') {
      where.mandatory = true;
    }

    if (search) {
      where.OR = [
        { reqCode: { contains: search } },
        { question: { contains: search } },
        { answer: { contains: search } },
      ];
    }

    const requirements = await db.requirement.findMany({
      where,
      orderBy: { reqCode: 'asc' },
      include: {
        evidences: {
          include: {
            chunk: {
              include: { document: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ requirements });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch requirements' }, { status: 500 });
  }
}
