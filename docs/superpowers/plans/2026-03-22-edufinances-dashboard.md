# EduFinances Modular Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a modular, high-fidelity dashboard based on the EduFinances Figma design using Angular 22 Signals and a top-navigation layout.

**Architecture:** Signals-based state management for dashboard configuration, grid-based responsive layout, and a suite of reusable presentational components for data visualization.

**Tech Stack:** Angular 22, Tailwind CSS 4, Lucide Icons (or SVG equivalents from Figma).

---

### Task 1: Define Figma Design Tokens

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Add CSS variables for EduFinances palette**

```css
:root {
  --primary-dark: #094c42;
  --bg-main: #fbf9f6;
  --bg-container: #f6f7f5;
  --card-green: #e8f4ec;
  --card-yellow: #fef9c3;
  --card-purple: #f3e8ff;
  --card-red: #fee2e2;
  --text-main: #1c1c1c;
  --text-muted: #6b7280;
}
```

- [ ] **Step 2: Commit changes**

```bash
git add src/styles.css
git commit -m "style: define EduFinances design tokens"
```

### Task 2: Create BaseCard Component

**Files:**
- Create: `src/app/shared/components/card/base-card.component.ts`

- [ ] **Step 1: Generate and implement BaseCard**

```typescript
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-base-card',
  standalone: true,
  template: `
    <div [class]="'bg-white rounded-[24px] p-6 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.02)] ' + class()">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseCardComponent {
  class = input<string>('');
}
```

- [ ] **Step 2: Commit changes**

```bash
git add src/app/shared/components/card/base-card.component.ts
git commit -m "feat: add BaseCard shared component"
```

### Task 3: Create StatCard Component

**Files:**
- Create: `src/app/shared/components/card/stat-card.component.ts`

- [ ] **Step 1: Implement StatCard with Figma styling**

```typescript
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div [class]="'rounded-[20px] p-5 flex flex-col ' + bgColor()">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
            <ng-content select="[icon]"></ng-content>
          </div>
          <span class="font-semibold text-[#1c1c1c] text-[15px]">{{ title() }}</span>
        </div>
      </div>
      <div class="text-[24px] font-black text-[#1c1c1c] mb-1">{{ amount() }}</div>
      <div class="text-[12px] font-medium text-[#6b7280]">{{ currency() }}</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  title = input.required<string>();
  amount = input.required<string>();
  currency = input.required<string>();
  bgColor = input<string>('bg-white');
}
```

- [ ] **Step 2: Commit changes**

```bash
git add src/app/shared/components/card/stat-card.component.ts
git commit -m "feat: add StatCard shared component"
```

### Task 4: Implement DashboardConfigService

**Files:**
- Create: `src/app/core/services/dashboard-config.service.ts`

- [ ] **Step 1: Create visibility service using Signals**

```typescript
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
```

- [ ] **Step 2: Commit changes**

```bash
git add src/app/core/services/dashboard-config.service.ts
git commit -m "feat: add DashboardConfigService for modularity"
```

### Task 5: Implement NavbarComponent

**Files:**
- Create: `src/app/shared/components/navbar/navbar.component.ts`

- [ ] **Step 1: Implement Navbar with Figma styling**

```typescript
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStoreService } from '../../../core/services/auth-store.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="flex items-center justify-between px-10 py-6 bg-[#f6f7f5]">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-[#094c42] rounded-lg"></div>
        <span class="text-[22px] font-black text-[#1c1c1c]">EduFinances</span>
      </div>
      
      <div class="flex items-center gap-8 text-[14px] font-medium text-[#6b7280]">
        <a routerLink="/dashboard" routerLinkActive="text-[#1c1c1c] font-bold" class="hover:text-[#1c1c1c] transition-colors">Inicio</a>
        <a routerLink="/accounts" routerLinkActive="text-[#1c1c1c] font-bold" class="hover:text-[#1c1c1c] transition-colors">Cuentas</a>
        <a routerLink="/budgets" routerLinkActive="text-[#1c1c1c] font-bold" class="hover:text-[#1c1c1c] transition-colors">Presupuestos</a>
        <a routerLink="/reports" routerLinkActive="text-[#1c1c1c] font-bold" class="hover:text-[#1c1c1c] transition-colors">Informes</a>
      </div>

      <div class="flex items-center gap-4">
        <div class="bg-white rounded-full p-2 shadow-sm border border-gray-100">
           <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" /></svg>
        </div>
        <div class="flex items-center gap-3 border-l pl-4 border-gray-200">
          <div class="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            <img [src]="user()?.avatarUrl || 'assets/default-avatar.png'" alt="User profile">
          </div>
          <div class="flex flex-col">
            <span class="text-[14px] font-semibold text-[#1c1c1c] leading-tight">{{ user()?.firstName }}</span>
            <span class="text-[14px] font-semibold text-[#1c1c1c] leading-tight">{{ user()?.lastName }}</span>
          </div>
        </div>
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private readonly authStore = inject(AuthStoreService);
  user = this.authStore.user;
}
```

- [ ] **Step 2: Commit changes**

```bash
git add src/app/shared/components/navbar/navbar.component.ts
git commit -m "feat: add top NavbarComponent"
```

### Task 6: Overhaul Dashboard Layout

**Files:**
- Modify: `src/app/shared/layouts/dashboard-layout/dashboard-layout.component.ts`

- [ ] **Step 1: Replace Sidebar with Navbar and update container styling**

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-[#fbf9f6] flex flex-col font-sans">
      <app-navbar></app-navbar>
      <main class="flex-1 p-4 md:p-8">
        <div class="max-w-7xl mx-auto bg-[#f6f7f5] rounded-[32px] p-8 shadow-[0px_20px_40px_0px_rgba(0,0,0,0.04)] min-h-[85vh]">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayoutComponent {}
```

- [ ] **Step 2: Commit changes**

```bash
git add src/app/shared/layouts/dashboard-layout/dashboard-layout.component.ts
git commit -m "refactor: overhaul DashboardLayout to match EduFinances"
```

### Task 7: Implement Dashboard Cards

**Files:**
- Create: `src/app/features/dashboard/components/progress-card/progress-card.component.ts`
- Create: `src/app/features/dashboard/components/budget-card/budget-card.component.ts`
- Create: `src/app/features/dashboard/components/payment-calendar/payment-calendar.component.ts`

- [ ] **Step 1: Implement ProgressCardComponent**

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseCardComponent } from '../../../../shared/components/card/base-card.component';

@Component({
  selector: 'app-progress-card',
  standalone: true,
  imports: [BaseCardComponent],
  template: `
    <app-base-card>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-[20px] font-bold text-[#1c1c1c]">Tu Progreso de Ahorro</h2>
        <button class="bg-[#094c42] text-white px-5 py-2.5 rounded-[20px] text-sm font-semibold">Request Demo</button>
      </div>
      <div class="flex items-end justify-between mb-8">
        <div>
          <div class="text-[56px] font-black text-[#1c1c1c] leading-none">78%</div>
          <div class="text-[14px] font-medium text-[#6b7280] mt-2">Balance de ahorro</div>
        </div>
        <!-- Simplified Dots for Figma visuals -->
        <div class="flex gap-6">
          <div class="flex flex-col items-center text-center">
            <div class="w-9 h-9 bg-[#e8f4ec] rounded-full flex items-center justify-center mb-2">✓</div>
            <span class="text-[13px] font-semibold leading-tight">Meta<br>Alcanzada</span>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-9 h-9 bg-[#fef9c3] rounded-full flex items-center justify-center mb-2">!</div>
            <span class="text-[13px] font-semibold leading-tight">Lessons<br>Meta</span>
          </div>
        </div>
      </div>
      <div class="h-[200px] bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400">
        Saving Graph Placeholder
      </div>
    </app-base-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressCardComponent {}
```

- [ ] **Step 2: Commit changes**

```bash
git add src/app/features/dashboard/components/progress-card/progress-card.component.ts
git commit -m "feat: add ProgressCardComponent"
```

### Task 8: Final Dashboard Assembly

**Files:**
- Modify: `src/app/features/dashboard/dashboard.component.ts`

- [ ] **Step 1: Assemble modular dashboard with grid layout**

```typescript
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardConfigService } from '../../core/services/dashboard-config.service';
import { ProgressCardComponent } from './components/progress-card/progress-card.component';
import { StatCardComponent } from '../../shared/components/card/stat-card.component';
import { BudgetCardComponent } from './components/budget-card/budget-card.component'; // Needs creation
import { PaymentCalendarComponent } from './components/payment-calendar/payment-calendar.component'; // Needs creation

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ProgressCardComponent, StatCardComponent], // Add others
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Content -->
      <div class="lg:col-span-8 space-y-8">
        @if (settings().showProgress) {
          <app-progress-card />
        }

        @if (settings().showAccounts) {
          <div>
            <h3 class="text-[20px] font-bold text-[#1c1c1c] mb-4">Mis Cuentas de un Vistazo</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <app-stat-card title="Corriente" amount="$1,845.93" currency="€ USD" bgColor="bg-[#e8f4ec]" />
              <app-stat-card title="Ahorros" amount="$3,36.00" currency="€ USD" bgColor="bg-[#fef9c3]" />
              <app-stat-card title="Tarjeta" amount="$300,83" currency="$ USD" bgColor="bg-[#f3e8ff]" />
            </div>
          </div>
        }
      </div>

      <!-- Right Content -->
      <div class="lg:col-span-4 space-y-6">
        @if (settings().showBudgets) {
          <div class="bg-white rounded-[24px] p-6 shadow-sm">
             <h3 class="text-[20px] font-bold text-[#1c1c1c] mb-6">Control de Presupuestos</h3>
             <!-- Budget implementation -->
          </div>
        }
        
        @if (settings().showPayments) {
          <div class="bg-white rounded-[24px] p-6 shadow-sm">
             <h3 class="text-[20px] font-bold text-[#1c1c1c] mb-6">Calendario de Pagos</h3>
             <!-- Payments implementation -->
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly configService = inject(DashboardConfigService);
  settings = this.configService.settings;
}
```

- [ ] **Step 2: Commit changes**

```bash
git add src/app/features/dashboard/dashboard.component.ts
git commit -m "feat: implement modular dashboard assembly"
```
