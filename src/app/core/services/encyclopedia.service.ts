import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


// API Response Interfaces (db.json yapısına göre)
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
  dates?: {
    periodStart?: number;
    periodEnd?: number;
  };
  places: Array<{
    name: string;
    geo: { lat: number; lng: number };
    admin: { il: string; ilce: string };
  }>;
  stats: {
    viewCount: number;
    likeCount: number;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  fullName: string;
  bio: string;
  affiliation: string;
  photoMediaId: string;
  links: any;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
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

// Component için dönüştürülmüş interface'ler
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  categoryName: string;
  publishDate: Date;
  viewCount: number;
  imageUrl?: string;
}

export interface Statistics {
  totalArticles: number;
  totalCategories: number;
  totalAuthors: number;
  dailyVisitors: number;
}

export interface FeaturedCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class EncyclopediaService {
  private readonly API_URL = 'http://localhost:3000';

  // Loading states
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  private setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }

  // Ana veriler
  getAllEntries(): Observable<Entry[]> {
    this.setLoading(true);
    return this.http.get<Entry[]>(`${this.API_URL}/entries`)
      .pipe(
        catchError(error => {
          console.error('Error fetching entries:', error);
          this.setLoading(false);
          return of([]);
        })
      );
  }

  getAllAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${this.API_URL}/authors`)
      .pipe(
        catchError(error => {
          console.error('Error fetching authors:', error);
          return of([]);
        })
      );
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/categories`)
      .pipe(
        catchError(error => {
          console.error('Error fetching categories:', error);
          return of([]);
        })
      );
  }

  // Home component için dönüştürülmüş veriler
  getRecentArticles(limit: number = 6): Observable<Article[]> {
    this.setLoading(true);

    return this.http.get<{
      entries: Entry[];
      authors: Author[];
      categories: Category[];
    }>(`${this.API_URL}/db`)
      .pipe(
        map(data => {
          // Son eklenen makaleleri al (createdAt'e göre sırala)
          const sortedEntries = data.entries
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit);

          return sortedEntries.map(entry => {
            // Yazar bilgisini bul
            const authorship = entry.authorships[0]; // İlk yazar
            const author = data.authors.find(a => a.id === authorship?.authorId);

            // Kategori bilgisini bul
            const category = data.categories.find(c => c.id === entry.categoryIds[0]);

            return {
              id: entry.id,
              title: entry.title,
              excerpt: entry.summary,
              author: author?.fullName || 'Bilinmeyen Yazar',
              categoryName: category?.name || 'Genel',
              publishDate: new Date(entry.createdAt),
              viewCount: entry.stats.viewCount,
              imageUrl: '/assets/images/default-article.jpg' // Default resim
            } as Article;
          });
        }),
        catchError(error => {
          console.error('Error fetching recent entries:', error);
          this.setLoading(false);
          return of([]);
        })
      );
  }

  getFeaturedCategories(): Observable<FeaturedCategory[]> {
    return this.http.get<{
      entries: Entry[];
      categories: Category[];
    }>(`${this.API_URL}/db`)
      .pipe(
        map(data => {
          // Her kategori için makale sayısını hesapla
          const categoryCountMap = new Map<string, number>();

          data.entries.forEach(entry => {
            entry.categoryIds.forEach(catId => {
              categoryCountMap.set(catId, (categoryCountMap.get(catId) || 0) + 1);
            });
          });

          // İkon mapping
          const categoryIcons: { [key: string]: string } = {
            'cat_tarih': '🏛️',
            'cat_mimari': '🏗️',
            'cat_turizm': '🏖️',
            'cat_doga': '🌿',
            'cat_cografya': '🌍'
          };

          return data.categories.map(category => ({
            id: category.id,
            name: category.name,
            icon: categoryIcons[category.id] || '📚',
            count: categoryCountMap.get(category.id) || 0
          }));
        }),
        catchError(error => {
          console.error('Error fetching featured categories:', error);
          return of([]);
        })
      );
  }

  getStatistics(): Observable<Statistics> {
    return this.http.get<{
      entries: Entry[];
      authors: Author[];
      categories: Category[];
    }>(`${this.API_URL}/db`)
      .pipe(
        map(data => {
          // Günlük ziyaretçi sayısını hesapla (viewCount'ların toplamı)
          const totalViews = data.entries.reduce((sum, entry) => sum + entry.stats.viewCount, 0);

          return {
            totalArticles: data.entries.length,
            totalCategories: data.categories.length,
            totalAuthors: data.authors.length,
            dailyVisitors: Math.floor(totalViews / 30) // Ortalama günlük
          };
        }),
        catchError(error => {
          console.error('Error fetching statistics:', error);
          return of({
            totalArticles: 0,
            totalCategories: 0,
            totalAuthors: 0,
            dailyVisitors: 0
          });
        })
      );
  }

  // Arama fonksiyonu
  searchEntries(query: string): Observable<Article[]> {
    if (!query.trim()) {
      return of([]);
    }

    return this.http.get<{
      entries: Entry[];
      authors: Author[];
      categories: Category[];
    }>(`${this.API_URL}/db`)
      .pipe(
        map(data => {
          const filteredEntries = data.entries.filter(entry =>
            entry.title.toLowerCase().includes(query.toLowerCase()) ||
            entry.summary.toLowerCase().includes(query.toLowerCase())
          );

          return filteredEntries.map(entry => {
            const authorship = entry.authorships[0];
            const author = data.authors.find(a => a.id === authorship?.authorId);
            const category = data.categories.find(c => c.id === entry.categoryIds[0]);

            return {
              id: entry.id,
              title: entry.title,
              excerpt: entry.summary,
              author: author?.fullName || 'Bilinmeyen Yazar',
              categoryName: category?.name || 'Genel',
              publishDate: new Date(entry.createdAt),
              viewCount: entry.stats.viewCount,
              imageUrl: '/assets/images/default-article.jpg'
            } as Article;
          });
        }),
        catchError(error => {
          console.error('Error searching entries:', error);
          return of([]);
        })
      );
  }
}
