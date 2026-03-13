import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      // on injecte le token dans chaque requete
      withInterceptors([authInterceptor])
    ),
    // pour avoir les dates au format fr partout
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
};
