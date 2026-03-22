import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseCardComponent } from '../../../../shared/components/card/base-card.component';

@Component({
  selector: 'app-payment-calendar',
  standalone: true,
  imports: [BaseCardComponent],
  template: `
    <app-base-card>
      <h3 class="text-[20px] font-bold text-[#1c1c1c] mb-6">Calendario de Pagos</h3>
      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#fee2e2] rounded-[14px] flex items-center justify-center text-[#ef4444]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <span class="text-[14px] font-semibold text-[#1c1c1c]">Alquiler</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[13px] text-[#6b7280]">21 Feb</span>
            <span class="text-[14px] font-bold text-[#1c1c1c]">-$200</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#e8f4ec] rounded-[14px] flex items-center justify-center text-[#094c42]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a9.914 9.914 0 0114.142 0M1.05 10.95a15.568 15.568 0 0121.9 0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <span class="text-[14px] font-semibold text-[#1c1c1c]">Internet</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[13px] text-[#6b7280]">26 Feb</span>
            <span class="text-[14px] font-bold text-[#1c1c1c]">-$150</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#f3e8ff] rounded-[14px] flex items-center justify-center text-[#7c3aed]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <span class="text-[14px] font-semibold text-[#1c1c1c]">Seguro</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[13px] text-[#6b7280]">23 Feb</span>
            <span class="text-[14px] font-bold text-[#1c1c1c]">$150</span>
          </div>
        </div>
      </div>
    </app-base-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentCalendarComponent {}
