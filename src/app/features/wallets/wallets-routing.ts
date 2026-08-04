import { Routes } from '@angular/router';

export const WALLET_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./wallet-list/wallet-list.component').then(m => m.WalletListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./create-wallet/create-wallet.component').then(m => m.CreateWalletComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./wallet-detail/wallet-detail.component').then(m => m.WalletDetailComponent)
  },
  {
    path: ':walletId/accounts/new',
    loadComponent: () => import('./create-account/create-account.component').then(m => m.CreateAccountComponent)
  },
  {
    path: ':walletId/accounts/:accountId',
    loadComponent: () => import('./account-detail/account-detail.component').then(m => m.AccountDetailComponent)
  }
];
