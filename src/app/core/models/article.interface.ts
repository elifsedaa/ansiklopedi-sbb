export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  author: string;
  authorId: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  publishDate: Date;
  updateDate: Date;
  viewCount: number;
  likeCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}
