import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/categories`;
  private apiUrl = 'http://localhost:3000'; // db.json server URL'in


  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.base);
  }
  // En popüler kategorileri getir (limit ile)
  getFeaturedCategories(limit: number = 6): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories?_limit=${limit}&_sort=count&_order=desc`);
  }

  // Tüm kategorileri getir
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  // ID'ye göre kategori getir
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}`);
  }
}

