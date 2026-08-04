import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BaseCardComponent } from '../../../shared/components/card/base-card.component';
import { AccountHttpService } from '../../../core/services/account-http.service';
import { AccountStoreService } from '../../../core/services/account-store.service';
import { Account, AccountType, MockTransaction } from '../../../core/models/account.models';

const MOCK_TRANSACTIONS: MockTransaction[] = [
  {
    id: 't1',
    description: 'Nómina Agosto',
    amount: 3500.00,
    date: '2026-08-01',
    type: 'income',
    category: 'Salario'
  },
  {
    id: 't2',
    description: 'Supermercado WalMart',
    amount: -125.50,
    date: '2026-07-31',
    type: 'expense',
    category: 'Alimentación'
  },
  {
    id: 't3',
    description: 'Transferencia a Ahorros',
    amount: -500.00,
    date: '2026-07-30',
    type: 'transfer',
    category: 'Transferencia'
  },
  {
    id: 't4',
    description: 'Netflix',
    amount: -19.99,
    date: '2026-07-28',
    type: 'expense',
    category: 'Entretenimiento'
  },
  {
    id: 't5',
    description: 'Freelance Proyecto Web',
    amount: 800.00,
    date: '2026-07-25',
    type: 'income',
    category: 'Ingresos extras'
  },
  {
    id: 't6',
    description: 'Gasolina PEMEX',
    amount: -65.00,
    date: '2026-07-24',
    type: 'expense',
    category: 'Transporte'
  },
  {
    id: 't7',
    description: 'Restaurante La Trattoria',
    amount: -87.30,
    date: '2026-07-20',
    type: 'expense',
    category: 'Restaurantes'
  },
  {
    id: 't8',
    description: 'Recibo Luz CFE',
    amount: -340.00,
    date: '2026-07-18',
    type: 'expense',
    category: 'Servicios'
  }
];

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    BaseCardComponent
  ],
  template: `
    <div class="space-y-6">

      <!-- Navigation Header -->
      <div class="flex items-center justify-between">
        <a
          [routerLink]="['/wallets', walletId()]"
          class="inline-flex items-center gap-2 text-sm font-semibold text-[#6b7280] hover:text-[#1c1c1c] transition-colors"
        >
          <mat-icon class="!w-5 !h-5 !text-[20px]">arrow_back</mat-icon>
          <span>Volver a la Billetera</span>
        </a>

        @if (account()) {
          <div class="flex items-center gap-2">
            <button
              class="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
              (click)="onDelete()"
            >
              Eliminar Cuenta
            </button>
          </div>
        }
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="p-12 text-center text-[#6b7280]">
          <mat-spinner diameter="32" class="mx-auto mb-3"></mat-spinner>
          <p class="text-sm font-medium">Cargando cuenta...</p>
        </div>

      } @else if (account()) {
        <!-- Account Banner -->
        <app-base-card>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex items-start gap-4">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                [style.background-color]="getAccountBgColor(account()!.type)"
              >
                <mat-icon
                  class="!w-8 !h-8 !text-[32px]"
                  [style.color]="getAccountIconColor(account()!.type)"
                >{{ getAccountIcon(account()!) }}</mat-icon>
              </div>

              <div>
                <div class="flex items-center gap-3 flex-wrap">
                  <h1 class="text-[24px] font-bold text-[#1c1c1c]">{{ account()!.name }}</h1>
                  <span
                    class="px-3 py-0.5 rounded-full text-xs font-semibold"
                    [class]="getTypeBadgeClass(account()!.type)"
                  >{{ getTypeLabel(account()!.type) }}</span>
                </div>
                <p class="text-sm text-[#6b7280] mt-1">{{ account()!.description || 'Sin descripción' }}</p>

                <!-- Tags -->
                @if (account()!.tags && account()!.tags!.length > 0) {
                  <div class="flex flex-wrap gap-1 mt-2">
                    @for (tag of account()!.tags!; track tag) {
                      <span class="px-2 py-0.5 rounded-full bg-gray-100 text-[#6b7280] text-[10px] font-medium">
                        #{{ tag }}
                      </span>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Balance Display -->
            <div
              class="p-4 rounded-2xl border text-right min-w-[200px]"
              [style.background-color]="getAccountBgColor(account()!.type)"
              [style.border-color]="getAccountIconColor(account()!.type) + '33'"
            >
              <div class="text-xs font-semibold text-[#6b7280]">{{ getBalanceLabel(account()!.type) }}</div>
              <div
                class="text-3xl font-black mt-1"
                [style.color]="getAccountIconColor(account()!.type)"
              >
                {{ '$' + ((account()!.available ?? 0) | number:'1.2-2') + ' USD' }}
              </div>
            </div>
          </div>
        </app-base-card>

        <!-- Type-specific details -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (detail of accountDetails(); track detail.label) {
            <div class="p-4 rounded-2xl bg-white border border-gray-200">
              <div class="text-xs font-semibold text-[#6b7280] mb-1">{{ detail.label }}</div>
              <div class="text-base font-bold text-[#1c1c1c]">{{ detail.value }}</div>
            </div>
          }
        </div>

        <!-- Appearance Config -->
        @if (account()!.accountConfig) {
          <app-base-card>
            <h3 class="text-[16px] font-bold text-[#1c1c1c] mb-4">Configuración de Apariencia</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div class="p-3 rounded-xl bg-gray-50">
                <div class="text-[10px] font-semibold text-[#6b7280] mb-1">Color</div>
                <div class="flex items-center gap-2">
                  <div
                    class="w-5 h-5 rounded-full border border-gray-200"
                    [style.background-color]="account()!.accountConfig!.color || '#000'"
                  ></div>
                  <span class="text-xs font-mono">{{ account()!.accountConfig!.color || 'N/A' }}</span>
                </div>
              </div>
              <div class="p-3 rounded-xl bg-gray-50">
                <div class="text-[10px] font-semibold text-[#6b7280] mb-1">Visible</div>
                <div class="flex items-center gap-1">
                  <mat-icon class="!w-4 !h-4 !text-[14px]" [class]="account()!.accountConfig!.visible ? 'text-green-600' : 'text-gray-400'">
                    {{ account()!.accountConfig!.visible ? 'check_circle' : 'cancel' }}
                  </mat-icon>
                  <span class="text-xs font-semibold">{{ account()!.accountConfig!.visible ? 'Sí' : 'No' }}</span>
                </div>
              </div>
              <div class="p-3 rounded-xl bg-gray-50">
                <div class="text-[10px] font-semibold text-[#6b7280] mb-1">Suma neta</div>
                <div class="flex items-center gap-1">
                  <mat-icon class="!w-4 !h-4 !text-[14px]" [class]="account()!.accountConfig!.includedInNetSum ? 'text-green-600' : 'text-gray-400'">
                    {{ account()!.accountConfig!.includedInNetSum ? 'check_circle' : 'cancel' }}
                  </mat-icon>
                  <span class="text-xs font-semibold">{{ account()!.accountConfig!.includedInNetSum ? 'Incluida' : 'Excluida' }}</span>
                </div>
              </div>
              <div class="p-3 rounded-xl bg-gray-50">
                <div class="text-[10px] font-semibold text-[#6b7280] mb-1">Grupo</div>
                <span class="text-xs font-semibold">{{ account()!.accountConfig!.group || 'default' }}</span>
              </div>
            </div>
          </app-base-card>
        }

        <!-- Transactions Section -->
        <app-base-card>
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="text-[18px] font-bold text-[#1c1c1c]">Transacciones</h3>
              <p class="text-xs text-[#6b7280] mt-0.5">Últimos movimientos de la cuenta</p>
            </div>

            <span class="px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-[#6b7280]">
              Datos de ejemplo
            </span>
          </div>

          <!-- Transaction List -->
          <div class="space-y-2">
            @for (tx of mockTransactions; track tx.id) {
              <div class="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                <!-- Category Icon -->
                <div
                  class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  [class]="getTxBgClass(tx.type)"
                >
                  <mat-icon class="!w-5 !h-5 !text-[18px]" [class]="getTxIconClass(tx.type)">
                    {{ getTxIcon(tx.type) }}
                  </mat-icon>
                </div>

                <!-- Description -->
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold text-[#1c1c1c] truncate">{{ tx.description }}</div>
                  <div class="text-[11px] text-[#6b7280]">{{ tx.category }} · {{ tx.date }}</div>
                </div>

                <!-- Amount -->
                <div
                  class="text-sm font-extrabold shrink-0"
                  [class.text-green-600]="tx.amount > 0"
                  [class.text-red-600]="tx.amount < 0"
                  [class.text-blue-600]="tx.type === 'transfer'"
                >
                  {{ (tx.amount > 0 ? '+' : '') + '$' + (tx.amount | number:'1.2-2') }}
                </div>
              </div>
            }
          </div>

          <!-- Pagination placeholder -->
          <div class="mt-4 pt-4 border-t border-gray-100 text-center">
            <button
              disabled
              class="text-xs font-semibold text-[#6b7280] px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
            >
              Ver más transacciones (próximamente)
            </button>
          </div>
        </app-base-card>

      } @else {
        <!-- Not found -->
        <app-base-card>
          <div class="p-8 text-center text-[#6b7280]">
            <mat-icon class="!w-12 !h-12 !text-[48px] text-gray-300 mb-2">account_balance</mat-icon>
            <h3 class="text-lg font-bold text-[#1c1c1c]">Cuenta no encontrada</h3>
            <p class="text-sm mt-1 mb-4">La cuenta no existe o fue eliminada.</p>
            <a
              [routerLink]="['/wallets', walletId()]"
              class="px-5 py-2.5 bg-[#094c42] text-white rounded-xl text-xs font-semibold hover:bg-opacity-90 inline-block"
            >
              Volver a la Billetera
            </a>
          </div>
        </app-base-card>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly accountHttp = inject(AccountHttpService);
  private readonly accountStore = inject(AccountStoreService);
  private readonly snackBar = inject(MatSnackBar);

  readonly walletId = signal('');
  readonly account = signal<Account | null>(null);
  readonly isLoading = signal(true);
  readonly mockTransactions = MOCK_TRANSACTIONS;

  readonly accountDetails = computed(() => {
    const a = this.account();
    if (!a) return [];
    const details: Array<{ label: string; value: string }> = [];

    if (a.type === 'debit') {
      const debit = a as any;
      details.push({ label: 'Saldo disponible', value: `$${(a.available ?? 0).toFixed(2)} USD` });
      if (debit.goal) details.push({ label: 'Meta de ahorro', value: `$${debit.goal.toFixed(2)} USD` });
    } else if (a.type === 'credit') {
      const credit = a as any;
      details.push({ label: 'Deuda actual', value: `$${(credit.currentDebt ?? 0).toFixed(2)} USD` });
      if (credit.creditLimit) details.push({ label: 'Límite de crédito', value: `$${credit.creditLimit.toFixed(2)} USD` });
      if (credit.creditLimit && credit.currentDebt) {
        const used = ((credit.currentDebt / credit.creditLimit) * 100).toFixed(1);
        details.push({ label: 'Uso de crédito', value: `${used}%` });
      }
    } else if (a.type === 'asset') {
      const asset = a as any;
      details.push({ label: 'Activo', value: asset.asset || 'N/A' });
      if (asset.averageCost) details.push({ label: 'Costo promedio', value: `$${asset.averageCost.toFixed(2)} USD` });
      if (asset.currentPrice) {
        details.push({ label: 'Precio actual', value: `$${asset.currentPrice.toFixed(2)} USD` });
        if (asset.averageCost) {
          const pnl = (((asset.currentPrice - asset.averageCost) / asset.averageCost) * 100).toFixed(2);
          details.push({ label: 'P&L', value: `${parseFloat(pnl) >= 0 ? '+' : ''}${pnl}%` });
        }
      }
      if (asset.goal) details.push({ label: 'Meta', value: `$${asset.goal.toFixed(2)} USD` });
    }

    return details;
  });

  ngOnInit() {
    const walletId = this.route.snapshot.paramMap.get('walletId');
    const accountId = this.route.snapshot.paramMap.get('accountId');

    if (!walletId || !accountId) {
      this.router.navigate(['/wallets']);
      return;
    }

    this.walletId.set(walletId);

    // Check store first
    const inStore = this.accountStore.accounts().find(a => a.id === accountId);
    if (inStore) {
      this.account.set(inStore as unknown as Account);
      this.isLoading.set(false);
      return;
    }

    // Fetch from backend
    this.accountHttp.getAccount(accountId).subscribe({
      next: (data) => {
        this.account.set(data);
        this.accountStore.setActiveAccount(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.account.set(null);
        this.isLoading.set(false);
      }
    });
  }

  onDelete() {
    const a = this.account();
    if (!a) return;

    if (confirm(`¿Eliminar la cuenta "${a.name}"?`)) {
      this.accountHttp.deleteAccount(a.id).subscribe({
        next: () => {
          this.accountStore.removeAccount(a.id);
          this.snackBar.open('Cuenta eliminada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/wallets', this.walletId()]);
        },
        error: () => {
          this.accountStore.removeAccount(a.id);
          this.snackBar.open('Cuenta eliminada localmente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/wallets', this.walletId()]);
        }
      });
    }
  }

  getAccountIcon(account: Account): string {
    if (account.accountConfig?.icon) return account.accountConfig.icon;
    switch (account.type) {
      case 'debit': return 'account_balance';
      case 'credit': return 'credit_card';
      case 'asset': return 'trending_up';
    }
  }

  getAccountBgColor(type: AccountType): string {
    switch (type) {
      case 'debit': return '#e8f4ec';
      case 'credit': return '#fde8e8';
      case 'asset': return '#fef9c3';
    }
  }

  getAccountIconColor(type: AccountType): string {
    switch (type) {
      case 'debit': return '#094c42';
      case 'credit': return '#dc2626';
      case 'asset': return '#d97706';
    }
  }

  getTypeBadgeClass(type: AccountType): string {
    switch (type) {
      case 'debit': return 'bg-[#e8f4ec] text-[#094c42]';
      case 'credit': return 'bg-[#fde8e8] text-[#dc2626]';
      case 'asset': return 'bg-[#fef9c3] text-[#d97706]';
    }
  }

  getTypeLabel(type: AccountType): string {
    switch (type) {
      case 'debit': return 'Débito';
      case 'credit': return 'Crédito';
      case 'asset': return 'Activo';
    }
  }

  getBalanceLabel(type: AccountType): string {
    switch (type) {
      case 'debit': return 'Saldo disponible';
      case 'credit': return 'Deuda actual';
      case 'asset': return 'Valor disponible';
    }
  }

  getTxIcon(type: 'income' | 'expense' | 'transfer'): string {
    switch (type) {
      case 'income': return 'arrow_downward';
      case 'expense': return 'arrow_upward';
      case 'transfer': return 'swap_horiz';
    }
  }

  getTxBgClass(type: 'income' | 'expense' | 'transfer'): string {
    switch (type) {
      case 'income': return 'bg-green-100';
      case 'expense': return 'bg-red-100';
      case 'transfer': return 'bg-blue-100';
    }
  }

  getTxIconClass(type: 'income' | 'expense' | 'transfer'): string {
    switch (type) {
      case 'income': return 'text-green-600';
      case 'expense': return 'text-red-600';
      case 'transfer': return 'text-blue-600';
    }
  }
}
