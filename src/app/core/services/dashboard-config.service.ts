import { Injectable, signal, effect } from '@angular/core';

export interface DashboardSettings {
  showProgress: boolean;
  showAccounts: boolean;
  showBudgets: boolean;
  showPayments: boolean;
  showInvestments: boolean;
}

const STORAGE_KEY = 'dashboard_settings';

@Injectable({ providedIn: 'root' })
export class DashboardConfigService {
  private readonly defaultSettings: DashboardSettings = {
    showProgress: true,
    showAccounts: true,
    showBudgets: true,
    showPayments: true,
    showInvestments: true
  };

  settings = signal<DashboardSettings>(this.loadSettings());

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings()));
    });
  }

  private loadSettings(): DashboardSettings {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : this.defaultSettings;
  }

  toggleCard(key: keyof DashboardSettings) {
    this.settings.update(s => ({ ...s, [key]: !s[key] }));
  }
}
