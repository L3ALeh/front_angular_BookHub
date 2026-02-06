import {Component, HostListener} from '@angular/core'; // N'oublie pas d'ajouter HostListener ici
import {RouterOutlet} from '@angular/router';
import {Header1Component} from './layouts/header/header1.component';
import {FooterComponent} from './layouts/footer/footer.component';

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

//Evenement pour le menu hamburger
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const navbarCollapse = document.querySelector('.navbar-collapse');

    //  Si le menu est ouvert on le referme
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      // replis du menu
      navbarCollapse.classList.remove('show');
    }
  }
}
