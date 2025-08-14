import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Suggestion } from '../models/suggestion.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SuggestionService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/suggestions`;

  create(payload: Suggestion): Observable<Suggestion> {
    // JSON Server’a POST atar; gerçek backend’e geçince de aynı kalır
    return this.http.post<Suggestion>(this.base, payload);
  }
}
