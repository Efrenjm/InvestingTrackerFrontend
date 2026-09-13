# Frontend Design System

## Purpose and authority

This document is the frontend contract for shared UI, design tokens, styling layers, Storybook representation, responsive behavior, accessibility, and contribution rules. It governs new shared UI work and focused migrations; it does not authorize a repository-wide visual rewrite.

This is the single source of truth for frontend styles, including the visual direction integrated from the September 2026 reference review. Agents must read this guide before styling work and update it when a visual convention changes. Screenshots, historical reviews, specifications, and plans do not establish competing styling policy.

Final maintained guides belong in `frontend/docs/`. Drafts, reviews, plans, specifications, and Superpowers artifacts belong in `frontend/.docs/` (for example, `.docs/reviews/`, `.docs/specs/`, and `.docs/superpowers/`). Promote accepted conventions into this guide; archive their supporting material outside `docs/`. Feature-local behavior documentation retains its existing architecture-defined location.

[`AGENTS.md`](../AGENTS.md) remains the always-loaded frontend rule source. [`ARCHITECTURE.md`](ARCHITECTURE.md) remains the source for structural boundaries and ownership. When work crosses these concerns, follow all three documents: this guide decides visual and shared-component conventions, while the other guides retain their stated authority.

## Audience and governance

This guide is for frontend contributors, reviewers, and coding agents who design, implement, or review application UI and its shared contracts. Frontend maintainers are the accountable owners of this guide and its enforcement.

At least one frontend maintainer must review and approve changes to the semantic-token taxonomy or a shared UI public API, any accessibility or security exception, and any breaking design-system contract. The change author must supply affected-consumer and migration evidence; approval is not implied by implementation alone.

Until BL-007 establishes an architecture-decision-record process, record every durable decision or temporary exception in an approved task or specification and reflect its enforceable outcome in this guide or, for a structural boundary, in `ARCHITECTURE.md`. A temporary exception must also state its scope, rationale, and removal condition and must not be treated as precedent. After BL-007 establishes that process, these records may migrate to ADRs and new decisions may use it, while the governing documents continue to state the active contract.

## Scope of this foundation

This foundation defines how the frontend should name and consume tokens, divide styling responsibilities, classify components, represent supported behavior, and review shared UI changes. It applies to application UI, shared form controls, application shell, feature UI, and the stories and tests that describe those contracts.

It establishes target conventions and visual direction for incremental work. Normative rules below govern new work; the current-state section describes migration debt, and the unresolved-decisions section identifies values that have not been standardized. This document does not assert that every target directory, token, component, theme, or story already exists.

## Design principles

- **Semantic before decorative.** Name roles by intent so components do not depend on a particular palette or visual treatment.
- **Accessible by default.** Treat keyboard operation, perceivable state, contrast, motion preferences, and assistive-technology semantics as part of the component contract.
- **Reusable before duplicated.** Search for and evaluate an existing contract before adding another component or style pattern.
- **Explicit supported states.** Define, implement, test, and document only the states the component actually supports.
- **Responsive from the smallest supported viewport upward.** Establish a usable base before progressively adapting composition at larger viewports.
- **Deterministic and privacy-safe examples.** Stories, tests, documentation, and screenshots use stable synthetic data and no live services.
- **Incremental migration rather than a visual rewrite.** New work follows this contract; existing inconsistencies move through focused, behavior-preserving tasks.

## Current styling reality

- `src/styles.css` imports Tailwind CSS and external font families. It declares Tailwind theme tokens and also maintains a second `:root` custom-property set.
- `src/material-theme.scss` independently configures Angular Material with azure and blue palettes and Roboto typography.
- Tailwind theme tokens, application custom properties, and Angular Material theme values are not yet aligned into a single semantic token contract.
- Global Material overrides and application-specific global classes already exist in `styles.css`; under the target rules below, these are migration debt rather than patterns to copy.
- Current values are not automatically final brand decisions. Updating this guide does not implement a theme or migrate components.

The 2026-09-11 repository review confirmed the following gaps. Recheck affected consumers when implementing a focused migration and update this inventory when resolved.

| Gap | Evidence | Required alignment |
|---|---|---|
| Duplicate application palettes | `src/styles.css`: `#004D40` versus `#094c42` for primary treatments; `#FBF8F3` versus `#fbf9f6` for canvas treatments | Map equivalent purposes to one semantic role. |
| Independent Material identity | `src/material-theme.scss` uses azure/blue and Roboto; application CSS imports Inter, Montserrat, and Poppins | Align Material with the visual and typography rules below. |
| Overlapping global base styles | Both stylesheets set body typography and colors; `angular.json` loads Material before application CSS | Establish explicit token mapping; stylesheet order alone is not a theme contract. |
| Literal values in shared UI | `src/app/shared/components/card/stat-card.component.ts` and `navbar/navbar.component.ts` embed colors and sizes; card implementations differ in radius declarations | Migrate representative shared consumers to semantic roles. |
| Inconsistent utility vocabulary | Avatar and sidebar use `primary-*`; the inspected Tailwind theme declares `brand-primary` | Verify generated CSS and resolve utility mappings before relying on them. |
| Incomplete theme and story coverage | Material sets `color-scheme: light`; OTP is the only colocated shared-component story | Validate theme mappings and add stories when shared components are migrated. |

## Visual direction and reference interpretation

Use a calm neutral canvas, rounded panels, generous but consistent spacing, clear information hierarchy, and green primary actions. The supplied workspace-root `dashboard.png`, `accounts.png`, and `dark_layout.png` establish this direction. Their relevant patterns are captured here so agents do not need access to those files to follow the contract.

- The light dashboard uses white panels over a warm neutral canvas, prominent metrics, pastel account treatments, and a large primary area beside supporting panels.
- The accounts view repeats that language with a green wallet summary, category cards, a table, transactions, and supporting panels.
- The dark dashboard preserves the hierarchy using a near-black canvas, distinct dark panels, subtle borders, and brighter green accents.

The PNGs are desktop inspiration, not pixel-exact acceptance fixtures. They do not define mobile behavior, interactive states, exact font families, accessible color pairs, production copy, or valid financial data. Do not reproduce their mixed-language labels, inconsistent monetary notation, truncated text, branding, or incidental content. Reference inspection did not include pixel sampling or contrast measurements; accessibility must be verified on the implementation.

### Color meaning and surface treatment

- Keep backgrounds, panel surfaces, text, borders, actions, and statuses semantically distinct.
- Use mint, yellow, and lavender treatments for account categories where appropriate. Category color must not imply success, warning, or danger; category-to-business-meaning mapping belongs to feature UI.
- Pair status treatments with labels, icons, or another non-color cue. A category card can independently carry a warning or error state.
- Use restrained elevation and consistent panel radii. Dark panels may use subtle borders to distinguish surfaces; do not depend on shadows alone.
- Use pill shapes for appropriate badges and actions, with separate radius roles for controls and panels. Select exact scales through the unresolved-decisions process below.

### Typography and financial information

- Use Inter as the target shared family, with a system sans-serif fallback, across application content and Material controls. This is a project decision based on an already imported family, not a font identification from the PNGs. Existing Montserrat, Poppins, and Roboto consumers remain migration debt until a focused change aligns them.
- Define a consistent hierarchy for page titles, panel titles, body text, supporting labels, and prominent metrics. Use weight and size deliberately; do not introduce extra font families to distinguish financial data.
- Use tabular numerals for comparable financial amounts and align numeric columns consistently. Keep currency and descriptive labels available alongside emphasized balances.
- Format amounts and dates consistently with the feature's locale and currency requirements. Do not infer currency or sign from color or copy sample notation from the PNGs.
- Charts must provide labels, legends where needed, and a textual equivalent for essential information. Distinguish series and financial outcomes beyond color alone.

### Composition and navigation

- Wide dashboard and account compositions use a larger primary area and a smaller supporting area when content permits. Group related summaries; derive widths from content rather than screenshot dimensions.
- Stack panels when content no longer fits, preserving reading order and essential actions. A table must explicitly support contained overflow or a labeled compact representation without discarding necessary information.
- Use one spacing scale for composition and component anatomy. Avoid isolated dimensions that make related components diverge.
- Navigation requires clear active styling and consistent icon geometry. The horizontal header in the references does not mandate replacing the current sidebar; shell composition and narrow-screen navigation require a focused task that preserves access to existing routes.
- Apply the same visual language to authentication and other features through shared components; dashboard layouts are not templates for every page.

## Styling layers

Use the following precedence and responsibility model. A later layer may consume and specialize the contracts above it, but it must not silently redefine their global meaning.

1. **Semantic application tokens** express roles such as canvas, surface, text, border, action, success, warning, danger, spacing, radius, elevation, and motion. They form the public styling contract for application components.
2. **Angular Material theme tokens** style Material primitives. When the Material theme is aligned, its values must map to approved semantic roles rather than create a competing application vocabulary.
3. **Tailwind utilities** handle layout, spacing, responsive composition, and token-backed utilities. An arbitrary one-off value requires a documented exception explaining why an existing or new shared token is unsuitable.
4. **Shared component styles** implement component anatomy and supported states. They consume the shared contract and do not redefine global brand values.
5. **Feature styles** compose shared contracts and remain local to their owning feature. They must not become undeclared global tokens or overrides.

Specificity hacks, global Angular Material overrides, and `!important` require an explained, narrowly scoped compatibility reason. Existing global overrides are migration debt and do not establish precedent for new work.

## Design tokens

Token tiers separate implementation values from public intent:

- **Raw/reference tokens** hold palette or scale values. Components do not consume them directly.
- **Semantic tokens** describe intent and are the public styling contract. Components consume these tokens so themes and future visual decisions can change without rewriting component meaning.
- **Component tokens** are allowed only when a reusable component needs a stable customization point that is not covered by a semantic token. They must be named for the component and role, map back to semantic tokens by default, and remain part of that component's reviewed API.

Target semantic naming examples, intentionally shown without values, are:

```text
--color-bg-canvas
--color-bg-surface
--color-text-primary
--color-text-muted
--color-border-default
--color-action-primary
--color-status-success
--space-1
--space-2
--space-3
--radius-control
--radius-surface
--elevation-surface
--motion-duration-fast
--motion-easing-standard
```

Names use lowercase kebab case and move from category to intent, then optional state or emphasis. Define the smallest coherent set required by supported UI. The token contract covers:

- color roles for backgrounds, surfaces, text, borders, actions, focus, and statuses;
- typography roles for families, sizes, weights, line heights, and letter spacing;
- spacing and sizing scales for composition, controls, and stable layout constraints;
- semantic breakpoints that describe layout changes rather than device models;
- radii and elevation roles for controls, surfaces, and overlays;
- opacity roles for supported treatments without weakening required contrast;
- z-index roles for an explicit stacking model;
- motion durations and easing, with reduced-motion behavior defined alongside them.

Components consume semantic tokens and must not infer meaning from raw color names. Adding or changing a public token requires consumer review and migration notes when its meaning or behavior changes.

## Themes

Light and dark are the target visual themes over the same semantic roles. High-contrast remains an extension point, not an implemented or visually specified theme. The current application configures a light Material color scheme; neither a complete light token contract nor dark support is established by this guide alone.

| Role | Light direction | Dark direction |
|---|---|---|
| Canvas | Warm off-white | Near-black |
| Primary panels | White | Distinct lighter dark surface |
| Main text | Dark neutral | Light neutral |
| Supporting text | Muted, readable neutral | Muted, readable neutral adapted to dark surfaces |
| Primary action | Deep green | Brighter green |
| Text on primary action | Foreground validated against the light action | Independently validated foreground; do not assume white text |
| Category surfaces | Soft mint, yellow, lavender | Darker related treatments with readable foregrounds |

Do not mechanically invert colors or reuse foreground/background pairs without validation. Theme selection behavior and persistence require an explicit implementation decision; this document does not add a theme switcher.

A new theme must preserve semantic intent, define every required role rather than depend on accidental fallbacks, and meet WCAG AA contrast requirements. Theme work must validate component states and non-color cues, not only static default surfaces.

## Component taxonomy

| Category | Location | Examples | Ownership rule |
|---|---|---|---|
| Primitive/shared UI | `src/app/shared/ui` target | button, card, avatar | domain-agnostic and Storybook-documented |
| Shared form control | `src/app/shared/forms` target | input, OTP input, field feedback | typed, accessible, form-compatible, and Storybook-documented |
| Composite shared UI | `src/app/shared/ui` target | reusable empty state or dialog composition | reused across multiple features without feature business rules |
| Layout/shell | `src/app/shell` target | auth and dashboard layouts, navigation | application chrome without feature use cases |
| Feature UI | `src/app/features/<feature>/ui` | wallet summary or auth-specific panel | reusable inside the owning feature only |
| Feature page | `src/app/features/<feature>/pages` | route container | orchestrates feature state; no story required by default |

Existing `src/app/shared/components` and `src/app/shared/layouts` remain valid current locations until focused migration tasks move them. New placement follows the target architecture; this guide does not itself direct a relocation.

Use this sequence before creating or promoting UI:

1. Search existing shared and feature UI plus Storybook.
2. Reuse an existing component when its contract fits.
3. Extend an existing component only when the new variant is coherent and testable.
4. Keep feature-specific UI inside the feature until demonstrated reuse justifies promotion.
5. Record breaking shared-contract changes and migrate consumers together.

## Component states

For each component, identify which of default, hover, active, focus-visible, disabled, loading, empty, error, success, and read-only states apply. Define each supported state's appearance, semantics, interaction behavior, and any relationship to form or asynchronous state. Loading and disabled behavior must prevent unintended duplicate actions without hiding useful context; error and success states must expose meaning beyond color.

Tests and stories cover the supported contract. Do not create unsupported decorative states or stories merely to display visual possibilities.

## Responsive behavior

- Design and implement from the smallest supported viewport upward, then introduce layout changes at semantic breakpoints.
- Document material layout changes in the component contract or story, including changes in order, visibility, density, or interaction.
- Avoid fixed dimensions that break content at 200% zoom, with localization, or with user font settings. Use intrinsic sizing and wrapping where possible.
- Test long labels, long synthetic content, narrow layouts, and 200% zoom without loss of content or operation.
- Responsive behavior must preserve logical reading and focus order; visual rearrangement must not create a contradictory keyboard or assistive-technology sequence.

## Accessibility

Accessibility is a release requirement for every supported state and viewport:

- Provide complete keyboard operation and a logical focus order for interactive behavior.
- Preserve a clearly visible `focus-visible` treatment; do not remove native focus without an accessible replacement.
- Give controls programmatic names and, where needed, descriptions that communicate purpose and constraints.
- Connect validation messages and instructions to their fields programmatically, and expose errors at an appropriate time without destructive focus movement.
- Communicate error, success, warning, selection, and other status through text, iconography, semantics, or another non-color cue.
- Respect reduced motion preferences; remove or simplify non-essential motion while preserving status and spatial understanding.
- Make each pointer target at least 24 by 24 CSS pixels, satisfying [WCAG 2.2 Success Criterion 2.5.8, Target Size (Minimum), Level AA](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum). A smaller target is permitted only when evidence establishes one of SC 2.5.8's named exceptions: spacing, equivalent, inline, user-agent control, or essential. Without that evidence, the target fails this requirement. This accessibility floor applies to pointer and touch interactions and does not establish the deferred visual density scale.
- Meet WCAG AA contrast for text, meaningful graphics, controls, focus indicators, and supported themes.

Prefer native HTML semantics and behavior. When a custom interaction is necessary, its keyboard and assistive-technology behavior becomes an explicit, tested part of the component API.

## Content and data safety

- Use concise, neutral interface copy that explains outcomes without blame or unnecessary exposure of system details.
- Use synthetic fixtures only. Email examples must be clearly fictional and masked where a partial identifier is sufficient; financial examples must use invented, non-identifying values and be masked when full values are unnecessary.
- Never include secrets, credentials, real personal data, real account or portfolio data, or production-derived records in UI examples, stories, tests, documentation, logs, or screenshots.
- Authentication and recovery messages must not disclose whether an account, email, or other identifier exists; avoid account-enumeration language.
- Review screenshots for sensitive data, browser chrome, notifications, debug panels, and metadata before sharing or retaining them.

## Storybook contract

The existing OTP input story uses the older `Shared/OtpInput` title. It remains valid current content until a focused component or story task aligns it; the target naming contract below applies to new and materially changed stories.

- Colocate `*.stories.ts` with each shared visual component.
- Title stories `Shared/UI/<Name>`, `Shared/Forms/<Name>`, or `Shell/<Name>` according to component ownership.
- Use typed metadata and typed args so the story contract remains aligned with the component API.
- Include only supported states and behaviors; do not invent decorative examples.
- Use deterministic mocks and synthetic fixtures. Stories must make no live backend calls and must not depend on time, network, or mutable external state.
- Add `play` coverage for meaningful interactions such as keyboard input, validation, focus movement, selection, or dismissal.
- Keep the accessibility addon enabled and resolve findings or document a narrowly scoped, reviewed exception.
- Do not add new generated examples under `src/stories`; existing generated examples are separate migration work.

## Contribution workflow

1. Inspect existing shared and feature UI, Storybook, current tokens, and nearby consumers.
2. Classify ownership using the component taxonomy and architecture boundaries.
3. Define the public API and applicable supported states before implementation.
4. Implement with semantic tokens, native semantics, keyboard behavior, responsive content handling, and reduced-motion support as applicable.
5. Add or update focused tests and a colocated story when the ownership rules require one.
6. Run focused tests and `npm run build-storybook` for shared UI or story changes.
7. Review all consumers for visual, behavioral, accessibility, and migration impact.
8. Update this guide or architecture documentation only when the governing contract or boundary changes.

## Change review checklist

- [ ] Existing components and Storybook were searched, and reuse or extension was considered before adding a new abstraction.
- [ ] Ownership and location match the component taxonomy and architecture boundaries.
- [ ] Component styles consume semantic tokens; arbitrary values or compatibility overrides have a documented reason.
- [ ] Applicable states are explicit, implemented consistently, and covered without unsupported decorative stories.
- [ ] Responsive behavior handles the smallest supported viewport, long content, localization, and 200% zoom.
- [ ] Keyboard access, focus, programmatic names and relationships, non-color cues, and reduced motion were reviewed; every pointer target measures at least 24 by 24 CSS pixels or records evidence for an applicable WCAG 2.2 SC 2.5.8 exception (spacing, equivalent, inline, user-agent control, or essential); WCAG AA contrast was verified.
- [ ] Fixtures, copy, screenshots, and mocks are deterministic, synthetic, and privacy-safe.
- [ ] Focused tests cover meaningful behavior and contract changes.
- [ ] Required colocated Storybook stories and `play` interactions are present, and the static Storybook build passes when shared UI or stories changed.
- [ ] Consumer and migration impact is recorded, and breaking shared-contract changes migrate affected consumers together.

## Unresolved visual values and migration rules

The visual direction, target family, theme roles, category/status separation, and composition rules above are active guidance. Exact palette pairs, typography sizes and line heights, spacing and sizing scales, radius values, elevation, density, breakpoint values, icon-set selection, illustration style, motion values, and complete component variants still require explicit selection and implementation validation. No missing value should be inferred as an approved measurement from the PNGs.

When a task needs an unresolved value, inspect existing consumers, propose the smallest coherent shared scale or role mapping, validate representative states, and record the resulting decision here under the applicable section. Follow the governance requirements for public token changes. Until that happens, preserve existing behavior outside the task and document any scoped compatibility exception; do not create another normative style guide or silently promote incidental values to global policy.

Align application tokens and Material mappings before migrating dependent shared components. Prioritize representative buttons, inputs, and cards with their consumers and stories, then feature composition. Navigation changes remain a focused shell task. Existing raw colors and utilities are migration evidence, not alternative conventions.

For theme and shared-component migrations, verify applicable states, keyboard focus, contrast, reduced motion, narrow layouts, long labels, and 200% zoom. Compare rendered screens against the visual patterns described here. A static screenshot match or a successful Storybook build alone does not demonstrate accessibility or correct interaction.

## Related documentation

- [Frontend repository guide](../AGENTS.md)
- [Frontend architecture](ARCHITECTURE.md)
