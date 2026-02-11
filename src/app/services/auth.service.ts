import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private authStatus = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));

  constructor(private http: HttpClient) {}

  get isAuthenticated$(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  register(prenom: string, nom: string, email: string, password: string): Observable<AuthResponse> {
    const body = { prenom, nom, email, password, roles: ['READER'] };
    return this.http.post<AuthResponse>(`${this.apiUrl}/inscrire`, body);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/connexion`, { email, password }).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.authStatus.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.clear();

    this.authStatus.next(false);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      // On cherche la clé 'uuid' que nous avons ajoutée au Backend
      return decoded.uuid || null;
    } catch (error) {
      console.error("Erreur décodage token", error);
      return null;
    }
  }

  hasRole(role: string): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      const roles: string[] = decoded.roles || [];
      return roles.includes(role);
    } catch {
      return false;
    }
  }
}
