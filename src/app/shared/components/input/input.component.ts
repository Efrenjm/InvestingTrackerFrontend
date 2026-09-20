import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  readonly label = input('');
  readonly type = input('text');
  readonly placeholder = input('');
  readonly id = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly control = input<FormControl>(new FormControl());
  readonly showErrors = input(true);
  readonly blurred = output<void>();

  readonly resolvedId = computed(() => {
    const label = this.label().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return this.id() ?? `app-input-${label || 'field'}`;
  });

  readonly isFocused = signal(false);

  get isRequired(): boolean {
    return this.control().hasValidator(Validators.required);
  }

  get errorMessage(): string {
    if (!this.showErrors()) return '';

    const ctrl = this.control();
    if (ctrl.invalid && ctrl.touched) {
      if (ctrl.hasError('required')) return 'This field is required';
      if (ctrl.hasError('email')) return 'Invalid email address';
      const minlengthError = ctrl.errors?.['minlength'] as { requiredLength?: unknown } | undefined;
      if (ctrl.hasError('minlength') && typeof minlengthError?.requiredLength === 'number') {
        return `Minimum ${minlengthError.requiredLength} characters`;
      }
      if (ctrl.hasError('pattern')) {
        if (this.type() === 'password') {
          return 'Must contain uppercase, lowercase, number and special char (@#$%^&+=!?)';
        }
        return 'Invalid format';
      }
    }
    return '';
  }

  onFocus() {
    this.isFocused.set(true);
  }

  onBlur() {
    this.isFocused.set(false);
    this.control().markAsTouched();
    this.blurred.emit();
  }
}
