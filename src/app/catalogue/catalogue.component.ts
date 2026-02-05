import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LivreService } from '../services/livre.service';
import { Livre } from '../models/livre.model';

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

  constructor(private livreService: LivreService, private router: Router) {}

  ngOnInit(): void {
    this.livreService.getLivres().subscribe(data => {
      const rawData = (data as any).content || data;
      this.livres = rawData;
      this.livresFiltres = [...rawData];
      this.categories = [...new Set(this.livres.map(l => (l.categorie || '').trim()))].sort();
    });
  }

  goToDetails(uuid: string): void {
    if (uuid) {
      this.router.navigate(['/book', uuid]);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Fermeture automatique du menu burger
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }

    // Toggle de la barre de filtres
    if (currentScroll > this.lastScrollTop && currentScroll > 100) {
      this.isHeaderVisible = false;
    } else {
      this.isHeaderVisible = true;
    }
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  applyFilters(): void {
    this.livresFiltres = this.livres.filter(l => {
      const matchSearch = !this.searchTerm ||
        l.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        l.auteur.toLowerCase().includes(this.searchTerm.toLowerCase());

      const selected = this.selectedCategorie.toLowerCase().trim();
      const current = (l.categorie || '').toLowerCase().trim();
      const matchCat = selected === 'toutes catégories' || current === selected;
      const matchDispo = !this.onlyAvailable || l.exemplaireDisponible > 0;

      return matchSearch && matchCat && matchDispo;
    });
  }
}
