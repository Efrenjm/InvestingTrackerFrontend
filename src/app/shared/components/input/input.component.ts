import { ChangeDetectionStrategy, Component, input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
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
  readonly icon = input<string | undefined>(undefined);
  readonly control = input<FormControl>(new FormControl());

  readonly isFocused = signal(false);

  get errorMessage(): string {
    const ctrl = this.control();
    if (ctrl.invalid && (ctrl.dirty || ctrl.touched)) {
      if (ctrl.hasError('required')) return 'This field is required';
      if (ctrl.hasError('email')) return 'Invalid email address';
      if (ctrl.hasError('minlength')) return `Minimum ${ctrl.errors?.['minlength'].requiredLength} characters`;
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
  }
}
