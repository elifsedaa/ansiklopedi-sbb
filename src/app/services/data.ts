// services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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
    geo: {
      lat: number;
      lng: number;
    };
    admin: {
      il: string;
      ilce: string;
    };
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

export interface Media {
  id: string;
  type: string;
  url: string;
  width: number;
  height: number;
  credit: string;
  license: string;
  sourceUrl: string | null;
}

export interface ApiResponse {
  entries: Entry[];
  authors: Author[];
  categories: Category[];
  volumes: Volume[];
  media: Media[];
  suggestions: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000'; // JSON Server URL
  private data: ApiResponse | null = null;

  constructor(private http: HttpClient) {}

  // Ana veri çekme fonksiyonu
  private loadData(): Observable<ApiResponse> {
    if (this.data) {
      return new Observable(observer => {
        observer.next(this.data!);
        observer.complete();
      });
    }

    return this.http.get<ApiResponse>(`${this.apiUrl}/db`).pipe(
      map(response => {
        this.data = response;
        return response;
      })
    );
  }

  // Tüm maddeler
  getEntries(): Observable<Entry[]> {
    return this.loadData().pipe(
      map(data => data.entries.sort((a, b) => a.title.localeCompare(b.title, 'tr')))
    );
  }

  // ID'ye göre madde
  getEntryById(id: string): Observable<Entry | undefined> {
    return this.loadData().pipe(
      map(data => data.entries.find(entry => entry.id === id))
    );
  }

  // Slug'a göre madde
  getEntryBySlug(slug: string): Observable<Entry | undefined> {
    return this.loadData().pipe(
      map(data => data.entries.find(entry => entry.slug === slug))
    );
  }

  // Harfe göre maddeler
  getEntriesByLetter(letter: string): Observable<Entry[]> {
    return this.loadData().pipe(
      map(data => {
        let filtered: Entry[] = [];

        if (letter === '#') {
          // Rakam ile başlayanlar
          filtered = data.entries.filter(entry =>
            /^[0-9]/.test(entry.title)
          );
        } else {
          // Belirli harf ile başlayanlar
          filtered = data.entries.filter(entry => {
            const firstChar = entry.title.charAt(0).toUpperCase();
            // Türkçe karakterleri normalize et
            const normalizedChar = firstChar
              .replace(/[ÇĞIİÖŞÜ]/g, (match) => {
                const map: { [key: string]: string } = {
                  'Ç': 'C', 'Ğ': 'G', 'I': 'I', 'İ': 'I',
                  'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
                };
                return map[match] || match;
              });

            return normalizedChar === letter.toUpperCase() || firstChar === letter.toUpperCase();
          });
        }

        return filtered.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
      })
    );
  }

  // Kategori ID'ye göre maddeler
  getEntriesByCategory(categoryId: string): Observable<Entry[]> {
    return this.loadData().pipe(
      map(data => data.entries.filter(entry =>
        entry.categoryIds.includes(categoryId)
      ).sort((a, b) => a.title.localeCompare(b.title, 'tr')))
    );
  }

  // Cilt ID'ye göre maddeler
  getEntriesByVolume(volumeId: string): Observable<Entry[]> {
    return this.loadData().pipe(
      map(data => data.entries.filter(entry =>
        entry.volume.volumeId === volumeId
      ).sort((a, b) => a.volume.pageStart - b.volume.pageStart))
    );
  }

  // Arama
  searchEntries(query: string): Observable<Entry[]> {
    return this.loadData().pipe(
      map(data => {
        const searchTerm = query.toLowerCase();
        return data.entries.filter(entry =>
          entry.title.toLowerCase().includes(searchTerm) ||
          entry.summary.toLowerCase().includes(searchTerm) ||
          entry.body.toLowerCase().includes(searchTerm)
        ).sort((a, b) => a.title.localeCompare(b.title, 'tr'));
      })
    );
  }

  // Tüm yazarlar
  getAuthors(): Observable<Author[]> {
    return this.loadData().pipe(
      map(data => data.authors.sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr')))
    );
  }

  // ID'ye göre yazar
  getAuthorById(id: string): Observable<Author | undefined> {
    return this.loadData().pipe(
      map(data => data.authors.find(author => author.id === id))
    );
  }

  // Yazar ID'ye göre maddeler
  getEntriesByAuthor(authorId: string): Observable<Entry[]> {
    return this.loadData().pipe(
      map(data => data.entries.filter(entry =>
        entry.authorships.some(authorship => authorship.authorId === authorId)
      ).sort((a, b) => a.title.localeCompare(b.title, 'tr')))
    );
  }

  // Tüm kategoriler
  getCategories(): Observable<Category[]> {
    return this.loadData().pipe(
      map(data => data.categories)
    );
  }

  // ID'ye göre kategori
  getCategoryById(id: string): Observable<Category | undefined> {
    return this.loadData().pipe(
      map(data => data.categories.find(category => category.id === id))
    );
  }

  // Tüm ciltler
  getVolumes(): Observable<Volume[]> {
    return this.loadData().pipe(
      map(data => data.volumes.sort((a, b) => a.number - b.number))
    );
  }

  // ID'ye göre cilt
  getVolumeById(id: string): Observable<Volume | undefined> {
    return this.loadData().pipe(
      map(data => data.volumes.find(volume => volume.id === id))
    );
  }

  // ID'ye göre medya
  getMediaById(id: string): Observable<Media | undefined> {
    return this.loadData().pipe(
      map(data => data.media.find(media => media.id === id))
    );
  }

  // İlgili maddeler (aynı kategorideki diğer maddeler)
  getRelatedEntries(entryId: string, limit: number = 5): Observable<Entry[]> {
    return this.loadData().pipe(
      map(data => {
        const entry = data.entries.find(e => e.id === entryId);
        if (!entry) return [];

        return data.entries
          .filter(e =>
            e.id !== entryId &&
            e.categoryIds.some(catId => entry.categoryIds.includes(catId))
          )
          .sort((a, b) => a.title.localeCompare(b.title, 'tr'))
          .slice(0, limit);
      })
    );
  }

  // Alfabetik harfleri al (mevcut maddelerden)
  getAvailableLetters(): Observable<string[]> {
    return this.loadData().pipe(
      map(data => {
        const letters = new Set<string>();
        let hasNumbers = false;

        data.entries.forEach(entry => {
          const firstChar = entry.title.charAt(0).toUpperCase();

          if (/[0-9]/.test(firstChar)) {
            hasNumbers = true;
          } else {
            letters.add(firstChar);
          }
        });

        const sortedLetters = Array.from(letters).sort((a, b) =>
          a.localeCompare(b, 'tr')
        );

        if (hasNumbers) {
          sortedLetters.push('#');
        }

        return sortedLetters;
      })
    );
  }

  // İstatistikler
  getStats(): Observable<{
    totalEntries: number;
    totalAuthors: number;
    totalCategories: number;
    totalVolumes: number;
  }> {
    return this.loadData().pipe(
      map(data => ({
        totalEntries: data.entries.length,
        totalAuthors: data.authors.length,
        totalCategories: data.categories.length,
        totalVolumes: data.volumes.length
      }))
    );
  }
}
