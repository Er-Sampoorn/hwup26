import { db } from './db';

export interface MatchedEvidence {
  chunkId: string;
  documentId: string;
  documentName: string;
  section: string;
  pageNumber: number;
  content: string;
  relevanceScore: number;
}

export async function findEvidenceForQuestion(
  question: string,
  category: string,
  organizationId: string,
  projectId?: string
): Promise<MatchedEvidence[]> {
  // Query all evidence documents & chunks in organization
  const chunks = await db.evidenceChunk.findMany({
    where: {
      document: {
        organizationId,
        ...(projectId ? { OR: [{ projectId }, { projectId: null }] } : {}),
      },
    },
    include: {
      document: true,
    },
  });

  if (chunks.length === 0) {
    return [];
  }

  const queryTerms = extractKeywords(question);
  const scoredChunks: MatchedEvidence[] = [];

  for (const chunk of chunks) {
    const score = calculateRelevance(queryTerms, category, chunk.content, chunk.section || '', chunk.document.category);
    if (score >= 0.25) {
      scoredChunks.push({
        chunkId: chunk.id,
        documentId: chunk.document.id,
        documentName: chunk.document.title || chunk.document.fileName,
        section: chunk.section || 'General',
        pageNumber: chunk.pageNumber || 1,
        content: chunk.content,
        relevanceScore: Math.round(score * 100) / 100,
      });
    }
  }

  // Sort descending by relevance score
  scoredChunks.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Return top 3-4 matches
  return scoredChunks.slice(0, 4);
}

function extractKeywords(text: string): string[] {
  const stopwords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might',
    'must', 'and', 'but', 'or', 'nor', 'for', 'yet', 'so', 'in', 'on', 'at', 'to', 'from',
    'by', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before',
    'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over',
    'under', 'again', 'further', 'then', 'once', 'describe', 'provide', 'details', 'detail',
    'state', 'explain', 'what', 'how', 'which', 'where', 'who', 'whom', 'this', 'that'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopwords.has(word));
}

function calculateRelevance(
  queryTerms: string[],
  reqCategory: string,
  chunkContent: string,
  chunkSection: string,
  docCategory: string
): number {
  if (queryTerms.length === 0) return 0;

  const contentLower = chunkContent.toLowerCase();
  const sectionLower = chunkSection.toLowerCase();
  let hits = 0;
  let exactPhrases = 0;

  for (const term of queryTerms) {
    if (contentLower.includes(term)) {
      hits++;
    }
    if (sectionLower.includes(term)) {
      hits += 0.5;
    }
  }

  let baseScore = hits / queryTerms.length;

  // Category alignment boost
  if (reqCategory.toLowerCase() === docCategory.toLowerCase()) {
    baseScore += 0.2;
  }

  // Specific acronym / term exact match boost
  const criticalAcronyms = ['soc2', 'iso', 'iso27001', 'gdpr', 'sla', 'hipaa', 'saml', 'sso', 'aes-256', 'tls', 'mfa', 'encryption'];
  for (const acr of criticalAcronyms) {
    if (queryTerms.includes(acr) && contentLower.includes(acr)) {
      baseScore += 0.25;
    }
  }

  return Math.min(0.98, Math.max(0.1, baseScore));
}
