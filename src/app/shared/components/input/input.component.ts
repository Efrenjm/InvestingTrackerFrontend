import { Component, Input, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <mat-form-field appearance="outline" class="w-full">
      <mat-label *ngIf="label">{{ label }}</mat-label>
      <input
        matInput
        [type]="type"
        [placeholder]="placeholder"
        [formControl]="control"
        (blur)="onTouched()"
      />
      <mat-icon matSuffix *ngIf="icon">{{ icon }}</mat-icon>
      <mat-error *ngIf="error()">{{ error() }}</mat-error>
    </mat-form-field>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper { font-size: 0.75rem; }
  `]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() icon?: string;
  @Input() control = new FormControl();

  onChange: any = () => {};
  onTouched: any = () => {};

  error = computed(() => {
    if (this.control.invalid && (this.control.dirty || this.control.touched)) {
      if (this.control.hasError('required')) return 'Este campo es requerido';
      if (this.control.hasError('email')) return 'Email inválido';
      if (this.control.hasError('minlength')) return `Mínimo ${this.control.errors?.['minlength'].requiredLength} caracteres`;
    }
    return '';
  });

  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }
}
