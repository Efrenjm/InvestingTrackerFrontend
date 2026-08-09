# Frontend Architecture

## Purpose and status

This document describes both the frontend's current structure and the target boundaries for incremental work. Sections labeled as current state report what exists in the repository at the time of writing. The target structure is a direction for new and focused migration work; it does not imply that the `domain` or `shell` directories, or every feature subdirectory, already exist.

## Technology baseline

- Angular 22.0.0-next packages are in use, including Angular Material and the Angular service worker.
- The remaining baseline is TypeScript 5.9, RxJS 7.8, Tailwind CSS 4.2, Storybook 10.2, and Vitest 4.0.
- The production build configures an Angular service worker. This configuration alone does not establish complete or correct offline behavior.
- Storybook is configured with documentation and accessibility addons. The OTP input is currently the only colocated shared-component story; `src/stories` still contains generated examples.

## Current structure

- `src/app/core` contains guards, interceptors, models, HTTP services, stores, dashboard configuration, and IndexedDB persistence.
- `src/app/features` contains `auth`, `dashboard`, `profile`, and `wallets`.
- `src/app/shared` contains reusable components and the auth and dashboard layouts.
- Feature-specific wallet and account concerns currently exist in `core`; their target ownership is documented below, but they have not yet been migrated.

## Current request and route flow

The root route table lazy-loads the auth and wallets route groups and the dashboard and profile components. The dashboard layout, currently under `shared/layouts`, forms the protected application shell and applies the auth guard to its child routes. The default and wildcard routes redirect to the dashboard.

HTTP services currently live under `core`, and requests pass through application-wide interceptors. This describes the current placement only: feature-owned HTTP services and transport mapping are intended to move behind the owning feature's `data-access` boundary through focused migrations.

## Target structure

The target structure for new code and incremental migrations is:

```text
src/app/
├── app.component.*
├── app.config.ts
├── app.routes.ts
├── core/
│   ├── config/
│   ├── error-handling/
│   ├── guards/
│   ├── interceptors/
│   └── persistence/
├── domain/
│   ├── account/
│   ├── user/
│   └── wallet/
├── shell/
│   ├── layouts/
│   └── navigation/
├── shared/
│   ├── forms/
│   ├── testing/
│   ├── ui/
│   ├── utilities/
│   └── validators/
└── features/
    └── <feature>/
        ├── data-access/
        ├── docs/
        ├── models/
        ├── pages/
        ├── state/
        ├── ui/
        └── <feature>.routes.ts
```

| Area | Owns | Must not own |
|---|---|---|
| `app` | application bootstrap, root configuration, top-level route composition | feature business rules |
| `core` | cross-cutting infrastructure used across the application | wallet-, account-, profile-, or auth-specific state and DTOs |
| `domain` | pure shared business concepts and deterministic rules | Angular, HTTP, storage, and presentation concerns |
| `shell` | application chrome, navigation, and layout composition | feature use cases and feature state |
| `shared` | domain-agnostic UI, forms, validators, utilities, and testing helpers | feature-specific orchestration or data access |
| `features/<feature>` | pages, feature UI, state, data access, transport mapping, and feature models | imports from another feature's internals |

## Dependency direction

The following table is the target dependency contract for new code and focused migrations. Current placements described above may not yet satisfy every edge; they remain migration debt and do not expand the target permissions.

| Target area | Allowed project dependencies | Forbidden project dependencies |
|---|---|---|
| `app` | `core`, `domain`, `shell`, `shared`, and each feature's public route exports | any feature internal module |
| `core` | `domain`, only for pure contracts shared across the application | `app`, `shell`, `shared`, and `features/<feature>` |
| `domain` | other pure `domain` modules | `app`, `core`, `shell`, `shared`, `features/<feature>`, Angular, HTTP, browser storage, and UI code |
| `shell` | `core`, `domain`, `shared`, and each feature's public navigation exports | `app` and feature pages, state, data access, models, or use cases |
| `shared` | other `shared` modules | `app`, `core`, `domain`, `shell`, and `features/<feature>` |
| `features/<feature>` | `core`, `domain`, `shared`, and its own internal modules | `app`, `shell`, and every other feature, including another feature's public exports |

Only the project dependency edges listed above are permitted. External framework or package use must still respect the owning area's responsibilities. Dependencies between modules within an area and across the complete application graph must be acyclic; re-exports, dependency injection, callbacks, and lazy imports do not permit a cycle. Permission to depend on an area does not transfer ownership: `core` remains limited to cross-cutting infrastructure, `shared` remains domain-agnostic, and `shell` must not invoke or implement feature use cases.

For the target structure, `features/<feature>/<feature>.routes.ts` is the feature's public entry point. Its public exports are limited to lazy route configuration for `app` and static, side-effect-free route identifiers or navigation metadata for `shell`. `app` may consume the route exports only for top-level route composition, and `shell` may consume the navigation exports only for application chrome. The entry point must not re-export feature pages, state, services, data access, transport models, or feature-specific business models. No other target area may consume a feature public entry point; a business concept needed across features belongs in `domain` after a focused migration.

## HTTP and model mapping

- HTTP services and transport DTOs live under the owning feature's `data-access` boundary.
- Transport DTOs are mapped to domain or view models before reaching presentation components.
- Interceptors contain only cross-cutting request behavior.
- Server responses remain authoritative for server-owned state.

## State and reactive flow

- Use component signals for local UI state.
- Use feature-owned signal stores or services for state shared within a feature.
- Use `computed` for derived synchronous state.
- Use RxJS for HTTP and asynchronous event boundaries.
- Use lifecycle-safe teardown for subscriptions.
- Do not place feature state in `core` merely to make it injectable.

## Persistence

- Access persistence through a cross-cutting adapter.
- Minimize persisted values, version them when necessary, validate them when restored, and never treat them as more authoritative than the server.
- Exclude authentication and session tokens from browser persistence.

## Presentation boundaries

- Pages coordinate feature use cases.
- Feature UI remains reusable within its owning feature.
- Shared UI remains domain-agnostic.
- Presentational components perform no HTTP or storage access.

## Styling and design-system boundary

[The frontend design-system guide](DESIGN_SYSTEM.md) owns the complete styling precedence model, visual conventions, and values. Tailwind utilities, Angular Material theming and components, design tokens, shared-component styles, and feature styles must follow that guide; their precedence, visual values, and alignment rules are not defined here.

## Storybook boundary

- Place shared-component stories beside the components they document.
- Use deterministic providers, fixtures, and mocks; stories must not call live APIs.
- Add interaction coverage when a component has meaningful behavior to exercise.
- Route containers and feature pages do not require stories by default.

## Security and privacy boundary

- Treat everything bundled into the browser as public; frontend code and configuration contain no secrets.
- Do not put sensitive values in URLs or logs.
- Do not bypass Angular's safe HTML handling without an explicit security review.
- Authentication credentials belong in backend-managed `HttpOnly`, `Secure`, and appropriately configured `SameSite` cookies.

## Testing placement

- Keep unit and component tests colocated with the implementation they cover.
- Keep feature integration tests near the owning feature.
- Use Storybook interaction tests for meaningful shared-UI behavior.
- Add end-to-end coverage only after a repository-provided command is established.

## Incremental migration policy

- New code follows the target boundaries.
- Existing code moves only in a focused task that benefits from the move.
- Characterize behavior before decomposing large components.
- Move feature-specific wallet and account services, stores, and models out of `core` incrementally.
- Move layouts from `shared` to `shell` only through a focused, behavior-preserving task.
- Do not combine repository-wide cleanup of `any`, redundant `standalone: true`, `ngClass`, or `ngStyle` with unrelated feature work.

## Known architectural gaps

These observations describe measured gaps; they are not assigned as work by this document.

- `create-account.component.ts` is 667 lines.
- `account-detail.component.ts` is 484 lines.
- `wallet-detail.component.ts` is 427 lines.
- `profile.component.ts` is 289 lines.
- Feature-specific wallet and account services, stores, and models currently live in `core`.
- Shared-component Storybook coverage is incomplete, and generated examples remain under `src/stories`.
- Unit-test coverage is uneven.
- No project-provided lint or end-to-end script exists in `package.json`.
- Styling has overlapping Tailwind, application custom-property, and Material theme values that require later design-system alignment.

## Related documentation

- [Frontend repository guide](../AGENTS.md)
- [Frontend design-system guide](DESIGN_SYSTEM.md)
