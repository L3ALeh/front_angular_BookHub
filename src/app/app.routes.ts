import { Routes } from '@angular/router';
import { CatalogueComponent } from './catalogue/catalogue.component';
import {livreDetailsComponent} from './detailsLivre/livreDetails.component';
import {DashboardComponent} from './dashboard/dashboard.component';

export const routes: Routes = [
  // route du catalogue
   { path: 'books', component: CatalogueComponent },
  //route détails du livre
  { path: 'books/:id', component: livreDetailsComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  //route dashboard
  { path: 'dashboard', component: DashboardComponent },
];
