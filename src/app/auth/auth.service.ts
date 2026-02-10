import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  // Inscription vers le backend
  register(
    prenom: string,
    nom: string,
    email: string,
    password: string
  ): Observable<AuthResponse> {
    const body = {
      prenom,
      nom,
      email,
      password,
      roles: ['reader'] // rôle fixé côté frontend
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/inscrire`, body);
  }

  // Connexion vers le backend
  login(email: string, password: string): Observable<AuthResponse> {
    const body = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/connexion`, body);
  }
}
