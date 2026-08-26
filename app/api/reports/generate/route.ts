import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FranchiseReportExporter, AuditExportData } from '@/lib/exporter';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get('locationId');
    const format = (searchParams.get('format') || 'DOCX').toUpperCase();

    let location = null;
    if (locationId) {
      location = await db.location.findUnique({
        where: { id: locationId },
        include: {
          violations: {
            include: { standard: true },
          },
        },
      });
    }

    if (!location) {
      location = await db.location.findFirst({
        include: {
          violations: {
            include: { standard: true },
          },
        },
      });
    }

    if (!location) {
      return NextResponse.json({ error: 'No location available for export' }, { status: 404 });
    }

    const exportData: AuditExportData = {
      locationCode: location.code,
      locationName: location.name,
      address: location.address,
      region: location.region,
      manager: location.manager,
      complianceScore: location.complianceScore,
      riskScore: location.riskScore,
      riskCategory: location.riskCategory,
      violations: location.violations.map((v) => ({
        violationCode: v.violationCode,
        standardCode: v.standard.code,
        category: v.standard.category,
        title: v.standard.title,
        description: v.description,
        severity: v.severity,
        status: v.status,
        isRecurring: v.isRecurring,
        confidence: v.confidence,
        aiExplanation: v.aiExplanation || undefined,
      })),
    };

    const exporter = new FranchiseReportExporter();

    if (format === 'JSON') {
      const json = exporter.generateJson(exportData);
      return new NextResponse(json, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${location.code}_compliance_report.json"`,
        },
      });
    }

    if (format === 'XLSX') {
      const xlsxBuffer = exporter.generateXlsx(exportData);
      return new NextResponse(Uint8Array.from(xlsxBuffer), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${location.code}_violations_matrix.xlsx"`,
        },
      });
    }

    if (format === 'PDF') {
      const pdfBuffer = exporter.generatePdf(exportData);
      return new NextResponse(Uint8Array.from(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${location.code}_compliance_report.pdf"`,
        },
      });
    }

    // Default: DOCX
    const docxBuffer = await exporter.generateDocx(exportData);
    return new NextResponse(Uint8Array.from(docxBuffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${location.code}_cure_notice_report.docx"`,
      },
    });
  } catch (err: any) {
    console.error('Export report error:', err);
    return NextResponse.json({ error: err.message || 'Report export failed' }, { status: 500 });
  }
}
