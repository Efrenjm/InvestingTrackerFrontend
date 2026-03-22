# Spec: EduFinances Modular Dashboard Design

**Date:** 2026-03-22  
**Status:** Draft  
**Topic:** Dashboard UI/UX Refactor and Modularity

---

## 1. Goal
Implement a high-fidelity, polished dashboard inspired by the "EduFinances" Figma design. The new UI will replace the current sidebar-based navigation with a modern top-navigation layout and provide a modular dashboard where users can toggle the visibility of specific information cards.

## 2. Design Constraints & Standards
- **Framework:** Angular 22+ (Signals-first, Standalone Components).
- **Styling:** Tailwind CSS 4 (Vanilla CSS for custom Figma tokens).
- **Accessibility:** Must pass WCAG AA (Contrast, Aria-labels, Focus management).
- **Responsiveness:** Mobile-first, Grid-based (12 columns).
- **Architecture:** Clean Architecture (Separation of UI, Logic, and State).

## 3. Architecture & Components

### 3.1. Navigation (NavbarComponent)
- **Position:** Fixed at the top.
- **Branding:** Logo + "EduFinances" (ExtraBold Inter).
- **Nav Links:** Inicio (Active), Cuentas, Presupuestos, Informes, Metas.
- **User Actions:** Search Bar (rounded), Notifications (badge), User Profile (Avatar + Name).

### 3.2. Dashboard Layout
- **Container:** `max-w-7xl mx-auto` with `bg-[#f6f7f5]` and `rounded-[32px]`.
- **Main Grid:** `grid grid-cols-1 lg:grid-cols-12 gap-6`.
- **Left Column (8/12):**
  - `ProgressCard`: Large hero card for saving progress (78%).
  - `AccountsGrid`: A title ("Mis Cuentas de un Vistazo") followed by a horizontal grid of `StatCard`s.
- **Right Column (4/12):**
  - `BudgetControlCard`: Circular progress indicators.
  - `PaymentCalendarCard`: List of upcoming payments.
  - `InvestmentPerformanceCard`: Linear progress bars for performance.

### 3.3. Reusable UI Components
- **BaseCard:** Wrapper component for all cards with consistent padding (`p-6`), rounding (`rounded-[24px]`), and shadow.
- **StatCard:** Input-based component for account balances.
  - Inputs: `title`, `amount`, `currency`, `bgColor`, `icon`.

## 4. State Management (Signals)

### 4.1. DashboardConfigService
A singleton service to manage dashboard state.
- **State:** `dashboardSettings = signal<DashboardSettings>(defaultSettings)`.
- **Persistence:** Sync with `LocalStorage` on every change.
- **Actions:** `toggleCard(cardKey: keyof DashboardSettings)`.

```typescript
interface DashboardSettings {
  showProgress: boolean;
  showAccounts: boolean;
  showBudgets: boolean;
  showPayments: boolean;
  showInvestments: boolean;
}
```

## 5. UI/UX Refinement (Figma Tokens)
- **Colors:**
  - `primary-dark`: `#094c42` (Buttons, Active states).
  - `bg-main`: `#fbf9f6` (Body background).
  - `bg-container`: `#f6f7f5` (Inner dashboard container).
  - `card-green`: `#e8f4ec`.
  - `card-yellow`: `#fef9c3`.
  - `card-purple`: `#f3e8ff`.
- **Typography:** Inter (Regular, Medium, SemiBold, Bold, ExtraBold).

## 6. Implementation Strategy
1. **Define Tokens:** Update `styles.css` or Tailwind config with EduFinances colors.
2. **Layout Overhaul:** Create `NavbarComponent` and update `DashboardLayoutComponent`.
3. **Card Components:** Implement `BaseCard` and specific card components one by one.
4. **State Logic:** Implement `DashboardConfigService` and the toggle UI (e.g., a "Settings" modal or dropdown).
5. **Dashboard Assembly:** Assemble the grid in `DashboardComponent` using `@if` blocks.

## 7. Success Criteria
- The visual result matches the Figma mockup with >95% fidelity.
- All cards can be shown/hidden via state.
- The layout is responsive and usable on mobile (stacking cards).
- Animations are smooth (using `@defer` or simple CSS transitions).
