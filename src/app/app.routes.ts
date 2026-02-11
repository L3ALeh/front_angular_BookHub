import { Routes } from '@angular/router';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { livreDetailsComponent } from './detailsLivre/livreDetails.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConnexionComponent } from './auth/connexion/connexion.component';
import { InscriptionComponent } from './auth/inscription/inscription.component';
import { authGuard } from './auth/auth.guard';
import { EmpruntComponent } from './emprunt/emprunt.component';

export const routes: Routes = [
  // les routes publiques
  { path: 'login', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },

  // ici faut etre connecte grace au guard
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

  //redirection auto on va au dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // si l'url existe pas, retour case depart
  { path: '**', redirectTo: 'login' }
];
