import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { LivreService } from '../services/livre.service';
import { Livre } from '../models/livre.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  livres: Livre[] = [];
  mesEmprunts: any[] = [];
  retardsLecteur: number = 0;
  retardsGlobaux: number = 0;
  empruntsEnRetard: any[] = []; // Liste détaillée pour le Librarian

  stats = {
    totalOuvrages: 0,
    totalExemplaires: 0,
    enCirculation: 0,
    disponibles: 0,
    tauxOccupation: 0
  };

  constructor(public authService: AuthService, private livreService: LivreService) {}

  ngOnInit(): void {
    this.chargerDonneesBackend();
  }

  chargerDonneesBackend() {
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    this.livreService.getLivres().subscribe({
      next: (res) => {
        this.livres = res;
        this.stats.totalOuvrages = res.length;
        this.stats.totalExemplaires = res.reduce((acc, l) => acc + (l.exemplaireTotal || 0), 0);
        this.stats.disponibles = res.reduce((acc, l) => acc + (l.exemplaireDisponible || 0), 0);
        this.stats.enCirculation = this.stats.totalExemplaires - this.stats.disponibles;
        this.stats.tauxOccupation = this.stats.totalExemplaires > 0
          ? Math.round((this.stats.enCirculation / this.stats.totalExemplaires) * 100) : 0;
      },
      error: (err) => console.error("Erreur chargement livres :", err)
    });

    // 2. Un seul appel pour tous les types d'emprunts
    this.livreService.getEmprunts().subscribe({
      next: (emprunts) => {
        const userId = this.authService.getUserId();

        this.mesEmprunts = emprunts
          .filter(e => {
            const idUser = e.utilisateur?.uuidUtilisateur || e.uuidUtilisateur || e.uuid_utilisateur;
            return idUser === userId && (e.statut === 'EN_COURS' || e.statut === 'ACTIF');
          })
          .map(e => {
            const dateFin = new Date(e.dateFinPrevue || e.date_fin_prevue);
            // Calcul de la différence en jours
            const diffTime = dateFin.getTime() - aujourdhui.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
              ...e,
              joursRestants: diffDays > 0 ? diffDays : 0,
              joursRetard: diffDays < 0 ? Math.abs(diffDays) : 0
            };
          });

        this.retardsLecteur = this.mesEmprunts.filter(e => e.joursRetard > 0).length;

        this.empruntsEnRetard = emprunts
          .filter(e => {
            const dateFin = new Date(e.dateFinPrevue || e.date_fin_prevue);
            return (e.statut === 'EN_COURS' || e.statut === 'ACTIF') && dateFin < aujourdhui;
          })
          .map(e => {
            const dateFin = new Date(e.dateFinPrevue || e.date_fin_prevue);
            const diffDays = Math.ceil(Math.abs(aujourdhui.getTime() - dateFin.getTime()) / (1000 * 60 * 60 * 24));
            return { ...e, joursRetard: diffDays };
          });

        this.retardsGlobaux = this.empruntsEnRetard.length;
      },
      error: (err) => console.error("Erreur chargement emprunts :", err)
    });
  }

  get topLivres() {
    return [...this.livres]
      .sort((a, b) => (b.exemplaireTotal - b.exemplaireDisponible) - (a.exemplaireTotal - a.exemplaireDisponible))
      .slice(0, 5);
  }
}
