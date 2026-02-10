import {Component, OnInit} from '@angular/core';
import {CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {Emprunt, EmpruntService} from '../services/emprunt.service';

// Enregistrer le locale français
registerLocaleData(localeFr);

@Component({
  selector: 'app-emprunt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emprunt.component.html',
  styleUrl: './emprunt.component.css'
})
export class EmpruntComponent implements OnInit{

  empruntsEnCours: Emprunt[] = [];
  historique: Emprunt[] = [];
  ongletActif: "emprunt" | "historique" = 'emprunt';

  // TEMPORAIRE : en dur pour les tests !
  idUtilisateur = '11111111-1111-1111-1111-111111111111';

  constructor(private empruntService: EmpruntService) {}

  ngOnInit(): void {
    this.chargerEmpruntsEnCours();
    this.chargerHistorique();
  }

  private chargerEmpruntsEnCours() {
    this.empruntService.getEmpruntsEnCours(this.idUtilisateur).subscribe({
      next: (data) => {
        this.empruntsEnCours = data;
        console.log('Emprunts en cours : ', data);
      },
      error: (err) => console.error('Erreurs : ', err)
    });
  }

  private chargerHistorique() {
    this.empruntService.getHistorique(this.idUtilisateur).subscribe({
      next: (data) => {
        this.historique = data;
        console.log('Historique : ', data);
      },
      error: (err) => console.error('Erreurs : ', err)
    });
  }

  changerOnglet(onglet: 'emprunt' | 'historique') {
    this.ongletActif = onglet;
  }

  joursRestants(emprunt: Emprunt): number {
    const dateRetour = new Date(emprunt.dateFinPrevue);
    const aujourdhui = new Date();
    const diff = dateRetour.getTime() - aujourdhui.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  joursRetard(emprunt: Emprunt): number {
    return Math.abs(this.joursRestants(emprunt));
  }
}
