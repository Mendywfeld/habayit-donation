# Design Handoff Skill (design:design-handoff)

Translate design specs into developer-ready documentation and code.

## Handoff Deliverables

When handed a design (description, screenshot, or Figma spec), produce:

1. **Component structure** — semantic HTML skeleton
2. **CSS specifications** — tokens used, spacing, typography, colors
3. **States** — default, hover, focus, active, disabled, loading, error
4. **RTL notes** — any mirroring or direction-specific behavior
5. **Assets needed** — icons, images, fonts

## RTL Handoff Notes (Required for Every Component)

Always include an RTL section in handoff docs:

```
## RTL Behavior
- Layout direction: rtl (inherited / explicit)
- Icon mirroring: [list which icons flip]
- Padding/margin: all values use logical properties
- Text: Hebrew primary, dir="ltr" on [list any LTR sub-elements]
```

## Output Format

For each component, produce a spec block:

```
### ComponentName

**Purpose:** One sentence.

**HTML:**
<semantic markup>

**Tokens:**
- Background: --color-surface
- Text: --color-on-surface
- Spacing: --space-4 (padding-inline)

**States:**
- default: ...
- hover: background --color-primary-hover
- focus: outline 2px solid --color-focus-ring, outline-offset 2px
- disabled: opacity 0.4, cursor not-allowed

**RTL:**
- Icon at inline-start (chevron mirrors in RTL)
- Text alignment: start

**Accessibility:**
- role, aria-* needed
```

## When Invoked

- Convert a design description into a developer spec
- Document an existing component for the design system
- Generate implementation checklist from a Figma screenshot or description
- Specify responsive breakpoints and behavior
