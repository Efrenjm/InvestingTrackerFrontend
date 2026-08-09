# Frontend Design System

## Purpose and authority

This document is the frontend contract for shared UI, design tokens, styling layers, Storybook representation, responsive behavior, accessibility, and contribution rules. It governs new shared UI work and focused migrations; it does not authorize a repository-wide visual rewrite.

[`AGENTS.md`](../AGENTS.md) remains the always-loaded frontend rule source. [`ARCHITECTURE.md`](ARCHITECTURE.md) remains the source for structural boundaries and ownership. When work crosses these concerns, follow all three documents: this guide decides visual and shared-component conventions, while the other guides retain their stated authority.

## Audience and governance

This guide is for frontend contributors, reviewers, and coding agents who design, implement, or review application UI and its shared contracts. Frontend maintainers are the accountable owners of this guide and its enforcement.

At least one frontend maintainer must review and approve changes to the semantic-token taxonomy or a shared UI public API, any accessibility or security exception, and any breaking design-system contract. The change author must supply affected-consumer and migration evidence; approval is not implied by implementation alone.

Until BL-007 establishes an architecture-decision-record process, record every durable decision or temporary exception in an approved task or specification and reflect its enforceable outcome in this guide or, for a structural boundary, in `ARCHITECTURE.md`. A temporary exception must also state its scope, rationale, and removal condition and must not be treated as precedent. After BL-007 establishes that process, these records may migrate to ADRs and new decisions may use it, while the governing documents continue to state the active contract.

## Scope of this foundation

This foundation defines how the frontend should name and consume tokens, divide styling responsibilities, classify components, represent supported behavior, and review shared UI changes. It applies to application UI, shared form controls, application shell, feature UI, and the stories and tests that describe those contracts.

It establishes target conventions for incremental work. It does not assert that every target directory, token, component, theme, or story already exists, and it does not assign final brand values.

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
- This documentation task changes no CSS, theme, font, or component styling and does not claim that the current values are final brand decisions.

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

Light, dark, and high-contrast are extension points over the same semantic roles. The current application configures a light Material color scheme; this document does not claim that a complete light token contract, dark theme, or high-contrast theme is already implemented.

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

## Deliberately deferred visual decisions

Brand palette values, final font selection, detailed typography and density scales, final breakpoint values, icon-set policy, illustration style, motion personality, and complete component visual variants are reserved for a dedicated visual-design iteration. Until reviewed decisions exist, do not elevate current incidental values into permanent brand rules or create parallel placeholder policies.

## Related documentation

- [Frontend repository guide](../AGENTS.md)
- [Frontend architecture](ARCHITECTURE.md)
