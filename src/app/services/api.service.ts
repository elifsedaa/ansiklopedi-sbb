import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:4200'; // backend adresin

  constructor(private http: HttpClient) {}

  getPublications(): Observable<any> {
    return this.http.get(`${this.baseUrl}/publications`);
  }

  addPublication(pub: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/publications`, pub);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  getAuthors(): Observable<any> {
    return this.http.get(`${this.baseUrl}/authors`);
  }
}
