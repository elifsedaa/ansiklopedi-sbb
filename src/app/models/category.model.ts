export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
}
// category.model.ts
export interface Category {
  id: string;
  name: string;
  color?: string;         // template’de kullanılıyor
  articleCount?: number;  // template’de kullanılıyor
}
