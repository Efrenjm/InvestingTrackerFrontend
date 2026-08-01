import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      @if (title()) {
        <h3 class="font-display text-sm text-gray-500 uppercase tracking-wider mb-2">
          {{ title() }}
        </h3>
      }
      <div class="card-content">
        <ng-content></ng-content>
      </div>
      @if (footer()) {
        <div class="mt-4 flex gap-2">
          <ng-content select="[cardFooter]"></ng-content>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly title = input<string>();
  readonly footer = input<boolean>(false);
  readonly padding = input<string>('p-6');
  readonly customClass = input<string>('');

  get cardClasses() {
    return `bg-white ${this.padding()} rounded-edufin shadow-soft border border-brand-surface ${this.customClass()}`;
  }
}
