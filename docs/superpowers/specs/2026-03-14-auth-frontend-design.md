# Design Spec: Authentication Frontend (Angular 21 + PWA)

**Date:** 2026-03-14  
**Status:** Approved  
**Topic:** Authentication Flow with OTP and HttpOnly Cookies  
**Stack:** Angular 21, Tailwind CSS, Angular Material, TypeScript, IndexedDB, Service Workers (Storybook)

---

## 1. Overview
Implementing the authentication frontend for a finance tracking application. The system integrates with a backend providing Register, OTP verification, and Session management via HttpOnly cookies.

## 2. Architecture & Project Structure

### 2.1 Folder Organization
- **`src/app/core/`**: Singletons and global logic.
  - `services/auth-http.service.ts`: HTTP communication with the backend.
  - `services/auth-store.service.ts`: Global state management using Signals.
  - `services/indexed-db.service.ts`: Persistent metadata storage.
  - `interceptors/auth.interceptor.ts`: Adds `withCredentials: true`.
  - `interceptors/error.interceptor.ts`: Handles 401/403 redirects.
  - `guards/auth.guard.ts`: Protects routes based on auth state.
  - `models/auth.models.ts`: Global interfaces (User, AuthResponse, etc.).
- **`src/app/shared/`**: Reusable UI components.
  - `components/input/`: (with `input.stories.ts`) Reusable input field.
  - `components/button/`: (with `button.stories.ts`) Reusable button.
  - `layouts/auth-layout/`: Shared layout shell for all auth features.
- **`src/app/features/auth/`**: Auth-specific feature module.
  - `docs/README.md`: Feature-specific documentation.
  - `login/`: Login component and logic.
  - `register/`: Registration component and logic.
  - `otp-verify/`: OTP verification component and logic.
  - `auth-routing.ts`: Routes for the auth feature.

### 2.2 UI Development with Storybook
- **Component isolation**: All shared components and feature-level presentation components will have a `*.stories.ts` file.
- **Visual Testing**: Use Storybook to verify states (loading, error, disabled) without running the full app.

### 2.3 Documentation Strategy
- **Root `README.md`**: High-level overview and links to `docs/ARCHITECTURE.md`.
- **`docs/ARCHITECTURE.md`**: Detailed technical map linking to each feature's documentation.
- **Feature Documentation**: Each feature (e.g., `features/auth/`) will contain its own `docs/` folder with a `README.md` explaining its specific logic, endpoints, and flows.

### 2.4 Shared UI Components
- **`InputComponent`**: Reusable standalone component supporting `ControlValueAccessor`. Handles labeling, validation states, and basic Material/Tailwind styling.
- **`ButtonComponent`**: Standardized buttons (Primary, Secondary, Ghost) with built-in loading spinners and disabled states.
- **`AuthLayoutComponent`**: Shared layout shell for all auth features with a slot for dynamic content using `<ng-content>`.

### 2.5 Aesthetics & UX
- **Design Language**: Modern, clean, and minimalist (Fintech style).
- **Typography**: Clean sans-serif (e.g., Inter or Roboto).
- **Icons**: Sourced from **The Noun Project** for a unique, professional look.
- **Feedback**: Smooth transitions, loading skeletons, and interactive states using Tailwind and Angular animations.

---

## 3. Data Flow & Endpoints

### 3.1 Backend API Contracts (Base URL: `http://localhost:8080/api`)
- **`POST /auth/register`**: 
  - Input: `{ email, password, firstName, lastName }`
  - Output: `{ userId: string, message: string }`
- **`POST /auth/verify-code`**: 
  - Input: `{ userId: string, code: string }`
  - Output: `{ user: User }` (Sets HttpOnly Cookie)
- **`GET /auth/refresh-code?userId={userId}`**: 
  - Output: `{ message: string }` (Triggers new email)
- **`GET /user`**: 
  - Output: `{ user: User }` if authenticated, else 401. (Requires `withCredentials: true`)

### 3.2 Registration Flow
1. User submits `RegisterComponent` form.
2. `AuthHttpService.register()` is called.
3. Backend sends OTP via email and returns `userId`.
4. `AuthStoreService` stores `userId` in `sessionStorage` (fallback for page refresh during OTP).
5. Router navigates to `/auth/verify-code`.

### 3.3 OTP Verification Flow
1. User enters 6-digit code in `OtpVerifyComponent`.
2. `AuthHttpService.verifyCode(userId, code)` is called.
3. Backend sets HttpOnly JWT cookie and returns `User` object.
4. `AuthStoreService` updates `currentUser` signal and saves metadata to `IndexedDbService`.
5. Router navigates to the dashboard.

---

## 4. PWA & Persistence
- **Service Worker**: Configured to cache shell assets and provide a "fallback" offline page.
- **IndexedDB**: Used via `Dexie.js` or native API to store:
  - User profile (name, email).
  - UI Preferences (dark mode, currency).

---

## 5. Success Criteria
- [ ] Seamless registration to dashboard flow.
- [ ] Correct handling of OTP expiration (10 min) and resend limits (1 min).
- [ ] Persistent session after browser restart (via HttpOnly cookies + `/user` check).
- [ ] Full TypeScript compliance (no `any`).
- [ ] Responsive UI using Tailwind and Angular Material.
- [ ] Storybook stories for all shared components.
