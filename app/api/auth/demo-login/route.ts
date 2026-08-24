import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { seedDemoDatabase } from '@/demo/seed';

export async function POST() {
  try {
    let org = await db.organization.findUnique({ where: { slug: 'acme-telecom' } });
    if (!org) {
      await seedDemoDatabase();
      org = await db.organization.findUnique({ where: { slug: 'acme-telecom' } });
    }

    let user = await db.user.findFirst({ where: { organizationId: org?.id } });
    if (!user) {
      await seedDemoDatabase();
      user = await db.user.findFirst({ where: { organizationId: org?.id } });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        role: user?.role,
        organizationId: user?.organizationId,
      },
    });

    response.cookies.set('bidforge_session', JSON.stringify({ userId: user?.id, orgId: user?.organizationId }), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Demo login failed' }, { status: 500 });
  }
}
