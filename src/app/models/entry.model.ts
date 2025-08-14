export interface Entry {
  id: string;
  slug: string;
  maddeNo: number;
  title: string;
  summary: string;
  body?: string;
  categoryIds: string[];
  tagIds?: string[];
  authorships?: { authorId: string; role: string; order: number }[];
  volume?: { volumeId: string; pageStart?: number; pageEnd?: number };
  dates?: { periodStart?: number; periodEnd?: number };
  places?: { name: string; geo?: { lat: number; lng: number }; admin?: { il: string; ilce?: string } }[];
  media?: { mediaId: string; caption?: string; credit?: string }[];
  references?: { type: 'book' | 'article' | 'url' | 'archive'; text: string; url?: string }[];
  relatedEntryIds?: string[];
  seo?: { metaTitle?: string; metaDescription?: string };
  stats?: { viewCount: number; likeCount: number };
  status?: 'draft' | 'published';
  language?: 'tr' | 'en';
  createdAt?: string;
  updatedAt?: string;
}
