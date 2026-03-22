import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div [class]="'rounded-[20px] p-5 flex flex-col ' + bgColor()">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
            <ng-content select="[icon]"></ng-content>
          </div>
          <span class="font-semibold text-[#1c1c1c] text-[15px]">{{ title() }}</span>
        </div>
      </div>
      <div class="text-[24px] font-black text-[#1c1c1c] mb-1">{{ amount() }}</div>
      <div class="text-[12px] font-medium text-[#6b7280]">{{ currency() }}</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  title = input.required<string>();
  amount = input.required<string>();
  currency = input.required<string>();
  bgColor = input<string>('bg-white');
}
