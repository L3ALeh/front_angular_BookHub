import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AsyncPipe, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-header1',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './header1.component.html',
  styleUrl: './header1.component.css'
})
export class Header1Component {
  isAuthenticated: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated = this.authService.isAuthenticated;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
