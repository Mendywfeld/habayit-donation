# Design Critique Skill (design:design-critique)

Review UI/UX decisions and provide structured, actionable feedback.

## Critique Framework

Evaluate designs across five dimensions:

1. **Clarity** — Is the purpose immediately obvious? Can users predict outcomes?
2. **Consistency** — Does it match the design system and existing patterns?
3. **RTL Correctness** — Is the layout, mirroring, and typography correct for Hebrew RTL?
4. **Accessibility** — Does it meet WCAG AA? Can all users complete the task?
5. **Efficiency** — Can users accomplish the goal with minimal friction?

## Output Format

```
## Design Critique: [Component / Screen Name]

### Strengths
- ...

### Issues

| Severity | Dimension | Issue | Recommendation |
|----------|-----------|-------|----------------|
| Critical | RTL | Icon not mirrored | Apply transform: scaleX(-1) in RTL context |
| Major | Clarity | CTA label is vague ("אישור") | Use action verb: "שלח תרומה" |
| Minor | Consistency | Border radius deviates from --radius-md | Align to token |

### RTL Checklist Results
- [ ] direction: rtl ✓/✗
- [ ] Logical properties only ✓/✗
- [ ] Directional icons mirrored ✓/✗
- [ ] Hebrew font stack loaded ✓/✗

### Recommended Next Steps
1. ...
2. ...
```

## Severity Definitions

- **Critical** — Broken for users (a11y failure, RTL layout collapse, missing affordance)
- **Major** — Significantly degrades experience (confusing copy, inconsistent behavior)
- **Minor** — Polish issue (off-token value, slight spacing inconsistency)
- **Suggestion** — Optional improvement worth considering

## When Invoked

- Critique a component design before implementation
- Review a PR diff for UX regressions
- Evaluate a page layout against UX best practices
- Compare two design options and recommend one with reasoning
