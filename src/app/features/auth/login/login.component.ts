import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../../../shared/layouts/auth-layout/auth-layout.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
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
    <app-auth-layout title="Iniciar Sesión" subtitle="Ingresa tus credenciales para continuar">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
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
          placeholder="••••••••"
          icon="lock"
          formControlName="password"
          [control]="passwordControl"
        ></app-input>

        <div class="flex justify-end mt-2">
          <a routerLink="/auth/forgot-password" class="text-sm font-medium text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <app-button type="submit" [loading]="isLoading()" [disabled]="loginForm.invalid">
          Entrar
        </app-button>
      </form>

      <div class="mt-8 pt-6 border-t border-slate-100 text-center">
        <p class="text-slate-500">
          ¿No tienes una cuenta?
          <a routerLink="/auth/register" class="font-semibold text-primary hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </app-auth-layout>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authHttp = inject(AuthHttpService);
  private readonly authStore = inject(AuthStoreService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly isLoading = signal(false);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get emailControl() { return this.loginForm.get('email') as any; }
  get passwordControl() { return this.loginForm.get('password') as any; }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;

    this.authHttp.login({ email: email!, password: password! }).subscribe({
      next: (res) => {
        if (res.user) {
          this.authStore.setAuthenticatedUser(res.user);
          this.router.navigate(['/dashboard']);
        } else {
          // Si requiere verificación de código u otro paso
          this.snackBar.open('Acción requerida', 'Cerrar', { duration: 3000 });
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open(err.error?.message || 'Error al iniciar sesión', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
