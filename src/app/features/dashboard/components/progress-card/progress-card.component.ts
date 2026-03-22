import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseCardComponent } from '../../../../shared/components/card/base-card.component';

@Component({
  selector: 'app-progress-card',
  standalone: true,
  imports: [BaseCardComponent],
  template: `
    <app-base-card>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-[20px] font-bold text-[#1c1c1c]">Tu Progreso de Ahorro</h2>
        <button class="bg-[#094c42] text-white px-5 py-2.5 rounded-[20px] text-sm font-semibold hover:bg-opacity-90 transition-all">Request Demo</button>
      </div>
      <div class="flex items-end justify-between mb-8">
        <div>
          <div class="text-[56px] font-black text-[#1c1c1c] leading-none">78%</div>
          <div class="text-[14px] font-medium text-[#6b7280] mt-2">Balance de ahorro</div>
        </div>
        <div class="flex gap-6">
          <div class="flex flex-col items-center text-center">
            <div class="w-9 h-9 bg-[#e8f4ec] rounded-full flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-[#094c42]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <span class="text-[13px] font-semibold leading-tight text-[#1c1c1c]">Meta<br>Alcanzada</span>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-9 h-9 bg-[#fef9c3] rounded-full flex items-center justify-center mb-2 text-[#d97706] font-bold">!</div>
            <span class="text-[13px] font-semibold leading-tight text-[#1c1c1c]">Lessons<br>Meta</span>
          </div>
        </div>
      </div>
      <div class="h-[200px] bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400">
        Saving Graph Placeholder
      </div>
    </app-base-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressCardComponent {}
