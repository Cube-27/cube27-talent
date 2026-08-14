# Design System — Sharp, Flat, Enterprise

## 1. Visual direction

The interface is direct, commercial, and restrained. Compact headings, generous whitespace, colour fields, and hairlines create structure. It must feel like a credible enterprise service rather than a card-based SaaS template.

## 2. Non-negotiable rules

1. Section bands, content panels, and marketing cards have square corners.
2. Buttons, inputs, selects, and other functional controls use a 2–4px radius.
3. Content surfaces never use drop shadows. Overlays may use the single overlay shadow.
4. Gradients are limited to authored neutral atmosphere fields, warm feature-card surfaces, and icon tiles. No gradient text, glass effects, floating badges, decorative pills, hover translation, or hover scaling.
5. One indigo accent carries actions and state. Supporting tints create page-level rhythm rather than isolated decoration.
6. A 1px hairline is the default separator.
7. The hiring-process rail owns the most expressive motion.

### Portable flat subset

When this system is applied to another Cube27 property without a full visual redesign, transfer only these rules:

- Marketing sections, cards, panels, tables, and navigation regions use `0px` corner radius.
- Buttons, form fields, selects, toggles, and other functional controls use a `2–4px` radius; `3px` is the default.
- A `1px` hairline supplies structure. Borders must use that property’s existing colour tokens.
- Content surfaces do not use shadows. Shadows are reserved for genuine overlays such as menus, mobile navigation, and popovers.
- Hover and active states may change colour, border, or underline, but never translate, lift, or scale.
- Decorative pills, floating badges, glass panels, and nested cards are removed unless the component’s meaning requires the shape.
- Existing colours, fonts, type scale, copy, information architecture, and media remain unchanged unless the project receives a separate redesign brief.

## 3. Colour roles

- **Ground:** warm ivory (`#faf9f5`) for the main reading surface.
- **Surface:** crisp white or pale stone (`#f4f2ee`) for grouped content.
- **Ink:** softened deep charcoal slate (`#21252d`) for display and body text to reduce eye strain while maintaining > 13:1 WCAG AA contrast.
- **Secondary ink:** muted neutral slate (`#4d535e`) for supporting copy.
- **Muted ink:** subtle caption slate (`#626875`).
- **Accent:** deep indigo (`#3b38d8`) for actions, links, focus, and active process state.
- **Neutral field:** soft grey linear gradient (`#f7f7f5` to `#ebebe8`) for transition regions. Primary marketing heroes use a stronger asymmetric indigo-and-stone light field, one broad geometric light plane, and extremely fine monochrome grain. Structural separation below them comes from spacing and colour fields rather than decorative guide lines.
- **Deep field:** charcoal grey (`#25282e`) with high-contrast text (`#f8fafc`) for footer and conversion sections.
- **Supporting fields:** restrained, monochromatic soft micro-tints (violet, mint, peach, sky) for subtle section differentiation without loud multi-color gradients.
- **Feature surface:** a pale stone vertical gradient used on selected marketing cards.
- **Danger:** reserved for validation and errors.

All combinations meet WCAG AA.

## 4. Typography

Use the existing local Hauora and Switzer variable fonts.

- Display headings: Hauora, strong weight, tight tracking, short line length.
- Body and interface copy: Switzer, regular or medium weight.
- Weight ceiling: 600 across headings, buttons, labels, metrics, and body copy. Do not load or apply 700–900 weights.
- H1: `2.75rem` (44px). No public heading exceeds 44px.
- H2: `clamp(2rem, 3vw, 2.5rem)` with clear separation from body copy.
- H3: 1.125–1.5rem depending on function.
- Non-heading text, including proof metrics, stays below the heading scale.
- Labels are compact and direct; do not use tracked uppercase as decoration everywhere.

Headings use sentence case and describe an outcome, decision, or capability.

## 5. Layout

- Maximum content width: approximately 80rem.
- Main gutter: fluid from 1.25rem to 4rem.
- Section padding: fluid from 3.5rem to 6rem.
- Use full-width colour bands, asymmetrical grids, and editorial dividers instead of collections of floating cards.
- Mobile order follows reading priority, never desktop decoration.

## 6. Components

### Buttons

Primary buttons use solid indigo, white text, 3px radius, and a colour-only hover/pressed state. Secondary actions use text links or hairline buttons. Buttons never lift or scale.

### Content panels

Panels use square corners, a fill or hairline, and deliberate padding. A page should not turn every paragraph into a card.

### Elevation hierarchy

1. **Page and section:** colour field only.
2. **Inline panel or card:** fill plus optional 1px hairline; no shadow.
3. **Selected or interactive state:** existing accent fill or border; no movement.
4. **Overlay:** existing surface fill, 1px boundary where useful, and one soft offset shadow.

Do not combine a hairline and a large card shadow to communicate the same elevation level.

### Icons and standards

Functional icons use restrained violet, blue, green, or orange accents on softly graded icon tiles. Compliance responsibilities use clear names with supporting context, never seals, badges, or trust-mark treatments.

### Forms

Controls use a 3px radius, 1px boundary, generous target height, explicit labels, visible focus, inline help, and grouped section rhythm. Validation copy is concise and actionable.

### Hiring-process rail

Every phase is present in the DOM. Desktop uses a vertical spine with scroll-linked active state and a sticky explanatory header. Mobile presents the same phases as a static sequence. Reduced motion removes animated progression without removing content.

## 7. Motion

- Entry motion: opacity with no more than 12px translation.
- Process progression: colour and line-length changes tied to viewport position.
- Duration: approximately 160ms for controls and 450ms for entry/progress.
- No autoplay, infinite motion, parallax, or decorative loops.
- `prefers-reduced-motion` removes transitions and smooth scrolling.

## 8. Accessibility and resilience

- Maintain visible focus and logical keyboard order.
- Use semantic headings and landmarks.
- Interactive controls expose current state without relying on colour alone.
- Ensure 44px minimum interactive targets where practical.
- Preserve content and navigation without JavaScript.
- Test at narrow mobile, standard mobile, tablet, and desktop widths.

## 9. Writing inside the interface

Use commercial claims, concrete nouns, and active verbs. Keep supporting paragraphs to one short sentence. Do not narrate internal operations. Buttons name the action: **Build your team**, **Send requirement**, **Apply to join**.
