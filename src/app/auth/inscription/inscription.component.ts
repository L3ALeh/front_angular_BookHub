import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from '../auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent {
  inscriptionForm: FormGroup;
  message: string | null = null; // Message de succès ou d'erreur

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Création du formulaire
    this.inscriptionForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
      ]],
    });
  }

  onSubmit() {
    if (this.inscriptionForm.invalid) {
      this.message = 'Veuillez remplir tous les champs correctement.';
      console.warn('Formulaire invalide', this.inscriptionForm.errors);
      return;
    }

    const { prenom, nom, email, password } = this.inscriptionForm.value;

    this.authService.register(prenom, nom, email, password)
      .subscribe({
        next: (response) => {
          console.log('Réponse backend inscription :', response);
          this.message = response.message;

          if (response.success) {
            setTimeout(() => {
              this.router.navigate(['/connexion'], { state: { message: this.message } });
            }, 1000);
          }
        },
        error: (err) => {
          console.error('Erreur HTTP :', err);

          if (err.error && err.error.message) {
            this.message = err.error.message; // message précis du backend
          } else {
            this.message = 'Erreur lors de l’inscription';
          }
        }
      });
  }

  protected readonly console = module
}
