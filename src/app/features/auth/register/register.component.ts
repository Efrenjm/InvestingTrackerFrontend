import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../../../shared/layouts/auth-layout/auth-layout.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthLayoutComponent,
    InputComponent,
    ButtonComponent,
    MatSnackBarModule
  ],
  template: `
    <app-auth-layout title="Crea tu cuenta" subtitle="Únete a InvestingTracker hoy mismo">
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <app-input
            label="Nombre"
            placeholder="Juan"
            formControlName="firstName"
            [control]="firstNameControl"
          ></app-input>
          <app-input
            label="Apellido"
            placeholder="Pérez"
            formControlName="lastName"
            [control]="lastNameControl"
          ></app-input>
        </div>

        <app-input
          label="Email"
          type="email"
          placeholder="nombre@ejemplo.com"
          icon="email"
          formControlName="email"
          [control]="emailControl"
        ></app-input>

        <app-input
          label="Contraseña"
          type="password"
          placeholder="Mínimo 8 caracteres"
          icon="lock"
          formControlName="password"
          [control]="passwordControl"
        ></app-input>

        <app-button type="submit" [loading]="isLoading()" [disabled]="registerForm.invalid">
          Empezar
        </app-button>
      </form>

      <div class="mt-8 pt-6 border-t border-slate-100 text-center">
        <p class="text-slate-500">
          ¿Ya tienes una cuenta?
          <a routerLink="/auth/login" class="font-semibold text-primary hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </app-auth-layout>
  `
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authHttp = inject(AuthHttpService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly isLoading = signal(false);

  readonly registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  get firstNameControl() { return this.registerForm.get('firstName') as any; }
  get lastNameControl() { return this.registerForm.get('lastName') as any; }
  get emailControl() { return this.registerForm.get('email') as any; }
  get passwordControl() { return this.registerForm.get('password') as any; }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    const { firstName, lastName, email, password } = this.registerForm.value;

    this.authHttp.register({ 
      firstName: firstName!, 
      lastName: lastName!, 
      email: email!, 
      password: password! 
    }).subscribe({
      next: (res) => {
        if (res.userId) {
          // Guardar userId en sessionStorage para el siguiente paso (OTP)
          sessionStorage.setItem('pending_user_id', res.userId);
          this.router.navigate(['/auth/verify-code']);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open(err.error?.message || 'Error al registrarse', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
