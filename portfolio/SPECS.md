# Dennis-Tanui-V0.0.8 — Next.js App Specification

## Overview

A Tokyo Night terminal-themed portfolio website with interactive search/filter, keyboard-driven navigation, and dark/light theme toggling. Built as a static Next.js app using MDX content, Tailwind CSS, and client-side interactivity.

---

## 1. Routing

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, featured projects, recent blog posts |
| `/blog` | Blog index | Filterable blog card grid with search |
| `/blog/[slug]` | Blog post | Full article with code blocks |
| `/projects` | Projects index | Filterable project card grid with search |
| `/projects/[slug]` | Project detail | Project showcase |
| `/about` | About | Story/timeline page |
| `/search` | Search | Global search with term highlighting |

All routes use static generation (`generateStaticParams` for dynamic routes).

---

## 2. Layout

### Architecture

```
app/
  layout.tsx          ← RootLayout: <html>, <body>, AppHeader, AppFooter, {children}
  page.tsx            ← Home page
  blog/
    layout.tsx        ← (optional) blog-specific layout wrapper
    page.tsx          ← Blog index
    [slug]/page.tsx   ← Blog post
  projects/
    page.tsx          ← Projects index
    [slug]/page.tsx   ← Project detail
  about/page.tsx
  search/page.tsx
```

### Persistent Chrome (root layout — never unmounts)

The root layout (`app/layout.tsx`) renders the shared chrome. On client-side navigation via `<Link>`, Next.js preserves this layout — it stays mounted, keeps state, and does **not** re-render. Only the `{children}` segment swaps.

```
┌──────────────────────────────────────────────┐
│  HEADER (fixed top, h-10 / 40px, z-50)       │
│  [Dennis-Tanui-V0.0.8] [0:HOME] [1:POSTS] [2:PROJECTS] [3:ABOUT]  │ ⚙ │
├──────────────────────────────────────────────┤
│                                              │
│  {children} — only this changes on nav       │
│  - Scrollable pages: pt-10 pb-8              │
│  - Fixed viewport pages: fixed top-10 bottom-8│
│                                              │
├──────────────────────────────────────────────┤
│  FOOTER (fixed bottom, h-8 / 32px, z-50)     │
│  [PAGE > BREADCRUMB]    [GITHUB|LINKEDIN|RSS]    [?] [100%] │
└──────────────────────────────────────────────┘
```

### Prefetching behavior

| Route type | Prefetch | Navigation |
|---|---|---|
| **Static** (all portfolio routes) | Full page prefetched when `<Link>` enters viewport | Instant — no server round trip |
| **Dynamic** (not used here) | Partial — only shared layout + `loading.tsx` fallback | Shows loading UI while server renders |

All portfolio content is static (generated at build time via `generateStaticParams`), so every route is fully prefetched. Navigation between pages is instant — the browser swaps only the `{children}` subtree.

### Scroll behavior per page type

| Type | Pages | Implementation |
|---|---|---|
| **Scrollable** | `/`, `/about`, `/blog/[slug]`, `/projects/[slug]` | Content flows naturally in document flow. `pt-10 pb-8` for header/footer clearance. |
| **Fixed viewport** | `/blog`, `/projects`, `/search` | Page component uses `fixed top-10 bottom-8 left-0 right-0 overflow-y-auto` with inner scroll container `#main-scroll`. Scroll position is managed per-page (not shared). |

---

## 3. Theme System

### Dark mode = Tokyo Night
- Background: `#1a1b26`
- Foreground: `#c0caf5`
- All surface/on-surface tokens as defined below

### Light mode = Tokyo Moon (Day)
- Background: `#e6e7ed` (light cream)
- Foreground: `#343b58` (dark navy)
- Accent colors shift to maintain contrast on light bg

### Color Tokens

#### Dark (Night) — default

| Token | Hex | Usage |
|---|---|---|
| `surface-dim` | `#12131d` | Header bg, code blocks |
| `surface-container-low` | `#1a1b26` | Footer bg, card default |
| `surface-container` | `#1e1f2a` | Dropdowns, modals |
| `surface-container-high` | `#282935` | Hover states |
| `surface-container-highest` | `#333440` | Brand label, tags |
| `on-surface` | `#c0caf5` | Primary text |
| `on-surface-variant` | `#a9b1d6` | Secondary text |
| `on-surface-muted` | `#565f89` | Muted text, placeholders |
| `primary` | `#7aa2f7` | Links, active states, blue |
| `secondary` | `#bb9af7` | Purple accents |
| `tertiary` | `#ff9e64` | Terminal prompts, orange |
| `error` | `#f7768e` | Red indicators |
| `success` | `#9ece6a` | Green indicators |
| `cyan` | `#7dcfff` | Cyan accents |
| `yellow` | `#e0af68` | Yellow indicators |
| `teal` | `#73daca` | Teal accents |
| `outline` | `#3b4261` | Borders |
| `outline-variant` | `#292e42` | Lighter borders |

#### Light (Moon) — toggled via `.light` class

| Token | Hex | Usage |
|---|---|---|
| `surface-dim` | `#d8dae3` | Header bg |
| `surface-container-low` | `#e6e7ed` | Footer bg, card default |
| `surface-container` | `#f0f1f5` | Dropdowns, modals |
| `surface-container-high` | `#fafafa` | Hover states |
| `surface-container-highest` | `#ffffff` | Brand label, tags |
| `on-surface` | `#343b58` | Primary text |
| `on-surface-variant` | `#565a6e` | Secondary text |
| `on-surface-muted` | `#8b8fa3` | Muted text, placeholders |
| `primary` | `#2f6ed6` | Links, active states |
| `secondary` | `#7a4fbf` | Purple accents |
| `tertiary` | `#d96c1a` | Terminal prompts, orange |
| `error` | `#c64343` | Red indicators |
| `success` | `#4f8a2b` | Green indicators |
| `cyan` | `#0f75a0` | Cyan accents |
| `yellow` | `#b8871a` | Yellow indicators |
| `teal` | `#2e8a7a` | Teal accents |
| `outline` | `#9b9fb1` | Borders |
| `outline-variant` | `#c1c4d2` | Lighter borders |

### Implementation
- Tailwind `darkMode: "class"` — `.dark` class on `<html>` for dark, `.light` class for light
- Theme preference persisted in `localStorage`
- System preference respected on first visit via `prefers-color-scheme`
- Settings dropdown shows "Theme: Dark" / "Theme: Light" toggle
- The 4 variant buttons (Night/Storm/Moon/Day) are replaced with 2: **Night** (dark) and **Moon** (light)

### Spacing Scale
All spacing uses a constrained scale derived from Tailwind's default (multiples of 4px):

| Token | px | Usage |
|---|---|---|
| `gap-1` | 4px | Tight coupling (icon + label, tag clusters) |
| `gap-2` | 8px | Related items (card metadata rows) |
| `gap-4` | 16px | Default spacing between elements |
| `gap-6` | 24px | Section separation within cards |
| `gap-8` | 32px | Card-to-card grid gaps |
| `gap-12` | 48px | Major page sections |
| `gap-16` | 64px | Hero spacing, page-level sections |

Rule: spacing between groups must exceed spacing within groups.

### Shadow Scale (elevation)

| Token | Shadow | Elevation | Usage |
|---|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Raised slightly | Cards (default), tag pills |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.35)` | Elevated | Hovered cards, dropdowns |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.4)` | Floating | Modals, settings dropdown |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.45)` | Highest | Help modal, CV picker overlay |

Light mode shadows use the same tokens with reduced opacity (multiply by 0.5).

---

## 4. Typography

### Font
- **JetBrains Mono** (Google Fonts) — monospace only
- Applied globally via Tailwind `fontFamily.mono`
- Single family with weight variation (300–800) for both display and body — no pairing needed

### Fluid Size Scale (clamp-based)

| Token | Fluid Size | Line H | Weight | Usage |
|---|---|---|---|---|
| `label` | `clamp(10px, 0.625rem + 0.1vw, 11px)` | 16px | 700 | Tags, badges, footer, keyboard hints |
| `body` | `clamp(12px, 0.75rem + 0.15vw, 13px)` | 20px | 400 | Default text, nav items |
| `body-lg` | `clamp(14px, 0.875rem + 0.15vw, 15px)` | 22px | 400 | Terminal prompts, card descriptions |
| `h2` | `clamp(18px, 1rem + 0.4vw, 20px)` | 28px | 600 | Section subheadings |
| `h1` | `clamp(20px, 1.125rem + 0.6vw, 24px)` | 32px | 700 | Section headings |
| `display` | `clamp(24px, 1.25rem + 0.8vw, 28px)` | 36px | 700 | Page titles |
| `display-lg` | `clamp(32px, 1.5rem + 2vw, 42px)` | 52px | 800 | Hero headline (home page only) |
| `code` | `clamp(12px, 0.75rem + 0.15vw, 13px)` | 20px | 400 | Inline code |

### Measure (line length)
- Body text containers: `max-width: 65ch` (~45–75 characters optimal for readability)
- Prose containers (blog posts): `max-width: 70ch` with `line-height: 1.7`
- Headings: no measure constraint, but manual line-break control at key breakpoints

### Font Loading Strategy
- **Preload**: `<link rel="preload" href="/fonts/JetBrainsMono.woff2" as="font" type="font/woff2" crossorigin>`
- **Display**: `font-display: swap` — shows fallback monospace text immediately, swaps when font loads
- **Subsetting**: Latin character subset only (drop unused glyphs to reduce payload)
- **Budget**: Under 200KB total font payload (single variable font covers all weights)
- **Fallback stack**: `'JetBrains Mono', 'Courier New', 'Consolas', monospace` — matching metrics to minimize layout shift

### Icons
- **Material Symbols Outlined** (Google Fonts)
- Font variation: `"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20`
- Icon sizing: `w-4 h-4` inline, `w-5 h-5` nav, `w-6 h-6` feature icons

---

## 5. Components

### 5.1 Header (`<AppHeader />`)
- Fixed top, h-10, z-50
- Brand label (bg-surface-container-highest)
- 4 nav tabs: HOME, POSTS, PROJECTS, ABOUT
- Active tab: `bg-primary text-on-primary font-bold`
- Settings gear button (opens dropdown)
- Keyboard: `0`-`3` navigates to each tab

### 5.2 Footer (`<AppFooter />`)
- Fixed bottom, h-8, z-50
- Left: page name + breadcrumb (e.g., `BLOG > INDEX`)
- Center: GITHUB | LINKEDIN | RSS (links TBD)
- Right: `?` help button + zoom level display

### 5.3 Settings Dropdown (`<SettingsDropdown />`)
- Absolute positioned, w-56, z-50
- Sections:
  1. **Theme**: Dark/Light toggle
  2. **Font Size**: A- / Reset / A+ (80%–120% range, persisted)
  3. **Zoom**: 75% / 100% / 125% / 150% (persisted)
  4. **Contact Me**: opens contact modal
  5. **Download CV**: opens CV format picker modal
  6. **Help**: opens help modal
  7. **Report Problem**: opens report modal

### 5.4 Help Modal (`<HelpModal />`)
- Fixed overlay, bg-surface-dim/80 backdrop-blur-sm, z-100
- Man-page style with sections: NAME, SYNOPSIS, NAVIGATION, SYSTEM
- Lists all keyboard shortcuts

### 5.5 Contact Modal (`<ContactModal />`)
- Fixed overlay, z-100, primary-themed (blue)
- Fields: Name, Email, Subject, Message
- Submit button (handler TBD — formspree or similar)

### 5.6 CV Format Picker (`<CvPicker />`)
- Fixed overlay, z-100, secondary-themed (purple)
- Title: "SELECT CV FORMAT"
- Options displayed as terminal-style cards:
  - **PDF** — `[cv.pdf]` — icon + "Print-ready format"
  - **Markdown** — `[cv.md]` — icon + "Plain text, readable"
  - **JSON** — `[cv.json]` — icon + "Machine-readable data"
- Each option is a clickable card that triggers download via `/api/cv?format=pdf|md|json`
- Close via Escape or backdrop click

### 5.7 Report Modal (`<ReportModal />`)
- Fixed overlay, z-100, tertiary-themed (orange)
- Fields: Name, Email, Message
- Submit button (handler TBD)

### 5.7 Search Bar (`<SearchBar />`)
- Hidden by default, toggled via `/` key
- Terminal-style input with `$` prefix
- Placeholder: `search "term" #tag @language — try "fzf scripts" #cli @bash`
- Shows result count: "Showing X of Y results"
- Debounced input (150ms)

### 5.8 Filterable Card (`<FilterableCard />`)
- Terminal-style box with traffic light dots header
- Image area (16:10 aspect ratio)
- Title, description, tag pills, language pills
- Data attributes: `data-title`, `data-description`, `data-tags`, `data-langs`
- Hover: border-primary + blue glow shadow
- Entrance animation: `fadeSlideUp` with staggered delay

### 5.9 Tag Pill (`<TagPill />`)
- `#tagname` text, clickable
- Click prefills search bar with `#tagname`
- Hover: bg-primary text-on-primary

### 5.10 Language Pill (`<LangPill />`)
- `LanguageName` text, clickable
- Click prefills search bar with `@language`
- Hover: bg-tertiary text-on-tertiary

### 5.11 Terminal Prompt (`<TerminalPrompt />`)
- Decorative header showing current "directory"
- Blinking cursor or animated pulse block
- Variants: `~/blogs`, `~/projects`, `~/search`, etc.

### 5.12 Code Block (`<CodeBlock />`)
- Terminal-style with traffic light dots header
- Language label
- `<pre><code>` with syntax highlighting
- Tokyo Night color tokens for syntax

### 5.13 Traffic Light Dots
- 3 dots: red (error), yellow, green (success)
- Used in card headers and code block headers

---

## 6. Keyboard Shortcuts

| Key | Action |
|---|---|
| `0` | Navigate to `/` |
| `1` | Navigate to `/blog` |
| `2` | Navigate to `/projects` |
| `3` | Navigate to `/about` |
| `?` | Toggle help modal |
| `/` | On `/blog`, `/projects`, `/search`: toggle inline search bar & focus. On other pages: navigate to `/search` |
| `Escape` | Close all modals and settings |
| `g` | Scroll to top (smooth) |
| `G` | Scroll to bottom (smooth) |

Disabled when INPUT or TEXTAREA is focused.

---

## 7. Search/Filter System

### Query Syntax
```
search "term" #tag @language
```

- `"quoted text"` — search term (matches title + description)
- `#tag` — filter by tag (OR logic among multiple tags)
- `@language` — filter by language (OR logic among multiple langs)
- All three must match (AND logic across categories)

### Parsing (`parseQuery`)
1. Extract quoted strings as terms
2. Split remaining by whitespace
3. `#prefix` → tags array
4. `@prefix` → langs array
5. Everything else → terms array

### Filtering (`filterCards`)
- For each `.filterable-card`:
  - `textMatch`: any term appears in `data-title` or `data-description`
  - `tagMatch`: any tag appears in `data-tags` (comma-separated)
  - `langMatch`: any lang appears in `data-langs` (comma-separated)
  - Card visible only if all three match
- Hidden cards: `display: none`
- Matching terms highlighted in title with `.fzf-highlight` class

### Highlighting (`highlightText`)
- `.fzf-highlight`: `background-color: #ff9e64; color: #1a1b26; padding: 0 2px; font-weight: 700`
- Regex-escapes terms, wraps matches in `<span class="fzf-highlight">`

### Click-to-search
- Tag pills: click sets `#tagname` in search bar
- Language pills: click sets `@language` in search bar

---

## 8. Data Model

### Blog Post (MDX frontmatter)

```yaml
---
title: "Mastering fzf filters for workflow automation"
slug: mastering-fzf-filters
date: 2023-10-15
tags: [cli, automation, fzf, rust, wasm]
description: "Exploring the hardware constraints of edge computing..."
image: "/images/blog/fzf-filters.jpg"
featured: true
---
```

### Project (MDX frontmatter)

```yaml
---
title: "fzf-scripts"
slug: fzf-scripts
tags: [fzf, cli, automation]
languages: [shell, python]
description: "Collection of interactive fuzzy finder scripts..."
image: "/images/projects/fzf-scripts.jpg"
stars: 128
featured: true
---
```

### Content directory structure
```
content/
  blog/
    mastering-fzf-filters.mdx
    building-tmux-workflow.mdx
    ...
  projects/
    fzf-scripts.mdx
    dotfiles-manager.mdx
    ...
```

### Image directory
```
public/
  images/
    blog/
      mastering-fzf-filters.jpg
      ...
    projects/
      fzf-scripts.jpg
      ...
```

---

## 9. API Routes

### `GET /api/cv?format=pdf|md|json`

Returns the CV in the requested format.

- **pdf**: Returns `public/cv/cv.pdf` as `application/pdf` with `Content-Disposition: attachment`
- **md**: Returns `public/cv/cv.md` as `text/markdown` with `Content-Disposition: attachment`
- **json**: Returns `public/cv/cv.json` as `application/json` with `Content-Disposition: attachment`
- Invalid format: returns 400 with error message
- Missing file: returns 404

### `POST /api/contact` (future)
- Accepts: `{ name, email, subject, message }`
- Forwards via email service (TBD: Resend, Formspree, or API route)

### `POST /api/report` (future)
- Accepts: `{ name, email, message }`
- Forwards via email service (TBD)

---

## 10. Background & Visual Effects

### Dot-grid background
- All pages: `radial-gradient(circle, rgba(68,76,247,0.3) 1.2px, transparent 1.2px)`
- `background-size: 15px 15px`
- `background-attachment: fixed`
- Applied to `<body>` — visible through transparent main content areas

### Card entrance animation
```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.card-enter { animation: fadeSlideUp 0.4s ease-out both; }
```

### Card hover glow
```css
box-shadow: 0 0 20px -5px rgba(122,162,247,0.15);
```

### Scrollbar
- Width: 4px
- Track: `#1a1b26` (dark) / `#e6e7ed` (light)
- Thumb: `#3b4261` (dark) / `#9b9fb1` (light)
- Thumb hover: `#7aa2f7`

### Custom Easing Curves
All animations use custom cubic-bezier curves — default `ease`, `ease-in`, `ease-out`, and `linear` are banned:

| Curve | cubic-bezier | Usage |
|---|---|---|
| Expo Out | `cubic-bezier(0.16, 1, 0.3, 1)` | Card entrance, page reveals |
| Quart Out | `cubic-bezier(0.25, 1, 0.5, 1)` | Hover transitions, button feedback |
| Expo In-Out | `cubic-bezier(0.87, 0, 0.13, 1)` | Page transitions, modal open/close |

### Micro-Interactions

| Element | Interaction | Implementation |
|---|---|---|
| **Navigation tabs** | Active tab: `bg-primary` + bold; hover: `bg-surface-container-high` | CSS transition 150ms ease |
| **Card hover** | Border shifts to `primary`, blue glow shadow, slight translateY(-2px) | CSS transition 200ms quart-out |
| **Tag/Lang pills** | Hover: bg shifts to primary/tertiary, text to on-primary | CSS transition 150ms |
| **Buttons** | Hover: slight scale(1.02); active: scale(0.98) | CSS transform |
| **Links** | Underline appears on hover via `background-size` animation | CSS `background-image` gradient trick |
| **Selection color** | `::selection { background: #7aa2f7; color: #1a1b26; }` (dark) / `#2f6ed6` + `#e6e7ed` (light) | Global CSS |
| **Focus states** | Visible `outline: 2px solid var(--primary)` with `outline-offset: 2px` on keyboard focus only | `:focus-visible` selector |
| **Loading states** | Skeleton shimmer using `bg-surface-container-high` with animated gradient sweep | CSS `@keyframes shimmer` |
| **Empty states** | Terminal-style "No results found" with `$` prompt and suggestion text | Inline component |
| **404 page** | Terminal error: `bash: page not found: [path]` with `$` prompt and suggestion | Static page |

### Scroll-Based Design (Lenis)
- **Library**: Lenis smooth scroll for weighted, physical scroll feel
- **Configuration**: `duration: 1.2`, `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`, `orientation: 'vertical'`, `smoothWheel: true`
- **Integration**: Wrapped in a React context provider, applied to `#main-scroll` container
- **Scroll-driven reveals**: IntersectionObserver toggles `.card-enter` class for staggered card entrance
- **Respects reduced motion**: `prefers-reduced-motion: reduce` disables Lenis and falls back to native scroll
- **Ethical boundary**: No scroll hijacking — users can always scroll at their own pace and reach all content

---

## 11. Responsive Design System

### Breakpoints

| Breakpoint | Width | Name | Layout changes |
|---|---|---|---|
| `xs` | < 480px | Mobile S | Single column, compact spacing |
| `sm` | ≥ 480px | Mobile L | Slightly wider content padding |
| `md` | ≥ 768px | Tablet | 2-column grids, side-by-side cards |
| `lg` | ≥ 1024px | Desktop | 3-column grids (projects), full nav labels |
| `xl` | ≥ 1280px | Wide | Max content width constraints, comfortable spacing |

### Layout behavior per breakpoint

| Element | xs (<480) | sm (≥480) | md (≥768) | lg (≥1024) | xl (≥1280) |
|---|---|---|---|---|---|
| Header nav labels | Icons only | Icons + short labels | Full labels | Full labels | Full labels |
| Blog grid | 1 col | 1 col | 2 cols | 2 cols | 2 cols |
| Projects grid | 1 col | 1 col | 2 cols | 3 cols | 3 cols |
| Home projects | 1 col | 1 col | 2 cols | 3 cols | 3 cols |
| Home blog | 1 col | 1 col | 2 cols | 2 cols | 2 cols |
| About social links | 1 col | 1 col | 3 cols | 3 cols | 3 cols |
| Content max-width | 100% | 100% | 896px | 896px | 1024px |
| Card padding | px-3 | px-4 | px-6 | px-6 | px-8 |
| Section gap | gap-3 | gap-4 | gap-4 | gap-4 | gap-6 |

### Mobile navigation
- Below `md`: header nav collapses to icon-only buttons with tooltips
- Settings gear always visible
- Footer social links: abbreviated to icons only below `sm`

### Touch targets
- All interactive elements ≥ 44px tap target on touch devices
- Cards: entire card is clickable (wrapped in `<Link>`)
- Tag/language pills: minimum 28px height for touch

---

## 12. State Management

### Persisted (localStorage)
- `theme`: `"dark"` | `"light"`
- `fontSize`: number (80–120, default 100)
- `zoom`: number (75 | 100 | 125 | 150, default 100)

### React Context
- `ThemeContext`: current theme + toggle function
- `SettingsContext`: fontSize, zoom, setters

### Client-side only
- Search/filter state (query, results)
- Modal visibility
- Settings dropdown visibility

---

## 13. UX Heuristics & Accessibility

### Trunk Test
A user dropped on any random page should instantly answer:
1. **What site is this?** — Brand label in header (`Dennis-Tanui-V0.0.8`)
2. **What page am I on?** — Active nav tab highlighted, breadcrumb in footer
3. **What are the major sections?** — 4 nav tabs always visible (HOME, POSTS, PROJECTS, ABOUT)
4. **What are my options here?** — Primary CTA, search bar (where applicable), scroll indicator
5. **Where am I in the hierarchy?** — Footer breadcrumb (`PAGE > SECTION`), active nav tab
6. **Where's search?** — `/` key reveals search bar on applicable pages; gear icon → settings

### Error States
| Component | Empty State | Error State | Loading State |
|---|---|---|---|
| **Blog grid** | `$ No posts found. Try a different search.` | `$ Failed to load posts. [retry]` | Skeleton cards (3) with shimmer |
| **Projects grid** | `$ No projects match your query.` | `$ Failed to load projects. [retry]` | Skeleton cards (3) with shimmer |
| **Search results** | `$ No results for "[query]". Try #tags or @languages.` | `$ Search failed. [retry]` | Spinner in search bar |
| **Contact form** | — | Inline field validation + `$ Submission failed. [retry]` | Button shows `Sending...` with spinner |
| **CV download** | — | `$ CV not available in [format]. Try another format.` | Button shows `Downloading...` with progress |

### Accessibility Checklist
- **Keyboard navigation**: All interactive elements reachable and operable via Tab/Shift+Tab
- **Focus indicators**: `:focus-visible` outlines on all interactive elements (never `outline: none` without replacement)
- **Skip link**: Hidden skip-to-content link at top of page
- **ARIA labels**: Icon-only buttons (nav tabs on mobile, settings gear) have `aria-label`
- **Screen reader**: Search results announce count via `aria-live="polite"` region
- **Motion**: `prefers-reduced-motion` disables all animations, Lenis smooth scroll, and entrance effects
- **Contrast**: All text meets WCAG AA (4.5:1 body, 3:1 large text); color tokens designed with contrast in mind
- **Touch targets**: Minimum 44×44px on all interactive elements
- **Zoom**: Page works at 200% browser zoom without content loss or horizontal scroll

---

## 14. Architecture Decision Log

Key architectural decisions and the rationale behind them:

| # | Decision | Rationale | Alternatives Rejected |
|---|---|---|---|
| 1 | **Static generation** (no SSR/ISR) | Portfolio content changes infrequently; static files serve fastest with zero server cost | SSR (unnecessary complexity), ISR (overkill for ~20 pages) |
| 2 | **MDX content** (not CMS) | Content lives in repo, version-controlled, no external dependency; developer edits directly | Headless CMS (vendor lock-in, extra latency), JSON files (no embedded components) |
| 3 | **Modular monolith** (no microservices) | Single developer, single concern (portfolio); no team boundaries to justify service split | Micro-frontends (distributed monolith with no benefit) |
| 4 | **Tailwind darkMode: "class"** (not media-query) | User-chosen theme must persist across sessions; system preference is first-visit default only | `prefers-color-scheme` only (no manual toggle), CSS variables alone (no Tailwind integration) |
| 5 | **Client-side search** (no backend) | All content known at build time; filter/highlight logic runs in-browser on static data | Algolia/Meilisearch (overkill for <100 items), server-side search (requires runtime) |
| 6 | **Lenis smooth scroll** (not native) | Terminal-theme aesthetic demands weighted, physical scroll feel; Lenis is lightweight and React-compatible | Locomotive Scroll (heavier, less maintained), native scroll (no weighted feel) |
| 7 | **Single font family** (JetBrains Mono) | Terminal theme consistency; variable font covers all weights in one file; no pairing needed | Multiple families (dilutes terminal aesthetic), system monospace (loses brand character) |
| 8 | **No custom cursor** | Terminal aesthetic uses default cursor; custom cursors hurt usability without clear benefit | Custom cursor (gimmicky, accessibility concern, opt-in only) |

---

## 15. Testing Strategy

### Philosophy
Proportional to risk — a static portfolio site needs targeted unit tests for complex logic, not full E2E suites. Build-time checks (TypeScript, ESLint, `next build`) catch the majority of defects for free.

### Layers

| Layer | Tool | What it covers | When it runs |
|---|---|---|---|
| **Type checking** | `tsc --noEmit` | Type errors, missing exports, incorrect props | `npm run typecheck` — dev, CI |
| **Linting** | ESLint (next/core-web-vitals + typescript) | React hooks rules, a11y, import issues | `npm run lint` — dev, CI |
| **Formatting** | Prettier | Consistent code style (semi, quotes, trailing commas) | `npm run format:check` — CI; `npm run format` — dev |
| **Unit tests** | Vitest | Shared utility logic (parseQuery, filterCards, highlightText) | `npm test` — dev, CI |
| **Build** | `next build` | Broken imports, missing pages, undefined generateStaticParams | `npm run build` — dev, CI |

### Unit test scope (~3 files, ~15 tests)

| File | What's tested | Priority |
|---|---|---|
| `lib/utils.test.ts` | `parseQuery` (quoted terms, tags, langs, mixed, empty), `filterCards` (term/tag/lang filtering, AND logic, empty query), `highlightText` (case-insensitive match, no match, empty terms) | High — search/filter is the most complex client logic |
| `hooks/useKeyboard.test.ts` | Key-action dispatch, input focus gating | Medium — keyboard is core UX |
| `hooks/useLocalStorage.test.ts` | SSR safety, read/write, fallback behavior | Low — simple wrapper |

### What we don't need
- **E2E (Playwright)** — no user auth, no forms hitting real APIs, no dynamic data paths
- **Integration tests** — no database, no runtime API calls
- **Storybook** — 13 components, all visible in context, no shared design system across projects
- **Visual regression** — static site; if it builds, it looks right; manual review in dev is sufficient

### CI pipeline (GitHub Actions)

On every push/PR to `main`:

```
npm ci → typecheck → lint → format:check → test → build
```

All steps must pass before merge. See `.github/workflows/ci.yml`.

---

### `lib/utils.ts`
- `parseQuery(query)`: returns `{ terms, tags, langs }`
- `highlightText(text, terms)`: returns HTML string with `<span class="fzf-highlight">`
- `filterCards(cards, query)`: returns filtered card array

### `lib/constants.ts`
- Color token definitions
- Keyboard shortcut map
- Navigation items

### `hooks/useKeyboard.ts`
- Centralized keyboard shortcut handler
- Configurable key-action map
- Respects input focus state

### `hooks/useLocalStorage.ts`
- Generic localStorage read/write with SSR safety

### `hooks/useLenis.ts`
- Lenis smooth scroll initialization and cleanup
- Respects `prefers-reduced-motion`
- Provides scroll progress and velocity to consuming components

---

## 16. Pages Detail

### Home (`/`)
- Hero section: terminal prompt, headline, subtitle, CTA buttons
- Featured projects (3 cards, grid)
- Recent blog posts (2 cards, grid)
- No search bar

### Blog Index (`/blog`)
- Terminal prompt: `➜ ~/blogs`
- Search bar (hidden, toggle with `/`)
- Blog card grid (2 columns, featured article spans 2)
- 6+ blog cards with tags

### Blog Post (`/blog/[slug]`)
- Terminal path header
- Author info, date
- Featured image
- Article content with code blocks
- Related posts (2 cards)

### Projects Index (`/projects`)
- Terminal prompt: `λ /home/user/workspace` + `$ ls projects/`
- Search bar (hidden, toggle with `/`)
- Project card grid (3 columns)
- 12+ project cards with tags + language pills

### Project Detail (`/projects/[slug]`)
- Project header with title, tags, languages
- Description, features
- Code snippets
- Related projects

### About (`/about`)
- Terminal prompt: `➜ ~/about`
- Vertical timeline with alternating sections
- Story sections with image placeholders
- Social links grid

### Search (`/search`)
- Terminal prompt: `➜ ~/search`
- Search bar (hidden, toggle with `/`, autofocus when opened)
- Search result cards with term highlighting
- 6+ result cards

---

## 17. Implementation Order

1. **Scaffold**: Next.js app, Tailwind config with color tokens, font setup, preload fonts
2. **Layout**: AppHeader, AppFooter, SettingsDropdown, modals (Help, Contact, CV Picker, Report)
3. **Theme**: ThemeContext, dark/light toggle, localStorage persistence, color token CSS variables
4. **Lenis**: useLenis hook, smooth scroll context provider, reduced-motion respect
5. **Home page**: Hero with terminal prompt, featured projects, recent blog posts
6. **Blog**: MDX content pipeline, blog index with search/filter, blog post page with code blocks
7. **Projects**: MDX content pipeline, projects index with search/filter, project detail page
8. **About**: Timeline page with alternating sections, social links grid
9. **Search**: Global search page with term highlighting
10. **Keyboard**: Centralized useKeyboard handler with key-action map
11. **Polish**: Card entrance animations, micro-interactions, responsive breakpoints, error/empty/loading states, 404 page, accessibility audit
