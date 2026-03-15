# Authentication Frontend Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, modern authentication frontend using Angular 21, including registration, 6-digit OTP verification, and session management with HttpOnly cookies, persisting non-sensitive data in IndexedDB.

**Architecture:** Clean architecture with separate layers for HTTP (`AuthHttpService`), State (`AuthStoreService`), and Persistence (`IndexedDbService`). Uses Standalone Components, Signals, and Functional Interceptors.

**Tech Stack:** Angular 21, Tailwind CSS, Angular Material, TypeScript, IndexedDB, Storybook, Service Workers (PWA).

---

## Chunk 1: Project Setup & Core Infrastructure

### Task 1: Initialize Angular Project & Style
**Files:**
- Create: `package.json`, `angular.json`, etc. (via CLI)
- Create: `tailwind.config.js`
- Modify: `src/styles.css`
- Modify: `src/app/app.config.ts`

- [ ] **Step 1: Initialize Angular 21 Project**
Run: `npx -p @angular/cli@next ng new investing-tracker-frontend --style=css --routing --standalone --package-manager=npm --inline-template --inline-style`
*Note: Move files to root if `ng new` creates a subfolder.*

- [ ] **Step 2: Install Dependencies & PWA**
Run: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`
Run: `ng add @angular/material --skip-confirmation`
Run: `ng add @angular/pwa --skip-confirmation`

- [ ] **Step 3: Configure Tailwind**
Modify `tailwind.config.js` to include Angular paths.
Modify `src/styles.css` to add `@tailwind base; @tailwind components; @tailwind utilities;`.

- [ ] **Step 4: Install Storybook**
Run: `npx storybook@latest init`

- [ ] **Step 5: Create Folder Structure**
Run: `mkdir -p src/app/core/services src/app/core/interceptors src/app/core/guards src/app/core/models src/app/shared/components src/app/shared/layouts src/app/features/auth/docs`

- [ ] **Step 6: Configure Providers in `app.config.ts`**
Add `provideHttpClient()` and prepare for interceptors.

- [ ] **Step 7: Commit**
```bash
git add .
git commit -m "chore: initial angular 21 project setup with tailwind, material, pwa and storybook"
```

### Task 2: Implement IndexedDB Service (Core)
**Files:**
- Create: `src/app/core/services/indexed-db.service.ts`

- [ ] **Step 1: Implement IndexedDB Service** (Native API) to store user metadata and preferences.
- [ ] **Step 2: Commit**

---

## Chunk 2: Auth Infrastructure & Shared Components

### Task 3: Auth Models & Interceptors
**Files:**
- Create: `src/app/core/models/auth.models.ts`
- Create: `src/app/core/interceptors/auth.interceptor.ts`
- Create: `src/app/core/interceptors/error.interceptor.ts`
- Modify: `src/app/app.config.ts`

- [ ] **Step 1: Define TypeScript interfaces** (`User`, `AuthResponse`, `RegisterRequest`, etc.)
- [ ] **Step 2: Implement AuthInterceptor** (Functional) to add `withCredentials: true`.
- [ ] **Step 3: Implement ErrorInterceptor** (Functional) to handle 401/403 redirects.
- [ ] **Step 4: Register Interceptors in `app.config.ts`**.
- [ ] **Step 5: Commit**

### Task 4: Auth Services & Guard
**Files:**
- Create: `src/app/core/services/auth-http.service.ts`
- Create: `src/app/core/services/auth-store.service.ts`
- Create: `src/app/core/guards/auth.guard.ts`

- [ ] **Step 1: Implement AuthHttpService** for backend communication.
- [ ] **Step 2: Implement AuthStoreService** with `currentUser` signal and `isAuthenticated` computed.
- [ ] **Step 3: Implement AuthGuard** (Functional) based on `AuthStoreService`.
- [ ] **Step 4: Commit**

### Task 5: Shared UI Components (Storybook)
**Files:**
- Create: `src/app/shared/components/input/input.component.ts`
- Create: `src/app/shared/components/input/input.stories.ts`
- Create: `src/app/shared/components/button/button.component.ts`
- Create: `src/app/shared/components/button/button.stories.ts`

- [ ] **Step 1: Implement InputComponent** with `ControlValueAccessor`.
- [ ] **Step 2: Create Storybook story for Input**.
- [ ] **Step 3: Implement ButtonComponent** with variants and loading state.
- [ ] **Step 4: Create Storybook story for Button**.
- [ ] **Step 5: Commit**

---

## Chunk 3: Auth Features & Documentation

### Task 6: Auth Layout & Routing
**Files:**
- Create: `src/app/shared/layouts/auth-layout/auth-layout.component.ts`
- Create: `src/app/features/auth/auth-routing.ts`
- Modify: `src/app/app.routes.ts`

- [ ] **Step 1: Implement AuthLayoutComponent** with `<ng-content>`.
- [ ] **Step 2: Configure Auth Routes** in `auth-routing.ts`.
- [ ] **Step 3: Lazy load auth routes** in `app.routes.ts`.
- [ ] **Step 4: Commit**

### Task 7: Login, Register & OTP Components
**Files:**
- Create: `src/app/features/auth/login/login.component.ts`
- Create: `src/app/features/auth/register/register.component.ts`
- Create: `src/app/features/auth/otp-verify/otp-verify.component.ts`

- [ ] **Step 1: Implement LoginComponent**.
- [ ] **Step 2: Implement RegisterComponent**.
- [ ] **Step 3: Implement OtpVerifyComponent** with countdown and resend logic.
- [ ] **Step 4: Commit**

### Task 8: Documentation & Final Cleanup
**Files:**
- Create: `src/app/features/auth/docs/README.md`
- Create: `docs/ARCHITECTURE.md`
- Modify: `README.md`

- [ ] **Step 1: Write feature and architecture documentation**.
- [ ] **Step 2: Final Commit**
