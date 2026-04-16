import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier } from '@inven-tech/types';
import { environment } from '../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class SuppliersService {
  private http = inject(HttpClient);

  getAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${API_URL}/suppliers`, { withCredentials: true });
  }

  create(data: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Observable<Supplier> {
    return this.http.post<Supplier>(`${API_URL}/suppliers`, data, { withCredentials: true });
  }

  update(id: number, data: Partial<Omit<Supplier, 'id' | 'created_at' | 'updated_at'>>): Observable<void> {
    return this.http.put<void>(`${API_URL}/suppliers/${id}`, data, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/suppliers/${id}`, { withCredentials: true });
  }
}
