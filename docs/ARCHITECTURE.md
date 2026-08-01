# Frontend Architecture: Investing Tracker

This document describes the structure and technical decisions made for the Investing Tracker frontend.

## Design Principles
- **Clean Architecture**: Clear separation between infrastructure (HTTP), domain (State), and presentation (UI) layers.
- **Modern Angular**: Use of Angular 21+, Signals for state management, Standalone Components, and Functional Interceptors.
- **PWA-First**: Asset caching, offline functionality, and local persistence with IndexedDB.
- **CSS-First**: Use of Tailwind CSS 4 for responsive design and Angular Material for complex UI components.

## Folder Structure

### `src/app/core/`
Singletons and global application logic.
- **`services/`**: Communication and persistence services.
  - `auth-http.service.ts`: HTTP client for authentication.
  - `auth-store.service.ts`: Global state (Signals).
  - `indexed-db.service.ts`: Local persistence.
- **`interceptors/`**: HTTP request interception.
- **`guards/`**: Route protection.
- **`models/`**: TypeScript interface definitions.

### `src/app/shared/`
Reusable components and visual infrastructure across multiple features.
- **`components/`**: Inputs, Buttons, etc. (Documented with Storybook).
- **`layouts/`**: Page structures (e.g., Auth Layout).

### `src/app/features/`
Specific business functionality modules.
- **`auth/`**: [See Auth documentation](../src/app/features/auth/docs/README.md)
  - Login, Registration, and OTP Verification.

## Technologies Used
- **Angular 21**: Base framework.
- **Tailwind CSS 4**: Visual design.
- **Angular Material**: Form components and utilities.
- **Storybook**: Documentation and isolated component development.
- **IndexedDB**: Robust local persistence.
- **The Noun Project**: Professional iconography.

---
For more details on a specific feature, navigate to the `docs/` directory within its folder in `features/`.
