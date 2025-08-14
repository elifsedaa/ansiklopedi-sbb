import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Volume } from '../models/volume.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VolumeService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/volumes`;

  getAll(): Observable<Volume[]> {
    return this.http.get<Volume[]>(this.base);
  }
}
