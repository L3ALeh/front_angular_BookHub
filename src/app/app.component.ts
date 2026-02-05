import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header1Component} from './layouts/header/header1.component';
import {FooterComponent} from './layouts/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header1Component, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-angular';
}
