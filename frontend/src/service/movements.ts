import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movement } from '@inven-tech/types';

const API_URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  private http = inject(HttpClient);

  getAll(): Observable<Movement[]> {
    return this.http.get<Movement[]>(`${API_URL}/movements`, { withCredentials: true });
  }
}
