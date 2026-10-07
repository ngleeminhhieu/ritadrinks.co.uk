# RITA UK — Design System

Rules for building and editing the ritadrinks.co.uk frontend. Every value below exists as a CSS custom property on `:root` in `css/site.css`. Use the token; never type the raw number.

Figma frames are **1728 px wide** (MacBook Pro 16" preset, exported at 2×). The site's reference screen is **1920 px**: every size token reaches its maximum there and scales down **in proportion to the viewport** until it hits its mobile minimum, so a 1440 laptop shows the UI at ≈ 75 % — like the Figma frame zoomed to fit. Maximums sit ≈ 10 % below the Figma values on purpose: the UI should never feel oversized (see Typography → Fluid sizing).

---

## 1. Golden rules

1. **Tokens only.** No raw `font-size`, `line-height`, color, `border-radius`, `box-shadow` or transition duration outside `:root`. If a value is missing, add a token first.
2. **Width comes from `.container`.** Sections and grids never set their own `max-width`, `margin: auto` or `padding-inline`.
3. **Vertical spacing comes from `.ss-pd`.** Never override a section's `padding-top` / `padding-bottom` per section or per breakpoint. When two adjacent sections share a background, the earlier one gets `.pdb-0` and the later one keeps its top padding (so the gap is one `--pd-sc`). `.pdt-0` is only for a section that follows a non-section bar such as the breadcrumb `.crumb-bar`.
4. **Fluid tokens do the responsive work.** Don't re-declare a font size inside a media query. If a size looks wrong on mobile, change the token's minimum.
5. **Reuse components** (`.button`, `.nav-button`, `.section-head`, cards) before writing new CSS.
6. **No comments in code.** Explain decisions in the PR or chat, not in CSS/JS/HTML.
7. **JS hooks are separate from styling.** Add a `…JS` class (`heroSliderJS`, `loadMoreListJS`) for JavaScript and never style it.
8. **Name classes after the component, never the page.** No `home-`, `story-`, `contact-`… prefixes: any section can be reused on another page (`.capabilities`, `.exhibitions`, `.certificates`, `.stats`, `.collage-intro`). BEM for parts (`.stat__value`) and modifiers (`.capabilities__decor--left`). `<body>` gets no page class.
9. **Lock page scroll on `body`, never on `html`.** Popups and panels use `body:has(.x[open]) { overflow: hidden }`. Setting `overflow` on `html` turns `body` (which has `overflow-x: hidden`) into its own scroll container, and the sticky header jumps back to the top of the page.
10. **Copy is UK English.** -ise / -our / -re spellings (customise, flavour, colour, metres, programme, aluminium), “enquiry” for contact requests, sentence case for headings and article titles, dates as “28 Sep 2026”. Product SKU names follow the same spelling. Write for B2B buyers: say “beverage(s)”, “product” or “formula”, not “drink(s)”. Keep “drink” only where it is a fixed name: product category labels, SKU names, official award titles, the company name RITA Food &amp; Drink Co., Ltd and the trade term “ready-to-drink”.
11. **Clean document outline (SEO).** Every `<section>`, `<article>` and `<aside>` must contain its own heading, or it shows as "Untitled" in outline tools. The page H1 lives in `<header class="page-banner">` (or a plain `div`, as on the hero, product overview and blog post), never inside a `<section>` / `<article>`. Navigation blocks are `<div class="…" role="navigation" aria-label="…">`, not `<nav>`: that keeps the landmark for screen readers without adding untitled sections or hidden headings before the H1. Headless wrappers that need a name use `role="region"` + `aria-label` (hero, map, sticky CTA). One H1 per page, first heading on the page, no skipped levels. Label / value pairs (footer contact details) are a `<dl>`, not headings. Check with scratchpad `outline.js`.
12. **No hairline dividers between rows.** Lists never separate items with `--line` rules (the user finds that look generic). Exception: real data tables (article tables and the product “Information” table) keep the `.content-detail` table look with cell borders. Use the concept’s alternatives instead: separate cream cards (FAQ), a cream panel with a white highlight for the active row (TOC, share bar), zebra rows with `--radius-sm` (spec lists, data tables; white stripes on a cream surface), or plain spacing (mobile menu). Borders are fine as card outlines (white tiles) and inside form controls.

---

## 2. Typography

### Families

| Token | Font | Use |
|---|---|---|
| `--font-display` | Archivo Black | Section titles, banner titles, service titles. Always uppercase. |
| `--font-body` | Archivo (variable 400–700, italic 800–900) | Everything else |

Fonts are self-hosted in `assets/fonts/archivo/`. Don't load Google Fonts.

### Heading scale (h1 → h6)

The largest heading is **44 px** at 1920 (Figma: 48 px). Each level steps down by **≈ 1.25**: 44 → 36 → 28 → 23 → 20 → 17.

| Level | Token | 1920 | 1728 | 1440 | ≤ 1024 and mobile | Font | Used for |
|---|---|---|---|---|---|---|---|
| H1 | `--fs-h1` | 44 | 40 | 33 | 30 | Archivo Black | Page banner title, lead form title |
| H2 | `--fs-h2` | 36 | 32 | 27 | 26 | Archivo Black | Section titles (`.section-title`) |
| H3 | `--fs-h3` | 28 | 25 | 22 | 22 | Archivo Black | Feature titles (service card, leadership) |
| H4 | `--fs-h4` | 23 | 21 | 19 | 19 | Archivo 700 | Article headings, sub-sections |
| H5 | `--fs-h5` | 20 | 18 | 17 | 17 | Archivo 700 | Card titles (why us, news), contact card value |
| H6 | `--fs-h6` | 17 | 15.3 | 15 | 15 | Archivo 700 | Small card titles (categories), stat labels |

Plain `<h1>`–`<h6>` get these sizes by default. Match the visual level to the HTML level where possible; when they differ (e.g. an `<h3>` in a card that looks like H5), use the class, never a one-off size.

### Text scale

| Token | 1920 | 1440 | Mobile 390 | Use |
|---|---|---|---|---|
| `--fs-display` | 56 | 42 | 40 | Big stat numbers (Archivo Black, red). The only size above H1 |
| `--fs-button` | 15 | 14.4 | 13 | Buttons |
| `--fs-body` | 16 | 15.4 | 14 | Paragraphs, descriptions, list text |
| `--fs-label` | 14 | 13.7 | 13 | Uppercase labels: form labels, tabs, product names, footer headings, contact card labels |
| `--fs-input` | 16 | 16 | 16 | Form inputs. Stays 16 px so iOS doesn't zoom on focus |
| `--fs-small` | 13 | 13 | 13 | Navigation, breadcrumbs, announcement bar, legal line |
| `--fs-caption` | 12 | 12 | 11 | Counts and badges, e.g. "(128)" |

### Fluid sizing

Two curves, both clamped at MIN (mobile) and MAX (1920):

**Proportional** — display, H1–H6, buttons, inputs, nav buttons and spacing. The value is MAX scaled by the viewport, so the UI keeps the Figma proportions on every desktop:

```
--x: clamp(MIN, MAX / 1920 × 100vw, MAX)
```

Example: H2 26 → 36 px gives `clamp(26px, 1.875vw, 36px)`: 36 px at 1920, 32 px at 1728, 27 px at 1440, 26 px below ≈ 1390 px.

**Gentle** — body, label, button text and caption. Reading text never drops below a comfortable size, so it interpolates from 390 px to 1920 px instead:

```
--x: clamp(MIN, A + Bvw, MAX)
B = (MAX − MIN) / 1530 × 100      A = MIN − B × 3.9
```

To change a size, change MIN / MAX and recompute; never override a font size inside a media query. To make the whole UI bigger or smaller, move the MAX values together, not one component.

### Line height

| Token | Value | Use |
|---|---|---|
| `--lh-tight` | 1.15 | Display titles (H1–H3, Archivo Black) |
| `--lh-heading` | 1.3 | H4–H6, labels, card titles |
| `--lh-body` | 1.6 | Paragraphs |
| — | 1 | Single-line UI only: buttons, nav links, tabs |

### Casing and weight

- Display titles, card titles, labels, nav, buttons and tabs: **UPPERCASE**.
- Body copy and article content: sentence case.
- Weights: 400 body, 600 nav / UI, 700 headings and labels. The red italic accent line uses Archivo italic 900.
- Use `text-wrap: balance` on multi-line titles.

---

## 3. Color

### Brand

| Token | Hex | Role |
|---|---|---|
| `--green` | `#1c3b33` | Primary dark: header, dark sections, heading text |
| `--red` | `#d92b2b` | Primary accent: logo, primary button, accent titles, active states |
| `--cream` | `#ede8e4` | Soft surface: tertiary button, form panel, hover card, nav buttons |
| `--dark` | `#333333` | Secondary button, nav button hover |
| `--off-white` | `#fafafa` | Page background |
| `--leaf` | `#547f26` | Accent green for the "+" on stats |
| `--white` | `#ffffff` | Cards, inputs, text on dark |

### Text

| Token | Use |
|---|---|
| `--text` | Default body text on light |
| `--text-muted` | Section descriptions, card copy |
| `--gray` | Secondary text on cream (hover states) |
| `--placeholder` | Input placeholders |
| `--on-dark-muted` | Body text on green / dark |

### States and supporting

`--red-dark` (primary hover), `--red-soft` (red borders), `--cream-dark` (tertiary hover), `--dark-hover`, `--red-tint` (submenu item hover), `--yellow` (hero placeholder), `--line` / `--green-border` (borders), `--on-dark-line` / `--on-dark-line-soft` (dividers on dark), `--focus` (keyboard focus ring).

### Contrast rules

- Body text must reach **4.5 : 1**; large titles and logos **3 : 1**.
- Red on green is only **2.4 : 1**. Never put red text on `--green` without a light outline or a light plate behind it (see the header logo).
- On green, use white or `--on-dark-muted` for text.

---

## 4. Layout

| Token / class | Value | Rule |
|---|---|---|
| `--container` | 1720 px | Max content width |
| `--page-gutter` | 24 → 86 px | Side gutter |
| `.container` | — | `max-width: container + 2 × gutter`, centered, gutter padding. Wrap section content in it. |

**Full-bleed exceptions** sit outside `.container`: hero, announcement bar, sticky release tab bar, exhibition logo marquee, footer divider.

Home “New releases”: the category tabs (`tabsJS`) reorder one list (20 items desktop / 8 mobile via `loadMoreListJS`, no load-more button). Its “See more” is a link (`tabLinkJS`) that follows the active tab: `TabsModule` copies the tab’s `data-href` (`./product-category.html?category=…`) and sets `aria-label="See more {category}"`.

### Breakpoints

| Name | Query | Typical change |
|---|---|---|
| Desktop | ≥ 1121 px | Full navigation, sticky stack effect |
| Tablet | ≤ 1120 px | Burger menu (drawer), 3-column grids, 2-column why us, leadership cards in one column |
| Small tablet | ≤ 900 px | Stacked split heads, stacked stats |
| Mobile | ≤ 680 px | Full-screen menu, 2-column product grids, 1-column why us and services, smaller decor |

Use only these four. Don't add one-off breakpoints.

---

## 5. Spacing

| Token / class | Value | Use |
|---|---|---|
| `.ss-pd` / `--pd-sc` | 56 → 80 px | Standard top and bottom section padding |
| `.pdt-0` / `.pdb-0` | 0 | `.pdb-0` on the earlier of two same-background sections; `.pdt-0` only after a breadcrumb bar |
| `.nowrap` | — | Keep a phrase on one line, e.g. "export-ready" in a title |
| `.sec-overlap` | — | First section after a hero / page banner: pulls up by `--section-overlap`, rounded top corners, sits above the banner |
| `--banner-pb` | 32 → 48 px | Page banner: gap from breadcrumb to the banner's visible bottom. Adds `--section-overlap` automatically when the next section is `.sec-overlap` |
| `--header-gap` | 4 px | Gap under the header: above the home announcement bar, and above the page banner on pages without a sub-nav (contact, blog, services, searching…) |
| `--head-gap` | 36 → 52 px | Section head → content |
| `--gap-lg` | 20 → 32 px | Large grid gaps (cards, services, why us), form row gap and panel padding, contact cards |
| `--gap-md` | 14 → 24 px | Medium column gaps |
| `--gap-sm` | 10 → 14 px | Tight column gaps (product grid, form columns) |

Inside a card, stack elements with flex `gap` (32 px in why us cards), not margins on every child.

---

## 6. Radius, shadow, motion

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 4 px | Badges, small chips |
| `--radius-sm` | 6 px | Product cards, tabs, inputs |
| `--radius-md` | 8 px | Cards, media, form panel |
| `--btn-radius` | 7 → 9 px | Buttons |
| `--radius-lg` | 20 px | Header bottom corners, leadership cards |
| `--section-overlap` | 20 → 30 px | Rounded section tops that overlap the previous section |

Nothing is fully round: no `50%` or pill radii, including close buttons, play buttons and tags. Use `--radius-md` (8 px) for small controls.

Shadows: `--shadow-soft` (form panel), `--shadow-md` (dropdowns), `--shadow-lift` (section sliding over another; negative spread so it only casts upward and never darkens the next section). The tablet menu drawer dims the page with `--overlay-menu`.

Motion:

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 160 ms | Color, background, border hovers |
| `--dur-base` | 260 ms | Card state changes |
| `--dur-slow` | 600 ms | Reveals, slides |
| `--dur-image` | 900 ms | Image zoom on hover |
| `--ease-out` | `cubic-bezier(.22, 1, .36, 1)` | Anything that moves |

Image hover zoom is `scale(1.04–1.06)` over `--dur-image` with `--ease-out`. Never lift or bounce cards on hover (no `translateY` / `translate: 0 -Npx`); hover feedback is image zoom, border or color only. Don't add a global `prefers-reduced-motion` kill-switch.

---

## 7. Components

### Button — `.button`

| Variant | Class | Rest | Hover |
|---|---|---|---|
| Primary | `.button--primary` | red / white | `--red-dark` |
| Secondary | `.button--secondary` | dark / white | `--dark-hover` |
| Tertiary | `.button--tertiary` | cream / dark | `--cream-dark` |

- Size from `--btn-h` (40 → 48 px), `--btn-min-w` (127 → 152 px), `--btn-pad` (18 → 22 px), `--btn-radius` (8 px, same as `--radius-md`), `--fs-button` (13 → 15 px). Uppercase, weight 700.
- No arrow icon.
- The label goes in `<span class="button-label letterSwapJS">` to get the Letter 3D Swap hover. To change a label later (e.g. See more ↔ See less), dispatch `new CustomEvent("letterswap:set", { detail: "New text" })` on the label; never set `textContent` directly, or the letters lose the effect.
- Each `.letter-swap__box` keeps `will-change: transform`, so the letters always render on their own layer. Without it the text is redrawn on the normal layer when the animation ends and visibly "grows" by about half a pixel.

### Header navigation

- Dropdowns are `<div class="nav-dropdown">` + `<button class="nav-link" aria-expanded aria-controls>` + `.dropdown-panel`. They open on **hover** (desktop), and on click / Enter for touch and keyboard (`.is-open`, closed by Escape, outside click or focus leaving).
- Top-level hover: text stays white, a 2 px `--red` underline appears under the label.
- Submenu items: uppercase `--fs-small`. Hover / focus: `--red` text on `--red-tint`. Current page: `--red` text only.
- No beige or other off-palette hover colors.
- Every item on both sides of the logo is spaced by one `--nav-gap` (22 px at 1121 → 48 px at 1920, linear), so the left cluster never touches the logo on small laptops.
- "RITA on Alibaba" (`.alibaba-link`): outlined button (`--on-dark-muted` border, `--radius-md`, `--fs-small` 600 uppercase) with the orange Alibaba mark (`ic-alibaba-mark.svg`, 15 px tall) before the label; hover: white fill, `--green` text.

### Mobile menu — `.mobile-nav` (≤ 1120 px)

- Header on tablet / mobile: burger (`.menu-toggle`, turns into an X) left, logo center, search icon (`.header-search`) right.
- `<div class="mobile-nav mobileNavJS" role="navigation" id="mobile-navigation" hidden>` sits right after `</header>` (not inside it), so the header (z-index 21) keeps its rounded green corners on top of the panel (z-index 20). The panel starts `--radius-lg` above the header bottom and fills the rest of the screen on `--off-white`.
- Width `min(100%, --mobile-nav-w)`: a left drawer on tablet that dims the page with `--overlay-menu` (click outside closes it), full screen on mobile. Slides in from the left (`--dur-slow`, `--ease-out`). Page scroll is locked and everything else is `inert` while it's open.
- Drill-down, as on ritadrinks.in. Main level: rows of `.mobile-nav__link` (Archivo Black, `--fs-h4`, uppercase, `--green`, no dividers, `--mobile-nav-row` tall). A group is a `<button class="mobile-nav__link mobileNavOpenJS" aria-controls="mobile-nav-GROUP">` with a cream `.mobile-nav__chevron` square (same look as `.nav-button`). Current page / current group: `--red`. Bottom: Contact us (primary) + Alibaba store (tertiary) buttons, then phone and email.
- Sub level: `<div class="mobile-nav__level--sub mobileNavSubJS" id="mobile-nav-GROUP">` slides in from the right: back button (`mobileNavBackJS`, chevron + group name), 16 : 7 thumbnail (`--radius-md`), links in Archivo 700 `--fs-h6`.
- Keyboard: Escape goes back one level, then closes and returns focus to the burger. Focus moves with `preventScroll` so the sliding panel never scrolls sideways.
- Build: the markup lives in the header partial; the build script marks `aria-current="page"` on the link and adds `is-current` to the group button.

### Sub navigation — `.sub-nav`

- Sits right after `</header>` on every page of a group (About us: story, history, certificates, awards, activities, brands; Products: products, product category). Markup: `<div class="sub-nav" role="navigation" aria-label="…"><div class="sub-nav__inner subNavJS">` + `<a class="sub-nav__link">` links; the current page gets `aria-current="page"`.
- Bar: `--off-white`, 52 → 62 px tall, left padding `--header-pad` so the first pill lines up with HOME. Links: `--fs-label`, 700, uppercase, `--green`; hover `--red`; current: `--red` text, white pill, `--red-soft` border, `--radius-sm`.
- **Sticky**: sticks right under the header (`top: header-h − radius-lg`). It tucks 20 px up under the header so the header's rounded bottom corners never show content behind them. `html:has(.sub-nav)` adds `--subnav-h` to `scroll-padding-top` so anchors aren't hidden.
- **Hide on scroll**: add the `scrollHideJS` hook. While the bar is stuck, scrolling down tucks it up behind the header (`.is-tucked`, `translate: 0 -100%`) and scrolling up brings it back; it never hides at its natural position or while it has keyboard focus (`:focus-visible`; a mouse click leaving focus on a tab does not count). Same behaviour on the home New Releases category bar (`.release-tabs-bar`).
- Scrolls horizontally on small screens; `SiteNavModule` centers the current link.

- `.button--sm`: compact variant (34 → 40 px, `--fs-small`) for buttons laid over media. Add `<span class="button__play">` for a play icon.

### Next / Prev — `.nav-button`

- Size `--nav-btn` (30 → 34 px), both **cream at rest**. Hover and focus: `--dark` background with a white chevron.
- Use `.nav-button--prev` / `--next` only to pick the icon.

### Close button — `.close-button`

- 40 px `--dark` square, `--radius-md`, white `ic-close.svg` 16 px; hover / focus `--red`. Shared by every popup (awards / brands dialog, mobile search). The popup’s own class (e.g. `.detail-dialog__close`) only sets the position.

### Section head — `.section-head`

- Default: centered title (`.section-title`, H2) + description (`.section-desc`, body, `--text-muted`).
- `.section-head--split`: title left, description right. Stacks below 900 px.

### Cards

| Card | Title | Text | Hover |
|---|---|---|---|
| Capability | H6, uppercase | count in `--fs-caption` | red title, image zoom |
| Release (product) | `--fs-label`, uppercase | — | red border, OEM/ODM icon, red title, zoom |
| Why us | H5, uppercase | body | cream background, dark text |
| Service | H3 display + red italic accent | body | image zoom |
| News | H5 | body excerpt | red title, zoom |

### Stats — `.stat`

- Icon (120 px source, max 108 px) + value + label. Value: `--fs-display`, `--red`, Archivo Black; the "+" unit is `--leaf` at .5em; label `--fs-h6`, 400, uppercase, `--green`.
- Add `data-count="N"` to the number to animate it when it scrolls into view (`CountUpModule`).
- `.stats` keeps three across down to tablet: icon left of the value above 900 px, stacked and centered (icon, value, label) in three equal columns at ≤ 900 px, and one column of icon-left rows only at ≤ 680 px.

### Leadership — `.leader`

- Two-column grid: chairman message card (name H3 display `--red`, role `--fs-label` bold, quote body, tertiary + primary buttons, packaging image flush to the card bottom) and two cards (Vision / Mission: left-aligned H3 display `--green` and body, 100 px icon bottom-right, 72 px on mobile). Cards are white, `--radius-lg`, padding `--leader-pad`.
- Background: `bg-ceo.jpg` (cover, bottom). `.leader::before` fades `--off-white` (solid at top) to transparent over the top 55 % so the section blends into the off-white section above.
- No chairman photo (removed at the client’s request): the cards themselves are the section. ≤ 1120 px the grid is one column (message card, then Vision / Mission side by side); ≤ 680 px everything stacks. No popup, no JS.

### Dark block — `.dark-block`

- Green band that groups sections (home: intro + why us; our story: process + why us). Holds the four corner decor images (`.dark-block__decor--mango | cloud | flowers | tree`), cropped by `overflow: hidden`; inner sections get `.container` and sit above the decor.
- Add `.sec-overlap` when it should overlap the section before it (our story).
- Why us (`.why-us`) is the same markup on both pages.

### Sticky stack — `.stack-scroll`

- Wrap two siblings: `<div class="stack-scroll">` > first element (add the `stackPinJS` hook) + the next section. Desktop only (≥ 1121 px): the first element pins when its bottom reaches the bottom of the screen (`StackScrollModule` sets `--stack-top`), and the last element slides up over it with an `--off-white` background and `--shadow-lift`.
- Styling targets `:first-child` / `:last-child`, so it works for any pair. Used on home (dark block → services), OEM / ODM (dark block → formats) and our story (dark block → exhibitions).

### Collage intro — `.collage-intro`

- Full-width staggered photo collage (nine columns of 275 × 340 tiles, each column offset by `--offset` × tile height) with the centered `.section-head` pulled up over its lower edge. Our story opens with it.
- ≤ 680 px it never scrolls sideways: the five middle columns (one photo each) fill the screen width, the four outer columns are hidden, and the head sits below the collage.

### Process — `.process-grid`

- `<ol>` of `.process-card`: image in `.process-card__media` (488 × 471, `--radius-md`, overflow hidden; zooms to 1.06 on card hover like the other cards), title `--fs-h6` 700 uppercase white, description `--fs-small` `--on-dark-muted`. 4 columns, 2 on mobile; on mobile an odd last card spans both columns. Used by the OEM / ODM "Your formula" section; the our story factory steps now use the process path below.

### Showcase slider — `.showcase`

- Centered slider with copy underneath, used for the timeline on Our history. The blog uses the `.showcase--cards` variant (below).
- Centered Swiper (`showcaseSliderJS`, `ShowcaseSliderModule`): active slide `--showcase-w` wide (52vw, max 1000 px; 84vw on mobile), 2 : 1 images (`history-YEAR.jpg`, 900 × 450), neighbours peek on both sides, loops.
- `.showcase-slider__frame` sits on top of the active slide: Next / Prev `.nav-button`s straddle its left and right edges; bottom-right holds a `.button--primary.button--sm` "See video" (Fancybox, the company YouTube video, not tied to the slide) and the `n/total` counter.
- Below: `<ol class="showcase-copy">`, one `<li>` per slide; the module shows the item for the active slide (title "YEAR: TITLE" H3 display, body copy).
- **`.showcase--cards` (blog “Featured news”)**: two cards side by side in the middle and one card peeking on each side. The slider is exactly the `.container` width, so the two middle cards line up with the grid below and the peeking cards fill the page gutters; the Swiper (`data-layout="cards"`) shows 2 slides (1 ≤ 680 px), 24 px apart (12 px on mobile), loops, with `overflow: visible` so neighbours show beyond it and the section clips them (`overflow: clip`). Off-frame cards fade to .45 (`:not(.swiper-slide-visible)`, `watchSlidesProgress`). Each card is one `<a class="showcase-card swiper-slide">`: 2 : 1 `--radius-md` image (zoom 1.04 on hover), `.post-meta` date, H3 title (`--fs-h4` display, uppercase, red on hover). Clicking a peeking card slides to it instead of opening it. Prev / Next `.nav-button`s straddle the slider edges at the image’s vertical centre (computed with `cqi` from `--cols` / `--card-gap`). Swiper’s loop clones get `aria-hidden` and `tabindex="-1"`. No shared copy list, counter or frame.
- **No jump before Swiper runs**: until `.swiper-initialized` is on the slider, CSS lays the slides out exactly as Swiper will: the classic showcase wrapper gets `gap: var(--showcase-gap)` (24 px, 12 px ≤ 680 px, same as `spaceBetween`) and is shifted so the first slide is centred; the card variant sizes each card to `(100% − (cols − 1) × gap) / cols` with the same gap and dims cards beyond the first row (`:nth-child(n + 3)`, `n + 2` on mobile). Keep these numbers in sync with the module’s `spaceBetween` / `slidesPerView`.

### Certificate grid — `.cert-grid`

- `<ul class="cert-grid loadMoreListJS" data-load-more-step="8" data-load-more-step-mobile="6">` of `.cert-tile`s: cream tile (17 : 10, `--radius-md`) with the logo centered. 4 columns, 2 on mobile; See more reveals the rest.
- A tile with a certificate scan is `<a data-fancybox="certificates" data-caption="…">` pointing at the `cef-digicert_*.webp` image (zoom-in cursor, logo zooms 1.06 on hover); a tile without one is a plain `<div>`.

### Awards — `.awards` + `.detail-dialog`

- Slider: `awardsSliderJS` Swiper (auto width slides, loop, autoplay 3 s, pauses on hover; centered on mobile so no card sits against the screen edge). Each slide is a `<button class="award-card awardOpenJS" data-award="N">`: white square media with the product (`award-can-N.png`, anchored bottom, zooms 1.06 on hover) and the event seal top-left (white PNG turned black with `filter: brightness(0)`), then event (`--fs-label` 700 uppercase) and award name (red italic 900 uppercase).
- Popup: the shared `.detail-dialog` (below), one `<article class="dialog-detail" data-detail="N">` per award: square photo with top / bottom shade, city / flag pill top-right, seal bottom-right; event (`.dialog-detail__title`), award in red italic (`.dialog-detail__subtitle`), product, description, `<dl class="dialog-detail__specs">`, Contact us (`detailLeadJS`). "You may also like" shows award photos.

### Detail popup — `.detail-dialog`

- Shared full-screen popup (same layout as ritadrinks.in), used by awards and brands. Native `<dialog class="detail-dialog detailDialogJS" id="…-dialog" aria-labelledby="…-dialog-title">` on `--cream` (Esc, focus trap; `body:has(.detail-dialog[open])` locks scroll), fits one screen down to 1280 × 720 with no visible scrollbar; one column ≤ 1120 px.
- Grid: square `.dialog-detail__media` left (`min(50%, 100svh − 120px)`, `--radius-md`), `.dialog-detail__info` top-right (fills the whole right column), `.detail-dialog__more` "You may also like" bottom-right (Swiper, 3 per view / 2.4 on mobile, Next / Prev `.nav-button`s beside the title; they hide when everything fits). Shared `.close-button` top-right.
- Each item is an `<article class="dialog-detail" data-detail="key" hidden>` with `display: contents`. Openers anywhere on the page are `.detailOpenJS` with the same `data-detail` and `aria-controls` = the dialog id. `DetailDialogModule` shows the item, gives its `.dialog-detail__title` the dialog's title id, rebuilds the also-like slides without the open item, and closes on the close button, a backdrop click or a `detailLeadJS` link.

### Product detail — `product-detail.html`

- No page banner and no sub-nav. `<main>` starts with `.crumb-bar` (`--gap-md` top / bottom) holding `.breadcrumbs.breadcrumbs--light` (grey links, red on hover, dark separators, current item `--green` 600 and cut with an ellipsis on one line).
- `.product-overview.ss-pd.pdt-0` > `.product-overview__grid`: two equal columns (`clamp(32px, 4.17vw, 80px)` gap); one column ≤ 1120 px.
  - Left `.product-media` (sticky under the header on desktop; ≤ 1120 px static, max 600 px, centered): **one product photo** in a white `--line` `--radius-md` frame that is square but never taller than the viewport below the header (`height: min(100cqi, 100svh − header − 2 × --gap-md)`, image `object-fit: contain`), so while sticky it keeps the same gap above and below, Fancybox zoom on click, image zooms 1.04 on hover, red OEM/ODM badge (`--radius-md`) top-left.
  - Right `.product-info`: `.tag` (category) → H1 (display, `--fs-h2`, uppercase) → lead paragraph → `.product-perks` (uppercase cream chips with red masked icons: OEM / ODM, free sample, free label design, flexible MOQ) → "Information" table: `<div class="content-detail spec-table"><div class="content-detail__table"><table>` with `<th scope="row">` labels, so it uses exactly the article table styles from `content-detail.css` (borders, padding, link style, mobile scroll); `.spec-table` only adds colour and width (label column 34 % on `--cream`, values on `--white`, `--content-table-cols: 2`). The table is named with `aria-labelledby` pointing at the “Information” H2 — never a hidden `<caption>`: in the collapsed border model a caption, even `.sr-only`, splits the table border from the cell border and the top edge renders 2 px. FOB price links to `#enquiry`. → "Flavor" `.flavor-list` (white `--radius-md` tiles, all the same size — each item’s inner column is `minmax(0, 1fr)` so a long name never widens its tile; active tile red ring + red name) → "Certificates" note + `.cert-logos` (white tiles, logos max 72 × 48 px, one row on desktop) → `.product-info__actions` (`productActionsJS`): Product inquiry (primary → `#enquiry`) + Download catalogue (tertiary, catalogue link).
- `.product-story`: white `--radius-md` panel, centered display title "Product description", `.content-detail` body (full panel width) collapsed to 520 px with a white fade; "See more / See less" secondary button (`storyCollapseJS` / `storyToggleJS`, animates max-height). The toggle hides itself when the text is short.
- `.related` "Related products": `.release-card`s, 2 / 3 / 4 / 5 per view.
- `.sticky-cta` (`stickyCtaJS`, `hidden` until JS runs): fixed bottom bar, white, top corners `--radius-lg`, `--shadow-lift`; thumb + product name (ellipsis) + the same two buttons (`.button--sm`). Desktop: slides up once the page has scrolled past `productActionsJS` and hides again above it. ≤ 1120 px: the in-page buttons are hidden and the bar is always on screen instead. It always hides while the lead form or footer is on screen. ≤ 680 px: only the two buttons, full width. On phones the two buttons share the bar equally; when the button row is narrower than 346 px (phones under 390 px) the catalogue button swaps “Download catalogue” for its short label “Catalogue” (`.button-label--long` / `.button-label--short`, a container query on `.sticky-cta__actions`), so neither button overflows.
- Content comes from the live ritadrinks.co.uk product page; only the single product photo is used.

### Shared small components

- `.tag`: red uppercase label on `--red-tint`, `--radius-sm` (product category on product detail); hover turns solid red. The blog has no categories.
- `.related`: section title left + Next / Prev `.nav-button`s right, `relatedSliderJS` Swiper (`RelatedSliderModule`). Slides per view are CSS custom properties on the slider: `style="--pv-mobile: 2; --pv-tablet: 3; --pv-desktop: 4; --pv-wide: 5"` (products; articles `1.15 / 2 / 4 / 4`). The module reads them for Swiper (breakpoints 681 / 1121 / 1421, gaps 10 / 14 / 20 / 24 px) and the CSS uses the same values to lay the slides out before Swiper runs (`:not(.swiper-initialized)`), so nothing jumps on load.
- `.post-meta`: inline row of small grey items (date) separated by 4 px squares.

### Blog — `blog.html`

- Page banner (4 px under the header) → `.showcase.sec-overlap` featured slider → latest list. No categories, filters or tags anywhere on the blog.
  - `.showcase.showcase--cards` "Featured news" slider (2 cards + side peeks, see Showcase slider), `pdb-0`.
- `.blog-list.ss-pd`: `.results-head` ("Latest articles" + count) → `.post-grid` of `.news-card`s (the home news card plus a `.post-meta` row): 4 / 2 / 1 columns, 12 articles per page (“Showing 1–12 of 48”, 4 pages) → `.pagination`. Every card needs its own image (no repeats on a page).

### Blog detail — `blog-detail.html`

- `.crumb-bar` with light breadcrumbs (no banner) → `<div class="post">` (a div, so the H1 belongs to the page outline):
  - `.post-header`: H1 (display, `--fs-h1`, uppercase, full container width, no balanced wrapping) → `.post-header__meta` (date and author with red masked icons). The cover image is NOT in the header: `<figure class="post-cover">` opens `.post-body` (the 880 px middle column, above `.content-detail`), shown at its own aspect ratio, uncropped, `--radius-md`, `--gap-lg` below. Article images are rarely large, so stretching them to the full container made them blurry.
  - `.post-layout` grid: ≥ 1421 px `toc | body (max 880 px) | side`; ≤ 1420 px `toc | body` with the side card under the article; ≤ 1120 px one column.
  - `.toc` (`tocJS`, `PostModule`): on desktop a sticky block whose “Table of contents” label sits straight on the page background (level with “Latest news”) and whose `.toc__list` is the cream `--radius-md` panel (8 px padding); on tablet / mobile a collapsible `<details>`: the summary is a cream `--radius-md` bar with a chevron (hover `--cream-dark`), the list opens as its own cream panel below. Built from the article: one row per H2 (`--fs-label` 600, 2 px apart, no dividers; an open group — its H2 row and its H3 list — sits in one white `--radius-sm` block); an H2 with H3s gets a 24 px white `--radius-sm` chevron toggle (cream inside the open block) that opens its H3 list (`--fs-small`, muted). Parent and child links share the same 10 px side padding (no indent; the hierarchy comes from size and colour) and the block has the same space above the H2 as below the last H3. Accordion: one group open at a time, all closed at first; while scrolling the current section turns red and its group opens by itself. Collapsed groups are `inert`.
  - `.post-body` > `.content-detail` (`postContentJS`): images max 560 px tall, centered, `--radius-md`, centered captions; tables in `.content-detail__table` scroll sideways on mobile. `.post-footer` (no panel): `.share` on the left — “Share this article” label (`--fs-label` 700 uppercase `--green`) + `--nav-btn` cream `--radius-md` squares with Facebook / LinkedIn / X / copy-link glyphs, dark on hover, the copy button turns `--green` (`.is-copied`) and “Link copied” shows for 2.4 s (`PostModule`). No other action in the footer (the user dropped a “Back to blog” button).
  - `.post-side` > `.latest-posts`: "Latest news" label straight on the page background (no card, border or padding: group titles never sit in a white box) with three `.latest-post` links stacked image-on-top (16 : 10 image `--radius-sm`, then two-line title `--fs-label` 600 and date); sticky on wide screens, three columns under the article ≤ 1420 px, one column ≤ 680 px. Hover: red title, image zoom.
- `.related` "Related articles" slider of `.news-card`s, then the lead form.

### Exhibition map — `.exhi-map`

- World map (`map.png`) with absolutely positioned `.exhi-pin`s (`top` / `left` in %, `--i` for the drop-in stagger, `exhibitionMapJS`). Same 11 pins as the other RITA sites: US, UK, Europe, Russia, Iran, UAE, China, Vietnam, Singapore, India, Australia.
- Pins with a RITA country site are `<a class="exhi-pin" href="…" target="_blank" rel="noopener" data-label="Country" aria-label="RITA in Country">` (the UK pin links to this site's home); Europe and Vietnam are plain `<span aria-hidden="true">`. Hover / focus: the pin scales 1.2 and a `--green` `--radius-sm` label shows `data-label` above it.

### OEM / ODM service pages

Built only from existing components. "Your formula, our production" is always the first section; the first two sections after the banner are light (`--off-white`), the dark block comes after them, never at the top of the page:

1. Page banner (4 px under the header).
2. `.process.sec-overlap` "Your formula, our production" / "Ready-made formulas, your brand": centered `.section-head` + four `.process-card`s (`oem-01…04.jpg`). On a light background the card title is `--green` and the text `--text-muted`; inside `.dark-block` they switch to white / `--on-dark-muted`.
3. `.milestones` "3 months from idea to shelf" / "From concept to market": centered `.section-head` + `.milestone-grid` of nine `.milestone` cards (3 / 2 / 1 columns): white, `--line` border, `--radius-md`, padding `--gap-lg` (extra at the bottom); the step number is a large faded display numeral (`--cream`, 72 → 144 px) tucked into the bottom-right corner and cropped by the card; optional duration `.milestone__tag` (red on `--red-tint`, `--radius-sm`, uppercase) above the title; title `--fs-h6` 700 uppercase; body text on top of the numeral. Hover: `--red-soft` border and numeral.
4. `.stack-scroll` > `.dark-block.sec-overlap` (four corner decors) holding `.process-path` "How your beverage is produced" (dark colours, see Process path; first in the block like our story, so the line finishes before the block pins) and `.why-us` (the same six `.why-card`s as home / our story; "Why brands choose RITA for OEM / ODM manufacturing"). `.formats` "Formats & size" (see below) slides over the dark block.
5. `.finishes` "Your label, your signature" on the light background: three `.finish-card`s (square 1 : 1 cream `--radius-md` tile with the can centered (76 % of the tile), uppercase `--green` title, text; white text if ever placed in a dark block; ≤ 680 px a row with a 96 px tile on the left). The formats, finishes, CTA banner and FAQ each carry `pdb-0` because the next section has the same background.
6. `.cta-banner`: `--green` panel (`--overlay-cta` over `banner-cta.jpg`, `--radius-md`) with display title, text and a primary button to `#enquiry`; the three label cans (`label-*.jpg`, transparent PNGs) stand upright at the bottom right, like the old site: all sizes come from `--can-h` (412 px max; 200–300 px ≤ 1120 px); order glossy → direct printing → matte; the styling is positional (`:first-child` / `:nth-child(2)` / `:last-child`), so the second can is always the raised one: about 11 % of the can height higher and in front, covering only a thin edge of each side can (2.5 % of the can height), so every label reads in full. Swap the order in the HTML to feature another finish. Stacks ≤ 1120 px. Also used on the home page, between the services stack and the exhibitions (index.html keeps its own copy of `svc/cta.html`, so update both).
7. `.faq`: sticky aside (title, text, secondary button, then `.faq__media`: one finished product shot, `sparkling-cans.webp` (RITA’s own render of two tilted Sparkling Blueberry / Cherry cans with shadows baked in, from ritabeverages.com, resized to 1040 px WebP with alpha, 154 KB), centered, up to 460 px wide, drifting up and down ±10 px every 4 s (`float-y`, like the source site’s animate.css shakeY), with a bottom margin so it never touches the section edge (the FAQ has `pdb-0`); hidden ≤ 1120 px) + `<details class="faq-item" name="faq">` accordion (first open; one at a time). Each item is its own `--cream` `--radius-md` card, `--gap-sm` apart, no divider lines; hover `--cream-dark`; the open item turns `--green` with a white question, `--on-dark-muted` answer and a white 32 px chevron square with a green chevron.
8. Lead form.

### Formats & size — `.formats`

- Same features as the other RITA sites, in this site's card language (no grid lines). Centered `.section-head`, then two white cards (`--line` border, `--radius-md`, `--gap-lg` apart; stacked ≤ 1120 px):
  - Viewer: Swiper stage with the bottle / tray / container shots, Next / Prev `.nav-button`s at its sides, and four `.formats-thumb`s (cream `--radius-sm` tiles; active = white with a 2 px red inset ring).
  - Browser: its content is centred vertically in the card (level with the viewer). "Format" and "Size" labels (`--fs-label` 700 uppercase, left-aligned) over plain CSS-grid pickers `.formats__picker` (no Swiper, so nothing jumps before JS runs) of `.formats-cell` tiles: square, cream, `--radius-md`, `--gap-sm` apart, 5 per row (`--picker-cols`, 4 at ≤ 680 px); active = white with a 2 px red inset ring; image zooms 1.08 on hover.
- Data lives in `<script type="application/json" class="formatsDataJS">` (material, name, images, container load per 20 ft / 40 ft / 40 ft HC). The first material's sizes, first shot and thumbs are pre-rendered in the HTML from the same JSON (scratchpad `svc/formats-prerender.pl`, run by the build), so the panel has its final height before JS; `FormatsModule` then re-renders sizes, shots and the container loading table; a "Your size" entry swaps the stage for a "Need a size that isn't listed?" call-out.

### Process path — `.process-path`

- Used twice, both inside the dark block: OEM / ODM "How your beverage is produced" and our story "From formulation to export-ready product delivery" inside the dark block.
- Nine factory steps on a winding line, like a production route: the seven our story steps (`process-1…7.jpg`) plus "Mixing & pasteurisation" (`oem-03.jpg`) and "Filling & sealing" (`history-2022.jpg`) before "Incubation area". `<ol class="process-path__list processPathListJS">` of `.process-step` (landscape 16 : 10 `--radius-md` photo, 80 % of the column, full column ≤ 1120 px; numbered square marker `.process-step__dot`, uppercase title, small text), inside `.process-path.processPathJS`.
- Columns come from `--path-cols` on the list: 3 (three rows of three), 1 ≤ 680 px (marker on the left, photo, then text). ≤ 1120 px the list gets `--gap-lg` inline padding so the turns run in a lane beside the photos. `ProcessPathModule` places the steps in a snake (odd rows run right to left through `--col` / `--row`) and draws an SVG path through the marker centres. Only the first and last segments leave the container (from the left edge of the screen into step 1, and from step 9 out to the screen edge); the 80 px rounded turns between rows stay inside it, at the list edges. The path length is linked to scroll: and links its length to scroll: drawing starts when the first marker reaches 85 % of the viewport and finishes when the last one reaches 55 %, eased.
- Not reached yet: dotted `--green-border` track, outlined marker, photo / title / text hidden. When the line passes a marker it turns `--green` and the photo, title and text fade in (photo scales from .9). Inside `.dark-block` the colours flip: `--on-dark-line` track, `--white` line, markers outlined in `--on-dark-line` on `--green` and white with a `--green` number once reached; title white, text `--on-dark-muted`. The first and last segments are clipped by the dark block, which is full width. Scrolling back reverses it. Without JS the steps show as a plain grid.
- To use illustrations (e.g. isometric art) instead of photos, swap the images; the slot stays the same.

### Page banner and map

- **Slide-over on scroll** (`BannerPinModule`, every page whose banner is followed by a `.sec-overlap` block): the banner gets `.is-pinned` (`position: sticky` at its own natural top, measured into `--banner-top`), so it stays still while the first section, with its rounded top and `--shadow-lift`, slides up over it. Once the section has fully covered it the banner gets `.is-covered` (`visibility: hidden`) so it never shows behind later transparent sections. While the section is still sliding, `ScrollHideModule` keeps the sub-nav visible (tucking it would open a gap above the pinned banner); it hides on the next scroll down after the cover is complete. Without JS the banner simply scrolls.
- Page banner position: on pages with a sub-nav (About, Products) the banner follows the sub-nav; on every other page it starts `--header-gap` (4 px, `margin-top`) below the header. Rule: `main:not(.sub-nav + main) > .page-banner:first-child`.
- Contact page order: banner → `.map-section.sec-overlap.ss-pd.pdb-0` → `.faq.ss-pd.pdb-0` (same component as OEM / ODM, with contact questions: reply time, what to include, free samples, MOQ, lead time, payment terms and port, factory visits) → lead form.
- Contact page: `.map-section.sec-overlap.ss-pd.pdb-0` sits right after the banner. It starts with `.contact-info`: six cards (headquarter address → Google Maps link, tax code, fax, sales inquiry and office → `tel:`, email → `mailto:`), 3 columns / 2 ≤ 1120 px / 1 ≤ 680 px, `--gap-sm` apart, `--gap-lg` above the map. Card: white, `--line` border, `--radius-md`, padding `--gap-md`; cream `--radius-md` icon box (40 → 48 px) with a red outline icon set by the item modifier (`--location`, `--tax`, `--fax`, `--phone`, `--office`, `--mail`); label `--fs-label` 600 uppercase `--gray`; value `--fs-h6` 600 `--green`, links turn `--red` on hover. `.map-embed` is a full-container Google Maps `<iframe>` (RITA Food and Drink Co., Ltd), `--radius-md`, height 320 → 480 px, `loading="lazy"` with a `title`.

### Activities — `.moments` (our-activities)

- Page banner after the About sub-nav, then `.moments.sec-overlap.ss-pd` "Beyond the product": centered `.section-head`, then two full-bleed marquee rows (`.moments__row` > `.moments__track` with two identical `.moments__group`s, CSS `moments-marquee`, 60 s / 66 s). The second row runs the other way; duplicated groups are `aria-hidden` with `tabindex="-1"`. Rows pause on hover / focus.
- `.moment-card` (`<a data-fancybox data-caption>`): square photo (`--radius-md`, zooms 1.06), uppercase `--fs-label` 700 label that turns red. 220 → 380 px wide, `--gap-lg` apart. Each group has its own Fancybox gallery name. Row 1: employee programmes (birthdays, sourcing, health check-ups, exhibitions, team building, safety and first aid training); row 2: the year’s festivals (New Year opening ceremony, spring festival, International Women’s Day, Dragon Boat, Vu Lan, Mid-Autumn, Christmas). Both rows are real content; only the duplicated loop groups are hidden.

### Brands — `.brands` (our-brands)

- `.brands.sec-overlap.ss-pd` "Meet the RITA brands": centered `.section-head`, `.brand-grid` (4 / 3 / 2 columns, `loadMoreListJS`, step 8 / 6, See more only when there are more) of `<button class="brand-card detailOpenJS" data-detail="key" aria-controls="brand-dialog">`: cream `--radius-md` tile (374 : 230) with the logo contained; hover white with a `--red-soft` border and a 1.06 logo zoom.
- Popup: `.detail-dialog#brand-dialog`. Item: brand photo (`brand-*-1.jpg`), name, description and a `--green` `.dialog-detail__cta` panel (white display title "Ready to launch your brand?", short `--on-dark-muted` line, primary "Let’s build with us" `detailLeadJS` on the right; faint mango decor; wraps on narrow screens). "You may also like" shows logo tiles only (`.dialog-more__media--logo`, no caption; the name is in `aria-label`).

### Video embed

- Thumbnail covers the YouTube iframe; the iframe only loads when the thumbnail is clicked, then plays inline (no lightbox).
- Markup: `.video-embed.videoEmbedJS` > `<iframe title="…" data-src="https://www.youtube-nocookie.com/embed/VIDEO_ID?rel=0&amp;autoplay=1" allowfullscreen>` + `<button class="video-cover" aria-label="Play video: …">` with the image and `<span class="video-play">`.
- Box is a wide band: full container width, `aspect-ratio: 1500 / 602` (16:9 on mobile). While playing, YouTube letterboxes the 16:9 video inside it. `.video-play`: white circle 44 → 56 px with the red `ic-play.svg` and a pulsing ring.

### Lists and sliders

- Load more: `loadMoreListJS` + `data-load-more-step` (desktop) and `data-load-more-step-mobile`. The See more button only shows when items exceed the step.
- Shared helpers: `[hidden]` always hides (`display: none !important`), and revealed items get `.is-revealed` (fade-up, staggered by `--reveal-index`). Don't write per-grid hidden/reveal rules.
- Tabs: `tabsJS`, `role="tablist"`, arrow keys move between tabs.
- Sliders use Swiper (`assets/library/swiper`). Autoplay sliders pause on hover.

### Forms

- Labels: `--fs-label`, 700, uppercase, `--green`, 8 px above the field. A required field shows `<b>*</b>` and has `required` (Phone / WhatsApp is required too).
- Inputs and selects: white, no visible border (1 px transparent, `--green` on focus), `--radius-md`, height `--input-h` (46 → 48 px), `--fs-input` (16 px). Textarea is `2.5 × --input-h` tall.
- Radios: custom 24 px white circles; checked shows a 10 px red dot and a red ring.
- Grid: 2 columns, gaps `--gap-lg` (rows) / `--gap-sm` (columns); 1 column ≤ 680 px.

### Lead form — `.enquiry-section`

- Sits at the end of `<main>` on every page (`#enquiry`). Two columns (stacked ≤ 1120 px): left = H1 title, body copy and `.contact-cards`; right = `.enquiry-form` on `--cream` (padding `--gap-lg`, `--radius-md`). Columns are vertically centered.
- `.contact-card` (`<a>` to `tel:` / `mailto:`): `--green`, `--radius-md`, `--shadow-md`, 72 → 88 px tall, max 456 px wide, 32 px apart. Label `--fs-label` uppercase white, value `--fs-h5` 600; red `--radius-sm` square on the right with a white icon (`ic-phone-call.svg`, `ic-mail-fill.svg` as masks). Hover: icon `--red-dark`, value underlined.

### Search box — `.search-box`

- Search form used in the header panel (`<form class="search-box" action="./searching.html" role="search">`), max 960 px, centered: `.search-field` — one white field (`--input-h` + 8 px, `--line` border, `--green` when focused) with the query input (`name="q"`), a Category select (`name="category"`; no packaging filter on this site) and a red magnifier submit — then `.search-popular`: a "Popular" label and `.search-chip` links, left-aligned with the field (cream, `--radius-sm`; hover `--red` on `--red-tint`).
- ≤ 680 px: query + submit on the first row, Category full width below, chips scroll sideways.
- `SearchModule` pre-fills every search form from the URL (`?q=` / `?category=`) and writes the keyword into `.searchQueryJS`.

### Search panel — `.search-panel`

- The header stays as it is. The search icon (`.search-link` desktop, `.header-search` tablet / mobile) is a `<button class="searchOpenJS" aria-controls="site-search">` with a masked `.search-icon`; while open the icon turns into an X and closes the panel. Never a plain link.
- `<div class="search-panel searchPanelJS" id="site-search" hidden>` sits right after `</header>` (z-index 20, under the header's rounded corners, like the mobile menu). It dims the page with `--overlay-menu`; the `--off-white` sheet (`.search-panel__sheet`, bottom `--radius-lg`) drops down from under the header and holds the title "What are you looking for?" (display, `--fs-h3`) and a `.search-box`.
- Focus goes to the input; Escape, the X, a click on the dimmed area or opening the menu closes it and returns focus to the icon. The rest of the page is `inert` and scroll is locked while open.

### Products sub-navigation

- Products and product category pages get the same `.sub-nav` as the About pages (sticky, hides on scroll), with the category links: All products, Fruit juice, Aloe vera drinks, Coconut products, Milk drinks, Coffee drinks, Energy drinks, Sparkling drinks, Tea drinks, Seed drinks. No search box inside the page; search lives in the header panel only.

### Product results — `.product-results`

- Used on products, product category and searching: `.sec-overlap.ss-pd` section after the banner. `.results-head`: title left (display, `--fs-h3`, uppercase; the category name on a category page; on searching `Results for “<span class="searchQueryJS">keyword</span>”`), count right (`--fs-body`, `--text-muted`). Then `.release-grid` of `.release-card`s (5 / 3 / 2 columns) and `.pagination`.
- `.pagination`: Next / Prev `.nav-button`s around an `<ol>` of `.pagination__link`s (`--nav-btn` squares, cream; hover `--dark`; current `aria-current="page"` red) and a "…" gap. A disabled Prev / Next is a `<span class="nav-button is-disabled" aria-disabled="true">` (40 % opacity).
- The searching page has no search box in the page; people search again from the header.

---

## 8. Assets

- Images and JS libraries come from `C:\frontends\beveragevietnam.com` (`assets/images`, `assets/library`). Don't add CDN libraries.
- Decorative images use `alt=""` and `pointer-events: none`; meaningful images get a real `alt`.
- Lazy-load everything below the hero (`loading="lazy" decoding="async"`) and always set `width` / `height`.
- Icons: SVG, recolored with `mask` + `background: currentColor` so they follow text color.

---

## 9. Checklist before you ship a change

- [ ] No raw size, color, radius, shadow or duration outside `:root`
- [ ] Content sits in `.container`; section uses `.ss-pd` (+ `.pdt-0` / `.pdb-0` if needed)
- [ ] Checked at 1920, 1440, 1024, 768 and 390 px; no horizontal scroll
- [ ] Text contrast ≥ 4.5 : 1 (≥ 3 : 1 for large titles and logos)
- [ ] Interactive elements work with keyboard and show a focus ring
- [ ] No code comments
