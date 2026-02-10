import { Routes } from '@angular/router';
import { CatalogueComponent } from './catalogue/catalogue.component';
import {livreDetailsComponent} from './detailsLivre/livreDetails.component';
import {EmpruntComponent} from './emprunt/emprunt.component';

export const routes: Routes = [
  // TODO : Futur Ajout de commentaire pour la page d'accueil/dashboard + login

  // route du catalogue
   { path: 'catalogue', component: CatalogueComponent },
  //route détails du livre
  { path: 'books/:id', component: livreDetailsComponent },
  { path: '', redirectTo: '/catalogue', pathMatch: 'full' },
  { path : 'api/loans', component: EmpruntComponent },

];
