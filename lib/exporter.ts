import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { jsPDF } from 'jspdf';
import * as xlsx from 'xlsx';

export interface AuditExportData {
  locationCode: string;
  locationName: string;
  address: string;
  region: string;
  manager: string;
  complianceScore: number;
  riskScore: number;
  riskCategory: string;
  violations: Array<{
    violationCode: string;
    standardCode: string;
    category: string;
    title: string;
    description: string;
    severity: string;
    status: string;
    isRecurring: boolean;
    confidence: number;
    aiExplanation?: string;
  }>;
}

export class FranchiseReportExporter {
  /**
   * Generate DOCX Audit & Cure Notice Report Buffer
   */
  public async generateDocx(data: AuditExportData): Promise<Buffer> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: `FRANCHISE COMPLIANCE AUDIT REPORT: ${data.locationName.toUpperCase()}`,
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Location Code: `, bold: true }),
                new TextRun({ text: data.locationCode }),
                new TextRun({ text: ` | Region: `, bold: true }),
                new TextRun({ text: data.region }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Risk Category: `, bold: true }),
                new TextRun({ text: `${data.riskCategory} (${data.riskScore}/100)` }),
                new TextRun({ text: ` | Compliance Score: `, bold: true }),
                new TextRun({ text: `${data.complianceScore}%` }),
              ],
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: '1. Executive Compliance Overview',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              text: `This formal compliance audit report has been synthesized by SOLINE with evidence-grounded visual and operational signal analysis. Recurring failures trigger formal default warnings under corporate brand standards.`,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: '2. Detected Standards Violations & Remediation Plan',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 200 },
            }),
            ...data.violations.flatMap((v) => [
              new Paragraph({
                text: `[${v.violationCode}] ${v.standardCode} - ${v.title} (${v.severity} SEVERITY)`,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Description: `, bold: true }),
                  new TextRun({ text: v.description, italics: true }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Recurrence Status: `, bold: true }),
                  new TextRun({ text: v.isRecurring ? 'RECURRING VIOLATION (CURE NOTICE MANDATORY)' : 'First Occurrence' }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `AI Explanation: `, bold: true }),
                  new TextRun({ text: v.aiExplanation || 'Verified by multimodal vision agent.' }),
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
   * Generate PDF Location Audit Summary
   */
  public generatePdf(data: AuditExportData): Buffer {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text(`Franchise Compliance Report: ${data.locationName}`, 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Location ID: ${data.locationCode} | Region: ${data.region}`, 14, y);
    y += 7;
    doc.text(`Compliance Score: ${data.complianceScore}% | Risk: ${data.riskCategory} (${data.riskScore}/100)`, 14, y);
    y += 12;

    doc.setFontSize(14);
    doc.text(`Active Violations (${data.violations.length} Total):`, 14, y);
    y += 10;

    doc.setFontSize(10);
    for (let i = 0; i < Math.min(25, data.violations.length); i++) {
      const v = data.violations[i];
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`[${v.violationCode}] ${v.standardCode} - ${v.severity} SEVERITY ${v.isRecurring ? '(RECURRING)' : ''}`, 14, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(`Details: ${v.description}`, 180);
      doc.text(lines, 14, y);
      y += lines.length * 4.5 + 5;
    }

    return Buffer.from(doc.output('arraybuffer'));
  }

  /**
   * Generate XLSX Compliance Matrix Buffer
   */
  public generateXlsx(data: AuditExportData): Buffer {
    const rows = data.violations.map((v) => ({
      'Violation ID': v.violationCode,
      'Standard Code': v.standardCode,
      Category: v.category,
      Title: v.title,
      Severity: v.severity,
      Status: v.status,
      'Is Recurring?': v.isRecurring ? 'YES' : 'NO',
      'Confidence (%)': v.confidence,
      Description: v.description,
      'AI Explanation': v.aiExplanation || '',
    }));

    const worksheet = xlsx.utils.json_to_sheet(rows);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Violations Matrix');

    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Generate Machine-Readable JSON Bundle
   */
  public generateJson(data: AuditExportData): string {
    return JSON.stringify(
      {
        franchiseguard_version: '1.0.0',
        exported_at: new Date().toISOString(),
        location: {
          code: data.locationCode,
          name: data.locationName,
          region: data.region,
          compliance_score: data.complianceScore,
          risk_score: data.riskScore,
          risk_category: data.riskCategory,
        },
        violations: data.violations,
      },
      null,
      2
    );
  }
}
