import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
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
    MatIconModule
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

  readonly isLoading = signal(false);
  readonly showPassword = signal(false);
  readonly passwordValue = signal('');

  readonly registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required, 
      Validators.minLength(8),
      Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!?])(?=\\S+$).{8,}$')
    ]]
  });

  constructor() {
    this.registerForm.get('password')!.valueChanges.subscribe(v => {
      this.passwordValue.set(v || '');
    });
  }

  get emailControl() { return this.registerForm.get('email') as any; }
  get passwordControl() { return this.registerForm.get('password') as any; }

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

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    const { email, password } = this.registerForm.value;

    this.authHttp.register({ 
      email: email!, 
      password: password! 
    }).subscribe({
      next: (res) => {
        this.registrationState.setRegistrationData(res.userId, res.username, password!);
        this.router.navigate(['/auth/verify-code']);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        const message = err.error?.message || 'An error occurred during registration';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }
}
