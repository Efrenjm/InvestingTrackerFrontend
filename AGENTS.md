# Frontend agent instructions

Applies throughout `frontend`; a closer `AGENTS.md` overrides it within its subtree. Tool-specific files reference this entry point without duplicating it.

## Workflow

- Start with `git -C frontend status --short --branch` from the workspace root. Run frontend npm commands inside `frontend`; inspect `package.json` and nearby implementation first.
- Read only the applicable guides below before editing. Preserve public behavior unless the task changes it; avoid unrelated cleanup.
- Treat pre-existing changes as user-owned. Never stage, unstage, commit, amend, reset, or push without explicit authorization.

## Read by task

| Task | Required source |
|---|---|
| Code, configuration, dependencies, tests, security, or delegation | [Development](docs/DEVELOPMENT.md) |
| Structure, routes, dependencies between modules, data access, or state | [Architecture](docs/ARCHITECTURE.md) |
| UI, styles, themes, forms, accessibility, or Storybook | [Design system](docs/DESIGN_SYSTEM.md) — sole styling authority |
| Feature behavior | Relevant feature-local documentation and assigned specification |

## Always preserve

- Never expose secrets or real personal/financial data in outputs, examples, fixtures, or logs. Inspect configuration names, not secret values; report discovered secrets by location and type only and recommend rotation.
- Browser bundles are public. Do not store authentication/session tokens in browser storage; use backend-managed `HttpOnly`, `Secure`, appropriate `SameSite` cookies. No sensitive data in URLs or router state.
- Add or update tests for behavior changes and fixes. Run focused checks first and `npm run build-storybook` for shared UI/story changes. Documentation-only edits need file/link checks, not application builds.
- Review the diff and report changes, fresh verification evidence, and remaining limitations. Never claim checks passed without evidence.

## Documentation placement

- Final maintained guides: `docs/`. Update the relevant source of truth instead of duplicating rules here.
- Plans, draft reviews, specs, and Superpowers artifacts: `.docs/`. Historical artifacts do not override maintained guides.
- Keep feature behavior docs with the feature. Add routing entries only for existing, reviewed guides.
