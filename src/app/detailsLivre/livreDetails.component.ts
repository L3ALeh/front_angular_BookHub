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

  // Correction de l'erreur NG9 : On déclare les propriétés nécessaires au HTML
  categories: string[] = ['Science-Fiction', 'Roman', 'Poésie', 'Jeunesse', 'Histoire', 'Philosophie', 'Fantastique', 'Biographie'];
  nouvelleCategorieSaisie: string = "";

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
    this.estUtilisateur = this.authService.isAuthenticated();

    if (uuid) {
      this.chargerLivre(uuid);
      const userId = this.authService.getUserId();
      if (this.estUtilisateur && userId) {
        this.verifierDroitD_Avis(uuid, userId);
      }
    }
  }

  chargerLivre(uuid: string): void {
    this.livreService.getLivreByUuid(uuid).subscribe({
      next: (data: Livre) => {
        this.livre = data;
        this.formaterDatesPourAffichage();
      },
      error: (err: any) => console.error(err)
    });
  }

  verifierDroitD_Avis(uuidLivre: string, userId: string): void {
    this.livreService.checkIfUserReadBook(uuidLivre, userId).subscribe({
      next: (resultat: boolean) => {
        this.peutCommenter = resultat;
      },
      error: () => this.peutCommenter = false
    });
  }

  emprunterLivre(): void {
    const userId = this.authService.getUserId();
    console.log('ID Utilisateur récupéré :', userId); // Diagnostic 1

    if (!userId) {
      alert("Erreur : Impossible de récupérer votre identifiant. Reconnectez-vous.");
      return;
    }

    if (!this.livre || !this.livre.uuidLivre) {
      console.log('Erreur : Données du livre manquantes'); // Diagnostic 2
      return;
    }

    this.livreService.emprunterLivre(this.livre.uuidLivre.toString(), userId).subscribe({
      next: () => {
        if (this.livre) this.livre.exemplaireDisponible--;
        alert(`Emprunt réussi !`);
      },
      error: (err) => {
        console.error('Erreur API :', err);
        alert("Le serveur a refusé l'emprunt.");
      }
    });
  }

  reserverLivre(): void {
    if (this.livre) alert(`Ajouté à la liste d'attente.`);
  }

  validerModification(): void {
    if (this.livre && this.livre.uuidLivre) {

      // Gestion de la nouvelle catégorie saisie par le Librarian
      if (this.livre.categorie === 'NEW_CAT' && this.nouvelleCategorieSaisie.trim() !== "") {
        this.livre.categorie = this.nouvelleCategorieSaisie;
        if (!this.categories.includes(this.nouvelleCategorieSaisie)) {
          this.categories.push(this.nouvelleCategorieSaisie);
        }
      }

      let dateAEnvoyer = this.livre.datePublication;
      if (dateAEnvoyer && dateAEnvoyer.includes('/')) {
        const parts = dateAEnvoyer.split('/');
        if (parts.length === 3) {
          dateAEnvoyer = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }

      const livreAjour = {
        ...this.livre,
        exemplaireTotal: Number(this.livre.exemplaireTotal),
        exemplaireDisponible: Number(this.livre.exemplaireDisponible),
        page: this.livre.page ? Number(this.livre.page) : 0,
        datePublication: dateAEnvoyer
      };

      // Supprimer les champs calculés ou inutiles pour le backend
      delete (livreAjour as any).dateAjout;

      this.livreService.updateLivre(this.livre.uuidLivre.toString(), livreAjour).subscribe({
        next: (res: Livre) => {
          this.livre = res;
          this.nouvelleCategorieSaisie = ""; // Reset après succès
          this.formaterDatesPourAffichage();
          alert('Mise à jour réussie !');
        },
        error: () => alert('Erreur lors de la sauvegarde.')
      });
    }
  }

  private formaterDatesPourAffichage(): void {
    if (this.livre) {
      if (this.livre.dateAjout && this.livre.dateAjout.includes('T')) {
        this.livre.dateAjout = new Date(this.livre.dateAjout).toLocaleDateString('fr-FR');
      }
      if (this.livre.datePublication && this.livre.datePublication.includes('-')) {
        const parts = this.livre.datePublication.split('-');
        if (parts.length === 3) {
          this.livre.datePublication = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
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
          alert('Avis publié !');
        },
        error: () => alert('Erreur lors de la publication')
      });
    }
  }

  supprimerCommentaire(id: number): void {
    if(confirm('Supprimer cet avis ?')) {
      this.livreService.deleteCommentaire(id).subscribe({
        next: () => {
          if (this.livre && this.livre.commentaires) {
            this.livre.commentaires = this.livre.commentaires.filter(c => c.id !== id);
          }
        }
      });
    }
  }

  supprimerLivre(): void {
    if (this.livre && this.livre.uuidLivre) {
      if (confirm('Retirer ce livre du catalogue ?')) {
        this.livreService.deleteLivre(this.livre.uuidLivre.toString()).subscribe({
          next: () => this.router.navigate(['/books']),
          error: () => alert('Erreur lors de la suppression.')
        });
      }
    }
  }

  setHover(star: number): void { this.noteSurvolee = star; }
  noter(star: number): void { this.noteSelectionnee = star; }

}
