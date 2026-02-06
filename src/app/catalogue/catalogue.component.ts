import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {LivreService} from '../services/livre.service';
import {Livre} from '../models/livre.model';


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
  isHeaderVisible: boolean = true;
  lastScrollTop: number = 0;

  // gestion Librarian
  modeEdition: boolean = false;
  livreEnCours: any = {};

  constructor(
    private livreService: LivreService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.chargerLivres();
  }

  chargerLivres() {
    this.livreService.getLivres().subscribe(data => {
      const rawData = (data as any).content || data;
      this.livres = rawData;
      this.livresFiltres = [...rawData];
      this.categories = [...new Set(this.livres.map(l => (l.categorie || '').trim()))].sort();
    });
  }

  // navigation et filtres
  goToDetails(uuid: string): void {
    if (uuid) {
      this.router.navigate(['/books', uuid]);
    }
  }

  applyFilters(): void {
    this.livresFiltres = this.livres.filter(l => {
      const matchSearch = !this.searchTerm ||
        l.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        l.auteur.toLowerCase().includes(this.searchTerm.toLowerCase());
      const selected = this.selectedCategorie.toLowerCase().trim();
      const matchCat = selected === 'toutes catégories' || (l.categorie || '').toLowerCase().trim() === selected;
      const matchDispo = !this.onlyAvailable || l.exemplaireDisponible > 0;
      return matchSearch && matchCat && matchDispo;
    });
  }
}
