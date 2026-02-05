import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Livre } from '../models/livre.model';

@Injectable({
  providedIn: 'root'
})
export class LivreService {
  private apiUrl = 'http://localhost:8080/api/books'; //connexion avec le back )

  constructor(private http: HttpClient) {}

  // Dans ton livre.service.ts
  getLivres(): Observable<Livre[]> {
    return this.http.get<any>('http://localhost:8080/api/books').pipe(
      map(response => response.content) // apparation des livres de la bdd
    );
  }
}
