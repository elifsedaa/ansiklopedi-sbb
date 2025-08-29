// src/app/core/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces
export interface Entry {
  id: string;
  slug: string;
  maddeNo: number;
  title: string;
  summary: string;
  body: string;
  categoryIds: string[];
  tagIds: string[];
  authorships: Array<{
    authorId: string;
    role: string;
    order: number;
  }>;
  volume: {
    volumeId: string;
    pageStart: number;
    pageEnd: number;
  };
  dates: {
    periodStart?: number;
    periodEnd?: number;
  };
  places: Array<{
    name: string;
    geo: { lat: number; lng: number };
    admin: { il: string; ilce: string };
  }>;
  media: Array<{
    mediaId: string;
    caption: string;
    credit: string;
  }>;
  references: Array<{
    type: string;
    text: string;
  }>;
  relatedEntryIds: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  stats: {
    viewCount: number;
    likeCount: number;
  };
  status: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
}

export interface Author {
  id: string;
  fullName: string;
  bio: string;
  affiliation: string;
  photoMediaId: string;
  links: Record<string, any>;
}

export interface Volume {
  id: string;
  title: string;
  number: number;
  isbn: string;
  publicationDate: string;
  pdfUrl: string;
  pageCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Entries
  getEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.baseUrl}/entries`);
  }

  getEntry(id: string): Observable<Entry> {
    return this.http.get<Entry>(`${this.baseUrl}/entries/${id}`);
  }

  searchEntries(query: string): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.baseUrl}/entries?q=${query}`);
  }

  getEntriesByCategory(categoryId: string): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.baseUrl}/entries?categoryIds_like=${categoryId}`);
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/categories/${id}`);
  }

  // AuthorsComponent
  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${this.baseUrl}/authors`);
  }

  getAuthor(id: string): Observable<Author> {
    return this.http.get<Author>(`${this.baseUrl}/authors/${id}`);
  }

  // Volumes
  getVolumes(): Observable<Volume[]> {
    return this.http.get<Volume[]>(`${this.baseUrl}/volumes`);
  }

  // Statistics
  getPopularEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.baseUrl}/entries?_sort=stats.viewCount&_order=desc&_limit=5`);
  }

  getRecentEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.baseUrl}/entries?_sort=createdAt&_order=desc&_limit=5`);
  }
}
