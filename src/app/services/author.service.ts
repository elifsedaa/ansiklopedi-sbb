import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Author } from '../models/author.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/authors`;

  getAll(): Observable<Author[]> {
    return this.http.get<Author[]>(this.base);
  }

  getById(id: string): Observable<Author> {
    return this.http.get<Author>(`${this.base}/${id}`);
  }
}
