import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@inven-tech/types';

const API_URL = 'http://localhost:3000/api';

type UserRolePayload = 'ADMIN' | 'EMPLOYEE';

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRolePayload;
}

interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRolePayload;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}/users`, { withCredentials: true });
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}/users/${id}`, { withCredentials: true });
  }

  create(data: CreateUserPayload): Observable<User> {
    return this.http.post<User>(`${API_URL}/users`, data, { withCredentials: true });
  }

  update(id: number, data: UpdateUserPayload): Observable<void> {
    return this.http.put<void>(`${API_URL}/users/${id}`, data, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/users/${id}`, { withCredentials: true });
  }
}
