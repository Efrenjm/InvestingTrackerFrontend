# Frontend Development Guide

Implementation, verification, and security conventions. [AGENTS.md](../AGENTS.md) routes tasks here; [ARCHITECTURE.md](ARCHITECTURE.md) owns structural boundaries and [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) owns visual and shared-UI contracts.

## Supported commands

Run npm commands with `frontend` as the working directory.

- Development server: `npm start`
- Production build: `npm run build`
- Unit tests: `npm test`
- Storybook development: `npm run storybook`
- Static Storybook build: `npm run build-storybook`
- Storybook validation preserving generated documentation: `npm run check:storybook`
- Full lint inventory: `npm run lint`
- Explicit lint autofixes: `npm run lint:fix` (review the resulting diff)
- Lint and hook regression tests: `npm run test:lint`
- Validate staged files: `npm run precommit`
- Install or repair local Git hooks: `npm run prepare`

There is no repository-provided end-to-end command. Do not invent one or add dependencies without task authorization.

## Automated commit checks

`eslint.config.mjs` is the executable lint policy; this guide explains its scope. Husky 9 runs `.husky/pre-commit`, which invokes `npm run precommit`. lint-staged checks the entire staged version of each matching file, including existing violations in that file. Unstaged edits in partially staged files are hidden during checks and restored afterward. A failed task prevents the commit. Tasks run sequentially and do not apply automatic fixes.

| Trigger | Automatic validation |
|---|---|
| Staged TypeScript, HTML, or MJS | ESLint with errors and warnings blocking the commit; generated output and `.docs/` are excluded |
| Lint config, TypeScript config, package/lockfile, tooling, or pre-commit changes | `npm run test:lint`, including a disposable Git repository test of valid, invalid, and partially staged content |
| Shared UI, shell, stories/MDX, `.storybook/`, `angular.json`, global styles, or PostCSS configuration changes | `npm run check:storybook` runs the static build and restores the prior `documentation.json` content on success or failure |

Documentation-only commits do not run application builds. Application unit tests and production builds remain task-specific checks; they are not run indiscriminately on every commit. Storybook builds validate the working tree and its dependencies, not an isolated snapshot of the entire commit; review unrelated working-tree changes before interpreting build results.

### Enforced source rules

- TypeScript recommended type-aware checks, explicit `any` rejection (also in tests), unsafe operations involving `any`, unhandled promises, unused variables, and related correctness checks. `unknown` requires proper narrowing rather than an unsafe cast.
- Angular standalone conventions, omission of redundant `standalone: true`, dependency injection conventions, and OnPush change detection through the official Angular ESLint rule. Angular 22 stable defaults to OnPush, so omitted metadata is valid; explicitly opting into `Eager` is reported.
- No imports of Angular's `UntypedForm*` APIs. Fully appropriate form models still require review.
- Subscriptions in components, directives, injectables, and pipes must follow the configured `takeUntil`/`takeUntilDestroyed` pattern. Prefer Angular's `takeUntilDestroyed`; use an explicit `DestroyRef` outside an injection context. Unsafe operators following teardown, nested subscriptions, and asynchronous subscribe callbacks are rejected.
- Template checks cover `$any`, native control flow, class/style bindings, text alternatives, labels, keyboard-related handlers, focusability, and ARIA. Both external and inline templates are processed.
- Dynamic evaluation and direct `bypassSecurityTrust*` calls are rejected. A security-reviewed exception must be narrow and explained; lint disable comments are not approval. Unused disable directives fail lint.

The RxJS plugin recognizes syntactic patterns; it does not prove all subscriptions are leak-free. Manual `takeUntil` notifier cleanup, indirect subscription helpers, subscriptions outside decorated classes, and correct `DestroyRef` ownership still require review. The alias configuration intentionally does not demand a destroy Subject for Angular's `takeUntilDestroyed`. Tests using controlled finite streams do not need a component lifecycle solely to satisfy lint.

### Rules that still require review

ESLint cannot prove behavior preservation, appropriate component reuse, semantic token meaning, complete theme contrast, focus movement, responsive layout, synthetic-data provenance, absence of all secrets, backend cookie attributes, or the quality of tests. Module ownership, lazy-loading decisions, HTTP/storage boundaries, story presence and meaningful coverage, and migration approval also remain review requirements. A successful hook or Storybook build is not proof of those contracts; use `ARCHITECTURE.md` and `DESIGN_SYSTEM.md` for their definitions.

### Existing debt and rollout

The rollout is strict per staged file, as requested: no global suppression baseline, no blanket exemptions for tests, and no unrelated source migration. `npm run lint` intentionally reports existing violations throughout the repository and may fail until they are resolved. The initial inventory is archived at [2026-09-12-lint-debt.json](../.docs/reviews/2026-09-12-lint-debt.json); it is historical evidence, never a suppression list. Re-run lint for current findings.

When touching a file, fix its findings with preserved behavior and appropriate tests. Do not replace `any` with unchecked assertions or add ineffective teardown merely to satisfy the linter. Update this guide if enforcement scope changes.

### Installation and CI

Use Node 24.21.0 (`nvm use`, as pinned in `.nvmrc`), npm 11.19.0, and the lockfile. The supported Node range is declared in `package.json`. Husky's `prepare` script installs hooks in this frontend Git repository. The tracked hook contains ordinary commands; do not add the deprecated `husky.sh` bootstrap. Generated `.husky/_/` files stay untracked. If lifecycle scripts were skipped, run `npm run prepare` explicitly.

Install with `npm ci`. Angular 22.1.6, CLI/build 22.1.8, Storybook 10.6.0, Compodoc 2.0.0, and TypeScript 6.0.3 have compatible peer ranges; neither `--legacy-peer-deps` nor `--force` is required.

Hooks can be bypassed locally, so they are not a server-side enforcement boundary. CI can use `HUSKY=0 npm ci` and invoke checks explicitly. No remote workflow or branch protection is configured by this change. Requiring full `npm run lint` in CI would currently block on the documented debt; adopt that gate after migration or define an explicit changed-file CI policy. Branch protection must require the chosen checks to enforce them at merge time.

Implementation references: [Husky setup](https://typicode.github.io/husky/get-started.html), [Husky CI and hook behavior](https://typicode.github.io/husky/how-to.html), [lint-staged](https://github.com/lint-staged/lint-staged), [typescript-eslint typed linting](https://typescript-eslint.io/getting-started/typed-linting/), [Angular ESLint](https://github.com/angular-eslint/angular-eslint), [RxJS Angular rules](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-angular-x), [RxJS rules](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x), and [Angular teardown](https://angular.dev/ecosystem/rxjs-interop/take-until-destroyed).

## Angular and TypeScript

- Preserve strict typing. Do not introduce `any` to bypass type design.
- Use standalone components without writing `standalone: true` where standalone is already the framework default.
- Prefer `ChangeDetectionStrategy.OnPush` for new or materially changed components.
- Prefer `inject`, signals, and `computed` for dependency access and synchronous reactive state.
- Use typed reactive forms for non-trivial forms.
- Use native Angular control flow. Prefer direct class and style bindings over new `ngClass` or `ngStyle` usage.
- Lazy-load feature routes where the route boundary permits it.
- Keep presentational components free of HTTP calls, browser persistence, and feature orchestration.
- Use RxJS at asynchronous boundaries and lifecycle-safe teardown such as `takeUntilDestroyed`.
- Preserve public behavior unless the task explicitly changes it.

## Testing and verification

- Add or update tests with behavior changes and bug fixes. Reproduce a defect with a failing test first when practical.
- Run focused checks before the relevant full checks.
- Run `npm run build-storybook` when shared UI or stories change.
- Match verification effort to risk; documentation-only work does not require application builds unless configuration or source also changes.
- Do not claim completion without fresh command output or direct file-level evidence.

## Security and privacy

- Never expose, copy, print, commit, or log private keys, API tokens, passwords, OTP values, authentication headers, session cookies, environment secrets, certificates, or credential-store contents.
- Inspect configuration names rather than values and redact any sensitive value from output.
- Treat everything bundled into the browser as public. Never place a private secret in Angular source, build configuration, or Storybook configuration.
- Do not persist authentication or session tokens in `localStorage`, `sessionStorage`, or IndexedDB. Authentication credentials belong in backend-managed `HttpOnly`, `Secure`, and appropriate `SameSite` cookies.
- Never use real user, email, financial, account, or portfolio data in stories, fixtures, tests, screenshots, documentation, logs, analytics, or examples.
- Do not place secrets or sensitive personal data in URLs, query parameters, fragments, or router state.
- Minimize and mask personal and financial data in logs, analytics, and error reports.
- Avoid `innerHTML`, `bypassSecurityTrust*`, dynamic evaluation, and ad hoc sanitization without explicit security review.
- If a secret is discovered, stop propagating it, report only its location and type, and recommend rotation without repeating its value.
- Justify dependency changes and review their security and maintenance implications before installation.

## Coordination and completion

- Give each subagent a bounded objective, allowed files, acceptance criteria, and verification commands. Do not assign overlapping files to concurrent agents.
- Handoffs and final reports identify changed files, checks run, assumptions, and remaining risks.
- Review the final diff and preserve unrelated changes. Follow the Git authorization rules in `AGENTS.md`.
- Update the governing guide when boundaries or conventions change. Keep feature behavior in feature-local documentation or the assigned specification.
