import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-header1',
  standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive
    ],
  templateUrl: './header1.component.html',
  styleUrl: './header1.component.css'
})
export class Header1Component {
  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/login']);
    //TODO: a adapter
  }
}
