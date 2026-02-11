import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs/operators';
import {AuthResponse, AuthService} from '../../services/auth.service';

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
    const state = history.state;
    if (state.message) {
      this.message = state.message;
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.message = "Veuillez remplir correctement les champs.";
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .pipe(first())
      .subscribe({
        next: (response: AuthResponse) => {
          this.message = response.message || 'Connexion réussie !';

          if (response.token || response.success) { // On accepte l'un ou l'autre
            console.log('Token détecté, redirection...');
            this.router.navigate(['/dashboard']);
          } else {
            console.warn('Pas de token dans la réponse :', response);
          }
        },
        error: (err) => {
          console.error('Erreur de connexion:', err);
          this.message = err.error?.message || "Identifiants incorrects ou problème serveur.";
        }
      });
  }
}
