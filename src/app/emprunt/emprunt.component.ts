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
  // Cette variable sera utilisée par le HTML pour les deux rôles
  mesReservations: any[] = [];
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
      // Cas Bibliothécaire : On récupère tout d'un coup
      this.empruntService.getAllEmpruntsGlobal().subscribe({
        next: (data) => {
          this.empruntsEnCours = data.enCours || [];
          this.historique = data.historique || [];
          // On remplit mesReservations avec les réservations globales pour le mode Admin
          this.mesReservations = data.reservations || [];
        },
        error: (err) => console.error('Erreur admin:', err)
      });
    } else if (userId) {
      // Cas Lecteur : On charge les emprunts, l'historique et les réservations perso
      this.rafraichirDonneesLecteur(userId);
    }
  }

  rafraichirDonneesLecteur(userId: string): void {
    // 1. Emprunts actifs
    this.empruntService.getEmpruntsEnCours(userId).subscribe({
      next: (data) => this.empruntsEnCours = data,
      error: (err) => console.error('Erreur emprunts actifs:', err)
    });

    // 2. Historique
    this.empruntService.getHistorique(userId).subscribe({
      next: (data) => this.historique = data,
      error: (err) => console.error('Erreur historique:', err)
    });

    // 3. Réservations personnelles
    this.empruntService.getMesReservations().subscribe({
      next: (data) => this.mesReservations = data,
      error: (err) => console.error('Erreur réservations:', err)
    });
  }

  annulerReservation(idReservation: string): void {
    if (confirm("Voulez-vous vraiment annuler cette réservation ?")) {
      this.empruntService.annulerReservation(idReservation).subscribe({
        next: () => {
          alert("Réservation annulée avec succès.");
          this.chargerDonnees(); // On rafraîchit tout
        },
        error: (err) => alert("Erreur lors de l'annulation.")
      });
    }
  }

  changerOnglet(onglet: 'emprunt' | 'reservation'): void {
    this.ongletActif = onglet;
  }

  retournerLivre(uuidEmprunt: string): void {
    if (confirm("Valider le retour de ce livre ?")) {
      this.empruntService.validerRetour(uuidEmprunt).subscribe({
        next: () => {
          alert("Livre rendu !");
          this.chargerDonnees();
        },
        error: (err) => console.error("Erreur retour:", err)
      });
    }
  }

  getRetard(emprunt: any): number {
    const datePrevueStr = emprunt.dateFinPrevue || emprunt.date_fin_prevue;
    if (!datePrevueStr) return 0;
    const datePrevue = new Date(datePrevueStr);
    const aujourdhui = new Date();
    const diffInMs = datePrevue.getTime() - aujourdhui.getTime();
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  }
}
