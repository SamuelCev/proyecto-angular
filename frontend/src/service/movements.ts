import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movement } from '@inven-tech/types';
import { environment } from '../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  private http = inject(HttpClient);

  getAll(): Observable<Movement[]> {
    return this.http.get<Movement[]>(`${API_URL}/movements`, { withCredentials: true });
  }
}
