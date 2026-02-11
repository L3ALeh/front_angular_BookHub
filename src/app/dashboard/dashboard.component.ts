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
    const isAdmin = this.authService.hasRole('LIBRARIAN');

    if (isAdmin) {
      this.empruntService.getAllEmpruntsGlobal().subscribe({
        next: (data: any) => this.traiterDonneesAdmin(data, aujourdhui)
      });
    } else {
      const userId = this.authService.getUserId();
      if (userId) {
        // 1. Charger les emprunts
        this.empruntService.getEmpruntsEnCours(userId).subscribe({
          next: (data: any[]) => {
            this.mesEmprunts = data.map(e => this.enrichir(e, aujourdhui));
            this.retardsLecteur = this.mesEmprunts.filter(e => e.joursRetard > 0).length;
          }
        });

        // 2. Charger les réservations
        this.empruntService.getMesReservations().subscribe({
          next: (reservations) => {
            this.mesReservations = reservations;
            this.reservationsLecteur = reservations.length;
          }
        });
      }
    }
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


  get topLivres() {
    if (!this.livres || this.livres.length === 0) return [];
    return [...this.livres]
      .sort((a, b) => ((b.exemplaireTotal || 0) - (b.exemplaireDisponible || 0)) -
        ((a.exemplaireTotal || 0) - (a.exemplaireDisponible || 0)))
      .slice(0, 5);
  }

  private traiterDonneesAdmin(data: any, aujourdhui: Date) {
    const tous = [...(data.enCours || []), ...(data.historique || []), ...(data.enRetard || [])];

    // Remplissage des livres pour le calcul des stats
    this.livres = Array.from(new Map(tous.filter(e => e?.livre).map(e => [e.livre.uuidLivre || e.livre.id, e.livre])).values());

    // Remplissage des listes d'affichage
    this.mesEmprunts = (data.enCours || []).map((e: any) => this.enrichir(e, aujourdhui));
    this.empruntsEnRetard = (data.enRetard || []).map((e: any) => this.enrichir(e, aujourdhui));

    // Mise à jour des compteurs admin
    this.retardsGlobaux = this.empruntsEnRetard.length;
    this.calculerStatsGlobales();
  }

  private calculerStatsGlobales() {
    this.stats.totalOuvrages = this.livres.length;
    this.stats.totalExemplaires = this.livres.reduce((acc, l) => acc + (l.exemplaireTotal || 0), 0);
    const dispos = this.livres.reduce((acc, l) => acc + (l.exemplaireDisponible || 0), 0);
    this.stats.enCirculation = this.stats.totalExemplaires - dispos;
    this.stats.tauxOccupation = this.stats.totalExemplaires > 0
      ? Math.round((this.stats.enCirculation / this.stats.totalExemplaires) * 100) : 0;
  }
}
