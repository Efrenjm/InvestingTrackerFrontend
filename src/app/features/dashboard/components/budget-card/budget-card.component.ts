import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseCardComponent } from '../../../../shared/components/card/base-card.component';

@Component({
  selector: 'app-budget-card',
  standalone: true,
  imports: [BaseCardComponent],
  template: `
    <app-base-card>
      <h3 class="text-[20px] font-bold text-[#1c1c1c] mb-6">Control de Presupuestos</h3>
      <div class="flex justify-around items-center">
        <div class="flex flex-col items-center">
          <span class="text-[14px] font-semibold text-[#1c1c1c] mb-4">Supermercado</span>
          <div class="relative w-24 h-24 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="8" fill="transparent" class="text-gray-100" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="8" fill="transparent" stroke-dasharray="251.2" stroke-dashoffset="55.2" class="text-[#094c42]" />
            </svg>
            <span class="absolute text-[18px] font-bold text-[#1c1c1c]">78%</span>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-[14px] font-semibold text-[#1c1c1c] mb-4">Ocio</span>
          <div class="relative w-24 h-24 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="8" fill="transparent" class="text-gray-100" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="8" fill="transparent" stroke-dasharray="251.2" stroke-dashoffset="50.2" class="text-[#094c42]" />
            </svg>
            <span class="absolute text-[18px] font-bold text-[#1c1c1c]">80%</span>
          </div>
        </div>
      </div>
    </app-base-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetCardComponent {}
