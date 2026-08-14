# Design System — Sharp, Flat, Enterprise

## 1. Visual direction

The interface is direct, commercial, and restrained. Compact headings, generous whitespace, colour fields, and hairlines create structure. It must feel like a credible enterprise service rather than a card-based SaaS template.

## 2. Non-negotiable rules

1. Section bands, content panels, and marketing cards have square corners.
2. Buttons, inputs, selects, and other functional controls use a 2–4px radius.
3. Cards and content panels combine a 1px hairline with the single restrained card shadow (`--c27-shadow-card`). Overlays use the stronger overlay shadow (`--c27-shadow-overlay`). Section bands, controls, and icon tiles stay flat.
4. Gradients are limited to authored neutral atmosphere fields, warm feature-card surfaces, and icon tiles. No gradient text, glass effects, floating badges, decorative pills, hover translation, or hover scaling.
5. One indigo accent carries actions and state. Supporting tints create page-level rhythm rather than isolated decoration.
6. A 1px hairline is the default separator.
7. The hiring-process rail owns the most expressive motion.

### Portable flat subset

When this system is applied to another Cube27 property without a full visual redesign, transfer only these rules:

- Marketing sections, cards, panels, tables, and navigation regions use `0px` corner radius.
- Buttons, form fields, selects, toggles, and other functional controls use a `2–4px` radius; `3px` is the default.
- A `1px` hairline supplies structure. Borders must use that property’s existing colour tokens.
- Cards and content panels carry a 1px hairline and one restrained downward card shadow together; the two are a single elevation step, not competing ones. Menus, mobile navigation, and popovers take the heavier overlay shadow. Section bands, form controls, and icon tiles carry no shadow.
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
- H1: `2.75rem` (44px) on sub-pages. The landing page runs a larger display scale — `clamp(2.125rem, 4.2vw, 3.125rem)`, topping out at 50px — because at 44px the hero heading sat too small against the width of that page. 50px is the ceiling for the site; no heading exceeds it, and no sub-page uses the landing scale.
- H2: `clamp(2rem, 3vw, 2.5rem)` with clear separation from body copy.
- H3: two sizes, assigned by role rather than by component.
  - `1.5rem` (`.c27-h3-lg`) — cards that carry a title plus a paragraph, and
    any heading that opens a block of prose. Compliance, ExpertiseSelector,
    ProcessRail phases, the _why-us_ panels.
  - `1.0625rem` (`.c27-h3`) — label-scale titles in dense rails where three or
    four cards sit across and the title is a name, not a sentence. Lifecycle,
    LeadershipHiring.
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

Padding is a token, not a per-panel choice: `--c27-pad-card-sm` for dense rails,
`--c27-pad-card` for the standard card, `--c27-pad-card-lg` for panels holding a
full sub-layout. Reach for the `.c27-card*` classes rather than re-assembling
fill, hairline, shadow and padding as utilities.

Panels use square corners, a fill or hairline, and deliberate padding. A page should not turn every paragraph into a card.

### Elevation hierarchy

1. **Page and section:** colour field only. Never a shadow.
2. **Inline panel or card:** fill, a 1px hairline, and `--c27-shadow-card`. All three together, applied consistently — a card surface that carries the hairline without the shadow reads as a different level than the card beside it, which is the failure mode to watch for.
3. **Functional control** — button, input, select, chip: fill and 1px boundary only. Controls stay flat so the card they sit on remains the raised object.
4. **Selected or interactive state:** existing accent fill or border; no movement.
5. **Overlay:** existing surface fill, 1px boundary where useful, and `--c27-shadow-overlay`.

The card shadow is deliberately slight and directional so the top edge stays crisp. Do not reach for the overlay shadow on a card, and do not introduce a third shadow value.

**Grid-lattice cards.** Where cards form a contiguous lattice sharing borders (Compliance, the _why-us_ proof rows), the shared hairlines are the lattice and each cell still takes the card shadow. Do not add a full border per cell — that doubles the seam.

### Icons and standards

Icon tiles come in three sizes, each with a fixed glyph size. Pick a pair; do
not interpolate.

| Tile                | Glyph | Used for                              |
| ------------------- | ----- | ------------------------------------- |
| `size-11` (2.75rem) | 20px  | Card and list icons — the default     |
| `size-12` (3rem)    | 24px  | Feature cards and process nodes       |
| `size-14` (3.5rem)  | 26px  | The single lead icon in a large panel |

Functional icons use restrained violet, blue, green, or orange accents on softly graded icon tiles. Compliance responsibilities use clear names with supporting context, never seals, badges, or trust-mark treatments.

### Forms

**Fields are wells, not boxes.** A `--c27-field-fill` tint with one 1px bottom
rule in `--c27-line-control`, no top or side border, and radius on the top
corners only. A boxed field was tried and rejected: four dark sides on fifteen
stacked inputs reads as a grid of cages on a page whose whole character is flat
hairlines.

The fill carries the visual read — a field looks like a field at a glance. The
bottom rule is what formally identifies it as a control, and because it sits
between the fill above and the card below it must clear 3:1 against **both**
(WCAG 1.4.11). The decorative `--c27-line` hairline cannot do this job at all;
it measures 1.31 on white.

Focus lifts the fill to white and turns the rule accent, thickened with an inset
shadow rather than a wider border so nothing shifts by a pixel while tabbing.

Buttons and chips keep the 3px radius on all corners and a 1px boundary — they
are pressable objects, not wells. Everything else holds: generous target height,
explicit labels, visible focus, inline help, grouped section rhythm, and
validation copy that is concise and actionable.

**Third-party widgets are a layout risk the tokens cannot reach.** The Turnstile
iframe has a 300px minimum width and is the only fixed-width element in either
form, which put both into horizontal scroll below a ~388px viewport until it was
switched to its 150px compact size there. Any embedded widget needs checking at
320px in a real browser; a source-level read of the grid cannot see it.

### Hiring-process rail

Every phase is present in the DOM. Desktop uses a vertical spine with scroll-linked active state and a sticky explanatory header. Mobile presents the same phases as a static sequence. Reduced motion removes animated progression without removing content.

## 7. Motion

- Entry motion: opacity with no more than 16px translation.
- Process progression: colour and line-length changes tied to viewport position.
- Duration: 160ms for controls and 500ms for entry/progress.
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
