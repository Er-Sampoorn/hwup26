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
  locationId?: string
): Promise<MatchedEvidence[]> {
  const assets = await db.mediaAsset.findMany({
    where: {
      location: {
        organizationId,
        ...(locationId ? { id: locationId } : {}),
      },
    },
    include: {
      location: true,
      analysis: true,
    },
    take: 5,
  });

  return assets.map((a, idx) => ({
    chunkId: a.id,
    documentId: a.id,
    documentName: a.fileName,
    section: 'Visual Inspection',
    pageNumber: 1,
    content: a.analysis?.summaryText || `Media asset ${a.fileName} captured for location ${a.location.code}.`,
    relevanceScore: 0.9 - idx * 0.05,
  }));
}
