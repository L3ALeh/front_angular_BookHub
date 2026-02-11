import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Livre } from '../models/livre.model';
import { EmpruntService } from '../services/emprunt.service';

interface EmpruntBrut {
  livre: Livre;
  statut: string;
  utilisateur?: any;
  uuidUtilisateur?: string;
  dateFinPrevue?: string;
  date_fin_prevue?: string;
}

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
  mesReservations: any[] = [];
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
    private empruntService: EmpruntService
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees() {
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    const userId = this.authService.getUserId();

    this.empruntService.getAllEmpruntsGlobal().subscribe({
      next: (data: any) => {
        console.log("Structure détectée :", data);

        const listeBrute: EmpruntBrut[] = [
          ...(data.enCours || []),
          ...(data.historique || []),
          ...(data.enRetard || [])
        ];

        const livresExtraits: Livre[] = listeBrute
          .filter(e => e && e.livre)
          .map(e => e.livre);

        this.livres = Array.from(new Map(livresExtraits.map(l => [l.uuidLivre || (l as any).id, l])).values());

        this.calculerStatsGlobales();

        if (userId) {
          // Emprunts réellement en cours
          this.mesEmprunts = (data.enCours || [])
            .filter((e: any) => (e.utilisateur?.uuidUtilisateur || e.uuidUtilisateur) === userId)
            .map((e: any) => this.enrichir(e, aujourdhui));

          this.mesReservations = (data.enCours || data.reservations || [])
            .filter((e: any) => {
              const idOwner = e.utilisateur?.uuidUtilisateur || e.uuidUtilisateur;
              return idOwner === userId && e.statut === 'RESERVE'; // UNIQUEMENT les réservations
            });

          const monHistorique = (data.historique || [])
            .filter((e: any) => (e.utilisateur?.uuidUtilisateur || e.uuidUtilisateur) === userId);

          this.retardsLecteur = (data.enRetard || [])
            .filter((e: any) => (e.utilisateur?.uuidUtilisateur || e.uuidUtilisateur) === userId).length;
        }
      },
      error: (err) => console.error('Erreur API :', err)
    });
  }

  private enrichir(e: any, aujourdhui: Date) {
    const d = e.dateFinPrevue || e.date_fin_prevue;
    if (!d) return { ...e, joursRestants: 0, joursRetard: 0 };

    const dateFin = new Date(d);
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
    if (!this.livres || this.livres.length === 0) return [];
    return [...this.livres]
      .sort((a, b) => ((b.exemplaireTotal || 0) - (b.exemplaireDisponible || 0)) -
        ((a.exemplaireTotal || 0) - (a.exemplaireDisponible || 0)))
      .slice(0, 5);
  }
}
