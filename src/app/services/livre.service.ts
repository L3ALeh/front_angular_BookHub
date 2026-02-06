import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Livre } from '../models/livre.model';

@Injectable({
  providedIn: 'root'
})
export class LivreService {
  private apiUrl = 'http://localhost:8080/api/books'; //connexion avec le back )

  constructor(private http: HttpClient) {
  }

  getLivres(): Observable<Livre[]> {
    return this.http.get<any>('http://localhost:8080/api/books').pipe(
      map(response => response.content) // apparition des livres de la bdd
    );
  }

  getLivreByUuid(uuid: string): Observable<Livre> {
    return this.http.get<Livre>(`${this.apiUrl}/${uuid}`);
  }

  checkIfUserReadBook(uuid: string): Observable<boolean> {
    // On renvoie un Observable de type boolean
    // L'URL dépend de ta configuration Backend (ex: /api/livres/check-lecture/uuid)
    return this.http.get<boolean>(`${this.apiUrl}/check-lecture/${uuid}`);
  }

  addLivre(livre: any): Observable<Livre> {
    return this.http.post<Livre>(`${this.apiUrl}`, livre);
  }

  updateLivre(uuid: string, livre: any): Observable<Livre> {
    return this.http.put<Livre>(`${this.apiUrl}/${uuid}`, livre);
  }

  deleteLivre(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uuid}`);
  }
}
