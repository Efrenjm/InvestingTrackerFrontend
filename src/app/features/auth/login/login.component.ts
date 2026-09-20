import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../../../shared/layouts/auth-layout/auth-layout.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { RegistrationStateService } from '../../../core/services/registration-state.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, of, switchMap, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private readonly registrationState = inject(RegistrationStateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor() {
    const verifiedUsername = this.registrationState.consumeVerifiedUsername();
    if (verifiedUsername) {
      this.loginForm.patchValue({ email: verifiedUsername });
    }
  }

  get emailControl() { return this.loginForm.controls.email; }
  get passwordControl() { return this.loginForm.controls.password; }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;
    if (!email || !password) {
      this.isLoading.set(false);
      return;
    }

    this.authHttp.login({ username: email, password })
      .pipe(
        switchMap((res) => res?.user
          ? of(res.user)
          : this.authStore.fetchUser().pipe(switchMap((currentUser) => of(currentUser.user)))),
        catchError(() => {
          this.isLoading.set(false);
          return of(null);
        }),
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((user) => {
        if (!user) return;
        this.authStore.setAuthenticatedUser(user);
        this.isLoading.set(false);
        void this.router.navigate(['/dashboard']);
      });
  }
}
