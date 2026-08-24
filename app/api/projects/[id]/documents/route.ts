import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseDocumentBuffer } from '@/lib/ingestion';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const docType = (formData.get('docType') as string) || 'EVIDENCE'; // EVIDENCE or RFP

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse document text and semantic chunks
    const parsed = await parseDocumentBuffer(file.name, buffer);

    if (docType === 'RFP') {
      let rfp = await db.rfp.findUnique({ where: { projectId } });
      if (!rfp) {
        rfp = await db.rfp.create({
          data: { title: file.name, projectId },
        });
      }

      const rfpDoc = await db.rfpDocument.create({
        data: {
          fileName: file.name,
          fileType: parsed.fileType,
          fileSize: file.size,
          filePath: `/uploads/${file.name}`,
          parsedText: parsed.parsedText,
          rfpId: rfp.id,
        },
      });

      // Extract basic initial requirements from parsed text
      const lines = parsed.parsedText.split('\n').filter((l) => l.trim().length > 15);
      let count = 0;
      for (const line of lines.slice(0, 15)) {
        if (line.includes('?') || line.match(/^(REQ|MUST|SHALL|DESCRIBE|PROVIDE)/i)) {
          count++;
          await db.requirement.create({
            data: {
              reqCode: `REQ-${String(count).padStart(3, '0')}`,
              projectId,
              question: line.trim(),
              category: 'General Capabilities',
              mandatory: line.toUpperCase().includes('MUST') || line.toUpperCase().includes('SHALL'),
              confidence: 50.0,
              status: 'needs_review',
              reasoningSummary: 'Extracted from uploaded RFP document. Pending RocketRide pipeline analysis.',
            },
          });
        }
      }

      await db.auditLog.create({
        data: {
          projectId,
          action: 'RFP_DOCUMENT_UPLOADED',
          details: `Uploaded RFP document ${file.name} (${parsed.fileType}, ${(file.size / 1024).toFixed(1)} KB). Extracted ${count} initial requirements.`,
        },
      });

      return NextResponse.json({ success: true, rfpDocument: rfpDoc });
    } else {
      // Evidence Document Upload
      const evidenceDoc = await db.evidenceDocument.create({
        data: {
          title: file.name,
          fileName: file.name,
          fileType: parsed.fileType,
          category: 'General',
          organizationId: project.organizationId,
          projectId,
        },
      });

      for (let i = 0; i < parsed.chunks.length; i++) {
        const c = parsed.chunks[i];
        await db.evidenceChunk.create({
          data: {
            evidenceDocumentId: evidenceDoc.id,
            content: c.content,
            section: c.section,
            pageNumber: c.pageNumber,
            chunkIndex: c.chunkIndex,
          },
        });
      }

      await db.auditLog.create({
        data: {
          projectId,
          action: 'EVIDENCE_DOCUMENT_UPLOADED',
          details: `Uploaded evidence document ${file.name} (${parsed.chunks.length} chunks generated).`,
        },
      });

      return NextResponse.json({ success: true, evidenceDocument: evidenceDoc, chunkCount: parsed.chunks.length });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Document upload failed' }, { status: 500 });
  }
}
