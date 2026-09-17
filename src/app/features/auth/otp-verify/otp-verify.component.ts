import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthLayoutComponent } from '../../../shared/layouts/auth-layout/auth-layout.component';
import { OtpInputComponent } from '../../../shared/components/otp-input/otp-input.component';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { RegistrationStateService } from '../../../core/services/registration-state.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../../core/services/notification.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { getApiErrorMessage } from '../../../core/errors/api-error.mapper';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private readonly registrationState = inject(RegistrationStateService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly isResending = signal(false);
  readonly isSuccess = signal(false);
  readonly resendCooldown = signal(60);
  readonly hasError = signal(false);

  readonly maskedUsername = this.registrationState.maskedUsername;

  @ViewChild(OtpInputComponent) otpInput?: OtpInputComponent;

  private cooldownTimer?: ReturnType<typeof setInterval>;

  ngOnInit() {
    if (!this.registrationState.hasActiveRegistration()) {
      this.notifications.warning('Registration session expired. Please register again.');
      void this.router.navigate(['/auth/register']);
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

    this.authHttp.verifyCode({ userId, code })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.isSuccess.set(true);
          this.registrationState.completeVerification();
          this.notifications.success('Account verified successfully! Please log in.');

          setTimeout(() => {
            void this.router.navigate(['/auth/login']);
          }, 1200);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.hasError.set(true);
          setTimeout(() => {
            this.otpInput?.reset();
            this.hasError.set(false);
          }, 600);
          this.notifications.error(getApiErrorMessage(err, 'Incorrect or expired code. Please try again.'));
        }
    });
  }

  resendCode() {
    const userId = this.registrationState.userId();
    if (!userId || this.resendCooldown() > 0) return;

    this.isResending.set(true);
    this.authHttp.refreshCode(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isResending.set(false);
          this.notifications.success('A new code has been sent!');
          this.startCooldown();
          this.otpInput?.reset();
        },
        error: (err) => {
          this.isResending.set(false);
          this.notifications.error(getApiErrorMessage(err, 'Error resending code. Please wait and try again.'));
        }
    });
  }
}
