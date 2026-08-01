import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-button',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly variant = input<'primary' | 'secondary' | 'outline'>('primary');
  
  readonly onClick = output<Event>();

  get buttonClasses() {
    const base = 'px-6 py-3 rounded-full font-display font-semibold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
    const variants = {
      primary: 'bg-brand-primary hover:opacity-90 text-white',
      secondary: 'bg-brand-secondary hover:opacity-90 text-white',
      outline: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/10 shadow-none'
    };
    return `${base} ${variants[this.variant()]}`;
  }
}
