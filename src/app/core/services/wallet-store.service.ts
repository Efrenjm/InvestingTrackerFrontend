import { Injectable, computed, signal } from '@angular/core';
import { Wallet, WalletSummary } from '../models/wallet.models';

@Injectable({
  providedIn: 'root'
})
export class WalletStoreService {
  private readonly _wallets = signal<WalletSummary[]>([]);
  private readonly _activeWallet = signal<Wallet | null>(null);
  private readonly _loading = signal<boolean>(false);

  readonly wallets = computed(() => this._wallets());
  readonly activeWallet = computed(() => this._activeWallet());
  readonly loading = computed(() => this._loading());

  setWallets(wallets: WalletSummary[]): void {
    this._wallets.set(wallets);
  }

  setActiveWallet(wallet: Wallet | null): void {
    this._activeWallet.set(wallet);
  }

  setLoading(isLoading: boolean): void {
    this._loading.set(isLoading);
  }

  addWallet(wallet: WalletSummary): void {
    this._wallets.update(current => [...current, wallet]);
  }

  removeWallet(id: string): void {
    this._wallets.update(current => current.filter(w => w.id !== id));
    if (this._activeWallet()?.id === id) {
      this._activeWallet.set(null);
    }
  }
}
