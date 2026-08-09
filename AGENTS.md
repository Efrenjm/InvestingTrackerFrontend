# Frontend Repository Guide

## Scope and precedence

- These instructions apply to all work inside this repository.
- `AGENTS.md` is the canonical frontend guidance source. Tool-specific files may import it but must not duplicate it.
- A more specific `AGENTS.md` closer to a changed file overrides this file only within that subtree.
- Work from the workspace root when coordinating with the backend, but run frontend Git and npm commands against `frontend` explicitly.
- Treat existing staged, unstaged, and untracked files as user-owned unless the current task explicitly includes them.

## Start every task

1. Confirm that the requested location is `frontend` or `cross-repository`.
2. Run `git -C frontend status --short --branch` from the workspace root.
3. Read only the routed documents relevant to the task.
4. Inspect nearby implementation and the scripts in `package.json` before proposing structure or commands.
5. Keep the change bounded; do not mix unrelated cleanup into the task.

## Documentation routing

| Work type | Read before editing |
|---|---|
| Architecture, state placement, boundaries, or structural refactoring | `docs/ARCHITECTURE.md` |
| Shared UI, styling, theming, responsive behavior, accessibility, or Storybook | `docs/DESIGN_SYSTEM.md` |
| Feature behavior | The feature-local docs and task-specific specification named by the task |
| Planned guidance that does not exist yet | Read workspace `backlog/README.md`, then only the assigned `backlog/<state>/BL-NNN.md`; do not invent missing policy |

Update this table only after a new guide exists and has been reviewed.

## Supported commands

Run npm commands with `frontend` as the working directory.

- Development server: `npm start`
- Production build: `npm run build`
- Unit tests: `npm test`
- Storybook development: `npm run storybook`
- Static Storybook build: `npm run build-storybook`

There is currently no repository-provided lint or end-to-end command. Do not invent one or add a dependency unless the task explicitly authorizes it.

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

## Architecture boundaries

- `core` is limited to application-wide infrastructure and cross-cutting concerns.
- `domain` is the target location for pure shared business types and logic; it must not depend on Angular, HTTP, storage, or UI.
- `shared` contains domain-agnostic UI, forms, validators, utilities, and testing helpers.
- `features` own their pages, feature UI, data access, state, and feature-specific models.
- `shell` is the target location for application chrome, navigation, and layout composition without feature business logic.
- A feature must not import another feature's internals.
- Keep transport DTOs at the data-access boundary and map them to domain or view models.
- Move existing feature-specific services, stores, models, and layouts only through focused, behavior-preserving tasks.

## Components and Storybook

- Reuse or extend an appropriate shared component before creating another abstraction.
- Every new or materially changed shared visual component requires a colocated Storybook story.
- Cover only supported states, including default, disabled, loading, error, empty, and responsive states when applicable.
- Add Storybook interaction coverage for meaningful behavior when practical.
- Use deterministic providers and mocks; stories must never call live services.
- Route containers and feature pages do not require stories by default.
- Do not add more generated examples under `src/stories`; their removal is separate backlog work.

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

## Accessibility

- Meet WCAG AA contrast targets for supported themes.
- Preserve keyboard access, visible focus, meaningful accessible names, error relationships, and logical focus movement.
- Respect reduced-motion preferences and do not rely on color alone to convey status.
- Include accessibility states in shared-component review and Storybook coverage.

## Documentation and coordination

- Update architecture or design-system documentation when a task changes their boundaries or conventions.
- Keep feature-specific behavior with the feature or task specification rather than expanding this file.
- Give a subagent a bounded objective, allowed files, acceptance criteria, and verification commands.
- Do not assign overlapping files to concurrent agents.
- Require every handoff to report changed files, checks run, assumptions, and remaining risks.

## Completion and Git safety

- Review the final diff and preserve unrelated changes.
- Report files changed, verification evidence, assumptions, and remaining risks.
- Never stage, unstage, commit, amend, reset, or push without explicit user authorization.
