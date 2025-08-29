import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Category, Entry, Author, Volume } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HomeDataService {
  private apiUrl = 'http://localhost:3000'; // fake-api URL'i

  constructor(private http: HttpClient) {}

  // Kategorileri getir
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  // Maddeleri getir
  getEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.apiUrl}/entries`);
  }

  // Yazarları getir
  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${this.apiUrl}/authors`);
  }

  // Ciltleri getir
  getVolumes(): Observable<Volume[]> {
    return this.http.get<Volume[]>(`${this.apiUrl}/volumes`);
  }

  // Arama fonksiyonu
  searchEntries(searchTerm: string): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.apiUrl}/entries`)
      .pipe(
        map(entries => entries.filter(entry =>
          entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.summary.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
  }

  // Kategoriye göre maddeleri getir
  getEntriesByCategory(categoryId: string): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.apiUrl}/entries`)
      .pipe(
        map(entries => entries.filter(entry =>
          entry.categoryIds.includes(categoryId)
        ))
      );
  }

  // Yazara göre maddeleri getir
  getEntriesByAuthor(authorId: string): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.apiUrl}/entries`)
      .pipe(
        map(entries => entries.filter(entry =>
          entry.authorships?.some(authorship => authorship.authorId === authorId)
        ))
      );
  }

  // Tek madde getir
  getEntryById(entryId: string): Observable<Entry | undefined> {
    return this.http.get<Entry[]>(`${this.apiUrl}/entries`)
      .pipe(
        map(entries => entries.find(entry => entry.id === entryId))
      );
  }

  // Tek yazar getir
  getAuthorById(authorId: string): Observable<Author | undefined> {
    return this.http.get<Author[]>(`${this.apiUrl}/authors`)
      .pipe(
        map(authors => authors.find(author => author.id === authorId))
      );
  }

  // Tek cilt getir
  getVolumeById(volumeId: string): Observable<Volume | undefined> {
    return this.http.get<Volume[]>(`${this.apiUrl}/volumes`)
      .pipe(
        map(volumes => volumes.find(volume => volume.id === volumeId))
      );
  }

  // En popüler maddeleri getir (görüntülenme + beğeni bazında)
  getFeaturedEntries(limit: number = 6): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.apiUrl}/entries`)
      .pipe(
        map(entries => entries
          .sort((a, b) => {
            const scoreA = (a.stats?.viewCount || 0) + (a.stats?.likeCount || 0) * 10;
            const scoreB = (b.stats?.viewCount || 0) + (b.stats?.likeCount || 0) * 10;
            return scoreB - scoreA;
          })
          .slice(0, limit)
        )
      );
  }

  // En aktif yazarları getir (maddelerinin toplam görüntülenme sayısına göre)
  getFeaturedAuthors(limit: number = 4): Observable<Author[]> {
    return this.http.get<{authors: Author[], entries: Entry[]}>(`${this.apiUrl}/db`)
      .pipe(
        map(data => {
          const authorsWithStats = data.authors.map(author => {
            const authorEntries = data.entries.filter(entry =>
              entry.authorships?.some(authorship => authorship.authorId === author.id)
            );

            const totalViews = authorEntries.reduce((sum, entry) =>
              sum + (entry.stats?.viewCount || 0), 0
            );

            return { ...author, totalViews };
          });

          return authorsWithStats
            .sort((a: any, b: any) => b.totalViews - a.totalViews)
            .slice(0, limit);
        })
      );
  }

  // İstatistikleri getir
  getStats(): Observable<{totalEntries: number, totalAuthors: number, totalVolumes: number, totalCategories: number}> {
    return this.http.get<{
      entries: Entry[],
      authors: Author[],
      volumes: Volume[],
      categories: Category[]
    }>(`${this.apiUrl}/db`)
      .pipe(
        map(data => ({
          totalEntries: data.entries.length,
          totalAuthors: data.authors.length,
          totalVolumes: data.volumes.length,
          totalCategories: data.categories.length
        }))
      );
  }
}
