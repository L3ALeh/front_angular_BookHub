import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Emprunt {
  uuidEmprunt: string;
  dateDebut: string;
  dateFinPrevue: string;
  dateFin?: string;
  statut: string;
  livre: any;
  estEnRetard: boolean;
  utilisateur?: any;
}

@Injectable({ providedIn: 'root' })
export class EmpruntService {
  private apiUrl = 'http://localhost:8080/api/loans';
  private reservUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

  // clic sur emprunter
  emprunterLivre(uuidLivre: string, uuidUtilisateur: string): Observable<any> {
    const body = { uuidLivre, uuidUtilisateur };
    return this.http.post(this.apiUrl, body);
  }

  // pour le retour du livre
  validerRetour(uuidEmprunt: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${uuidEmprunt}/retour`, {});
  }

  getHistorique(userId: string): Observable<Emprunt[]> {
    return this.http.get<Emprunt[]>(`${this.apiUrl}/utilisateur/historique`);
  }

  getEmpruntsEnCours(userId: string): Observable<Emprunt[]> {
    return this.http.get<any>(`${this.apiUrl}/utilisateur/actifs`).pipe(
      // petit check pour recuperer la liste direct
      map(res => Array.isArray(res) ? res : (res.content || []))
    );
  }

  getAllEmpruntsGlobal(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/all`);
  }

  // reservation si plus de stock
  reserverLivre(uuidLivre: string): Observable<any> {
    return this.http.post(`${this.reservUrl}/${uuidLivre}`, {});
  }

  // recupere mes reservations
  getMesReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.reservUrl}/my`);
  }

  annulerReservation(idReservation: string): Observable<any> {
    return this.http.delete(`${this.reservUrl}/${idReservation}`);
  }
}
