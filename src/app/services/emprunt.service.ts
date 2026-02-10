import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Emprunt {
  idEmprunt: string;
  livre: {
    titre: string;
    auteur: string;
    isbn: string;
    couverture?: string;
  };
  dateDebut: string;
  dateFinPrevue: string;
  dateFin?: string;
  estEnRetard?: boolean;
  statut: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpruntService {
  private apiUrl = 'http://localhost:8080/api/loans';

  constructor(private http: HttpClient) { }

  // Récupérer les emprunts en cours
  getEmpruntsEnCours(idUtilisateur: string): Observable<Emprunt[]> {
    return this.http.get<Emprunt[]>(`${this.apiUrl}/my?idUtilisateur=${idUtilisateur}&type=current`);
  }

  // Récupérer l'historique
  getHistorique(idUtilisateur: string): Observable<Emprunt[]> {
    return this.http.get<Emprunt[]>(`${this.apiUrl}/my?idUtilisateur=${idUtilisateur}&type=history`);
  }
}
