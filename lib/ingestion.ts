import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import * as xlsx from 'xlsx';

export interface IngestedChunk {
  content: string;
  section: string;
  pageNumber: number;
  chunkIndex: number;
}

export interface IngestedDocumentResult {
  fileName: string;
  fileType: string;
  parsedText: string;
  chunks: IngestedChunk[];
}

export async function parseDocumentBuffer(
  fileName: string,
  buffer: Buffer
): Promise<IngestedDocumentResult> {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  let parsedText = '';
  let fileType = ext.toUpperCase();

  try {
    if (ext === 'pdf') {
      const data = await pdfParse(buffer);
      parsedText = data.text;
    } else if (ext === 'docx' || ext === 'doc') {
      const result = await mammoth.extractRawText({ buffer });
      parsedText = result.value;
    } else if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheetNames = workbook.SheetNames;
      const textParts: string[] = [];
      for (const sheetName of sheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const csv = xlsx.utils.sheet_to_csv(sheet);
        textParts.push(`--- Sheet: ${sheetName} ---\n${csv}`);
      }
      parsedText = textParts.join('\n\n');
    } else {
      // Default to plain text
      parsedText = buffer.toString('utf-8');
    }
  } catch (err: any) {
    console.error(`Error parsing document ${fileName}:`, err);
    parsedText = buffer.toString('utf-8') || `Failed to extract full text from ${fileName}.`;
  }

  // Generate chunks
  const chunks = chunkText(parsedText);

  return {
    fileName,
    fileType,
    parsedText,
    chunks,
  };
}

export function chunkText(text: string, chunkSize = 600, overlap = 100): IngestedChunk[] {
  if (!text || text.trim().length === 0) {
    return [
      {
        content: 'Empty document',
        section: 'General',
        pageNumber: 1,
        chunkIndex: 0,
      },
    ];
  }

  const lines = text.split('\n');
  const chunks: IngestedChunk[] = [];
  let currentChunk = '';
  let currentSection = 'General';
  let chunkIndex = 0;
  let estimatedPage = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Detect heading candidates
    if (
      line.match(/^(SECTION|CHAPTER|PART|ARTICLE|SECURITY|COMPLIANCE|SLAS?|TECHNICAL|PRICING)\b/i) ||
      (line.length < 60 && line.endsWith(':'))
    ) {
      if (currentChunk.trim().length > 0) {
        chunks.push({
          content: currentChunk.trim(),
          section: currentSection,
          pageNumber: estimatedPage,
          chunkIndex: chunkIndex++,
        });
        currentChunk = '';
      }
      currentSection = line.replace(/[:#]/g, '').trim();
    }

    // Estimate page transition (roughly 350 words or ~2000 chars per page)
    if (i > 0 && i % 40 === 0) {
      estimatedPage++;
    }

    if (currentChunk.length + line.length > chunkSize) {
      chunks.push({
        content: currentChunk.trim(),
        section: currentSection,
        pageNumber: estimatedPage,
        chunkIndex: chunkIndex++,
      });
      // Keep overlap from current chunk
      currentChunk = currentChunk.slice(-overlap) + ' ' + line;
    } else {
      currentChunk += ' ' + line;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      content: currentChunk.trim(),
      section: currentSection,
      pageNumber: estimatedPage,
      chunkIndex: chunkIndex++,
    });
  }

  return chunks;
}
