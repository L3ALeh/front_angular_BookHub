import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Livre, Commentaire } from '../models/livre.model';

@Injectable({
  providedIn: 'root'
})
export class LivreService {
  private apiUrl = 'http://localhost:8080/api/books'; // pour les bouquins
  private empruntUrl = 'http://localhost:8080/api/loans'; // pour verifier les droits


  constructor(private http: HttpClient) {
  }

  getLivres(): Observable<Livre[]> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      // on recupere soit le content (si page) soit la liste directe
      map(response => response.content || response)
    );
  }

  getLivreByUuid(uuid: string): Observable<Livre> {
    return this.http.get<Livre>(`${this.apiUrl}/${uuid}`);
  }

  // check si l'user a bien lu le livre avant de le laisser noter
  checkIfUserReadBook(uuidLivre: string, userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.empruntUrl}/${uuidLivre}/can-comment`);
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

  // envoie l'avis et la note
  postCommentaire(uuidLivre: string, avis: { note: number; texte: string }): Observable<Commentaire> {
    return this.http.post<Commentaire>(`${this.apiUrl}/${uuidLivre}/commentaires`, avis);
  }

  //supprimer l'avis si besoin
  deleteCommentaire(idCommentaire: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/commentaires/${idCommentaire}`);
  }
}
