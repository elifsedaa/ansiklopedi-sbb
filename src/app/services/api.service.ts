import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api'; // proxy ile kullanacağız

  constructor(private http: HttpClient) {}

  getPublications(): Observable<any> {
    return this.http.get(`${this.baseUrl}/publications`);
  }

  addPublication(pub: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/publications`, pub);
  }

  getEntries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/entries`);
  }

  addEntry(entry: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/entries`, entry);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  getAuthors(): Observable<any> {
    return this.http.get(`${this.baseUrl}/authors`);
  }

  getData(): Observable<any> {
    return forkJoin({
      entries: this.getPublications(),
      categories: this.getCategories(),
      authors: this.getAuthors()
    }).pipe(
      map(result => ({
        entries: result.entries,
        categories: result.categories,
        authors: result.authors
      }))
    );
  }
}
