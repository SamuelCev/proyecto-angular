import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '@inven-tech/types';

const API_URL = 'http://localhost:3000/api';
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
}
