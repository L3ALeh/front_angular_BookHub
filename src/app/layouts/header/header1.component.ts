import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header1',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, AsyncPipe],
  templateUrl: './header1.component.html',
  styleUrl: './header1.component.css'
})
export class Header1Component {
  // on suit l'etat de connexion en temps reel
  isAuthenticated$: Observable<boolean>;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  logout(): void {
    this.authService.logout();

    // on renvoie au login et on refresh pour vider les etats
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
