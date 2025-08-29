import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Entry } from '../models/entry.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EntryService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/entries`;

  list(params?: {
    query?: string;
    categoryId?: string;
    authorId?: string;
    volumeId?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
  }): Observable<Entry[]> {
    let httpParams = new HttpParams();

    if (params?.query)      httpParams = httpParams.set('q', params.query);
    if (params?.categoryId) httpParams = httpParams.set('categoryIds_like', params.categoryId);
    if (params?.authorId)   httpParams = httpParams.set('authorships_like', params.authorId);
    if (params?.volumeId)   httpParams = httpParams.set('volume.volumeId', params.volumeId);
    if (params?.sort)       httpParams = httpParams.set('_sort', params.sort);
    if (params?.page)       httpParams = httpParams.set('_page', params.page);
    if (params?.pageSize)   httpParams = httpParams.set('_limit', params.pageSize);

    return this.http.get<Entry[]>(this.base, { params: httpParams });
  }


  getById(id: string): Observable<Entry> {
    return this.http.get<Entry>(`${this.base}/${id}`);
  }
}
