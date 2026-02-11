import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Emprunt, EmpruntService } from '../services/emprunt.service';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';
import {Observable} from 'rxjs';

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
  toutesLesReservations: any[] = [];
  historique: Emprunt[] = [];
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
      this.empruntService.getAllEmpruntsGlobal().subscribe({
        next: (data) => {
          this.empruntsEnCours = data.enCours || [];
          // AJOUT : On récupère l'historique depuis l'objet global retourné par le back
          this.historique = data.historique || [];
          this.toutesLesReservations = data.reservations || [];
        },
        error: (err) => console.error('Erreur admin:', err)
      });
    } else if (userId) {
      this.rafraichirDonnees(userId);
    }
  }

  rafraichirDonnees(userId: string): void {
    // Charge les emprunts EN_COURS
    this.empruntService.getEmpruntsEnCours(userId).subscribe({
      next: (data) => this.empruntsEnCours = data,
      error: (err) => console.error('Erreur emprunts actifs:', err)
    });

    // Charge l'historique (RETOURNE)
    this.empruntService.getHistorique(userId).subscribe({
      next: (data) => {
        this.historique = data;
        console.log("Historique chargé :", data); // Vérifiez ici si des données arrivent
      },
      error: (err) => console.error('Erreur historique:', err)
    });
  }

  changerOnglet(onglet: 'emprunt' | 'reservation'): void {
    this.ongletActif = onglet;
  }

  retournerLivre(uuidEmprunt: string): void {
    if (confirm("Valider le retour de ce livre ?")) {
      // UTILISE BIEN LE SERVICE EMPRUNT ICI
      this.empruntService.validerRetour(uuidEmprunt).subscribe({
        next: () => {
          alert("Livre rendu ! Il va apparaître dans l'historique.");
          this.chargerDonnees(); // Rafraîchit les listes
        },
        error: (err) => {
          console.error("Erreur 500 : Vérifie ton code Java !", err);
        }
      });
    }
  }

  joursRestants(emprunt: Emprunt): number {
    const diff = new Date(emprunt.dateFinPrevue).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  joursRetard(emprunt: Emprunt): number {
    return Math.abs(this.joursRestants(emprunt));
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
