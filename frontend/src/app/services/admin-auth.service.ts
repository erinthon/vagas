import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';

const API = 'http://localhost:8080/api/admin';
const TOKEN_KEY = 'vagas_admin_jwt';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  login(username: string, senha: string) {
    return this.http.post<{ token: string }>(`${API}/auth/login`, { username, senha }).pipe(
      tap(res => localStorage.setItem(TOKEN_KEY, res.token)),
      map(() => void 0)
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/admin/login']);
  }
}
