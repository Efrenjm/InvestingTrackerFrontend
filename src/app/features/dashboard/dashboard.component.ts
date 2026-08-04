import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DashboardConfigService } from '../../core/services/dashboard-config.service';
import { AuthStoreService } from '../../core/services/auth-store.service';
import { WalletHttpService } from '../../core/services/wallet-http.service';
import { WalletStoreService } from '../../core/services/wallet-store.service';
import { WalletSummary } from '../../core/models/wallet.models';
import { ProgressCardComponent } from './components/progress-card/progress-card.component';
import { StatCardComponent } from '../../shared/components/card/stat-card.component';
import { BudgetCardComponent } from './components/budget-card/budget-card.component';
import { PaymentCalendarComponent } from './components/payment-calendar/payment-calendar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    ProgressCardComponent, 
    StatCardComponent, 
    BudgetCardComponent, 
    PaymentCalendarComponent
  ],
  template: `
    <div class="space-y-6">

      <!-- Header & Action Button -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-[24px] font-bold text-[#1c1c1c]">
            ¡Hola, {{ currentUser()?.firstName || currentUser()?.username || 'Inversionista' }}!
          </h1>
          <p class="text-[14px] text-[#6b7280] mt-0.5">
            Resumen de tus activos y cuentas principales
          </p>
        </div>

        <a
          routerLink="/wallets/new"
          class="bg-[#094c42] text-white px-5 py-2.5 rounded-[20px] text-sm font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          <mat-icon class="!w-4 !h-4 !text-[16px]">add</mat-icon>
          <span>Nueva Billetera</span>
        </a>
      </div>

      <!-- Left and Right Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Content -->
        <div class="lg:col-span-8 space-y-8">
          @if (settings().showProgress) {
            <app-progress-card />
          }

          @if (settings().showAccounts) {
            <div>
              <div class="flex items-center justify-between mb-4 ml-2">
                <a routerLink="/wallets" class="text-[20px] font-bold text-[#1c1c1c] hover:text-[#094c42] transition-colors">
                  Mis Cuentas de un Vistazo
                </a>
                @if (isLoadingWallets()) {
                  <span class="text-xs text-[#6b7280]">Cargando...</span>
                }
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                @if (wallets().length > 0) {
                  @for (wallet of wallets(); track wallet.id; let idx = $index) {
                    <a [routerLink]="['/wallets', wallet.id]" class="block transition-transform hover:-translate-y-1">
                      <app-stat-card
                        [title]="wallet.name"
                        amount="$0.00"
                        currency="$ USD"
                        [bgColor]="idx % 3 === 0 ? 'bg-[#e8f4ec]' : idx % 3 === 1 ? 'bg-[#fef9c3]' : 'bg-[#f3e8ff]'"
                      >
                        <mat-icon icon class="w-4 h-4 text-[#094c42]">account_balance_wallet</mat-icon>
                      </app-stat-card>
                    </a>
                  }
                } @else {
                  <app-stat-card title="Corriente" amount="$1,845.93" currency="$ USD" bgColor="bg-[#e8f4ec]">
                    <mat-icon icon class="w-4 h-4 text-[#094c42]">account_balance_wallet</mat-icon>
                  </app-stat-card>
                  <app-stat-card title="Ahorros" amount="$3,336.00" currency="$ USD" bgColor="bg-[#fef9c3]">
                    <mat-icon icon class="w-4 h-4 text-[#d97706]">savings</mat-icon>
                  </app-stat-card>
                  <app-stat-card title="Tarjeta" amount="$300.83" currency="$ USD" bgColor="bg-[#f3e8ff]">
                    <mat-icon icon class="w-4 h-4 text-[#7c3aed]">credit_card</mat-icon>
                  </app-stat-card>
                }
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
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private readonly configService = inject(DashboardConfigService);
  private readonly authStore = inject(AuthStoreService);
  private readonly walletHttp = inject(WalletHttpService);
  private readonly walletStore = inject(WalletStoreService);

  readonly settings = this.configService.settings;
  readonly currentUser = this.authStore.user;
  readonly wallets = this.walletStore.wallets;

  readonly isLoadingWallets = signal(false);

  ngOnInit() {
    this.loadWallets();
  }

  loadWallets() {
    this.isLoadingWallets.set(true);
    this.walletHttp.getMyWallets().subscribe({
      next: (data: WalletSummary[]) => {
        this.walletStore.setWallets(data);
        this.isLoadingWallets.set(false);
      },
      error: () => {
        this.isLoadingWallets.set(false);
      }
    });
  }
}
