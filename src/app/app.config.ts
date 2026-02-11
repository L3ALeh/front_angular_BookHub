import {ApplicationConfig, LOCALE_ID} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http'; // Ajout de withInterceptors
import {routes} from './app.routes';
import {authInterceptor} from './interceptors/auth.interceptor'; // Vérifie bien le chemin vers ton fichier !

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
};
