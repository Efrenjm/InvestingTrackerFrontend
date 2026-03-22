import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardConfigService } from '../../core/services/dashboard-config.service';
import { ProgressCardComponent } from './components/progress-card/progress-card.component';
import { StatCardComponent } from '../../shared/components/card/stat-card.component';
import { BudgetCardComponent } from './components/budget-card/budget-card.component';
import { PaymentCalendarComponent } from './components/payment-calendar/payment-calendar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ProgressCardComponent, 
    StatCardComponent, 
    BudgetCardComponent, 
    PaymentCalendarComponent
  ],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Content -->
      <div class="lg:col-span-8 space-y-8">
        @if (settings().showProgress) {
          <app-progress-card />
        }

        @if (settings().showAccounts) {
          <div>
            <h3 class="text-[20px] font-bold text-[#1c1c1c] mb-4 ml-2">Mis Cuentas de un Vistazo</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <app-stat-card title="Corriente" amount="$1,845.93" currency="€ USD" bgColor="bg-[#e8f4ec]">
                <svg icon class="w-4 h-4 text-[#094c42]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </app-stat-card>
              <app-stat-card title="Ahorros" amount="$3,36.00" currency="€ USD" bgColor="bg-[#fef9c3]">
                <svg icon class="w-4 h-4 text-[#d97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </app-stat-card>
              <app-stat-card title="Tarjeta" amount="$300,83" currency="$ USD" bgColor="bg-[#f3e8ff]">
                <svg icon class="w-4 h-4 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </app-stat-card>
            </div>
          </div>
        }
      </div>

      <!-- Right Content -->
      <div class="lg:col-span-4 space-y-6">
        @if (settings().showBudgets) {
          <app-budget-card />
        }
        
        @if (settings().showPayments) {
          <app-payment-calendar />
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly configService = inject(DashboardConfigService);
  settings = this.configService.settings;
}
