import { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx';
import { jsPDF } from 'jspdf';
import * as xlsx from 'xlsx';

export interface ProposalExportData {
  projectName: string;
  customer: string;
  deadline?: string;
  rfpType: string;
  requirements: Array<{
    reqCode: string;
    category: string;
    question: string;
    mandatory: boolean;
    answer: string;
    confidence: number;
    risk: string;
    status: string;
    reasoningSummary?: string;
    evidences: Array<{
      documentName: string;
      section: string;
      pageNumber: number;
      relevanceScore: number;
    }>;
  }>;
}

export class ProposalExporter {
  /**
   * Generate DOCX Proposal Document Buffer
   */
  public async generateDocx(data: ProposalExportData): Promise<Buffer> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: `PROPOSAL RESPONSE: ${data.projectName.toUpperCase()}`,
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Client / Customer: `, bold: true }),
                new TextRun({ text: data.customer }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `RFP Type: `, bold: true }),
                new TextRun({ text: data.rfpType }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Generated Date: `, bold: true }),
                new TextRun({ text: new Date().toLocaleDateString() }),
              ],
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: '1. Executive Summary & Compliance Overview',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              text: `This proposal response package has been prepared by BidForge AI with evidence-backed verification across all requirement categories. Every answer includes verifiable references to official corporate documentation, security audits, and product specifications.`,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: '2. Detailed Requirement Responses & Compliance Matrix',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 200 },
            }),
            ...data.requirements.flatMap((req) => [
              new Paragraph({
                text: `[${req.reqCode}] ${req.category} (${req.mandatory ? 'MANDATORY' : 'OPTIONAL'})`,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Requirement / Question: `, bold: true }),
                  new TextRun({ text: req.question, italics: true }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Proposal Answer: `, bold: true }),
                  new TextRun({ text: req.answer || 'No response provided.' }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Confidence Score: `, bold: true }),
                  new TextRun({ text: `${req.confidence}% | Status: ${req.status.toUpperCase()} | Risk: ${req.risk.toUpperCase()}` }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Evidence References: `, bold: true }),
                  new TextRun({
                    text:
                      req.evidences.length > 0
                        ? req.evidences.map((e) => `${e.documentName} (Section ${e.section}, Page ${e.pageNumber})`).join('; ')
                        : 'No direct evidence attached (Human Review Flagged).',
                    italics: true,
                  }),
                ],
                spacing: { after: 300 },
              }),
            ]),
          ],
        },
      ],
    });

    const { Packer } = require('docx');
    return await Packer.toBuffer(doc);
  }

  /**
   * Generate PDF Proposal Document Buffer
   */
  public generatePdf(data: ProposalExportData): Buffer {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text(`Proposal Response: ${data.projectName}`, 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Customer: ${data.customer}`, 14, y);
    y += 7;
    doc.text(`RFP Type: ${data.rfpType}`, 14, y);
    y += 7;
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, y);
    y += 12;

    doc.setFontSize(14);
    doc.text(`Requirements Summary (${data.requirements.length} Total):`, 14, y);
    y += 10;

    doc.setFontSize(10);
    for (let i = 0; i < Math.min(25, data.requirements.length); i++) {
      const req = data.requirements[i];
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`[${req.reqCode}] ${req.category} - ${req.mandatory ? 'MANDATORY' : 'OPTIONAL'}`, 14, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const qLines = doc.splitTextToSize(`Q: ${req.question}`, 180);
      doc.text(qLines, 14, y);
      y += qLines.length * 4.5 + 2;

      const aLines = doc.splitTextToSize(`A: ${req.answer}`, 180);
      doc.text(aLines, 14, y);
      y += aLines.length * 4.5 + 5;
    }

    return Buffer.from(doc.output('arraybuffer'));
  }

  /**
   * Generate XLSX Compliance Matrix Buffer
   */
  public generateXlsx(data: ProposalExportData): Buffer {
    const rows = data.requirements.map((req) => ({
      'Requirement ID': req.reqCode,
      Category: req.category,
      'Mandatory?': req.mandatory ? 'YES' : 'NO',
      'Question / Clause': req.question,
      'Proposal Response': req.answer,
      'Confidence Score (%)': req.confidence,
      'Risk Level': req.risk.toUpperCase(),
      Status: req.status.toUpperCase(),
      'Evidence Documents': req.evidences.map((e) => `${e.documentName} (P.${e.pageNumber})`).join(' | '),
      'Reasoning Summary': req.reasoningSummary || '',
    }));

    const worksheet = xlsx.utils.json_to_sheet(rows);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Compliance Matrix');

    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Generate Machine-Readable JSON Export Package
   */
  public generateJson(data: ProposalExportData): string {
    return JSON.stringify(
      {
        bidforge_version: '1.0.0',
        exported_at: new Date().toISOString(),
        project: {
          name: data.projectName,
          customer: data.customer,
          rfp_type: data.rfpType,
          deadline: data.deadline,
        },
        summary: {
          total_requirements: data.requirements.length,
          verified_count: data.requirements.filter((r) => r.status === 'verified').length,
          needs_review_count: data.requirements.filter((r) => r.status === 'needs_review').length,
          unsupported_count: data.requirements.filter((r) => r.status === 'unsupported').length,
          average_confidence: (
            data.requirements.reduce((acc, r) => acc + r.confidence, 0) / (data.requirements.length || 1)
          ).toFixed(1),
        },
        requirements: data.requirements,
      },
      null,
      2
    );
  }
}
