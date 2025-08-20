export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  parentId?: string;
  orderIndex: number;
  articleCount: number;
  isActive: boolean;
  color?: string;
  icon?: string;
}
