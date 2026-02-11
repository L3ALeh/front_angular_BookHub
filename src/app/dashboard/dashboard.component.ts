import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LivreService } from '../services/livre.service';
import { Livre } from '../models/livre.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  livres: Livre[] = [];
  mesEmprunts: any[] = [];
  retardsLecteur: number = 0;
  reservationsLecteur: number = 0;
  empruntsEnRetard: any[] = [];
  retardsGlobaux: number = 0;

  stats = {
    totalOuvrages: 0,
    totalExemplaires: 0,
    enCirculation: 0,
    tauxOccupation: 0
  };

  constructor(
    public authService: AuthService,
    private livreService: LivreService
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees() {
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    this.livreService.getLivres().subscribe({
      next: (data: any) => {
        this.livres = data.content || data || [];
        this.calculerStatsGlobales();
      },
      error: (err) => console.error(err)
    });

    this.livreService.getEmprunts().subscribe({
      next: (emprunts: any[]) => {
        const userId = this.authService.getUserId();

        this.mesEmprunts = emprunts
          .filter(e => {
            const idOwner = e.utilisateur?.uuidUtilisateur || e.uuid_utilisateur || e.uuidUtilisateur;
            return idOwner === userId && (e.statut === 'EN_COURS' || e.statut === 'ACTIF');
          })
          .map(e => this.enrichir(e, aujourdhui));

        this.retardsLecteur = this.mesEmprunts.filter(e => e.joursRetard > 0).length;

        this.reservationsLecteur = emprunts.filter(e => {
          const idOwner = e.utilisateur?.uuidUtilisateur || e.uuid_utilisateur || e.uuidUtilisateur;
          return idOwner === userId && e.statut === 'RESERVE';
        }).length;

        this.empruntsEnRetard = emprunts
          .filter(e => {
            const dateFin = new Date(e.dateFinPrevue || e.date_fin_prevue);
            return (e.statut === 'EN_COURS' || e.statut === 'ACTIF') && dateFin < aujourdhui;
          })
          .map(e => this.enrichir(e, aujourdhui));

        this.retardsGlobaux = this.empruntsEnRetard.length;
      },
      error: (err) => console.error(err)
    });
  }

  private enrichir(e: any, aujourdhui: Date) {
    const dateFin = new Date(e.dateFinPrevue || e.date_fin_prevue);
    const diffTime = dateFin.getTime() - aujourdhui.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      ...e,
      joursRestants: diffDays > 0 ? diffDays : 0,
      joursRetard: diffDays < 0 ? Math.abs(diffDays) : 0
    };
  }

  private calculerStatsGlobales() {
    this.stats.totalOuvrages = this.livres.length;
    this.stats.totalExemplaires = this.livres.reduce((acc, l) => acc + (l.exemplaireTotal || 0), 0);
    const dispos = this.livres.reduce((acc, l) => acc + (l.exemplaireDisponible || 0), 0);
    this.stats.enCirculation = this.stats.totalExemplaires - dispos;
    this.stats.tauxOccupation = this.stats.totalExemplaires > 0
      ? Math.round((this.stats.enCirculation / this.stats.totalExemplaires) * 100) : 0;
  }

  get topLivres() {
    return [...this.livres]
      .sort((a, b) => (b.exemplaireTotal - b.exemplaireDisponible) - (a.exemplaireTotal - a.exemplaireDisponible))
      .slice(0, 5);
  }
}
