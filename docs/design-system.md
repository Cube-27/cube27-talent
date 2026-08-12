# Cube27 Talent — Design System

**Status:** Locked for V1 implementation
**Prepared:** 12 August 2026
**Source of truth for:** colour, type, spacing, radius, elevation, motion, and every shared component on `talent.cube27.com`

> This document governs implementation. If a page needs something not defined here, the token or component is added to this file **first**, then used. Nothing is styled ad hoc in a page file. Priority when documents conflict: **invariants → V1 plan → this design system → implementation detail**.

---

## 1. Principles

1. **One accent job per colour.** Green means "act" (primary CTA) and "verified". Blue means "Cube27 / informational". Navy is structure. Nothing else is coloured.
2. **Evidence over decoration.** Visual weight goes to the candidate snapshot, the responsibility table, and the process — the things that prove the model. No decorative imagery.
3. **No unverified proof.** Any number rendered on the site comes from `src/data/proof.ts`, and every entry there carries a `verified` flag. Unverified entries do not render.
4. **Third person in headings.** No "we", "us", "our", "you", "your" in any `h1`–`h4`. Body copy may use natural language.
5. **Both funnels are always reachable.** Employer and candidate CTAs appear together in the header, the hero, and the audience split.
6. **Motion is a reveal, not a performance.** Entrance fades and one underline draw. Everything respects `prefers-reduced-motion`.

---

## 2. Colour tokens

Defined in `src/styles/tokens.css` as CSS custom properties and exposed to Tailwind v4 through `@theme inline`. Tailwind utilities read `--color-c27-*`; raw values live on `--c27-*`.

### 2.1 Surfaces

| Token             | Value     | Use                                                      |
| ----------------- | --------- | -------------------------------------------------------- |
| `--c27-ground`    | `#fafafa` | Page background                                          |
| `--c27-surface`   | `#ffffff` | Cards, panels, form fields, alternating sections         |
| `--c27-surface-2` | `#f8fafc` | Recessed areas: table head, snapshot footer, score boxes |
| `--c27-tint`      | `#eef1f8` | Lavender tint: bars, badges, candidate audience card     |
| `--c27-tint-2`    | `#f4f6fc` | Lightest tint: form section background                   |
| `--c27-navy`      | `#0b192c` | Announcement bar, footer, dark band base                 |
| `--c27-navy-2`    | `#16305c` | Dark band gradient end                                   |

### 2.2 Text

| Token         | Value     | Use                    | Min size |
| ------------- | --------- | ---------------------- | -------- |
| `--c27-ink`   | `#0b192c` | Headings, primary body | —        |
| `--c27-ink-2` | `#56617a` | Secondary body, labels | 14px     |
| `--c27-ink-3` | `#6b7590` | Tertiary, disclaimers  | 14px     |

`--c27-ink-3` was darkened from `#8b93ab` to clear 4.5:1 on `--c27-ground`. Do not lighten it.

### 2.3 Accent

| Token             | Value     | Use                                                               |
| ----------------- | --------- | ----------------------------------------------------------------- |
| `--c27-green`     | `#10b45f` | Primary CTA background, verified marks                            |
| `--c27-green-d`   | `#0d7a42` | CTA hover, green text on light (`#10b45f` fails contrast as text) |
| `--c27-blue`      | `#2563eb` | Icons, links, informational accent, secondary CTA                 |
| `--c27-blue-d`    | `#1d4ed8` | Blue hover, blue text on tint                                     |
| `--c27-blue-soft` | `#e8eefd` | Icon plates, selected chips, note blocks                          |
| `--c27-amber`     | `#b45309` | Pending/conditional markers only. Never a CTA                     |

### 2.4 Lines

| Token             | Value                    | Use                                            |
| ----------------- | ------------------------ | ---------------------------------------------- |
| `--c27-line`      | `#e2e8f0`                | Card borders, section dividers, hero grid wash |
| `--c27-line-2`    | `#eef1f6`                | Interior rules inside a card                   |
| `--c27-line-dark` | `rgba(255,255,255,0.18)` | Rules on navy                                  |

### 2.5 On-navy text

| Token                  | Value                    | Notes                                |
| ---------------------- | ------------------------ | ------------------------------------ |
| `--c27-on-navy`        | `#ffffff`                | Headings                             |
| `--c27-on-navy-2`      | `rgba(255,255,255,0.78)` | Body — raised from 0.66 for contrast |
| `--c27-on-navy-3`      | `rgba(255,255,255,0.62)` | Meta labels — floor. Never go below  |
| `--c27-on-navy-accent` | `#a8c3ff`                | Labels on navy                       |

**Contrast rule:** every text/background pair must clear WCAG 2.2 AA — 4.5:1 for body, 3:1 for text ≥24px or ≥19px bold. The three tokens above are the tested floors on navy.

---

## 3. Typography

Two families, self-hosted as variable `woff2` in `public/fonts/`, preloaded in `Layout.astro`.

| Role               | Family      | Token                | Weight          | Tracking             |
| ------------------ | ----------- | -------------------- | --------------- | -------------------- |
| Display / headings | Satoshi     | `--c27-font-display` | 700             | −0.03em to −0.038em  |
| Body / UI          | Switzer     | `--c27-font-body`    | 400 / 500 / 600 | 0                    |
| Data / code        | System mono | `--c27-font-mono`    | 500             | 0.1em when uppercase |

### 3.1 Scale

| Name      | Size                           | Line | Weight | Used for                             |
| --------- | ------------------------------ | ---- | ------ | ------------------------------------ |
| `display` | `clamp(2.1rem, 4.1vw, 3.4rem)` | 1.06 | 700    | `h1`, once per page                  |
| `h2`      | `clamp(1.6rem, 2.9vw, 2.3rem)` | 1.14 | 700    | Section headings                     |
| `h3-lg`   | `1.5rem`                       | 1.2  | 700    | Audience cards, process detail       |
| `h3`      | `1.0625rem`                    | 1.3  | 700    | Card titles                          |
| `body`    | `1rem`                         | 1.55 | 400    | Default                              |
| `body-sm` | `0.9375rem`                    | 1.5  | 400    | Card copy, table cells, lists        |
| `caption` | `0.8125rem`                    | 1.45 | 400    | Meta, disclaimers, form labels       |
| `label`   | `0.75rem`                      | 1.2  | 600    | Uppercase eyebrows, `0.1em` tracking |
| `micro`   | `0.6875rem`                    | 1.2  | 700    | Badges, owner tags, `0.1em` tracking |

**Hero size is capped at `3.4rem`.** Do not raise it.

### 3.2 Measure

Headings `text-wrap: balance`, max 17ch for `h1`, 20ch for `h2`. Body max 52ch, lede max 44ch.

---

## 4. Spacing, radius, elevation

**Spacing** uses the Tailwind 4px scale. Section rhythm is one token:

- `--c27-pad-section`: `clamp(3.5rem, 6.5vw, 6rem)` vertical, on every `<section>`
- `--c27-gutter`: `clamp(1.25rem, 4vw, 3.5rem)` horizontal
- Container: `max-width: 78rem`; narrow container `60rem` for FAQ and legal

**Radius**

| Token             | Value   | Use                                        |
| ----------------- | ------- | ------------------------------------------ |
| `--c27-radius-sm` | `8px`   | Buttons, inputs, icon plates, small panels |
| `--c27-radius`    | `10px`  | FAQ rows, process steps                    |
| `--c27-radius-lg` | `16px`  | Cards, tables, major panels                |
| pill              | `999px` | Chips, badges, status pills                |

**Elevation** — two shadows only. Borders do most of the separation work.

| Token             | Value                                                                    | Use                |
| ----------------- | ------------------------------------------------------------------------ | ------------------ |
| `--c27-shadow-sm` | `0 1px 2px rgb(11 25 44 / 0.04), 0 10px 30px -22px rgb(11 25 44 / 0.25)` | Floating chips     |
| `--c27-shadow-lg` | `0 2px 6px rgb(11 25 44 / 0.05), 0 32px 60px -34px rgb(11 25 44 / 0.4)`  | Snapshot card only |

Cards use `1px solid var(--c27-line)` and **no** shadow. The snapshot card is the single elevated object on the page.

---

## 5. Motion

| Name           | Value                                                         |
| -------------- | ------------------------------------------------------------- |
| Ease           | `cubic-bezier(0.22, 1, 0.36, 1)`                              |
| Reveal         | `opacity` + `translateY(16px)`, 620ms, stagger 90ms via `--d` |
| Underline draw | `background-size` 0 → 100%, 700ms, 450ms delay                |
| Bar fill       | `scaleX` 0 → 1, 900ms, staggered via `--bd`                   |
| Hover          | 180ms on colour, `translateY(-1px)` on buttons                |

All of the above sit inside `@media (prefers-reduced-motion: no-preference)`. Under `reduce`, revealed elements render at full opacity with no transform and bars render filled. **No parallax, no scroll-jacking, no autoplaying loops except the two hero chips.**

---

## 6. Components

Every component below exists as one Astro file. Pages compose them; pages never restyle them.

### 6.1 Button — `components/ui/Button.astro`

| Variant       | Background      | Text                                | Use                                |
| ------------- | --------------- | ----------------------------------- | ---------------------------------- |
| `primary`     | `--c27-green`   | white                               | Employer CTA. One per section, max |
| `blue`        | `--c27-blue`    | white                               | Candidate CTA                      |
| `line`        | `--c27-surface` | `--c27-ink`, 1px `#cbd5e1`          | Secondary                          |
| `line-invert` | transparent     | white, 1px `rgba(255,255,255,0.32)` | Secondary on navy                  |

Sizes `md` (0.8rem/1.35rem, 15px) and `sm` (0.55rem/1rem, 14px). Radius `--c27-radius-sm`, weight 700. Optional trailing `→` that translates 3px on hover.

### 6.2 Section shell — `components/ui/Section.astro`

Props: `id`, `tone` (`ground` | `surface` | `tint` | `dark`), `bordered`, `narrow`. Applies padding, container, background, and top/bottom hairlines. **No page sets its own section padding.**

### 6.3 Section head — `components/ui/SectionHead.astro`

Label (uppercase, blue) → `h2` → optional lede. Max 42rem, bottom margin `clamp(2rem, 4vw, 3rem)`. Every content section starts with one.

### 6.4 Snapshot card — `components/ui/SnapshotCard.astro`

The candidate profile template. **Always carries the `Template` badge and the "Not a live candidate" line** — invariant 32 forbids anything that reads as live inventory. Structure: header (icon, role, badge) → two score boxes → three progress bars → interviewer note → footer with verified stamp.

### 6.5 Stat — `components/ui/Stat.astro`

Value in Satoshi 800, label below in `body-sm`. Renders **only** when its `proof.ts` entry is `verified: true`.

### 6.6 Responsibility table — `components/sections/ResponsibilityTable.astro`

Three columns: Responsibility / Cube27 / Client. Green check for Cube27, blue check for Client, em dash for neither. Wrapped in `overflow-x: auto`, `min-width: 38rem`.

### 6.7 Tabbed selector — `components/ui/TabSelector.astro`

Side rail of buttons + detail panel. Used by Expertise (8 families) and Process (9 steps). Roving `aria-selected`, arrow-key navigation, `role="tablist"`. Server-renders the first panel so it works without JS.

### 6.8 Form controls — `components/forms/`

Field 8px radius, 1px `#d4dae9`, focus = blue border + 3px `rgb(37 99 235 / 0.14)` ring. Labels 13px/600 above the field. Errors: red text below the field, `aria-describedby`, plus a form-level summary that receives focus. Chips are pill checkboxes; checked = blue border, `--c27-blue-soft` fill.

**Select** — `components/ui/Select.astro`. Never a bare `<select>`: the native control is kept for the OS picker and keyboard behaviour, but `appearance-none` suppresses the platform arrow and a chevron from the icon set replaces it, rotating 180° on focus. `option` sets an explicit background and colour so the open list survives a dark OS theme. Right padding is `2.75rem` to clear the chevron.

### 6.10 Header

Three width bands, because both funnels must stay reachable (§1.5):

| Width          | Nav links         | Find a job        | Hire talent |
| -------------- | ----------------- | ----------------- | ----------- |
| ≥ `lg` (64rem) | In the bar        | In the bar        | In the bar  |
| < `lg`         | In the menu panel | In the menu panel | In the bar  |

The menu is a `<details>` element, so it opens with no JS. Script only adds close-on-Escape, close-on-outside-click, close-on-link, and close when crossing back to `lg`. The strapline under the wordmark hides below `sm`.

### 6.9 FAQ — `components/ui/Faq.astro`

Native `<details>`, 1px border, `+`/`–` in blue. First item open. No JS.

---

## 7. Page composition

Homepage order is fixed:

1. Announcement bar
2. Header (logo · nav · **Find a job** + **Hire talent**)
3. Hero — pill, `h1`, lede, 3 verified stats, dual CTA, snapshot card
4. Inclusions strip
5. Expertise selector
6. Model — three cards + responsibility table
7. Process — dark band, stepper
8. Audience split — companies / engineers
9. FAQ
10. Employer requirement form
11. Footer

**Not on the site in V1:** commercial/pricing section, client logos, testimonials, case studies, candidate inventory, job board, salary figures, delivery-time claims.

---

## 8. Accessibility floor

- WCAG 2.2 AA on every text pair; verify before adding a colour.
- Visible focus: 2px `--c27-blue`, 3px offset. Never removed.
- Landmarks: one `main`, `header`, `footer`, `nav[aria-label]`. Heading order never skips.
- Tap targets ≥ 44px everywhere, enforced with `min-h-11` on buttons, tab rails, process steps and menu rows — padding alone is not sufficient and was previously giving ~36px.
- Async form states announced via a `role="status"` live region.
- Everything except the tab selectors and form submission works without JS.

---

## 9. Adding to this system

1. Check an existing token or component covers it.
2. If not, add the token here with its contrast result, then to `tokens.css`.
3. Build it as a component in `components/ui/`, not inline in a page.
4. New colours need a stated single job. A fourth accent hue needs a business reason, not a visual one.
