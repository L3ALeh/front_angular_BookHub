import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, AuthResponse } from '../../services/auth.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent {
  inscriptionForm: FormGroup;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
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

  onSubmit(): void {
    if (this.inscriptionForm.invalid) {
      this.message = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    const { prenom, nom, email, password } = this.inscriptionForm.value;

    this.authService.register(prenom, nom, email, password)
      .subscribe({
        next: (response: AuthResponse) => {
          this.message = response.message;

          if (response.success) {
            setTimeout(() => {
              this.router.navigate(['/login'], { state: { message: this.message } });
            }, 1000);
          }
        },
        error: (err: any) => {
          console.error('Erreur HTTP :', err);
          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Erreur lors de l’inscription';
          }
        }
      });
  }
}
