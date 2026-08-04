import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BaseCardComponent } from '../../../shared/components/card/base-card.component';
import { WalletHttpService } from '../../../core/services/wallet-http.service';
import { WalletStoreService } from '../../../core/services/wallet-store.service';
import { WalletSummary } from '../../../core/models/wallet.models';

@Component({
  selector: 'app-wallet-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule,
    BaseCardComponent
  ],
  template: `
    <div class="space-y-6">

      <!-- Header & Action Button -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-[24px] font-bold text-[#1c1c1c]">Mis Billeteras</h1>
          <p class="text-sm text-[#6b7280]">Administra tus espacios financieros y fondos de inversión</p>
        </div>

        <a
          routerLink="/wallets/new"
          class="bg-[#094c42] text-white px-5 py-2.5 rounded-[20px] text-sm font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          <mat-icon class="!w-4 !h-4 !text-[16px]">add</mat-icon>
          <span>Nueva Billetera</span>
        </a>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="p-12 text-center text-[#6b7280]">
          <mat-spinner diameter="32" class="mx-auto mb-3"></mat-spinner>
          <p class="text-sm font-medium">Cargando tus billeteras...</p>
        </div>
      } @else {
        
        <!-- Wallets Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (wallet of displayWallets; track wallet.id) {
            <a
              [routerLink]="['/wallets', wallet.id]"
              class="block p-6 rounded-[24px] bg-white border border-brand-surface hover:border-[#094c42]/40 shadow-soft hover:shadow-md transition-all group"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-2xl bg-[#e8f4ec] flex items-center justify-center text-[#094c42] group-hover:scale-105 transition-transform">
                  <mat-icon class="!w-6 !h-6 !text-[24px]">account_balance_wallet</mat-icon>
                </div>

                <mat-icon class="text-gray-400 group-hover:text-[#094c42] transition-colors !w-5 !h-5 !text-[20px]">
                  chevron_right
                </mat-icon>
              </div>

              <h3 class="text-lg font-bold text-[#1c1c1c] mb-1 group-hover:text-[#094c42] transition-colors truncate">
                {{ wallet.name }}
              </h3>
              
              <p class="text-xs text-[#6b7280] line-clamp-2 mb-4">
                {{ wallet.description || 'Billetera de la cuenta' }}
              </p>

              <div class="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span class="text-xs font-semibold text-[#6b7280]">Balance Estimado</span>
                <span class="text-sm font-extrabold text-[#094c42]">$0.00 USD</span>
              </div>
            </a>
          }
        </div>
      }

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletListComponent implements OnInit {
  private readonly walletHttp = inject(WalletHttpService);
  private readonly walletStore = inject(WalletStoreService);

  readonly wallets = this.walletStore.wallets;
  readonly isLoading = signal(false);

  // Default fallback personal wallet if backend list is empty
  private readonly defaultPersonalWallet: WalletSummary = {
    id: 'default-personal',
    name: 'Personal',
    description: 'Billetera personal por defecto'
  };

  get displayWallets(): WalletSummary[] {
    const current = this.wallets();
    if (current && current.length > 0) {
      return current;
    }
    return [this.defaultPersonalWallet];
  }

  ngOnInit() {
    this.loadWallets();
  }

  loadWallets() {
    this.isLoading.set(true);
    this.walletHttp.getMyWallets().subscribe({
      next: (data: WalletSummary[]) => {
        if (data && data.length > 0) {
          this.walletStore.setWallets(data);
        } else {
          this.walletStore.setWallets([this.defaultPersonalWallet]);
        }
        this.isLoading.set(false);
      },
      error: () => {
        // On error or fallback, guarantee at least the Personal wallet is visible
        if (this.wallets().length === 0) {
          this.walletStore.setWallets([this.defaultPersonalWallet]);
        }
        this.isLoading.set(false);
      }
    });
  }
}
