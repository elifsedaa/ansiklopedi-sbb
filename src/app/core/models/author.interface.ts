export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  imageUrl?: string;
  email: string;
  expertise: string[];
  articleCount: number;
  isActive: boolean;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}
