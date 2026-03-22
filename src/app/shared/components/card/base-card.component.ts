import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-base-card',
  standalone: true,
  template: `
    <div [class]="'bg-white rounded-[24px] p-6 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.02)] ' + class()">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseCardComponent {
  class = input<string>('');
}
