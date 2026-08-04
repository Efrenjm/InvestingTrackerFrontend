import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-routing').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'wallets',
        loadChildren: () => import('./features/wallets/wallets-routing').then(m => m.WALLET_ROUTES)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
