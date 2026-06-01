# Design System Skill (design:design-system)

Manage and enforce the project's design system: tokens, components, and consistency.

## Responsibilities

- Define and maintain design tokens (color, spacing, typography, radius, shadow)
- Document component variants and states
- Enforce consistent naming conventions
- Flag deviations from the system when reviewing code

## Token Structure

```css
:root {
  /* Color */
  --color-primary: ...;
  --color-primary-hover: ...;
  --color-surface: ...;
  --color-on-surface: ...;

  /* Spacing (4px base grid) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Typography */
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;
}
```

## RTL Requirement

All design system components must use CSS logical properties. See `frontend-design` skill for the full property mapping. No physical `left`/`right` values in token definitions or component styles.

## When Invoked

- Audit existing code for token usage consistency
- Propose or document new tokens before they are hardcoded
- Generate component API documentation (props, variants, states)
- Identify duplicate or near-duplicate components that should be unified
