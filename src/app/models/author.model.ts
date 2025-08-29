export interface Author {
  id: string;
  fullName: string;
  bio?: string;
  affiliation?: string;
  photoMediaId?: string;
  links?: { web?: string; orcid?: string; twitter?: string };
  totalViews?: number; // Service tarafında hesaplanacak

}
