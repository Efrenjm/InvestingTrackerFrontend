import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../../../shared/layouts/auth-layout/auth-layout.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { RegistrationStateService } from '../../../core/services/registration-state.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { getApiErrorMessage } from '../../../core/errors/api-error.mapper';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthLayoutComponent,
    InputComponent,
    ButtonComponent,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authHttp = inject(AuthHttpService);
  private readonly registrationState = inject(RegistrationStateService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);

  readonly registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!?])(?=\\S+$).{8,}$')
    ]],
    confirmPassword: ['', [Validators.required]]
  });

  get emailControl() { return this.registerForm.controls.email; }
  get passwordControl() { return this.registerForm.controls.password; }
  get confirmPasswordControl() { return this.registerForm.controls.confirmPassword; }

  get passwordsMatch() {
    return this.registerForm.controls.password.value === this.registerForm.controls.confirmPassword.value;
  }

  onSubmit() {
    if (this.registerForm.invalid || !this.passwordsMatch) return;

    this.isLoading.set(true);
    const { email, password } = this.registerForm.value;
    if (!email || !password) {
      this.isLoading.set(false);
      return;
    }

    this.authHttp.register({
      email,
      password
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.registrationState.setRegistrationData(res.userId, res.username || email);
          void this.router.navigate(['/auth/verify-code']);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          const message = getApiErrorMessage(err, 'An error occurred during registration');
          this.snackBar.open(message, 'Close', { duration: 5000 });
        }
      });
  }
}
