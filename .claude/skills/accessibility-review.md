# Accessibility Review Skill (design:accessibility-review)

Audit and fix accessibility issues. Target WCAG 2.1 AA compliance.

## RTL Accessibility

This project uses Hebrew RTL layout. Specific RTL a11y concerns:

- `lang="he"` on `<html>` (or the relevant subtree)
- `dir="rtl"` on `<html>` (inherited by all elements)
- Screen readers (NVDA, JAWS, VoiceOver) handle RTL text correctly when `lang` and `dir` are set
- Mixed-direction text: use `<span dir="ltr">` for inline LTR segments (phone numbers, URLs, English names)
- Bidi isolation: use `unicode-bidi: isolate` on elements that may contain bidirectional content

## WCAG Checklist

**Perceivable:**
- [ ] All images have meaningful `alt` text (decorative: `alt=""`)
- [ ] Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text (≥18pt or 14pt bold)
- [ ] No information conveyed by color alone

**Operable:**
- [ ] All interactive elements reachable by keyboard (Tab / Shift+Tab)
- [ ] Visible focus indicator on every interactive element
- [ ] No keyboard traps
- [ ] Skip-to-main link present
- [ ] No content that flashes >3 times/second

**Understandable:**
- [ ] `lang` attribute on `<html>`
- [ ] Labels on all form inputs (via `<label>`, `aria-label`, or `aria-labelledby`)
- [ ] Error messages associated with their input via `aria-describedby`
- [ ] Consistent navigation and labeling

**Robust:**
- [ ] Valid HTML (no duplicate IDs, no missing required attributes)
- [ ] ARIA used correctly (roles match element behavior)
- [ ] Interactive components have correct ARIA states (`aria-expanded`, `aria-selected`, etc.)

## Common ARIA Patterns

```html
<!-- Button that toggles -->
<button aria-expanded="false" aria-controls="menu-id">תפריט</button>

<!-- Form field with error -->
<label for="amount">סכום תרומה</label>
<input id="amount" aria-describedby="amount-error" aria-invalid="true">
<span id="amount-error" role="alert">נא להזין סכום חוקי</span>

<!-- Icon-only button -->
<button aria-label="סגור">✕</button>
```

## When Invoked

- Audit a component or page for a11y issues, ordered by severity
- Fix specific accessibility failures in existing code
- Add ARIA roles/attributes to an existing component
- Verify color contrast ratios
