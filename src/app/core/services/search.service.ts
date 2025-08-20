// src/app/core/services/search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

interface SearchResult {
  articles: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  async searchArticles(query: string, page: number = 1, limit: number = 10): Promise<SearchResult> {
    try {
      const response = await firstValueFrom(
        this.http.get<SearchResult>(`${this.baseUrl}/search`, {
          params: { q: query, page: page.toString(), limit: limit.toString() }
        })
      );
      return response || this.getMockSearchResults(query);
    } catch (error) {
      console.error('Search error:', error);
      return this.getMockSearchResults(query);
    }
  }

  private getMockSearchResults(query: string): SearchResult {
    return {
      articles: [
        {
          id: '1',
          title: `${query} ile ilgili sonuçlar`,
          excerpt: `${query} hakkında detaylı bilgiler...`,
          author: 'Test Author',
          categoryName: 'Genel',
          publishDate: new Date()
        }
      ],
      totalCount: 1,
      currentPage: 1,
      totalPages: 1
    };
  }
}
