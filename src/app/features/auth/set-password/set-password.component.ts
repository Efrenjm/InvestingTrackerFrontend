import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthLayoutComponent } from '../../../shared/layouts/auth-layout/auth-layout.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { RegistrationStateService } from '../../../core/services/registration-state.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../../core/services/notification.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PasswordFieldsComponent } from '../../../shared/components/password-fields/password-fields.component';
import { getApiErrorMessage } from '../../../core/errors/api-error.mapper';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, catchError, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-set-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthLayoutComponent,
    ButtonComponent,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PasswordFieldsComponent
  ],
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authHttp = inject(AuthHttpService);
  private readonly authStore = inject(AuthStoreService);
  private readonly registrationState = inject(RegistrationStateService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);

  readonly passwordForm = this.fb.group({
    newPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!?])(?=\\S+$).{8,}$')
    ]],
    confirmPassword: ['', [Validators.required]]
  });

  get newPasswordControl() { return this.passwordForm.controls.newPassword; }
  get confirmPasswordControl() { return this.passwordForm.controls.confirmPassword; }

  get passwordsMatch(): boolean {
    return this.passwordForm.controls.newPassword.value === this.passwordForm.controls.confirmPassword.value;
  }

  onSubmit() {
    if (this.passwordForm.invalid) return;

    if (!this.passwordsMatch) {
      this.notifications.warning('Passwords do not match.');
      return;
    }

    this.isLoading.set(true);
    const { newPassword } = this.passwordForm.value;
    if (!newPassword) {
      this.isLoading.set(false);
      return;
    }

    this.authHttp.updatePassword({ newPassword }).pipe(
      switchMap(() => {
        const username = this.registrationState.username();
        if (!username) {
          this.finishAndGoToLogin();
          return EMPTY;
        }

        return this.authHttp.login({ username, password: newPassword })
          .pipe(
            tap((res) => {
              if (res?.user) this.authStore.setAuthenticatedUser(res.user);
            }),
            catchError(() => {
              this.finishAndGoToLogin();
              return EMPTY;
            }),
            tap(() => {
              this.registrationState.clear();
              this.isLoading.set(false);
              this.notifications.success('Password created successfully! Welcome to Investing Tracker.');
              void this.router.navigate(['/dashboard']);
            })
          );
      }),
      takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        error: (err: unknown) => {
          this.isLoading.set(false);
          const message = getApiErrorMessage(err, 'Error updating password. Please try again.');
          this.notifications.error(message);
        }
      });
  }

  private finishAndGoToLogin() {
    this.isLoading.set(false);
    this.registrationState.clear();
    this.notifications.success('Password set successfully! Please log in.');
    void this.router.navigate(['/auth/login']);
  }
}
