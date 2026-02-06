import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
//Inutile pour le moment car aucun jeu + auth dans la bdd
  private utilisateurConnecte = {
    id: 1,
    nom: '',
    roles: ['']
  };

  constructor() {
  }

  // Vérifie si l'utilisateur possède un rôle spécifique
  hasRole(roleDemande: string): boolean {
    return this.utilisateurConnecte.roles.includes(roleDemande);
  }

  // Récupère l'ID de l'utilisateur pour les vérifications d'emprunt
  getUserId(): number {
    return this.utilisateurConnecte.id;
  }

  // Vérifie si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!this.utilisateurConnecte;
  }


}
