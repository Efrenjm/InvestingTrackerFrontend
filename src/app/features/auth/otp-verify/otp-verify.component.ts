import { ChangeDetectionStrategy, Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthLayoutComponent } from '../../../shared/layouts/auth-layout/auth-layout.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-otp-verify',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthLayoutComponent,
    InputComponent,
    ButtonComponent,
    MatSnackBarModule
  ],
  templateUrl: './otp-verify.component.html',
  styleUrl: './otp-verify.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      this.snackBar.open('Registration session expired. Please register again.', 'Close', { duration: 5000 });
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
        this.snackBar.open(err.error?.message || 'Incorrect or expired code', 'Close', { duration: 3000 });
      }
    });
  }

  resendCode() {
    if (!this.userId || this.resendCooldown() > 0) return;

    this.isResending.set(true);
    this.authHttp.refreshCode(this.userId).subscribe({
      next: () => {
        this.isResending.set(false);
        this.snackBar.open('New code sent', 'Close', { duration: 3000 });
        this.startCooldown();
      },
      error: (err) => {
        this.isResending.set(false);
        this.snackBar.open(err.error?.message || 'Error resending code', 'Close', { duration: 3000 });
      }
    });
  }
}
