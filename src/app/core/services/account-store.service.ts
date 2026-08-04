import { Injectable, computed, signal } from '@angular/core';
import { Account, AccountSummary } from '../models/account.models';

const SESSION_KEY_PREFIX = 'it_accounts_';

@Injectable({
  providedIn: 'root'
})
export class AccountStoreService {
  private readonly _accounts = signal<AccountSummary[]>([]);
  private readonly _activeAccount = signal<Account | null>(null);
  private readonly _currentWalletId = signal<string | null>(null);

  readonly accounts = computed(() => this._accounts());
  readonly activeAccount = computed(() => this._activeAccount());
  readonly currentWalletId = computed(() => this._currentWalletId());

  // ─── Local persistence via sessionStorage ──────────────────────────────────

  getLocalAccounts(walletId: string): AccountSummary[] {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY_PREFIX + walletId);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveLocalAccounts(walletId: string, accounts: AccountSummary[]): void {
    try {
      sessionStorage.setItem(SESSION_KEY_PREFIX + walletId, JSON.stringify(accounts));
    } catch { /* ignore */ }
  }

  private clearLocalAccounts(walletId: string): void {
    try {
      sessionStorage.removeItem(SESSION_KEY_PREFIX + walletId);
    } catch { /* ignore */ }
  }

  // ─── Store methods ──────────────────────────────────────────────────────────

  /** Load accounts for a wallet (merges backend + local persisted) */
  loadForWallet(walletId: string, backendAccounts: AccountSummary[] | null = null): void {
    const local = this.getLocalAccounts(walletId);

    if (backendAccounts && backendAccounts.length > 0) {
      // Backend has data: use it, clear local overrides
      this.clearLocalAccounts(walletId);
      this._accounts.set(backendAccounts);
    } else if (local.length > 0) {
      // No backend data: use locally-persisted accounts
      this._accounts.set(local);
    } else {
      this._accounts.set([]);
    }

    this._currentWalletId.set(walletId);
  }

  setCurrentWalletId(id: string): void {
    this._currentWalletId.set(id);
  }

  setAccounts(accounts: AccountSummary[]): void {
    this._accounts.set(accounts);
  }

  setActiveAccount(account: Account | null): void {
    this._activeAccount.set(account);
  }

  addAccount(account: AccountSummary, walletId?: string): void {
    this._accounts.update(current => [...current, account]);
    // Persist locally so it survives component recreation
    if (walletId) {
      const existing = this.getLocalAccounts(walletId);
      this.saveLocalAccounts(walletId, [...existing, account]);
    }
  }

  removeAccount(id: string): void {
    const walletId = this._currentWalletId();
    this._accounts.update(current => current.filter(a => a.id !== id));
    if (walletId) {
      const existing = this.getLocalAccounts(walletId);
      this.saveLocalAccounts(walletId, existing.filter(a => a.id !== id));
    }
    if (this._activeAccount()?.id === id) {
      this._activeAccount.set(null);
    }
  }

  clearAccounts(): void {
    this._accounts.set([]);
    this._activeAccount.set(null);
    this._currentWalletId.set(null);
  }
}
