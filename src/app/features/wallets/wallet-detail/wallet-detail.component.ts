import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BaseCardComponent } from '../../../shared/components/card/base-card.component';
import { StatCardComponent } from '../../../shared/components/card/stat-card.component';
import { WalletHttpService } from '../../../core/services/wallet-http.service';
import { WalletStoreService } from '../../../core/services/wallet-store.service';
import { AccountHttpService } from '../../../core/services/account-http.service';
import { AccountStoreService } from '../../../core/services/account-store.service';
import { Wallet, Visibility } from '../../../core/models/wallet.models';
import { AccountSummary, AccountType } from '../../../core/models/account.models';

@Component({
  selector: 'app-wallet-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    BaseCardComponent,
    StatCardComponent
  ],
  template: `
    <div class="space-y-6">

      <!-- Navigation Header -->
      <div class="flex items-center justify-between">
        <a
          routerLink="/wallets"
          class="inline-flex items-center gap-2 text-sm font-semibold text-[#6b7280] hover:text-[#1c1c1c] transition-colors"
        >
          <mat-icon class="!w-5 !h-5 !text-[20px]">arrow_back</mat-icon>
          <span>Volver a Billeteras</span>
        </a>

        <div class="flex items-center gap-2">
          <button
            (click)="deleteWallet()"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
          >
            Eliminar Billetera
          </button>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="p-12 text-center text-[#6b7280]">
          <mat-spinner diameter="32" class="mx-auto mb-3"></mat-spinner>
          <p class="text-sm font-medium">Cargando detalles de la billetera...</p>
        </div>
      } @else if (wallet()) {
        
        <!-- Wallet Banner Header -->
        <app-base-card>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-2xl bg-[#e8f4ec] flex items-center justify-center text-[#094c42] shrink-0">
                <mat-icon class="!w-8 !h-8 !text-[32px]">account_balance_wallet</mat-icon>
              </div>

              <div>
                <div class="flex items-center gap-3">
                  <h1 class="text-[24px] font-bold text-[#1c1c1c]">{{ wallet()?.name }}</h1>
                  <span class="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#e8f4ec] text-[#094c42] border border-[#094c42]/20">
                    {{ wallet()?.visibility || 'PRIVATE' }}
                  </span>
                </div>
                
                <p class="text-sm text-[#6b7280] mt-1">{{ wallet()?.description || 'Sin descripción asignada' }}</p>
                <p class="text-xs text-[#6b7280] mt-2">ID: <code class="bg-gray-100 px-2 py-0.5 rounded">{{ wallet()?.id }}</code></p>
              </div>
            </div>

            <!-- Total Balance Metric -->
            <div class="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-right min-w-[200px]">
              <div class="text-xs font-semibold text-[#6b7280]">Balance Total</div>
              <div class="text-3xl font-black text-[#1c1c1c] mt-1">
                {{ '$' + (totalBalance() | number:'1.2-2') + ' USD' }}
              </div>
            </div>
          </div>
        </app-base-card>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <app-stat-card title="Cuentas Débito" [amount]="'$' + debitBalance() + ' USD'" currency="Saldo disponible" bgColor="bg-[#e8f4ec]">
            <mat-icon icon class="w-4 h-4 text-[#094c42]">account_balance</mat-icon>
          </app-stat-card>

          <app-stat-card title="Activos" [amount]="'$' + assetBalance() + ' USD'" currency="Valor total" bgColor="bg-[#fef9c3]">
            <mat-icon icon class="w-4 h-4 text-[#d97706]">trending_up</mat-icon>
          </app-stat-card>

          <app-stat-card title="Crédito" [amount]="'$' + creditDebt() + ' USD'" currency="Deuda actual" bgColor="bg-[#fde8e8]">
            <mat-icon icon class="w-4 h-4 text-[#dc2626]">credit_card</mat-icon>
          </app-stat-card>
        </div>

        <!-- Accounts Section -->
        <div class="space-y-4">
          <!-- Section Header -->
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-[18px] font-bold text-[#1c1c1c]">Cuentas</h2>
              <p class="text-xs text-[#6b7280] mt-0.5">{{ localAccounts().length }} cuenta{{ localAccounts().length !== 1 ? 's' : '' }} vinculada{{ localAccounts().length !== 1 ? 's' : '' }}</p>
            </div>

            <a
              [routerLink]="['/wallets', wallet()!.id, 'accounts', 'new']"
              class="inline-flex items-center gap-2 bg-[#094c42] text-white px-4 py-2.5 rounded-[20px] text-sm font-semibold hover:bg-opacity-90 transition-all"
            >
              <mat-icon class="!w-4 !h-4 !text-[16px]">add</mat-icon>
              <span>Agregar Cuenta</span>
            </a>
          </div>

          <!-- Accounts Loading -->
          @if (isLoadingAccounts()) {
            <div class="p-8 text-center text-[#6b7280]">
              <mat-spinner diameter="28" class="mx-auto mb-2"></mat-spinner>
              <p class="text-sm">Cargando cuentas...</p>
            </div>
          } @else if (localAccounts().length === 0) {
            <!-- Empty State -->
            <app-base-card>
              <div class="py-10 text-center">
                <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <mat-icon class="!w-8 !h-8 !text-[32px] text-gray-400">account_balance</mat-icon>
                </div>
                <h3 class="text-base font-bold text-[#1c1c1c] mb-1">No hay cuentas aún</h3>
                <p class="text-sm text-[#6b7280] mb-5">Agrega tu primera cuenta para comenzar a gestionar tus finanzas</p>
                <a
                  [routerLink]="['/wallets', wallet()!.id, 'accounts', 'new']"
                  class="inline-flex items-center gap-2 bg-[#094c42] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-opacity-90 transition-all"
                >
                  <mat-icon class="!w-4 !h-4 !text-[16px]">add</mat-icon>
                  <span>Agregar Primera Cuenta</span>
                </a>
              </div>
            </app-base-card>
          } @else {
            <!-- Accounts Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (account of localAccounts(); track account.id) {
                <a
                  [routerLink]="['/wallets', wallet()!.id, 'accounts', account.id]"
                  class="group block p-5 rounded-[20px] bg-white border border-gray-200 hover:border-[#094c42]/40 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <!-- Account Card Header -->
                  <div class="flex items-start justify-between mb-3">
                    <div
                      class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      [style.background-color]="getAccountBgColor(account.type)"
                    >
                      <mat-icon
                        class="!w-5 !h-5 !text-[20px]"
                        [style.color]="getAccountIconColor(account.type)"
                      >{{ getAccountIcon(account) }}</mat-icon>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span
                        class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                        [class]="getAccountTypeBadgeClass(account.type)"
                      >{{ getAccountTypeLabel(account.type) }}</span>
                      <mat-icon class="!w-4 !h-4 !text-[16px] text-gray-400 group-hover:text-[#094c42] transition-colors">chevron_right</mat-icon>
                    </div>
                  </div>

                  <!-- Account Name & Description -->
                  <h3 class="text-sm font-bold text-[#1c1c1c] truncate group-hover:text-[#094c42] transition-colors">
                    {{ account.name }}
                  </h3>
                  <p class="text-xs text-[#6b7280] mt-0.5 line-clamp-1">
                    {{ account.description || 'Sin descripción' }}
                  </p>

                  <!-- Balance -->
                  <div class="mt-3 pt-3 border-t border-gray-100">
                    <div class="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wide mb-0.5">
                      {{ getBalanceLabel(account.type) }}
                    </div>
                    <div class="text-base font-extrabold" [style.color]="getAccountIconColor(account.type)">
                      {{ '$' + ((account.available ?? 0) | number:'1.2-2') + ' USD' }}
                    </div>
                  </div>

                  <!-- Tags -->
                  @if (account.tags && account.tags.length > 0) {
                    <div class="mt-2 flex flex-wrap gap-1">
                      @for (tag of account.tags.slice(0, 3); track tag) {
                        <span class="px-2 py-0.5 rounded-full bg-gray-100 text-[#6b7280] text-[10px] font-medium">
                          #{{ tag }}
                        </span>
                      }
                      @if (account.tags.length > 3) {
                        <span class="text-[10px] text-[#6b7280] font-medium self-center">+{{ account.tags.length - 3 }}</span>
                      }
                    </div>
                  }
                </a>
              }
            </div>
          }
        </div>

        <!-- Wallet Info Card -->
        <app-base-card>
          <h3 class="text-[18px] font-bold text-[#1c1c1c] mb-4">Información de la Billetera</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div class="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <span class="text-xs font-semibold text-[#6b7280] block mb-1">Creado por</span>
              <span class="font-bold text-[#1c1c1c]">{{ wallet()?.createdBy || 'Sistema' }}</span>
            </div>

            <div class="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <span class="text-xs font-semibold text-[#6b7280] block mb-1">Cuentas vinculadas</span>
              <span class="font-bold text-[#1c1c1c]">{{ localAccounts().length }} cuenta{{ localAccounts().length !== 1 ? 's' : '' }}</span>
            </div>
          </div>
        </app-base-card>

      } @else {
        <app-base-card>
          <div class="p-8 text-center text-[#6b7280]">
            <mat-icon class="!w-12 !h-12 !text-[48px] text-gray-300 mb-2">error_outline</mat-icon>
            <h3 class="text-lg font-bold text-[#1c1c1c]">Billetera no encontrada</h3>
            <p class="text-sm mt-1 mb-4">La billetera solicitada no existe o fue eliminada.</p>
            <a
              routerLink="/wallets"
              class="px-5 py-2.5 bg-[#094c42] text-white rounded-xl text-xs font-semibold hover:bg-opacity-90 inline-block"
            >
              Volver a Billeteras
            </a>
          </div>
        </app-base-card>
      }

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly walletHttp = inject(WalletHttpService);
  private readonly walletStore = inject(WalletStoreService);
  private readonly accountHttp = inject(AccountHttpService);
  private readonly accountStore = inject(AccountStoreService);
  private readonly snackBar = inject(MatSnackBar);

  readonly wallet = signal<Wallet | null>(null);
  readonly isLoading = signal(true);
  readonly isLoadingAccounts = signal(false);

  // Accounts come from a LOCAL signal that we control directly — no store reactivity issues
  readonly localAccounts = signal<AccountSummary[]>([]);

  readonly totalBalance = () =>
    this.localAccounts().reduce((sum, a) => sum + (a.available ?? 0), 0);

  readonly debitBalance = () =>
    this.localAccounts()
      .filter(a => a.type === 'debit')
      .reduce((sum, a) => sum + (a.available ?? 0), 0)
      .toFixed(2);

  readonly assetBalance = () =>
    this.localAccounts()
      .filter(a => a.type === 'asset')
      .reduce((sum, a) => sum + (a.available ?? 0), 0)
      .toFixed(2);

  readonly creditDebt = () =>
    this.localAccounts()
      .filter(a => a.type === 'credit')
      .reduce((sum, a) => sum + (a.available ?? 0), 0)
      .toFixed(2);

  ngOnInit() {
    const walletId = this.route.snapshot.paramMap.get('id');
    if (!walletId) {
      this.router.navigate(['/wallets']);
      return;
    }

    // ALWAYS load persisted local accounts first — guaranteed to show what was saved
    const persisted = this.accountStore.getLocalAccounts(walletId);
    this.localAccounts.set(persisted);

    this.loadWallet(walletId);
  }

  loadWallet(id: string) {
    this.isLoading.set(true);
    const summaryInStore = this.walletStore.wallets().find(w => w.id === id);

    this.walletHttp.getWallet(id).subscribe({
      next: (data) => {
        this.wallet.set(data);
        this.walletStore.setActiveWallet(data);
        this.isLoading.set(false);
        this.loadAccounts(id);
      },
      error: () => {
        const fallbackWallet: Wallet = {
          id: id,
          name: summaryInStore?.name || 'Personal',
          description: summaryInStore?.description || 'Billetera personal de la cuenta',
          visibility: Visibility.PRIVATE,
          createdBy: 'Sistema',
          accounts: []
        };
        this.wallet.set(fallbackWallet);
        this.walletStore.setActiveWallet(fallbackWallet);
        this.isLoading.set(false);
        this.loadAccounts(id);
      }
    });
  }

  loadAccounts(walletId: string) {
    this.isLoadingAccounts.set(true);
    this.accountHttp.getWalletAccounts(walletId).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          // Backend returned real accounts — use them and clear local overrides
          this.accountStore.loadForWallet(walletId, data);
          this.localAccounts.set(data);
        } else {
          // Backend returned empty — keep locally persisted accounts
          this.accountStore.loadForWallet(walletId, null);
          this.localAccounts.set(this.accountStore.getLocalAccounts(walletId));
        }
        this.isLoadingAccounts.set(false);
      },
      error: () => {
        // Backend not available — show locally persisted accounts
        this.accountStore.setCurrentWalletId(walletId);
        this.localAccounts.set(this.accountStore.getLocalAccounts(walletId));
        this.isLoadingAccounts.set(false);
      }
    });
  }

  deleteWallet() {
    const current = this.wallet();
    if (!current) return;

    if (confirm(`¿Estás seguro de eliminar la billetera "${current.name}"?`)) {
      this.walletHttp.deleteWallet(current.id).subscribe({
        next: () => {
          this.snackBar.open('Billetera eliminada exitosamente', 'Cerrar', { duration: 3000 });
          this.walletStore.removeWallet(current.id);
          this.router.navigate(['/wallets']);
        },
        error: () => {
          this.walletStore.removeWallet(current.id);
          this.snackBar.open('Billetera eliminada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/wallets']);
        }
      });
    }
  }

  getAccountIcon(account: AccountSummary): string {
    if (account.accountConfig?.icon) return account.accountConfig.icon;
    switch (account.type) {
      case 'debit': return 'account_balance';
      case 'credit': return 'credit_card';
      case 'asset': return 'trending_up';
      default: return 'account_balance';
    }
  }

  getAccountBgColor(type: AccountType): string {
    switch (type) {
      case 'debit': return '#e8f4ec';
      case 'credit': return '#fde8e8';
      case 'asset': return '#fef9c3';
      default: return '#f3f4f6';
    }
  }

  getAccountIconColor(type: AccountType): string {
    switch (type) {
      case 'debit': return '#094c42';
      case 'credit': return '#dc2626';
      case 'asset': return '#d97706';
      default: return '#6b7280';
    }
  }

  getAccountTypeBadgeClass(type: AccountType): string {
    switch (type) {
      case 'debit': return 'bg-[#e8f4ec] text-[#094c42]';
      case 'credit': return 'bg-[#fde8e8] text-[#dc2626]';
      case 'asset': return 'bg-[#fef9c3] text-[#d97706]';
      default: return 'bg-gray-100 text-[#6b7280]';
    }
  }

  getAccountTypeLabel(type: AccountType): string {
    switch (type) {
      case 'debit': return 'Débito';
      case 'credit': return 'Crédito';
      case 'asset': return 'Activo';
      default: return type;
    }
  }

  getBalanceLabel(type: AccountType): string {
    switch (type) {
      case 'debit': return 'Disponible';
      case 'credit': return 'Deuda actual';
      case 'asset': return 'Valor disponible';
      default: return 'Balance';
    }
  }
}
