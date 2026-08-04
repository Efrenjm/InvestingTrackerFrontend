import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BaseCardComponent } from '../../../shared/components/card/base-card.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { WalletHttpService } from '../../../core/services/wallet-http.service';
import { WalletStoreService } from '../../../core/services/wallet-store.service';
import { Visibility } from '../../../core/models/wallet.models';

@Component({
  selector: 'app-create-wallet',
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
          routerLink="/dashboard"
          class="inline-flex items-center gap-2 text-sm font-semibold text-[#6b7280] hover:text-[#1c1c1c] transition-colors"
        >
          <mat-icon class="!w-5 !h-5 !text-[20px]">arrow_back</mat-icon>
          <span>Volver al Dashboard</span>
        </a>

        <a
          routerLink="/wallets"
          class="text-xs font-semibold text-[#094c42] hover:underline"
        >
          Ver todas las billeteras
        </a>
      </div>

      <!-- Page Title Card -->
      <app-base-card>
        <div class="flex items-center gap-4 pb-6 border-b border-gray-100 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-[#e8f4ec] flex items-center justify-center text-[#094c42]">
            <mat-icon class="!w-6 !h-6 !text-[24px]">account_balance_wallet</mat-icon>
          </div>
          <div>
            <h1 class="text-[22px] font-bold text-[#1c1c1c]">Crear Nueva Billetera</h1>
            <p class="text-sm text-[#6b7280]">Configura un nuevo espacio financiero para administrar tus fondos o proyectos</p>
          </div>
        </div>

        <!-- Form -->
        <form [formGroup]="walletForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Wallet Name Input -->
          <app-input
            label="Nombre de la Billetera"
            placeholder="Ej. Fondo de Emergencia, Inversiones Cripto, Viajes"
            icon="account_balance_wallet"
            [control]="nameControl"
          ></app-input>

          <!-- Description Textarea -->
          <div>
            <label class="block text-xs font-semibold text-[#1c1c1c] mb-1.5 ml-1">Descripción</label>
            <textarea
              formControlName="description"
              rows="3"
              placeholder="Escribe una breve descripción del objetivo de esta billetera..."
              class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-[#1c1c1c] text-sm focus:outline-none focus:border-[#094c42] transition-all resize-none"
            ></textarea>
          </div>

          <!-- Visibility Selector -->
          <div>
            <label class="block text-xs font-semibold text-[#1c1c1c] mb-2 ml-1">Configuración de Visibilidad</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Private Option -->
              <button
                type="button"
                (click)="setVisibility(Visibility.PRIVATE)"
                [class]="visibility() === Visibility.PRIVATE ? 'border-[#094c42] bg-[#e8f4ec] text-[#094c42]' : 'border-gray-200 bg-gray-50 text-[#6b7280]'"
                class="p-4 rounded-2xl border text-left flex items-start gap-3 transition-all"
              >
                <mat-icon class="!w-5 !h-5 !text-[20px] mt-0.5">lock</mat-icon>
                <div>
                  <div class="text-sm font-bold">Privada</div>
                  <div class="text-xs opacity-80 mt-0.5">Solo tú tendrás acceso a esta billetera</div>
                </div>
              </button>

              <!-- Public/Shared Option -->
              <button
                type="button"
                (click)="setVisibility(Visibility.PUBLIC)"
                [class]="visibility() === Visibility.PUBLIC ? 'border-[#094c42] bg-[#e8f4ec] text-[#094c42]' : 'border-gray-200 bg-gray-50 text-[#6b7280]'"
                class="p-4 rounded-2xl border text-left flex items-start gap-3 transition-all"
              >
                <mat-icon class="!w-5 !h-5 !text-[20px] mt-0.5">group</mat-icon>
                <div>
                  <div class="text-sm font-bold">Compartida</div>
                  <div class="text-xs opacity-80 mt-0.5">Permite invitar miembros y colaboradores</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <a
              routerLink="/dashboard"
              class="px-6 py-3 rounded-2xl text-sm font-semibold text-[#6b7280] hover:text-[#1c1c1c] transition-colors"
            >
              Cancelar
            </a>

            <app-button
              type="submit"
              variant="primary"
              size="lg"
              [disabled]="walletForm.invalid || isLoading()"
            >
              @if (isLoading()) {
                <mat-spinner diameter="20" class="inline-block"></mat-spinner>
                <span>Guardando...</span>
              } @else {
                <span>Crear Billetera</span>
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
export class CreateWalletComponent {
  private readonly fb = inject(FormBuilder);
  private readonly walletHttp = inject(WalletHttpService);
  private readonly walletStore = inject(WalletStoreService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly isLoading = signal(false);
  readonly visibility = signal<Visibility>(Visibility.PRIVATE);
  readonly Visibility = Visibility;

  readonly walletForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  });

  get nameControl() { return this.walletForm.get('name') as any; }

  setVisibility(val: Visibility) {
    this.visibility.set(val);
  }

  onSubmit() {
    if (this.walletForm.invalid) return;

    this.isLoading.set(true);
    const { name, description } = this.walletForm.value;

    this.walletHttp.createWallet({
      name: name!,
      description: description || undefined,
      visibility: this.visibility()
    }).subscribe({
      next: (createdWallet) => {
        this.isLoading.set(false);
        this.snackBar.open('Billetera creada exitosamente', 'Cerrar', { duration: 3000 });
        
        const newSummary = {
          id: createdWallet?.id || Date.now().toString(),
          name: createdWallet?.name || name!,
          description: createdWallet?.description || description || ''
        };
        this.walletStore.addWallet(newSummary);

        this.router.navigate(['/wallets']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const fallbackSummary = {
          id: 'wallet-' + Date.now(),
          name: name!,
          description: description || ''
        };
        this.walletStore.addWallet(fallbackSummary);
        this.snackBar.open('Billetera creada en el frontend', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/wallets']);
      }
    });
  }
}
