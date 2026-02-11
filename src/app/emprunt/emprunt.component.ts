import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Emprunt, EmpruntService } from '../services/emprunt.service';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';

registerLocaleData(localeFr);

@Component({
  selector: 'app-emprunt',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './emprunt.component.html',
  styleUrl: './emprunt.component.css'
})
export class EmpruntComponent implements OnInit {
  empruntsEnCours: Emprunt[] = [];
  historique: Emprunt[] = [];
  mesReservations: any[] = [];
  // pour switcher entre les vues dans le html
  ongletActif: 'emprunt' | 'reservation' = 'emprunt';

  constructor(
    private empruntService: EmpruntService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    const userId = this.authService.getUserId();
    const isLibrarian = this.authService.hasRole('LIBRARIAN');

    if (isLibrarian) {
      // si c'est la bibliothecaire, on prend tout le global
      this.empruntService.getAllEmpruntsGlobal().subscribe({
        next: (data) => {
          this.empruntsEnCours = data.enCours || [];
          this.historique = data.historique || [];
          this.mesReservations = data.reservations || [];
        },
        error: (err) => console.error('erreur admin:', err)
      });
    } else if (userId) {
      // sinon juste les infos du user connecté
      this.rafraichirDonneesLecteur(userId);
    }
  }

  rafraichirDonneesLecteur(userId: string): void {
    // recupere les livres pas encore rendus
    this.empruntService.getEmpruntsEnCours(userId).subscribe({
      next: (data) => this.empruntsEnCours = data,
      error: (err) => console.error('erreur emprunts actifs:', err)
    });

    // tout ce qu'il a deja rendu
    this.empruntService.getHistorique(userId).subscribe({
      next: (data) => this.historique = data,
      error: (err) => console.error('erreur historique:', err)
    });

    // ses reservations en attente
    this.empruntService.getMesReservations().subscribe({
      next: (data) => this.mesReservations = data,
      error: (err) => console.error('erreur réservations:', err)
    });
  }

  annulerReservation(idReservation: string): void {
    if (confirm("voulez-vous vraiment annuler cette réservation ?")) {
      this.empruntService.annulerReservation(idReservation).subscribe({
        next: () => {
          alert("réservation annulée.");
          this.chargerDonnees();
        },
        error: (err) => alert("erreur d'annulation.")
      });
    }
  }

  changerOnglet(onglet: 'emprunt' | 'reservation'): void {
    this.ongletActif = onglet;
  }

  retournerLivre(uuidEmprunt: string): void {
    if (confirm("valider le retour de ce livre ?")) {
      this.empruntService.validerRetour(uuidEmprunt).subscribe({
        next: () => {
          alert("livre rendu !");
          this.chargerDonnees();
        },
        error: (err) => console.error("erreur retour:", err)
      });
    }
  }

  // petit calcul pour savoir si on est dans les temps
  getRetard(emprunt: any): number {
    const datePrevueStr = emprunt.dateFinPrevue || emprunt.date_fin_prevue;
    if (!datePrevueStr) return 0;
    const datePrevue = new Date(datePrevueStr);
    const aujourdhui = new Date();
    const diffInMs = datePrevue.getTime() - aujourdhui.getTime();
    // on transforme les ms en jours
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  }
}
