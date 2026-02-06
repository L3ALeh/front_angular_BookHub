import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {LivreService} from '../services/livre.service';
import {Livre} from '../models/livre.model';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../services/auth.service';


declare var bootstrap: any;

@Component({
  selector: 'app-livreDetails',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './livreDetails.component.html'
})
export class livreDetailsComponent implements OnInit {
  livre?: Livre;

  // Variables de droits
  estUtilisateur: boolean = false;
  aDejaLuCeLivre: boolean = false;
  estBibliothecaire: boolean = false;

  // Variables de notation
  noteSelectionnee: number = 0;
  noteSurvolee: number = 0;

  constructor(
    private route: ActivatedRoute,
    private livreService: LivreService,
    private authService: AuthService // Injection correcte ici
  ) {
  }

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('id');

    // Vérification du rôle via le service
    this.estUtilisateur = this.authService.hasRole('USER');
    this.estBibliothecaire = this.authService.hasRole('LIBRARIAN');

    if (uuid) {
      this.livreService.getLivreByUuid(uuid).subscribe((data: Livre) => {
        this.livre = data;

        // Vérification de l'historique si c'est un utilisateur
        if (this.estUtilisateur) {
          this.verifierHistoriqueEmprunt(uuid);
        }
      });
    }
  }

  emprunterLivre() {
    console.log("Tentative d'emprunt pour :", this.livre?.titre);
  }

  reserverLivre() {
    if (this.livre) {
      alert(`Le livre "${this.livre.titre}" a été réservé !`);
    }
  }

  noter(valeur: number) {
    this.noteSelectionnee = valeur;
  }

  setHover(valeur: number) {
    this.noteSurvolee = valeur;
  }

  modifierLivre() {
    const modalElem = document.getElementById('editBookModal');
    const modal = new bootstrap.Modal(modalElem);
    modal.show();
  }

  validerModification() {
    if (this.livre) {
      this.livreService.updateLivre(this.livre.uuidLivre, this.livre).subscribe({
        next: (livreMisAJour) => {
          this.livre = livreMisAJour; // On met à jour l'affichage en direct

          // Fermer la modal proprement
          const modalElem = document.getElementById('editBookModal');
          const modalInstance = bootstrap.Modal.getInstance(modalElem);
          modalInstance.hide();

          alert("Le livre a été mis à jour avec succès !");
        },
        error: (err) => {
          console.error("Erreur lors de la mise à jour", err);
          alert("Une erreur est survenue lors de la sauvegarde.");
        }
      });
    }
  }

  private verifierHistoriqueEmprunt(uuid: string) {
    // Vérification si l'utilisateur a déjà lu le livre pour autoriser le commentaire
    this.livreService.checkIfUserReadBook(uuid).subscribe((res: boolean) => {
      this.aDejaLuCeLivre = res;
    });
  }
}
