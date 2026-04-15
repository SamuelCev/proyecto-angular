import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import type { AuthResponse } from '../../../types/auth';
import { environment } from '../environments/environment';

export interface AuthUser {
  id: number;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly api = `${environment.apiUrl}/auth`;
  readonly user = signal<AuthUser | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  loadUser() {
    return this.http.get<AuthUser>(`${this.api}/me`, { withCredentials: true }).subscribe({
      next: (user) => this.user.set(user),
      error: () => this.user.set(null),
    });
  }

  checkAuth(): Observable<boolean> {
    if (this.user()) return of(true);
    return this.http.get<AuthUser>(`${this.api}/me`, { withCredentials: true }).pipe(
      map(user => {
        this.user.set(user);
        return true;
      }),
      catchError(() => {
        this.user.set(null);
        return of(false);
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.api}/login`, { email, password }, { withCredentials: true });
  }

  logout() {
    this.http.post(`${this.api}/logout`, {}, { withCredentials: true }).subscribe(() => {
      this.user.set(null);
      this.router.navigate(['/login']);
    });
  }
}
