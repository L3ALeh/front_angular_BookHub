import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header1Component } from './layouts/header/header1.component';
import { FooterComponent } from './layouts/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Header1Component,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BookHub';

  // pour fermer le menu si on scroll
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // si le menu hamburger est ouvert on le dégage
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  }
}
