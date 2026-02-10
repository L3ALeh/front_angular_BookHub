import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {LivreService} from '../services/livre.service';
import {Livre} from '../models/livre.model';
import {AuthService} from '../services/auth.service';

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

  nouveauLivre: any = {
    titre: '',
    auteur: '',
    isbn: '',
    categorie: '',
    description: '',
    couverture: '',
    datePublication: '',
    exemplaireTotal: 1,
    exemplaireDisponibleOptionnel: null,
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

        // Extraction des catégories uniques
        this.categories = [...new Set(this.livres.map(l => (l.categorie || '').trim()))]
          .filter(c => c !== '')
          .sort();
        this.applyFilters();
      },
      error: (err) => {
        console.error("Erreur BDD : ", err);
      }
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
    // On génère la date du jour
    const dateAujourdhui = new Date().toLocaleDateString('fr-FR');

    const livreAEnvoyer = {
      ...this.nouveauLivre,
      dateAjout: dateAujourdhui // On force le format JJ/MM/AAAA
    };
    //Ajout du livre en BDD
    this.livreService.addLivre(livreAEnvoyer).subscribe({
      next: () => {
        this.chargerLivres();
        this.resetForm();
      }
    });
  }

  // Mettre le formulaire de création de livre en vierge
  private resetForm() {
    this.nouveauLivre = {
      titre: '', auteur: '', isbn: '', categorie: '',
      description: '', couverture: '', datePublication: '',
      exemplaireTotal: 1, exemplaireDisponibleOptionnel: null, page: 0
    };
    this.nouvelleCategorie = '';
  }
}
