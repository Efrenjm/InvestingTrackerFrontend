import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputComponent } from '../input/input.component';

type PasswordCheck = {
  label: string;
  met: boolean;
};

type PasswordControl = FormControl<string | null>;

@Component({
  selector: 'app-password-fields',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, InputComponent],
  templateUrl: './password-fields.component.html',
  styleUrl: './password-fields.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordFieldsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly passwordControl = input.required<PasswordControl>();
  readonly confirmPasswordControl = input.required<PasswordControl>();
  readonly passwordLabel = input('Password');
  readonly confirmPasswordLabel = input('Confirm Password');
  readonly passwordPlaceholder = input('••••••••••••');
  readonly confirmPasswordPlaceholder = input('••••••••••••');

  readonly showPassword = signal(false);

  readonly passwordValue = signal('');
  readonly confirmPasswordValue = signal('');
  readonly confirmPasswordTouched = signal(false);

  readonly checks = computed<PasswordCheck[]>(() => {
    const password = this.passwordValue();

    return [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'Lowercase letter', met: /[a-z]/.test(password) },
      { label: 'Number', met: /\d/.test(password) },
      { label: 'Special character (@#$%^&+=!?)', met: /[@#$%^&+=!?]/.test(password) },
    ];
  });

  readonly strength = computed(() => {
    const password = this.passwordValue();
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@#$%^&+=!?]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Weak' };
    if (score <= 4) return { score, label: 'Medium' };
    return { score, label: 'Strong' };
  });

  readonly passwordsMatch = computed(
    () => this.passwordValue() === this.confirmPasswordValue(),
  );

  ngOnInit() {
    this.passwordValue.set(this.passwordControl().value ?? '');
    this.confirmPasswordValue.set(this.confirmPasswordControl().value ?? '');
    this.confirmPasswordTouched.set(this.confirmPasswordControl().touched);

    this.passwordControl().valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.passwordValue.set(value ?? ''));
    this.confirmPasswordControl().valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.confirmPasswordValue.set(value ?? ''));
    this.confirmPasswordControl().statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.confirmPasswordTouched.set(this.confirmPasswordControl().touched));
  }

  togglePassword() {
    this.showPassword.update((value) => !value);
  }
}
