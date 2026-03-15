import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
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
  selector: 'app-otp-verify',
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
    <app-auth-layout title="Verifica tu cuenta" subtitle="Ingresa el código de 6 dígitos que enviamos a tu email">
      <form [formGroup]="otpForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <app-input
          label="Código de Verificación"
          type="text"
          placeholder="000000"
          icon="vpn_key"
          formControlName="code"
          [control]="codeControl"
          maxlength="6"
        ></app-input>

        <div class="text-center">
          <p class="text-sm text-slate-500">
            ¿No recibiste el código?
            <button
              type="button"
              (click)="resendCode()"
              [disabled]="resendCooldown() > 0 || isResending()"
              class="font-semibold text-primary hover:underline disabled:text-slate-300 disabled:no-underline"
            >
              Reenviar {{ resendCooldown() > 0 ? '(' + resendCooldown() + 's)' : '' }}
            </button>
          </p>
        </div>

        <app-button type="submit" [loading]="isLoading()" [disabled]="otpForm.invalid">
          Verificar y Continuar
        </app-button>
      </form>
    </app-auth-layout>
  `
})
export class OtpVerifyComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly authHttp = inject(AuthHttpService);
  private readonly authStore = inject(AuthStoreService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly isLoading = signal(false);
  readonly isResending = signal(false);
  readonly resendCooldown = signal(60);
  
  private cooldownTimer?: any;
  private userId: string | null = null;

  readonly otpForm = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]]
  });

  get codeControl() { return this.otpForm.get('code') as any; }

  ngOnInit() {
    this.userId = sessionStorage.getItem('pending_user_id');
    if (!this.userId) {
      this.snackBar.open('Sesión de registro expirada. Por favor regístrate de nuevo.', 'Cerrar', { duration: 5000 });
      this.router.navigate(['/auth/register']);
      return;
    }
    this.startCooldown();
  }

  ngOnDestroy() {
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);
  }

  private startCooldown() {
    this.resendCooldown.set(60);
    this.cooldownTimer = setInterval(() => {
      this.resendCooldown.update(v => v > 0 ? v - 1 : 0);
      if (this.resendCooldown() === 0) clearInterval(this.cooldownTimer);
    }, 1000);
  }

  onSubmit() {
    if (this.otpForm.invalid || !this.userId) return;

    this.isLoading.set(true);
    const { code } = this.otpForm.value;

    this.authHttp.verifyCode({ userId: this.userId, code: code! }).subscribe({
      next: (res) => {
        if (res.user) {
          this.authStore.setAuthenticatedUser(res.user);
          sessionStorage.removeItem('pending_user_id');
          this.router.navigate(['/dashboard']);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open(err.error?.message || 'Código incorrecto o expirado', 'Cerrar', { duration: 3000 });
      }
    });
  }

  resendCode() {
    if (!this.userId || this.resendCooldown() > 0) return;

    this.isResending.set(true);
    this.authHttp.refreshCode(this.userId).subscribe({
      next: () => {
        this.isResending.set(false);
        this.snackBar.open('Nuevo código enviado', 'Cerrar', { duration: 3000 });
        this.startCooldown();
      },
      error: (err) => {
        this.isResending.set(false);
        this.snackBar.open(err.error?.message || 'Error al reenviar código', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
