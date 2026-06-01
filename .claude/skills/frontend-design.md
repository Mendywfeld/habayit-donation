# Frontend Design Skill

You are a frontend design expert for this project. Apply these preferences on every task.

## Language & Layout

- **Primary language:** Hebrew
- **Default direction:** `direction: rtl` on all containers and layout roots
- **Default text alignment:** `text-align: right` (or `text-align: start` with logical properties)

## Font Stack

Always load from Google Fonts and use this stack for Hebrew content:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&family=Assistant:wght@300;400;600;700&family=Rubik:wght@300;400;500;700&display=swap" rel="stylesheet">
```

```css
:root {
  --font-primary: 'Heebo', 'Assistant', 'Rubik', system-ui, sans-serif;
}

body {
  font-family: var(--font-primary);
  direction: rtl;
  text-align: right;
}
```

Heebo → body text. Assistant → UI labels and captions. Rubik → headings and emphasis.

## RTL-First CSS

All layouts must default to RTL. Apply `direction: rtl` at the root and never assume LTR.

```css
html {
  direction: rtl;
}
```

For mixed-language content (numbers, English inline text), use `unicode-bidi: embed` on the inline element.

## Logical Properties (Required)

Never use physical directional properties. Always use CSS logical properties:

| Avoid (physical)      | Use instead (logical)           |
|-----------------------|---------------------------------|
| `margin-left`         | `margin-inline-start`           |
| `margin-right`        | `margin-inline-end`             |
| `padding-left`        | `padding-inline-start`          |
| `padding-right`       | `padding-inline-end`            |
| `border-left`         | `border-inline-start`           |
| `border-right`        | `border-inline-end`             |
| `left` / `right`      | `inset-inline-start` / `inset-inline-end` |
| `text-align: left`    | `text-align: start`             |
| `text-align: right`   | `text-align: end`               |
| `float: left`         | `float: inline-start`           |

## RTL Component Mirroring

When building any component, check these RTL mirroring concerns:

**Flex layouts:**
```css
/* Row direction auto-mirrors in RTL — prefer this over reversing manually */
.nav { display: flex; flex-direction: row; }
/* If you must reverse, use logical: do NOT use flex-direction: row-reverse to simulate RTL */
```

**Icons and directional affordances:**
- Arrows pointing right (→) should point left (←) in RTL — use CSS `transform: scaleX(-1)` or separate RTL icon variants
- Back/forward chevrons, carousels, sliders, progress indicators all need RTL mirroring
- Checkmarks, close icons, info icons do NOT need mirroring

**Navigation:**
- Primary navigation flows right-to-left in RTL
- Breadcrumbs: Home > Section > Page becomes Page < Section < Home (separator flips)
- Dropdowns open toward the inline-start edge

**Form inputs:**
- Inputs for Hebrew text: `dir="rtl"` on the element
- Inputs for numbers/IDs/emails: `dir="ltr"` to keep LTR input behavior
- Placeholder text must match the field's direction

**Scroll and overflow:**
- Horizontal scrolling in RTL starts from the right — test with `overflow-x: auto`

## Component Checklist

Before declaring a component done, verify:
- [ ] `direction: rtl` applied (inherited or explicit)
- [ ] All spacing uses logical properties
- [ ] Directional icons are mirrored
- [ ] Focus ring and outline are direction-aware
- [ ] Tested at 375px (mobile) and 1280px (desktop) widths in RTL
- [ ] No hardcoded `left`/`right` CSS that breaks RTL
