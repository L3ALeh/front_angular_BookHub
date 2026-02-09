import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LivreService } from '../services/livre.service';
import { Livre, Commentaire } from '../models/livre.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-livreDetails',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './livreDetails.component.html',
  styleUrls: ['./livreDetails.component.css']
})
export class livreDetailsComponent implements OnInit {
  livre: Livre | null = null;

  noteSelectionnee: number = 0;
  noteSurvolee: number = 0;
  nouveauCommentaire: string = "";

  estUtilisateur: boolean = false;
  peutCommenter: boolean = false;

  constructor(
    public authService: AuthService,
    private livreService: LivreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('id');
    if (uuid) {
      this.chargerLivre(uuid);
      // On vérifie les droits dès l'initialisation si quelqu'un est connecté
      if (this.authService.isAuthenticated()) {
        this.verifierDroitD_Avis(uuid);
      }
    }
    this.estUtilisateur = this.authService.isAuthenticated();
  }

  chargerLivre(uuid: string): void {
    this.livreService.getLivreByUuid(uuid).subscribe({
      next: (data) => {
        this.livre = data;
        this.formaterDatesPourAffichage();
      },
      error: (err) => console.error('Erreur chargement livre', err)
    });
  }

  // Vérifie si l'utilisateur  a le droit de commenter
  verifierDroitD_Avis(uuidLivre: string): void {
    const userId = this.authService.getUserId();
    this.livreService.checkIfUserReadBook(uuidLivre, userId).subscribe({
      next: (resultat) => {
        this.peutCommenter = (resultat === true);
        console.log("Droit de commenter mis à jour :", this.peutCommenter);
      },
      error: () => this.peutCommenter = false
    });
  }

  //Action d'emprunt pour l'utilisateur
  emprunterLivre(): void {
    if (this.livre) {
      console.log("Tentative d'emprunt :", this.livre.titre);
      alert(`Demande d'emprunt envoyée pour : ${this.livre.titre}`);
    }
  }

  // Action de réservation (si stock épuisé)
  reserverLivre(): void {
    if (this.livre) {
      console.log("Tentative de réservation :", this.livre.titre);
      alert(`Ce livre est actuellement indisponible. Vous avez été ajouté à la liste d'attente.`);
    }
  }

  // Mise à jour du livre
  validerModification(): void {
    if (this.livre && this.livre.uuidLivre) {
      let datePubISO = this.livre.datePublication;
      if (datePubISO && datePubISO.includes('/')) {
        const [day, month, year] = datePubISO.split('/');
        datePubISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }

      const livreAjour = {
        ...this.livre,
        exemplaireTotal: Number(this.livre.exemplaireTotal),
        exemplaireDisponible: Number(this.livre.exemplaireDisponible),
        page: this.livre.page ? Number(this.livre.page) : 0,
        datePublication: datePubISO
      };

      this.livreService.updateLivre(this.livre.uuidLivre.toString(), livreAjour).subscribe({
        next: (res) => {
          this.livre = res;
          this.formaterDatesPourAffichage();
          alert('Informations mises à jour avec succès !');
        },
        error: (err) => alert('Erreur : ' + (err.error?.message || err.message))
      });
    }
  }

  private formaterDatesPourAffichage(): void {
    if (this.livre) {
      if (this.livre.dateAjout && this.livre.dateAjout.includes('T')) {
        this.livre.dateAjout = new Date(this.livre.dateAjout).toLocaleDateString('fr-FR');
      }
      if (this.livre.datePublication && this.livre.datePublication.includes('-')) {
        const [y, m, d] = this.livre.datePublication.split('-');
        this.livre.datePublication = `${d}/${m}/${y}`;
      }
    }
  }

  publierAvis(): void {
    if (this.noteSelectionnee > 0 && this.nouveauCommentaire.trim() && this.livre?.uuidLivre) {
      const avis = { note: this.noteSelectionnee, texte: this.nouveauCommentaire };
      this.livreService.postCommentaire(this.livre.uuidLivre.toString(), avis).subscribe({
        next: (nouveauCom: Commentaire) => {
          if (!this.livre!.commentaires) this.livre!.commentaires = [];
          this.livre!.commentaires.unshift(nouveauCom);
          this.nouveauCommentaire = "";
          this.noteSelectionnee = 0;
          alert('Merci pour votre avis !');
        },
        error: (err) => alert('Erreur lors de la publication')
      });
    }
  }

  supprimerCommentaire(id: number): void {
    if(confirm('Supprimer cet avis ?')) {
      this.livreService.deleteCommentaire(id).subscribe(() => {
        this.livre!.commentaires = this.livre!.commentaires?.filter(c => c.id !== id);
      });
    }
  }

  supprimerLivre(): void {
    if (confirm('Voulez-vous vraiment retirer ce livre du catalogue ?')) {
      this.livreService.deleteLivre(this.livre!.uuidLivre!.toString()).subscribe(() => {
        this.router.navigate(['/catalogue']);
      });
    }
  }

  setHover(star: number): void { this.noteSurvolee = star; }
  noter(star: number): void { this.noteSelectionnee = star; }
}
