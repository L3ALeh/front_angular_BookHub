import { Routes } from '@angular/router';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { livreDetailsComponent } from './detailsLivre/livreDetails.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConnexionComponent } from './auth/connexion/connexion.component';
import { InscriptionComponent } from './auth/inscription/inscription.component';
import { authGuard } from './auth/auth.guard';
import {EmpruntComponent} from './emprunt/emprunt.component';

export const routes: Routes = [
  // Routes publiques accessibles à tous
  { path: 'login', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },

  // Routes privées
  {
    path: 'books',
    component: CatalogueComponent,
    canActivate: [authGuard]
  },
  {
    path: 'books/:id',
    component: livreDetailsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  { path: 'api/loans',
    component: EmpruntComponent,
    canActivate: [authGuard] },

  // Redirection par défaut
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: '**', redirectTo: 'login' }
];
