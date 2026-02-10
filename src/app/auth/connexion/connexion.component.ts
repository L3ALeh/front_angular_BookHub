import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from '../auth.service'; // <-- import du service
import { CommonModule } from '@angular/common';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {
  loginForm: FormGroup;
  message: string | null = null; // pour afficher succès/erreur

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router
) { // <-- injection
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Récupère le message depuis l'état du router si présent
    const state = history.state;
    if (state.message) {
      this.message = state.message;
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    // Appel sécurisé à AuthService
    this.authService.login(email, password)
      .pipe(first())
      .subscribe((response: AuthResponse) => {
        this.message = response.message;
        console.log('Réponse AuthService login:', response);

        if (response.success) {
          // 🔹 Redirection vers /dashboard après login réussi
          this.router.navigate(['/dashboard'], { state: { message: 'Bienvenue !' } });
        }
      });

    /* .subscribe((response: AuthResponse) => {
      this.message = response.message;
      console.log('Message reçu:', this.message);
      if (response.success) {
        // ici, plus tard, on pourra router vers /dashboard ou autre
        console.log('Connexion réussie', response.token);
      } else {
        console.warn('Erreur de connexion');
      }
    }); */
  }
}
