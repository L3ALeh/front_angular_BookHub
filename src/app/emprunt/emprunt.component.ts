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
  ongletActif: 'emprunt' | 'reservation' = 'emprunt';

  constructor(
    private empruntService: EmpruntService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.rafraichirDonnees(userId);
    }
  }

  rafraichirDonnees(userId: string): void {
    this.empruntService.getEmpruntsEnCours(userId).subscribe({
      next: (data) => this.empruntsEnCours = data,
      error: (err) => console.error('Erreur emprunts actifs:', err)
    });

    this.empruntService.getHistorique(userId).subscribe({
      next: (data) => this.historique = data,
      error: (err) => console.error('Erreur historique:', err)
    });
  }

  changerOnglet(onglet: 'emprunt' | 'reservation'): void {
    this.ongletActif = onglet;
  }

  retournerLivre(uuidEmprunt: string): void {
    if (confirm("Confirmer le retour de ce livre ?")) {
      this.empruntService.deleteEmprunt(uuidEmprunt).subscribe({
        next: () => {
          const userId = this.authService.getUserId();
          if (userId) this.rafraichirDonnees(userId);
          alert("Livre rendu !");
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
