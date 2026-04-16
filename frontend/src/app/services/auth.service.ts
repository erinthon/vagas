import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { Morador } from '../models/morador.model';

const TOKEN_KEY = 'vagas_jwt';
const API = 'http://localhost:8080/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  readonly currentUser = signal<Morador | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  loginWithGoogle(): void {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  handleCallback(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.loadCurrentUser().subscribe(() => this.router.navigate(['/perfil']));
  }

  loadCurrentUser() {
    return this.http.get<Morador>(`${API}/me`).pipe(
      tap(user => this.currentUser.set(user))
    );
  }

  updateProfile(dados: Partial<Morador>) {
    return this.http.put<Morador>(`${API}/me`, dados).pipe(
      tap(user => this.currentUser.set(user))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
