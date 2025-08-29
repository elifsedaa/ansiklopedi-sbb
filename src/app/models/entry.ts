export interface Entry {
  id: string;
  title: string;
  summary: string;
  body: string;
  volume?: { volumeId: string; pageStart?: number; pageEnd?: number };
  status?: 'draft' | 'published';
}
