import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';

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
  private reservUrl = 'http://localhost:8080/api/reservations'; // Assure-toi que c'est bien reservations
  constructor(private http: HttpClient) {}

  // bouton "Emprunter" du livre
  emprunterLivre(uuidLivre: string, uuidUtilisateur: string): Observable<any> {
    const body = { uuidLivre, uuidUtilisateur };
    return this.http.post(this.apiUrl, body);
  }

  //  bouton "Valider le retour" du bibliothécaire
  validerRetour(uuidEmprunt: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${uuidEmprunt}/retour`, {});
  }

  //historique du lecteur
  getHistorique(userId: string): Observable<Emprunt[]> {
    // L'URL devient simple, le serveur utilise le Token pour savoir qui tu es
    return this.http.get<Emprunt[]>(`${this.apiUrl}/utilisateur/historique`);
  }

  getEmpruntsEnCours(userId: string): Observable<Emprunt[]> {
    return this.http.get<any>(`${this.apiUrl}/utilisateur/actifs`).pipe(
      map(res => Array.isArray(res) ? res : (res.content || []))
    );
  }
  getAllEmpruntsGlobal(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/all`);
  }

  reserverLivre(uuidLivre: string): Observable<any> {
    // L'appel POST doit correspondre à @PostMapping("/{uuidLivre}") du Java
    return this.http.post(`${this.reservUrl}/${uuidLivre}`, {});
  }

  getMesReservations(): Observable<any[]> {
    // REMPLACÉ this.apiUrl PAR this.reservUrl
    return this.http.get<any[]>(`${this.reservUrl}/my`);
  }

  annulerReservation(idReservation: string): Observable<any> {
    return this.http.delete(`${this.reservUrl}/${idReservation}`);
  }
}
