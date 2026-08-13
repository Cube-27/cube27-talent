# Design System — flat, vibrant, colour-as-elevation

**Status:** Locked
**Prepared:** 13 August 2026
**Supersedes:** the previous design-system document in full
**Source of truth in code:** `src/styles/tokens.css` and the `@layer components` block in `src/styles/globals.css`

> Reference: Superhuman for the flat surface language and colour-as-elevation, Toptal for the professional register. Both build depth with tint and hairlines rather than shadow, and neither lifts anything on hover.

---

## 1. The seven hard rules

These are not preferences. A change that breaks one of them is a bug.

1. **No hover lift.** No `translateY`, no `scale`, no `transform` of any kind on `:hover`, anywhere. Hover changes a fill tint, a border colour or an underline. Nothing moves.
2. **Elevation is colour.** A raised surface is a tint step against its ground — a white card on a tinted section, a tinted card on a white section. A card never carries a drop shadow.
3. **One shadow, for overlays only.** `--c27-shadow-overlay` belongs to things that genuinely float above the page: the stuck header, select menus, the mobile nav sheet. Never a content card.
4. **Hairlines.** A 1px `--c27-line` is the default boundary between surfaces. It does more work than any shadow.
5. **One accent.** Indigo carries every action, link and active state. Tints carry grouping and rhythm. Nothing else is coloured — no success green, no warning amber, no second brand colour.
6. **No gradients on content surfaces.** Flat fills only.
7. **The motion budget goes to the nine steps.** With hover motion gone, the process rail is where the site spends its animation. Everywhere else: a single fade-and-rise on entry, and nothing more.

---

## 2. Colour

Every ratio below is measured, not estimated. Recompute before changing any value.

### 2.1 Grounds

| Token               | Value     | Role                             |
| ------------------- | --------- | -------------------------------- |
| `--c27-ground`      | `#ffffff` | Page background                  |
| `--c27-surface`     | `#ffffff` | Card on a tinted section         |
| `--c27-surface-2`   | `#f7f7fb` | Card on a white section          |
| `--c27-tint-violet` | `#ece9fe` | Primary accent panel             |
| `--c27-tint-mint`   | `#e4f6ec` | Second panel in a set            |
| `--c27-tint-peach`  | `#fdeee4` | Third panel in a set             |
| `--c27-tint-sky`    | `#e4eefe` | Fourth panel in a set            |
| `--c27-deep`        | `#171325` | Nine-step section, footer        |
| `--c27-deep-2`      | `#241d3d` | Raised block inside a deep panel |

The four tints exist so a set of cards can be differentiated by colour instead of by elevation. Cycle them in order; do not invent a fifth.

### 2.2 Ink

| Token         | Value     | On white | On the darkest tint (`#ece9fe`) | Use                    |
| ------------- | --------- | -------- | ------------------------------- | ---------------------- |
| `--c27-ink`   | `#1c1a22` | 17.21    | 14.47                           | Headings and body      |
| `--c27-ink-2` | `#55535f` | 7.53     | 6.33                            | Secondary body, ledes  |
| `--c27-ink-3` | `#6b6878` | 5.42     | 4.55                            | Captions and meta only |

`--c27-ink-3` is the floor of the system. It clears AA on all six light grounds with 4.55 to spare at worst, and it must never be used below `--c27-text-caption`, nor for anything a visitor has to read to complete a task.

`#7a7786` was tested first and rejected: 3.67 on the violet tint, a clear AA failure.

### 2.3 Accent

| Token               | Value     | Notes                                                                                                                                                                               |
| ------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--c27-accent`      | `#4f39f6` | 6.46 on white, 5.43 on the darkest tint, and **6.46 for white text on it as a fill**. One value serves as link text and as the primary button fill, which is why there is only one. |
| `--c27-accent-d`    | `#3d28d4` | Hover and press. 8.56 under white text.                                                                                                                                             |
| `--c27-accent-soft` | `#ece9fe` | Accent-tinted fill — same value as `--c27-tint-violet`, named for intent.                                                                                                           |

### 2.4 Lines

| Token             | Value                    | Role                            |
| ----------------- | ------------------------ | ------------------------------- |
| `--c27-line`      | `#e6e5ee`                | Default hairline                |
| `--c27-line-2`    | `#f1f0f6`                | Internal dividers inside a card |
| `--c27-line-deep` | `rgba(255,255,255,0.12)` | Hairline on a deep panel        |

### 2.5 On deep panels

The two alpha tokens are measured **composited** over their ground — the alpha value itself tells you nothing about contrast, so the ratios below are the flattened colours.

| Token                  | Value                    | On `--c27-deep` | On `--c27-deep-2` | Use                      |
| ---------------------- | ------------------------ | --------------- | ----------------- | ------------------------ |
| `--c27-on-deep`        | `#ffffff`                | 18.16           | 15.93             | Headings, active state   |
| `--c27-on-deep-2`      | `rgba(255,255,255,0.82)` | 12.36           | 11.07             | Body                     |
| `--c27-on-deep-3`      | `rgba(255,255,255,0.60)` | 7.07            | 6.56              | Meta only, never body    |
| `--c27-on-deep-accent` | `#c4b5fd`                | 9.84            | 8.63              | Labels, active rail node |

### 2.6 Elevation

```css
--c27-shadow-overlay: 0 8px 28px -12px rgba(23, 19, 37, 0.22);
```

The only shadow in the system. Rule 3 governs where it may appear.

---

## 3. Type

Faces are unchanged: **Figtree** for display, **Switzer** for body, both self-hosted and preloaded.

| Token                | Value                           | Role                    |
| -------------------- | ------------------------------- | ----------------------- |
| `--c27-text-display` | `clamp(2.4rem, 5vw, 4rem)`      | H1                      |
| `--c27-text-h2`      | `clamp(1.75rem, 3.2vw, 2.6rem)` | Section headings        |
| `--c27-text-h3-lg`   | `1.5rem`                        | Panel headings          |
| `--c27-text-h3`      | `1.0625rem`                     | Card headings           |
| `--c27-text-body`    | `1rem`                          | Body                    |
| `--c27-text-body-sm` | `0.9375rem`                     | Dense body, form fields |
| `--c27-text-caption` | `0.8125rem`                     | Captions, labels        |
| `--c27-text-label`   | `0.75rem`                       | Uppercase eyebrow       |
| `--c27-text-micro`   | `0.6875rem`                     | Badges only             |

Headings are `font-weight: 600`, `letter-spacing: -0.03em`, `text-wrap: balance`. Display runs tighter at `-0.04em` — flat systems can carry more negative tracking than shadowed ones because there is no blur softening the edges.

Measures: display 17ch, h2 24ch, lede 52ch, body 68ch.

---

## 4. Space, radius, layout

```css
:root {
  --c27-gutter: clamp(1.25rem, 4vw, 3.5rem);
  --c27-pad-section: clamp(4rem, 7vw, 7rem);
  --c27-container: 78rem;
  --c27-container-narrow: 60rem;

  --c27-radius-sm: 10px; /* inputs, chips, small controls */
  --c27-radius: 14px; /* cards, buttons */
  --c27-radius-lg: 20px; /* panels, form containers */
}
```

Tighter than the previous system by 2px at every step. Flat surfaces read sharper with less rounding; softness was doing shadow's job before.

---

## 5. Components

### 5.1 Buttons

| Variant   | Rest                                       | Hover                                           | Notes                   |
| --------- | ------------------------------------------ | ----------------------------------------------- | ----------------------- |
| `primary` | `--c27-accent` fill, white text            | `--c27-accent-d` fill                           | The one action per view |
| `line`    | Transparent, `--c27-line` border, ink text | `--c27-accent-soft` fill, `--c27-accent` border | Secondary               |
| `ghost`   | Transparent, ink-2 text                    | `--c27-surface-2` fill                          | Tertiary, nav           |
| `on-deep` | White fill, `--c27-deep` text              | `--c27-on-deep-2` fill                          | Inside a deep panel     |

Colour and border transition at 160ms. **No transform**, no shadow, in any state.

### 5.2 Cards

A card is a fill plus a hairline plus padding. That is the whole recipe.

- On a white section: `--c27-surface-2` fill or a tint, with `--c27-line`.
- On a tinted section: `--c27-surface` fill, with `--c27-line`.
- Interactive card hover: border shifts to `--c27-accent`, fill shifts one tint step. Nothing moves.

### 5.3 Form controls

`--c27-radius-sm`, `--c27-surface` fill, `--c27-line` border, `--c27-ink` text at `--c27-text-body-sm`, 3rem tall so inputs and selects align in a row. Focus: `--c27-accent` border plus a 3px `--c27-accent` ring at 15% opacity. The form container is a hairline panel with **no shadow**.

Errors use `#b42318` text on `#fef3f2` with a `#b42318` left rule — the one place a colour outside the accent is permitted, because an error must not read as an action.

### 5.4 The process rail

Documented in full in the V1 plan §6.1 and implemented in `src/components/sections/ProcessRail.astro`. Visual specification:

- Full-bleed `--c27-deep` section.
- Nine nodes on a rail, with a progress bar filling left to right in `--c27-on-deep-accent`.
- Node states: upcoming is a hairline circle; complete is filled `--c27-on-deep-accent` at low opacity; active is a solid white circle with `--c27-deep` glyph.
- Detail panel on `--c27-deep-2` with a `--c27-line-deep` hairline, cross-fading between steps.
- Autoplay advances every 5s once the section is half visible, stops permanently on first interaction, pauses on pointer-over and when the tab is hidden, and stops at step nine rather than looping.
- Autoplay never calls `.focus()`.

---

## 6. Motion

```css
:root {
  --c27-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --c27-dur: 500ms; /* entry reveal */
  --c27-dur-fast: 160ms; /* colour and border transitions */
}
```

**Entry reveal.** Elements opt in with `.c27-rise` and stagger with `style="--c27-d: 90ms"`. An `IntersectionObserver` in `Layout.astro` marks everything already on screen as revealed _before_ switching on the hidden state, then adds `.reveal` to the root — this is what keeps the first screen from painting at `opacity: 0` and losing the LCP candidate. Do not move that logic into CSS.

A small `translateY` on **entry** is allowed and is not a violation of rule 1. Rule 1 governs `:hover`.

**Reduced motion.** `prefers-reduced-motion: reduce` disables every animation and transition site-wide, cancels autoplay, and renders all nine step panels stacked and readable.

---

## 7. Accessibility

- Focus is never removed: 2px `--c27-accent` outline at 3px offset, on every interactive element.
- Every colour pairing in §2 is measured and recorded. Recompute before changing a value; do not estimate.
- The process rail keeps full `tablist`/`tab`/`tabpanel` semantics, roving `tabindex`, and arrow/Home/End navigation.
- Tab panels ship with `hidden` and are un-hidden by CSS when the root lacks `.js`, so a scripted visit paints one panel and an unscripted visit paints all nine.
- No horizontal overflow at 375px. Wide content scrolls inside its own container.

---

## 8. Writing

Governed by the invariants' four rules. Additionally:

- **First person plural.** We, our team, our engineers. Never the company name (invariant rule 0.1).
- **Headings are statements**, not labels. "Nine steps. One team that stays." not "Our Process".
- **Sentence case** everywhere except the uppercase eyebrow label.
- **British spelling.**
- Short sentences. Concrete nouns. No narrative framing, no rhetorical questions, no "imagine", no invented customer stories.
- Numerals for counts and figures.
