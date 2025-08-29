import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Media } from '../models/media.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/media`;

  getAll(): Observable<Media[]> {
    return this.http.get<Media[]>(this.base);
  }

  getById(id: string): Observable<Media> {
    return this.http.get<Media>(`${this.base}/${id}`);
  }
}
