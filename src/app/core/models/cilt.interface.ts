export interface Cilt {
  id: string;
  name: string;
  description: string;
  volume: number;
  coverImageUrl?: string;
  pdfUrl?: string;
  articleIds: string[];
  publishDate: Date;
  pageCount: number;
  isPublished: boolean;
}
