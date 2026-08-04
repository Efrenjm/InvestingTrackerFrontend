# Copilot Instructions — Frontend (Angular PWA)

## Build, test, and lint commands

Run all commands from `frontend/`.

```bash
# Start local dev server
npm start

# Production build
npm run build

# Watch build for development
npm run watch

# Unit tests
npm test

# Unit tests once (no watch)
npm test -- --watch=false

# Single test file
npm test -- --watch=false --include src/app/features/auth/login/login.component.spec.ts

# Storybook (shared components)
npm run storybook

# Build static Storybook
npm run build-storybook
```

There is no dedicated lint script configured in `package.json`.

## High-level architecture

- Frontend follows a **clean-ish layered structure**:
  - `src/app/core`: singleton services (HTTP/store/IndexedDB), guards, interceptors, and global models.
  - `src/app/shared`: reusable UI components and layouts.
  - `src/app/features`: feature slices (auth, dashboard, profile, etc.).
- Routing uses **lazy loading**:
  - Feature route trees are loaded with `loadChildren`.
  - Main authenticated area is wrapped in `DashboardLayoutComponent`.
- State is built around **Angular Signals** in store-style services (for example, auth session state in `AuthStoreService`), with IndexedDB used for local metadata persistence.
- PWA setup is enabled through Angular service worker registration in `app.config.ts`, with production service worker config in `angular.json`.
- API auth contract is cookie-based:
  - API calls target `/api` / backend base URL.
  - `authInterceptor` sets `withCredentials: true`.
  - `errorInterceptor` redirects on 401/403.

## Key conventions

- Use **standalone components**, functional providers, and functional interceptors/guards.
- Prefer **signals + computed** for app state over class-based RxJS state containers.
- Use **native control flow** (`@if`, `@for`, `@switch`) instead of structural directive microsyntax.
- Shared visual primitives should live under `shared/components` and be documented via Storybook stories.
- Authentication UX assumes:
  - registration → OTP verification flow,
  - HttpOnly cookie session established by backend,
  - `/user` call on app/session initialization to hydrate real auth state.
