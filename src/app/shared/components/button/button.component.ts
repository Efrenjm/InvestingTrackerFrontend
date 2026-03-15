import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <button
      mat-flat-button
      [color]="color"
      [disabled]="disabled || loading"
      [type]="type"
      class="w-full relative py-6 text-lg font-medium transition-all"
      (click)="onClick.emit($event)"
    >
      <span [class.opacity-0]="loading">
        <ng-content></ng-content>
      </span>
      
      <div *ngIf="loading" class="absolute inset-0 flex items-center justify-center">
        <mat-spinner diameter="24"></mat-spinner>
      </div>
    </button>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    button { border-radius: 12px !important; }
  `]
})
export class ButtonComponent {
  @Input() color: 'primary' | 'accent' | 'warn' | '' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  
  @Output() onClick = new EventEmitter<Event>();
}
