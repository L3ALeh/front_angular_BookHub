import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import { Livre, Commentaire } from '../models/livre.model';

@Injectable({
  providedIn: 'root'
})
export class LivreService {
  private apiUrl = 'http://localhost:8080/api/books'; // Pour les livres
  private empruntUrl = 'http://localhost:8080/api/loans'; // Pour les emprunts


  constructor(private http: HttpClient) {
  }

  getLivres(): Observable<Livre[]> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map(response => response.content || response)
    );
  }

  getLivreByUuid(uuid: string): Observable<Livre> {
    return this.http.get<Livre>(`${this.apiUrl}/${uuid}`);
  }

  checkIfUserReadBook(uuid: string, userId: string): Observable<boolean> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<boolean>(`${this.apiUrl}/check-lecture/${uuid}`, {params});
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

  postCommentaire(uuidLivre: string, avis: { note: number; texte: string }): Observable<Commentaire> {
    return this.http.post<Commentaire>(`${this.apiUrl}/${uuidLivre}/commentaires`, avis);
  }

  deleteCommentaire(idCommentaire: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/commentaires/${idCommentaire}`);
  }
}
