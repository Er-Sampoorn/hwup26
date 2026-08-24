import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ProposalExporter, ProposalExportData } from '@/lib/exporter';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const { searchParams } = new URL(req.url);
    const format = (searchParams.get('format') || 'DOCX').toUpperCase();

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        requirements: {
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
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const exportData: ProposalExportData = {
      projectName: project.name,
      customer: project.customer,
      deadline: project.deadline ? project.deadline.toISOString() : undefined,
      rfpType: project.rfpType,
      requirements: project.requirements.map((r) => ({
        reqCode: r.reqCode,
        category: r.category || 'General',
        question: r.question,
        mandatory: r.mandatory,
        answer: r.answer || '',
        confidence: r.confidence,
        risk: r.risk,
        status: r.status,
        reasoningSummary: r.reasoningSummary || undefined,
        evidences: r.evidences.map((ev) => ({
          documentName: ev.chunk.document.title || ev.chunk.document.fileName,
          section: ev.chunk.section || 'General',
          pageNumber: ev.chunk.pageNumber || 1,
          relevanceScore: ev.relevanceScore,
        })),
      })),
    };

    const exporter = new ProposalExporter();

    if (format === 'JSON') {
      const jsonContent = exporter.generateJson(exportData);
      return new NextResponse(jsonContent, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${project.name.replace(/\s+/g, '_')}_proposal.json"`,
        },
      });
    }

    if (format === 'XLSX') {
      const xlsxBuffer = exporter.generateXlsx(exportData);
      return new NextResponse(Uint8Array.from(xlsxBuffer), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${project.name.replace(/\s+/g, '_')}_compliance_matrix.xlsx"`,
        },
      });
    }

    if (format === 'PDF') {
      const pdfBuffer = exporter.generatePdf(exportData);
      return new NextResponse(Uint8Array.from(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${project.name.replace(/\s+/g, '_')}_proposal.pdf"`,
        },
      });
    }

    // Default: DOCX
    const docxBuffer = await exporter.generateDocx(exportData);
    return new NextResponse(Uint8Array.from(docxBuffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${project.name.replace(/\s+/g, '_')}_proposal.docx"`,
      },
    });
  } catch (err: any) {
    console.error('Export error:', err);
    return NextResponse.json({ error: err.message || 'Export failed' }, { status: 500 });
  }
}
