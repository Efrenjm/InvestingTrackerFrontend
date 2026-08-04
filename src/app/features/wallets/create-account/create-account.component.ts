import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BaseCardComponent } from '../../../shared/components/card/base-card.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AccountHttpService } from '../../../core/services/account-http.service';
import { AccountStoreService } from '../../../core/services/account-store.service';
import { AccountType, AccountConfig } from '../../../core/models/account.models';

type TabType = AccountType;

const COLOR_PRESETS = [
  '#094c42', '#1d6954', '#2d9cdb', '#7c3aed', '#d97706',
  '#dc2626', '#db2777', '#0f766e', '#1e40af', '#92400e'
];

const ICON_PRESETS = [
  'account_balance', 'savings', 'credit_card', 'trending_up', 'monetization_on',
  'account_balance_wallet', 'receipt_long', 'attach_money', 'currency_exchange', 'bar_chart',
  'show_chart', 'candlestick_chart', 'real_estate_agent', 'diamond', 'bolt'
];

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    BaseCardComponent,
    InputComponent,
    ButtonComponent
  ],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">

      <!-- Back Navigation Header -->
      <div class="flex items-center justify-between">
        <a
          [routerLink]="['/wallets', walletId()]"
          class="inline-flex items-center gap-2 text-sm font-semibold text-[#6b7280] hover:text-[#1c1c1c] transition-colors"
        >
          <mat-icon class="!w-5 !h-5 !text-[20px]">arrow_back</mat-icon>
          <span>Volver a la Billetera</span>
        </a>
      </div>

      <!-- Page Title Card -->
      <app-base-card>
        <div class="flex items-center gap-4 pb-6 border-b border-gray-100 mb-6">
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
            [style.background-color]="previewBgColor()"
          >
            <mat-icon
              class="!w-6 !h-6 !text-[24px]"
              [style.color]="form.get('config.color')?.value || '#094c42'"
            >{{ form.get('config.icon')?.value || 'account_balance' }}</mat-icon>
          </div>
          <div>
            <h1 class="text-[22px] font-bold text-[#1c1c1c]">Agregar Nueva Cuenta</h1>
            <p class="text-sm text-[#6b7280]">Configura los detalles de tu cuenta financiera</p>
          </div>
        </div>

        <!-- Account Type Selector -->
        <div class="mb-6">
          <label class="block text-xs font-semibold text-[#1c1c1c] mb-2 ml-1">Tipo de Cuenta</label>
          <div class="grid grid-cols-3 gap-3">

            <!-- Debit -->
            <button
              type="button"
              id="btn-type-debit"
              (click)="setAccountType('debit')"
              [class]="selectedType() === 'debit'
                ? 'border-[#094c42] bg-[#e8f4ec] text-[#094c42] ring-2 ring-[#094c42]/20'
                : 'border-gray-200 bg-gray-50 text-[#6b7280] hover:border-gray-300'"
              class="p-4 rounded-2xl border text-left flex flex-col items-start gap-2 transition-all"
            >
              <mat-icon class="!w-5 !h-5 !text-[20px]">account_balance</mat-icon>
              <div>
                <div class="text-sm font-bold">Débito</div>
                <div class="text-[11px] opacity-80">Cuenta corriente o ahorro</div>
              </div>
            </button>

            <!-- Credit -->
            <button
              type="button"
              id="btn-type-credit"
              (click)="setAccountType('credit')"
              [class]="selectedType() === 'credit'
                ? 'border-[#dc2626] bg-[#fde8e8] text-[#dc2626] ring-2 ring-[#dc2626]/20'
                : 'border-gray-200 bg-gray-50 text-[#6b7280] hover:border-gray-300'"
              class="p-4 rounded-2xl border text-left flex flex-col items-start gap-2 transition-all"
            >
              <mat-icon class="!w-5 !h-5 !text-[20px]">credit_card</mat-icon>
              <div>
                <div class="text-sm font-bold">Crédito</div>
                <div class="text-[11px] opacity-80">Tarjeta o línea de crédito</div>
              </div>
            </button>

            <!-- Asset -->
            <button
              type="button"
              id="btn-type-asset"
              (click)="setAccountType('asset')"
              [class]="selectedType() === 'asset'
                ? 'border-[#d97706] bg-[#fef9c3] text-[#d97706] ring-2 ring-[#d97706]/20'
                : 'border-gray-200 bg-gray-50 text-[#6b7280] hover:border-gray-300'"
              class="p-4 rounded-2xl border text-left flex flex-col items-start gap-2 transition-all"
            >
              <mat-icon class="!w-5 !h-5 !text-[20px]">trending_up</mat-icon>
              <div>
                <div class="text-sm font-bold">Activo</div>
                <div class="text-[11px] opacity-80">Inversión, cripto, acción</div>
              </div>
            </button>

          </div>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">

          <!-- Base Fields -->
          <app-input
            label="Nombre de la Cuenta"
            placeholder="Ej. Cuenta Nómina, Bitcoin, Visa Platinum"
            icon="badge"
            [control]="nameControl"
          ></app-input>

          <div>
            <label class="block text-xs font-semibold text-[#1c1c1c] mb-1.5 ml-1">Descripción</label>
            <textarea
              formControlName="description"
              rows="2"
              placeholder="Descripción opcional de esta cuenta..."
              class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-[#1c1c1c] text-sm focus:outline-none focus:border-[#094c42] transition-all resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-[#1c1c1c] mb-1.5 ml-1">Saldo Disponible</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm font-semibold">$</span>
                <input
                  type="number"
                  formControlName="available"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  class="w-full pl-8 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-[#1c1c1c] text-sm focus:outline-none focus:border-[#094c42] transition-all"
                />
              </div>
            </div>

            <!-- Tags field -->
            <div>
              <label class="block text-xs font-semibold text-[#1c1c1c] mb-1.5 ml-1">Etiquetas</label>
              <input
                type="text"
                [value]="tagsInput()"
                (input)="onTagsInput($event)"
                placeholder="ahorro, cripto, emergencia..."
                class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-[#1c1c1c] text-sm focus:outline-none focus:border-[#094c42] transition-all"
              />
              <p class="text-[10px] text-[#6b7280] mt-1 ml-1">Separa con comas</p>
            </div>
          </div>

          <!-- === DEBIT SPECIFIC === -->
          @if (selectedType() === 'debit') {
            <div class="p-4 rounded-2xl bg-[#e8f4ec]/50 border border-[#094c42]/20">
              <h4 class="text-xs font-bold text-[#094c42] uppercase tracking-wide mb-3">Configuración de Débito</h4>
              <div>
                <label class="block text-xs font-semibold text-[#1c1c1c] mb-1.5 ml-1">Meta de ahorro (opcional)</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm font-semibold">$</span>
                  <input
                    type="number"
                    formControlName="goal"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    class="w-full pl-8 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-[#1c1c1c] text-sm focus:outline-none focus:border-[#094c42] transition-all"
                  />
                </div>
              </div>
            </div>
          }

          <!-- === CREDIT SPECIFIC === -->
          @if (selectedType() === 'credit') {
            <div class="p-4 rounded-2xl bg-[#fde8e8]/50 border border-[#dc2626]/20">
              <h4 class="text-xs font-bold text-[#dc2626] uppercase tracking-wide mb-3">Configuración de Crédito</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-[#1c1c1c] mb-1.5 ml-1">Deuda actual</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm font-semibold">$</span>
                    <input
                      type="number"
                      formControlName="currentDebt"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      class="w-full pl-8 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-[#1c1c1c] text-sm focus:outline-none focus:border-[#dc2626] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-[#1c1c1c] mb-1.5 ml-1">Límite de crédito</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm font-semibold">$</span>
                    <input
                      type="number"
                      formControlName="creditLimit"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      class="w-full pl-8 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-[#1c1c1c] text-sm focus:outline-none focus:border-[#dc2626] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- === ASSET SPECIFIC === -->
          @if (selectedType() === 'asset') {
            <div class="p-4 rounded-2xl bg-[#fef9c3]/50 border border-[#d97706]/20">
              <h4 class="text-xs font-bold text-[#d97706] uppercase tracking-wide mb-3">Configuración de Activo</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-[#1c1c1c] mb-1.5 ml-1">Nombre del Activo *</label>
                  <input
                    type="text"
                    formControlName="asset"
                    placeholder="Ej. BTC, ETH, AAPL, Apartamento..."
                    class="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 text-[#1c1c1c] text-sm focus:outline-none focus:border-[#d97706] transition-all"
                    [class.border-red-400]="form.get('asset')?.invalid && form.get('asset')?.touched"
                  />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-[#1c1c1c] mb-1.5 ml-1">Costo promedio *</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm font-semibold">$</span>
                      <input
                        type="number"
                        formControlName="averageCost"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        class="w-full pl-8 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-[#1c1c1c] text-sm focus:outline-none focus:border-[#d97706] transition-all"
                        [class.border-red-400]="form.get('averageCost')?.invalid && form.get('averageCost')?.touched"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-[#1c1c1c] mb-1.5 ml-1">Precio actual</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm font-semibold">$</span>
                      <input
                        type="number"
                        formControlName="currentPrice"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        class="w-full pl-8 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-[#1c1c1c] text-sm focus:outline-none focus:border-[#d97706] transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-[#1c1c1c] mb-1.5 ml-1">Meta (opcional)</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm font-semibold">$</span>
                      <input
                        type="number"
                        formControlName="goal"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        class="w-full pl-8 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-[#1c1c1c] text-sm focus:outline-none focus:border-[#d97706] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Appearance Section -->
          <div class="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <h4 class="text-xs font-bold text-[#6b7280] uppercase tracking-wide mb-3">Apariencia</h4>
            <div class="space-y-4" formGroupName="config">

              <!-- Color Picker -->
              <div>
                <label class="block text-xs font-semibold text-[#1c1c1c] mb-2 ml-1">Color</label>
                <div class="flex flex-wrap gap-2">
                  @for (color of colorPresets; track color) {
                    <button
                      type="button"
                      (click)="setColor(color)"
                      class="w-8 h-8 rounded-full border-2 transition-all"
                      [style.background-color]="color"
                      [class.border-white]="form.get('config.color')?.value !== color"
                      [class.border-gray-800]="form.get('config.color')?.value === color"
                      [class.scale-110]="form.get('config.color')?.value === color"
                      [class.shadow-md]="form.get('config.color')?.value === color"
                    ></button>
                  }
                  <!-- Custom color input -->
                  <label class="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-all">
                    <mat-icon class="!w-4 !h-4 !text-[14px] text-gray-400">colorize</mat-icon>
                    <input
                      type="color"
                      formControlName="color"
                      class="sr-only"
                    />
                  </label>
                </div>
              </div>

              <!-- Icon Picker -->
              <div>
                <label class="block text-xs font-semibold text-[#1c1c1c] mb-2 ml-1">Ícono</label>
                <div class="flex flex-wrap gap-2">
                  @for (icon of iconPresets; track icon) {
                    <button
                      type="button"
                      (click)="setIcon(icon)"
                      class="w-9 h-9 rounded-xl border transition-all flex items-center justify-center"
                      [class.border-[#094c42]]="form.get('config.icon')?.value === icon"
                      [class.bg-[#e8f4ec]]="form.get('config.icon')?.value === icon"
                      [class.text-[#094c42]]="form.get('config.icon')?.value === icon"
                      [class.border-gray-200]="form.get('config.icon')?.value !== icon"
                      [class.bg-white]="form.get('config.icon')?.value !== icon"
                      [class.text-[#6b7280]]="form.get('config.icon')?.value !== icon"
                    >
                      <mat-icon class="!w-5 !h-5 !text-[18px]">{{ icon }}</mat-icon>
                    </button>
                  }
                </div>
              </div>

              <!-- Toggles -->
              <div class="flex flex-wrap gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <div
                    class="w-10 h-5 rounded-full relative transition-colors cursor-pointer"
                    [class.bg-[#094c42]]="form.get('config.visible')?.value"
                    [class.bg-gray-300]="!form.get('config.visible')?.value"
                    (click)="toggleVisible()"
                  >
                    <div
                      class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                      [class.translate-x-5]="form.get('config.visible')?.value"
                      [class.translate-x-0.5]="!form.get('config.visible')?.value"
                    ></div>
                  </div>
                  <span class="text-xs font-semibold text-[#1c1c1c]">Visible</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer">
                  <div
                    class="w-10 h-5 rounded-full relative transition-colors cursor-pointer"
                    [class.bg-[#094c42]]="form.get('config.includedInNetSum')?.value"
                    [class.bg-gray-300]="!form.get('config.includedInNetSum')?.value"
                    (click)="toggleIncludedInNetSum()"
                  >
                    <div
                      class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                      [class.translate-x-5]="form.get('config.includedInNetSum')?.value"
                      [class.translate-x-0.5]="!form.get('config.includedInNetSum')?.value"
                    ></div>
                  </div>
                  <span class="text-xs font-semibold text-[#1c1c1c]">Incluir en suma neta</span>
                </label>
              </div>

              <!-- Group -->
              <div>
                <label class="block text-xs font-semibold text-[#1c1c1c] mb-1.5 ml-1">Grupo (opcional)</label>
                <input
                  type="text"
                  formControlName="group"
                  placeholder="Ej. principal, inversiones, pasivos..."
                  class="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 text-[#1c1c1c] text-sm focus:outline-none focus:border-[#094c42] transition-all"
                />
              </div>
            </div>
          </div>

          <!-- Validation error -->
          @if (validationError()) {
            <div class="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
              <mat-icon class="!w-4 !h-4 !text-[16px]">error_outline</mat-icon>
              {{ validationError() }}
            </div>
          }

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-5 border-t border-gray-100">
            <a
              [routerLink]="['/wallets', walletId()]"
              class="px-6 py-3 rounded-2xl text-sm font-semibold text-[#6b7280] hover:text-[#1c1c1c] transition-colors"
            >
              Cancelar
            </a>

            <app-button
              type="submit"
              variant="primary"
              size="lg"
              [disabled]="isSubmitting()"
            >
              @if (isSubmitting()) {
                <mat-spinner diameter="20" class="inline-block"></mat-spinner>
                <span>Guardando...</span>
              } @else {
                <span>Crear Cuenta</span>
                <mat-icon class="!w-5 !h-5 !text-[20px]">arrow_forward</mat-icon>
              }
            </app-button>
          </div>
        </form>
      </app-base-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAccountComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly accountHttp = inject(AccountHttpService);
  private readonly accountStore = inject(AccountStoreService);
  private readonly snackBar = inject(MatSnackBar);

  readonly colorPresets = COLOR_PRESETS;
  readonly iconPresets = ICON_PRESETS;

  readonly walletId = signal('');
  readonly selectedType = signal<AccountType>('debit');
  readonly isSubmitting = signal(false);
  readonly tagsInput = signal('');
  readonly validationError = signal('');

  readonly previewBgColor = computed(() => {
    const color = this.form.get('config.color')?.value || '#094c42';
    return color + '22'; // Add transparency
  });

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    available: [0],
    // Debit / Asset shared
    goal: [null as number | null],
    // Credit
    currentDebt: [null as number | null],
    creditLimit: [null as number | null],
    // Asset
    asset: [''],
    currentPrice: [null as number | null],
    averageCost: [null as number | null],
    // Config
    config: this.fb.group({
      color: ['#094c42'],
      icon: ['account_balance'],
      visible: [true],
      image: [null as string | null],
      includedInNetSum: [true],
      group: ['default']
    })
  });

  get nameControl() { return this.form.get('name') as any; }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('walletId');
    if (!id) {
      this.router.navigate(['/wallets']);
      return;
    }
    this.walletId.set(id);
  }

  setAccountType(type: AccountType) {
    this.selectedType.set(type);
    this.validationError.set('');

    // Update icon to type default
    const iconMap: Record<AccountType, string> = {
      debit: 'account_balance',
      credit: 'credit_card',
      asset: 'trending_up'
    };
    const colorMap: Record<AccountType, string> = {
      debit: '#094c42',
      credit: '#dc2626',
      asset: '#d97706'
    };
    this.form.patchValue({
      config: {
        icon: iconMap[type],
        color: colorMap[type]
      }
    });
  }

  setColor(color: string) {
    this.form.get('config.color')?.setValue(color);
  }

  setIcon(icon: string) {
    this.form.get('config.icon')?.setValue(icon);
  }

  toggleVisible() {
    const current = this.form.get('config.visible')?.value;
    this.form.get('config.visible')?.setValue(!current);
  }

  toggleIncludedInNetSum() {
    const current = this.form.get('config.includedInNetSum')?.value;
    this.form.get('config.includedInNetSum')?.setValue(!current);
  }

  onTagsInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.tagsInput.set(val);
  }

  parseTags(): string[] {
    return this.tagsInput()
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
  }

  validate(): boolean {
    if (this.form.invalid) {
      this.validationError.set('Por favor completa el nombre de la cuenta.');
      return false;
    }

    const type = this.selectedType();
    if (type === 'asset') {
      if (!this.form.value.asset?.trim()) {
        this.validationError.set('El nombre del activo es requerido para cuentas de tipo Activo.');
        return false;
      }
      if (this.form.value.averageCost == null) {
        this.validationError.set('El costo promedio es requerido para cuentas de tipo Activo.');
        return false;
      }
    }

    this.validationError.set('');
    return true;
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.validate()) return;

    this.isSubmitting.set(true);

    const val = this.form.value;
    const configRaw = val.config as any;
    const config: AccountConfig = {
      color: configRaw.color,
      icon: configRaw.icon,
      visible: configRaw.visible,
      image: configRaw.image ?? undefined,
      includedInNetSum: configRaw.includedInNetSum,
      group: configRaw.group
    };

    const payload: any = {
      name: val.name,
      description: val.description || undefined,
      type: this.selectedType(),
      available: val.available ?? 0,
      tags: this.parseTags(),
      config
    };

    if (this.selectedType() === 'debit') {
      if (val.goal != null) payload.goal = val.goal;
    } else if (this.selectedType() === 'credit') {
      if (val.currentDebt != null) payload.currentDebt = val.currentDebt;
      if (val.creditLimit != null) payload.creditLimit = val.creditLimit;
    } else if (this.selectedType() === 'asset') {
      payload.asset = val.asset;
      payload.averageCost = val.averageCost;
      if (val.currentPrice != null) payload.currentPrice = val.currentPrice;
      if (val.goal != null) payload.goal = val.goal;
    }

    this.accountHttp.createAccount(this.walletId(), payload).subscribe({
      next: (created) => {
        this.isSubmitting.set(false);
        const summary = {
          id: (created as any)?.id || 'acc-' + Date.now(),
          name: created.name,
          description: created.description,
          type: created.type,
          available: created.available,
          tags: created.tags,
          accountConfig: created.accountConfig
        };
        // Pass walletId so the account is persisted to sessionStorage
        this.accountStore.addAccount(summary, this.walletId());
        this.snackBar.open('Cuenta creada exitosamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/wallets', this.walletId()]);
      },
      error: () => {
        // Optimistic fallback: persist locally and navigate back
        this.isSubmitting.set(false);
        const fallback: any = {
          id: 'acc-' + Date.now(),
          name: val.name!,
          description: val.description || undefined,
          type: this.selectedType(),
          available: val.available ?? 0,
          tags: this.parseTags(),
          accountConfig: config
        };
        // Pass walletId so the account is persisted to sessionStorage
        this.accountStore.addAccount(fallback, this.walletId());
        this.snackBar.open('Cuenta guardada localmente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/wallets', this.walletId()]);
      }
    });
  }
}
