import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '@inven-tech/types';
import { environment } from '../environments/environment';

const API_URL = environment.apiUrl;
type ProductPayload = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private http = inject(HttpClient);

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/products`, { withCredentials: true });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${API_URL}/products/${id}`, { withCredentials: true });
  }

  create(data: ProductPayload): Observable<Product> {
    return this.http.post<Product>(`${API_URL}/products`, data, { withCredentials: true });
  }

  update(id: number, data: ProductPayload): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${API_URL}/products/${id}`, data, { withCredentials: true });
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${API_URL}/products/${id}`, { withCredentials: true });
  }
}
