import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = false;

  constructor() {
    // Récupérer le choix précédent ou préférer le mode système
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setDarkMode(savedTheme === 'dark');
    }
  }

  toggleDarkMode() {
    this.setDarkMode(!this.darkMode);
  }

  private setDarkMode(isDark: boolean) {
    this.darkMode = isDark;
    const theme = isDark ? 'dark' : 'light';

    // On applique l'attribut magique de Bootstrap sur la balise <html>
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }

  isDark() {
    return this.darkMode;
  }
}
