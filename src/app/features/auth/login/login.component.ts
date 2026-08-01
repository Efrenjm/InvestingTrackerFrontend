import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthLayoutComponent,
    InputComponent,
    ButtonComponent,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

    this.authHttp.login({ username: email!, password: password! }).subscribe({
      next: (res) => {
        if (res?.user) {
          this.authStore.setAuthenticatedUser(res.user);
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']);
        } else {
          this.authStore.fetchUser().subscribe({
            next: () => {
              this.isLoading.set(false);
              this.router.navigate(['/dashboard']);
            },
            error: (err: any) => {
              this.isLoading.set(false);
              this.snackBar.open(err.error?.message || 'Error fetching user session', 'Close', { duration: 3000 });
            }
          });
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open(err.error?.message || 'Invalid credentials', 'Close', { duration: 3000 });
      }
    });
  }
}
