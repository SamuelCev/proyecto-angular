import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/api';

export interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);

  getAll(): Observable<UserListItem[]> {
    return this.http.get<UserListItem[]>(`${API_URL}/users`, { withCredentials: true });
  }
}
