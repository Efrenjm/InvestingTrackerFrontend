import { ChangeDetectionStrategy, Component, inject, signal, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthLayoutComponent } from '../../../shared/layouts/auth-layout/auth-layout.component';
import { OtpInputComponent } from '../../../shared/components/otp-input/otp-input.component';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { RegistrationStateService } from '../../../core/services/registration-state.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-otp-verify',
  imports: [
    CommonModule,
    AuthLayoutComponent,
    OtpInputComponent,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './otp-verify.component.html',
  styleUrl: './otp-verify.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerifyComponent implements OnInit, OnDestroy {
  private readonly authHttp = inject(AuthHttpService);
  private readonly authStore = inject(AuthStoreService);
  private readonly registrationState = inject(RegistrationStateService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly isLoading = signal(false);
  readonly isResending = signal(false);
  readonly isSuccess = signal(false);
  readonly resendCooldown = signal(60);
  readonly hasError = signal(false);

  readonly maskedUsername = this.registrationState.maskedUsername;

  @ViewChild(OtpInputComponent) otpInput!: OtpInputComponent;

  private cooldownTimer?: ReturnType<typeof setInterval>;

  ngOnInit() {
    if (!this.registrationState.hasActiveRegistration()) {
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
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);
    this.cooldownTimer = setInterval(() => {
      this.resendCooldown.update(v => v > 0 ? v - 1 : 0);
      if (this.resendCooldown() === 0 && this.cooldownTimer) {
        clearInterval(this.cooldownTimer);
      }
    }, 1000);
  }

  onCodeComplete(code: string) {
    this.verifyCode(code);
  }

  private verifyCode(code: string) {
    const userId = this.registrationState.userId();
    if (!userId) return;

    this.isLoading.set(true);
    this.hasError.set(false);

    this.authHttp.verifyCode({ userId, code }).subscribe({
      next: () => {
        // Verification successful — attempt auto-login
        this.autoLogin();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.hasError.set(true);
        // Reset OTP input after a brief delay so the error animation plays
        setTimeout(() => {
          this.otpInput?.reset();
          this.hasError.set(false);
        }, 600);
        this.snackBar.open(
          err.error?.message || 'Incorrect or expired code. Please try again.',
          'Close',
          { duration: 4000 }
        );
      }
    });
  }

  private autoLogin() {
    const username = this.registrationState.username();
    const password = this.registrationState.getPasswordForAutoLogin();

    if (!username || !password) {
      // Password was lost (page refresh) — fallback to login page
      this.isLoading.set(false);
      this.registrationState.clear();
      this.snackBar.open('Account verified successfully! Please log in.', 'Close', { duration: 5000 });
      this.router.navigate(['/auth/login']);
      return;
    }

    this.authHttp.login({ username, password }).subscribe({
      next: () => {
        this.authStore.fetchUser().subscribe({
          next: () => {
            this.isLoading.set(false);
            this.isSuccess.set(true);
            this.registrationState.clear();

            // Show success animation for 2.5 seconds, then navigate
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 2500);
          },
          error: () => {
            this.fallbackToLogin();
          }
        });
      },
      error: () => {
        this.fallbackToLogin();
      }
    });
  }

  private fallbackToLogin() {
    this.isLoading.set(false);
    this.registrationState.clear();
    this.snackBar.open('Account verified! Please log in to continue.', 'Close', { duration: 5000 });
    this.router.navigate(['/auth/login']);
  }

  resendCode() {
    const userId = this.registrationState.userId();
    if (!userId || this.resendCooldown() > 0) return;

    this.isResending.set(true);
    this.authHttp.refreshCode(userId).subscribe({
      next: () => {
        this.isResending.set(false);
        this.snackBar.open('A new code has been sent!', 'Close', { duration: 3000 });
        this.startCooldown();
        this.otpInput?.reset();
      },
      error: (err) => {
        this.isResending.set(false);
        this.snackBar.open(err.error?.message || 'Error resending code. Please wait and try again.', 'Close', { duration: 4000 });
      }
    });
  }
}
