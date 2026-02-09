import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Scenario de test : Changement de user pour tester les deux profils

  // PROFIL 1 :Lecteur simple avec un emprunt
 /* private utilisateurConnecte = {
    id: '83E529D7-D4AF-4C17-B35E-A63D67D02478', // UUID
    nom: 'JeanLecteur',
    roles: ['USER']
  }; */


  // PROFIL 2 : Bibliothécaire
  private utilisateurConnecte = {
    id: 'E6002D4B-2470-4BB8-B4B3-52FE67629F68', // UUID de Marie
    nom: 'MarieBiblio',
   roles: ['LIBRARIAN']
  };

  constructor() {}

  hasRole(roleDemande: string): boolean {
    return this.utilisateurConnecte.roles.includes(roleDemande);
  }

  getUserId(): string {
    return this.utilisateurConnecte.id;
  }

  isAuthenticated(): boolean {
    return !!this.utilisateurConnecte;
  }
}
