import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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

  readonly isLoading = signal(false);

  readonly registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  get emailControl() { return this.registerForm.get('email') as any; }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    const { email } = this.registerForm.value;

    this.authHttp.register({ 
      email: email! 
    }).subscribe({
      next: (res) => {
        this.registrationState.setRegistrationData(res.userId, res.username || email!, '');
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
