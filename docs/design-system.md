# Design System — Editorial Signal

## 1. Visual direction

The interface is a contemporary Swiss editorial field applied to high-end B2B: precise, high-trust, and structured like a considered business journal rather than an agency website. Strong typography, generous whitespace, off-axis columns, and 1px rules create structure. Terracotta is an information signal, never decoration.

It must not read as a card-based SaaS template. The failure mode this system exists to prevent is a page that turns every paragraph into a bordered, shadowed, rounded box.

## 2. Non-negotiable rules

1. **Radius is `0`.** Every surface is a hard rectangle: panels, buttons, chips, fields, images, menus, tiles. There is no rounded variant and no exception.
2. **There is no card shadow.** Depth comes from colour fields, 1px rules, and offset blocks. The only shadow is `--c27-shadow-overlay`, reserved for menus and listboxes; never apply it to a section or content panel.
3. **A set of related items is a rule-divided lattice, not a row of boxes.** Use `.c27-rule-grid`. See §6.
4. **One terracotta accent carries actions, state, indices, and directional marks.** It is a signal colour: never use it to fill a decorative shape.
5. **A 1px rule is the only separator.** Three weights by structural role — see §3.
6. Gradients are limited to the blueprint grid overlays. No gradient text, glass, floating badges, decorative pills, or hover lifts.
7. **The primary hover idiom is colour + indent + arrow reveal.** Nothing lifts or gains a shadow. A restrained `ImagePanel` crop zoom is the only hover-scale exception; `:active` on a pressable control is the only other scale.
8. The hiring-process rail owns the most expressive motion.

### Portable flat subset

When this system is applied to another Cube27 property without a full visual redesign, transfer only these rules:

- Marketing sections, cards, panels, tables, navigation regions, and functional controls use `0` corner radius.
- A `1px` rule supplies structure. Borders must use that property's existing colour tokens.
- Content panels carry a fill **or** a rule, never a shadow. Menus, mobile navigation, and popovers take the overlay shadow.
- Hover and active states may change colour, border, or underline, but never lift or add elevation. A deliberate image crop may use the documented `ImagePanel` zoom when reduced motion disables it.
- Decorative pills, floating badges, glass panels, and nested cards are removed unless the component's meaning requires the shape.
- Existing colours, fonts, type scale, copy, information architecture, and media remain unchanged unless the project receives a separate redesign brief.

## 3. Colour roles

Every ratio below is measured, not estimated. Recompute before changing a value.

- **Ground:** white (`#ffffff`) — the main reading surface.
- **Surface:** white (`#ffffff`) for pills, menus, and overlay surfaces.
- **Surface 2:** warm parchment (`#f6f4ed`) — the consistent alternating band tone across pages.
- **Hero:** warm sand (`#ede4d6`) — the hero's right-hand field only.
- **Deep:** warm sand (`#ede4d6`) for the final CTA and the capability panel. It is a **light** tint, so its text ramp (`--c27-on-deep*`) mirrors the ink ramp rather than inverting it. Measured on it: 13.83 / 5.80 / 4.91 / 3.59.
- **Ink:** warm obsidian / deep charcoal (`#1b1a15`), with `#5a564e` and `#767066` beneath it. Measured minimum across all grounds: 17.42 on ground, 15.83 on surface-2, 13.83 on deep.
- **Accent — Light Soft Terracotta / Burnt Sienna (`#b66238`):** actions, links, focus, active state, index numerals, eyebrow squares, directional marks. Lighter and softer, free of harsh glare on mobile screens. Measured: 4.52 on ground, 4.11 on surface-2, 3.59 on deep, and 4.52 for white-on-terracotta. `--c27-accent-d` (`#944621`, 6.75 on white, 5.35 on deep) is the hover and pressed step.
- **Rules:** `--c27-line` (`#dfdbd2`) for list rows and control edges, `--c27-line-2` (`#d4cfc4`) for column dividers, `--c27-line-3` (`#c4beb1`) for the rule that opens a grid. These are deliberately stronger than a decorative hairline because they do the work a card border and shadow used to do.
- **Line control (`#7d776c`):** the single bottom rule identifying a form field. Measured 4.44 on ground, 4.00 on field fill, 3.53 on deep.
- **Footer (`#1b1a15`):** the one dark band, and only ever the footer — it closes the document rather than continuing the light rhythm, so it is never used as a section tone. Its ramp (`--c27-on-footer*`) inverts the ink ramp: measured on it, 17.42 / 10.37 / 6.55, with the link hover (`#e29b76`) at 7.62 and the wordmark numeral (`#d57c4b`) at 5.80. Focus ring uses `--c27-on-footer-accent`.
- **Image caption (`#1b1a15`):** the bar under a photograph. It sits below the frame, not over it, so it never covers the image and the fill is solid: 17.42 for white text.
- **Danger:** reserved for validation and errors.

All combinations meet WCAG AA.

## 4. Typography — The Enterprise Typography Ladder

Section designs follow the typography ladder, not the other way around. Typography cannot increase or decrease on an ad-hoc basis to satisfy local component styling. Hierarchy and visual parity are strictly governed.

Use the local DM Sans variable font:

- Display & Headings: DM Sans, weight 600, tight tracking.
- Body & Interface copy: DM Sans, regular (400) or medium (500).
- The variable file exposes weights 300–700. Components use 400, 500, or 600; 600 is the applied weight ceiling.

### The 11-tier hierarchy

1. **L1: Display (`--c27-text-display`, 38–48px / 1.05 / `-.035em`)** — homepage and campaign-scale H1s, capped at 20ch.
2. **L2: Page title (`--c27-text-h1`, 32–40px / 1.15 / `-.03em`)** — supporting-page H1s, capped at 24ch.
3. **L3: Section heading (`--c27-text-h2`, 30–40px / 1.15 / `-.03em`)** — main section H2s, capped at 24ch unless a split column supplies the measure.
4. **L4: Section lede (`--c27-text-lede`, 17–19px / 1.6)** — one short explanatory paragraph, capped at 65ch.
5. **L5: Feature title & capability statement (`--c27-text-card-title` / 20–24px / 1.25–1.3 / `-.025em`)** — H3 titles inside ruled groups, panels, and compact sections.
6. **L6: Body (`--c27-text-body`, 16px / 1.55–1.6)** — standalone prose, form values, and interface copy.
7. **L7: Compact body (`--c27-text-body-sm`, 15px / 1.55–1.65)** — list descriptions and supporting component copy.
8. **L8: Caption (`--c27-text-caption`, 13px / component-specific leading)** — metadata, form help, and compact annotations.
9. **L9: Metric (`--c27-text-metric`, 32–40px / 1 / `-.035em`)** — approved proof figures, in terracotta accent with tabular numerals.

Two tiers were added for the structural marks this system runs on. Neither is prose — never set a sentence at these sizes:

10. **L10: Eyebrow (`--c27-text-label`, 10px / `.15em` / uppercase)** — `.c27-label`, via `Eyebrow.astro`. Names the field a section sits in, opened by an 8×8px solid terracotta square. One per section, two or three words.
11. **L11: Index rail (`--c27-text-index`, 9px / `.14em` / uppercase)** — `.c27-index` via `IndexRail.astro`, and `.c27-side-label` for the bare variant. Numbers the section's place in the page's argument, with the numeral in terracotta accent.

### The emphasis clause

Headlines close on an emphasized clause rendered in Source Serif italic in terracotta accent (`.c27-emphasis`). Everywhere else the clause is quiet ink (`.c27-emphasis-quiet`); the line break alone carries the rhythm.

Headings use sentence case and describe an outcome, decision, or capability.

## 5. Layout

- **Full-bleed. There is no container and no max-width wrapper.** Sections run edge to edge and hold their own gutter via `.c27-wrap`.
- Line length is held by a `max-width` on the paragraph itself, not on an ancestor. This is what lets a section run edge to edge while its prose still sets at a readable measure.
- `.c27-wrap-narrow` (60rem, centred) is the single exception, for pages that are genuinely one column of text or fields.
- Main gutter: `clamp(1.25rem, 4.1vw, 5rem)`. Section padding: `clamp(4.5rem, 9vw, 10rem)`.
- **Layout splits are lopsided**, never 50/50: `7.25fr 5.75fr` (hero), `.8fr 1.2fr` (capability map), `.75fr 1.25fr` (FAQ), `.85fr 1.15fr` (final CTA). Executive search is the exception in kind rather than degree — its copy column is capped at a measure (`44rem`) and the image takes the remaining width, because a fraction there outgrew its own text.
- **Section heads are the one 50/50 split**, and deliberately so — see §6.
- **Nothing is centred.** An off-axis header is what makes a page read as an editorial field rather than a stack of marketing blocks. `SectionHead` offers `split` (default) and `stack`; there is no centred variant.
- **Cap the column, not the text.** Where a column is sized as a viewport fraction but its contents carry a `max-width` measure, the difference pools as dead space against the right edge on wide screens. Size the track to the content instead.
- Breakpoints: layout collapses at `56.25rem` (900px) and `32.5rem` (520px). **`.c27-rule-grid` collapses on its own thresholds** — `63.999rem` (1024px) for 4/3 columns → 2, and `40rem` (640px) → 1 — because four columns are already cramped well above 900px. Both sets are load-bearing; check all four.
- Mobile order follows reading priority, never desktop decoration.

## 6. Components

### Section heads

Every section opens the same way, through `SectionHead`. One pattern, no exceptions — the capability map had its own topline and executive search stacked an index rail on top of an eyebrow, and side by side they read as three different systems.

- **One label per section.** An `IndexRail` — a terracotta numeral and the name of the field, running in document order across the page. Never an index and an eyebrow together; `Eyebrow` is for sections that have no place in the numbered argument (the hero, the closing CTA).
- **A 50/50 split.** Heading in the left half flush to the left gutter, note in the right half flush to the right, `align-items: end`. This is the one place the system splits evenly: both halves close on a gutter, so nothing pools in between.
- **The heading fills its half** — the ladder's 24ch cap is lifted in the split variant. With every head on the same grid the column is what makes the wrap consistent; a cap inside a half-width column leaves the heading using half of its own half.
- **The right side is a note, not a lede.** 14px, right-aligned. At lede size it reads as a second headline competing with the first. The reference sets these at 14–15px throughout.
- `stack` is for heads that are a heading alone, or that sit above a single narrow column. It keeps the 24ch cap and left-aligns the note.

### Rule-divided columns — the card replacement

`.c27-rule-grid` is the core primitive and the reason this system has no card. One rule opens the group, one rule divides each column, and the last column clears both. Padding is asymmetric — nothing on the left, the full gutter on the right — so content sits flush to the rule on its left and the columns read as a single ruled field rather than as separate objects.

Set the desktop column count with `--c27-cols`. The class handles both step-downs (4/3 → 2 → 1) itself, so a consumer never matches Tailwind breakpoints to the rule logic.

### Filled panels

`.c27-panel` is a colour field holding a full sub-layout: no border, no shadow, no radius — the fill is the whole treatment.

### Buttons

`primary` is a solid terracotta fill with white text. `line` is a ruled outline. `link` is a ruled text link — the underline is a real border so it sits at a controlled distance from the baseline rather than through the descenders — and is the only element that moves its arrow (3px on hover). All variants press to `scale(.97)` on `:active`.

### Elevation hierarchy

1. **Page and section:** colour field only. Never a shadow, never a border box.
2. **Content panel:** a fill (`.c27-panel`) **or** a rule. Not both plus a shadow.
3. **Grouped items:** rules, via `.c27-rule-grid`.
4. **Functional control** — button, input, select, chip: fill and/or 1px boundary. Flat.
5. **Selected or interactive state:** colour and indent. No movement.
6. **Overlay:** surface fill, 1px boundary, and `--c27-shadow-overlay`.

### Image panels

Photography is evidence, not decoration: a hard rectangle flush to the grid, carrying a contained label that ties the people in it to the process being described. `ImagePanel.astro` composes a dark caption bar, a terracotta corner chip, and one corner mark — either the tight coordinate grid or the terracotta bracket. `caption` and `chip` both occupy the bottom edge; use one or the other. Required dimensions establish the frame's intrinsic aspect ratio and reserve space before the image loads; callers with a definite editorial crop may override that ratio with `auto`.

### Competency coordinates

`.c27-blueprint` lays a 68px terracotta grid at 8% behind an editorial field, masked so it fades out by 48% and never competes with copy set over it. `.c27-rule-mark` is the masthead flag: a 6×84px solid terracotta bar opening a page.

### Icons

Icons sit directly on the ground at 24px in terracotta accent. **There are no icon tiles.** The graded tile behind an icon was the last surviving piece of the card system and it made every list item look like a widget.

### Capability panel

The selected function's panel opens on its statement — no index inside it, because the numbered rail beside it already carries the position and marks the selected one. The metric sits beside the statement as a **tag**: a white chip holding a scope descriptor and what it covers. It annotates the statement rather than competing with it, so it is set at card-title size, not metric size.

A metric is a scope descriptor — `24/7`, `1→N`, `360°`, `C-level` — never a quantity we have delivered. Anything a reader could take as a tally of our work is an evidence claim and belongs in `data/proof.ts`, behind the approval path (PRODUCT.md, "Evidence on Hand").

### Forms

**A form is part of the page field, never a card placed on top of it.** The shell has no fill, inset padding, enclosing border, radius, or shadow. One stronger top rule opens the region and the submit area closes with the same rule.

**Controls are open ruled lines at rest.** Each has one 1px bottom rule in `--c27-line-control`, no top or side border, square corners, and a transparent background. On focus, `--c27-field-fill` creates a subtle active well and the rule turns terracotta accent, thickened with an inset shadow rather than a wider border so nothing shifts while tabbing.

Labels use the display face at 11px, uppercase with `0.1em` tracking. Entered values use the body face at 16px. Related controls may share columns, with a compact 24px row gap and individual baselines keeping them legible as fields rather than a spreadsheet. Multi-select choices use a rule-divided grid; selection is shown with the accent tint and text, not a pill.

**Third-party widgets are a layout risk the tokens cannot reach.** The Turnstile iframe has a 300px minimum width and is the only fixed-width element in either form. Any embedded widget needs checking at 320px in a real browser; a source-level read of the grid cannot see it.

### Hiring-process rail

Every phase is present in the DOM. Desktop uses a vertical spine with scroll-linked active state and a sticky explanatory header. Mobile presents the same phases as a static sequence. Reduced motion removes animated progression without removing content.

## 7. Motion

- Entry: opacity with no more than 16px translation, `--c27-ease`, 500ms.
- Interaction: 160ms on `--c27-ease-out` (`cubic-bezier(.23,1,.32,1)`).
- Hover: colour, a 10px indent, and a revealed arrow. Never elevation. The image crop zoom below is the sole hover-scale exception.
- `:active` presses to `scale(.97)` over 160ms.
- Image panels scale to 1.025 over 700ms on hover; with the `:active` press above, that is the only other scale in the system.
- Process progression: colour and line-length changes tied to viewport position.
- No autoplay, infinite motion, parallax, or decorative loops.
- `prefers-reduced-motion` removes transitions, the image zoom, and smooth scrolling.

## 8. Accessibility and resilience

- Maintain visible focus and logical keyboard order.
- Tablists implement what their role promises: roving tabindex, arrow keys with wraparound, and `aria-controls`/`aria-labelledby` wired both ways.
- Use semantic headings and landmarks.
- Interactive controls expose current state without relying on colour alone.
- Ensure 44px minimum interactive targets where practical.
- Preserve content and navigation without JavaScript — every capability panel renders unhidden.
- Test at 320, 375, 520, **640**, 768, 900, **1024**, 1280, and 1920. 640 and 1024 are where `.c27-rule-grid` collapses; the layout breakpoints alone do not cover them.
- **Exercise every state, not just the default one.** A width sweep of the capability map only ever measures the first function — the other six panels ship `hidden`, so their content is never laid out and an overflow in one of them will not show up.

## 9. Writing inside the interface

Use commercial claims, concrete nouns, and active verbs. Keep supporting paragraphs to one short sentence. Do not narrate internal operations. Buttons name the action: **Build your team**, **Send requirement**, **Apply to join**.
