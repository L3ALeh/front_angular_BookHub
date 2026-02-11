import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LivreService } from '../services/livre.service';
import { Livre } from '../models/livre.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
  livres: Livre[] = [];
  livresFiltres: Livre[] = [];
  searchTerm: string = '';
  selectedCategorie: string = 'Toutes catégories';
  onlyAvailable: boolean = false;
  categories: string[] = [];

  nouvelleCategorie: string = '';

  // Modèle aligné avec ton formulaire HTML
  nouveauLivre: any = {
    titre: '',
    auteur: '',
    isbn: '',
    categorie: '',
    description: '',
    couverture: '',
    datePublication: '',
    editeur: '', // Ajouté car présent dans ton HTML
    exemplaireTotal: 1,
    page: 0
  };

  constructor(
    private livreService: LivreService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerLivres();
  }

  chargerLivres() {
    this.livreService.getLivres().subscribe({
      next: (data) => {
        this.livres = (data as any).content || data || [];

        this.categories = [...new Set(this.livres.map(l => (l.categorie || '').trim()))]
          .filter(c => c !== '')
          .sort();

        this.applyFilters();
      },
      error: (err) => console.error("Erreur BDD : ", err)
    });
  }

  goToDetails(uuid: string | undefined): void {
    if (uuid) {
      this.router.navigate(['/books', uuid]);
    }
  }

  applyFilters(): void {
    this.livresFiltres = this.livres.filter(l => {
      const matchSearch = !this.searchTerm ||
        l.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        l.auteur.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchCat = this.selectedCategorie === 'Toutes catégories' ||
        l.categorie === this.selectedCategorie;

      const matchDispo = !this.onlyAvailable || l.exemplaireDisponible > 0;

      return matchSearch && matchCat && matchDispo;
    });
  }

  confirmerAjout() {
    const categorieFinale = this.nouveauLivre.categorie === 'AUTRE'
      ? this.nouvelleCategorie
      : this.nouveauLivre.categorie;

    const livreAEnvoyer = {
      ...this.nouveauLivre,
      categorie: categorieFinale,
      exemplaireDisponible: Number(this.nouveauLivre.exemplaireTotal),
      page: Number(this.nouveauLivre.page),
      exemplaireTotal: Number(this.nouveauLivre.exemplaireTotal)
    };

    this.livreService.addLivre(livreAEnvoyer).subscribe({
      next: () => {
        this.chargerLivres();
        this.resetForm();
      },
      error: (err) => {
        console.error("Erreur serveur :", err);
        alert("Impossible d'ajouter le livre. Vérifiez les champs.");
      }
    });
  }

  private resetForm() {
    this.nouveauLivre = {
      titre: '', auteur: '', isbn: '', categorie: '',
      description: '', couverture: '', datePublication: '',
      editeur: '', exemplaireTotal: 1, page: 0
    };
    this.nouvelleCategorie = '';
  }
}
