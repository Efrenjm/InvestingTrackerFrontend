import { describe, it, expect, beforeEach } from 'vitest';
import { WalletStoreService } from './wallet-store.service';
import { Visibility, Wallet, WalletSummary } from '../models/wallet.models';

describe('WalletStoreService', () => {
  let service: WalletStoreService;

  beforeEach(() => {
    service = new WalletStoreService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should manage wallets state via signals', () => {
    const summary: WalletSummary = { id: 'w1', name: 'My Wallet' };

    expect(service.wallets().length).toBe(0);

    service.setWallets([summary]);
    expect(service.wallets().length).toBe(1);
    expect(service.wallets()[0].name).toBe('My Wallet');

    service.addWallet({ id: 'w2', name: 'Second Wallet' });
    expect(service.wallets().length).toBe(2);

    service.removeWallet('w1');
    expect(service.wallets().length).toBe(1);
    expect(service.wallets()[0].id).toBe('w2');
  });

  it('should manage active wallet state', () => {
    const wallet: Wallet = { id: 'w1', name: 'Active Wallet', visibility: Visibility.PRIVATE };

    expect(service.activeWallet()).toBeNull();

    service.setActiveWallet(wallet);
    expect(service.activeWallet()?.id).toBe('w1');

    service.removeWallet('w1');
    expect(service.activeWallet()).toBeNull();
  });
});
