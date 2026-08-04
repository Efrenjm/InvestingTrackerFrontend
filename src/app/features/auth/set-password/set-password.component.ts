import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthLayoutComponent } from '../../../shared/layouts/auth-layout/auth-layout.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { RegistrationStateService } from '../../../core/services/registration-state.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-set-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthLayoutComponent,
    InputComponent,
    ButtonComponent,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule
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
  private readonly snackBar = inject(MatSnackBar);

  readonly isLoading = signal(false);
  readonly showPassword = signal(false);
  readonly passwordValue = signal('');

  readonly passwordForm = this.fb.group({
    newPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!?])(?=\\S+$).{8,}$')
    ]],
    confirmPassword: ['', [Validators.required]]
  });

  constructor() {
    this.passwordForm.get('newPassword')!.valueChanges.subscribe(v => {
      this.passwordValue.set(v || '');
    });
  }

  get newPasswordControl() { return this.passwordForm.get('newPassword') as any; }
  get confirmPasswordControl() { return this.passwordForm.get('confirmPassword') as any; }

  readonly passwordStrength = computed(() => {
    const password = this.passwordValue();
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@#$%^&+=!?]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-400' };
    if (score <= 4) return { score, label: 'Medium', color: 'bg-amber-400' };
    return { score, label: 'Strong', color: 'bg-emerald-400' };
  });

  readonly passwordChecks = computed(() => {
    const password = this.passwordValue();
    return [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'Lowercase letter', met: /[a-z]/.test(password) },
      { label: 'Number', met: /\d/.test(password) },
      { label: 'Special character (@#$%^&+=!?)', met: /[@#$%^&+=!?]/.test(password) },
    ];
  });

  get passwordsMatch(): boolean {
    const { newPassword, confirmPassword } = this.passwordForm.value;
    return newPassword === confirmPassword;
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.passwordForm.invalid) return;

    if (!this.passwordsMatch) {
      this.snackBar.open('Passwords do not match.', 'Close', { duration: 4000 });
      return;
    }

    this.isLoading.set(true);
    const { newPassword, confirmPassword } = this.passwordForm.value;

    this.authHttp.updatePassword({
      newPassword: newPassword!
    }).subscribe({
      next: () => {
        const username = this.registrationState.username();
        if (username) {
          // Auto-login with newly set password
          this.authHttp.login({ username, password: newPassword! }).subscribe({
            next: (res) => {
              if (res?.user) {
                this.authStore.setAuthenticatedUser(res.user);
              }
              this.registrationState.clear();
              this.isLoading.set(false);
              this.snackBar.open('Password created successfully! Welcome to Investing Tracker.', 'Close', { duration: 4000 });
              this.router.navigate(['/dashboard']);
            },
            error: () => {
              this.finishAndGoToLogin();
            }
          });
        } else {
          this.finishAndGoToLogin();
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const message = err.error?.message || 'Error updating password. Please try again.';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }

  private finishAndGoToLogin() {
    this.isLoading.set(false);
    this.registrationState.clear();
    this.snackBar.open('Password set successfully! Please log in.', 'Close', { duration: 4000 });
    this.router.navigate(['/auth/login']);
  }
}
