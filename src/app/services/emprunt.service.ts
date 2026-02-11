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
}

@Injectable({
  providedIn: 'root'
})
export class EmpruntService {
  private apiUrl = 'http://localhost:8080/api/loans';

  constructor(private http: HttpClient) {}

  getEmpruntsEnCours(userId: string): Observable<Emprunt[]> {
    return this.http.get<any>(`${this.apiUrl}/utilisateur/${userId}/actifs`).pipe(
      map(res => Array.isArray(res) ? res : (res.content || []))
    );
  }

  getHistorique(userId: string): Observable<Emprunt[]> {
    return this.http.get<Emprunt[]>(`${this.apiUrl}/utilisateur/${userId}/historique`);
  }


  deleteEmprunt(uuidEmprunt: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uuidEmprunt}`);
  }
}
