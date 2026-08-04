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
        <button class="bg-[#094c42] text-white px-5 py-2.5 rounded-[20px] text-sm font-semibold hover:bg-opacity-90 transition-all">Ver Detalle</button>
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
            <span class="text-[13px] font-semibold leading-tight text-[#1c1c1c]">En<br>Progreso</span>
          </div>
        </div>
      </div>

      <!-- Clean SVG Curve Progress Graph -->
      <div class="h-[180px] bg-[#e8f4ec]/40 rounded-2xl p-4 flex flex-col justify-end relative overflow-hidden border border-[#094c42]/10">
        <svg class="w-full h-full absolute inset-0 overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#094c42" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#094c42" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <path d="M 0 100 Q 120 40 250 70 T 500 20 L 500 120 L 0 120 Z" fill="url(#brandGradient)" />
          <path d="M 0 100 Q 120 40 250 70 T 500 20" fill="none" stroke="#094c42" stroke-width="3" stroke-linecap="round" />
          <circle cx="500" cy="20" r="5" fill="#094c42" />
        </svg>

        <div class="flex justify-between items-center text-[12px] font-semibold text-[#6b7280] z-10 pt-2 border-t border-[#094c42]/10">
          <span>Ene</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Abr</span>
          <span>May</span>
          <span>Jun</span>
        </div>
      </div>
    </app-base-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressCardComponent {}
