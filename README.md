# Dennis-Tanui-V0.0.8 — Portfolio

Tokyo Night terminal-themed portfolio built with Next.js 16. Interactive search, keyboard-driven navigation, and dark/light theme toggling.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 |
| Auth | NextAuth v5 (Credentials, GitHub OAuth, Google OAuth) |
| Content | MDX via `next-mdx-remote` + `gray-matter` frontmatter |
| Smooth scroll | Lenis |
| Testing | Vitest + Testing Library (jsdom) |
| Linting | ESLint (next config) + Prettier |
| Deployment | Vercel |

## Project Structure

```
portfolio-website/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout — <html>, fonts, <Providers>
│   ├── providers.tsx             # Client shell — theme, settings, toast, keyboard, modals
│   ├── page.tsx                  # Home — hero, featured projects, recent posts
│   ├── globals.css               # Tokyo Night/Moon theme tokens + animations
│   ├── not-found.tsx             # Custom 404
│   ├── about/
│   │   └── page.tsx              # About page (MDX content)
│   ├── blog/
│   │   ├── page.tsx              # Blog listing grid
│   │   ├── BlogGrid.tsx          # Client-side blog grid with tag filtering
│   │   └── [slug]/
│   │       └── page.tsx          # Individual blog post (MDX render)
│   ├── projects/
│   │   ├── page.tsx              # Projects listing grid
│   │   ├── ProjectGrid.tsx       # Client-side project grid with tag/language filtering
│   │   └── [slug]/
│   │       └── page.tsx          # Individual project (MDX render + GitHub README fallback)
│   ├── search/
│   │   ├── page.tsx              # Search page
│   │   └── SearchResults.tsx     # Client-side fuzzy search (fzf-style highlighting)
│   ├── admin/
│   │   ├── page.tsx              # Admin dashboard (server — fetches posts/projects)
│   │   ├── AdminClient.tsx       # Admin CRUD client — create/edit/delete posts & projects
│   │   └── login/
│   │       ├── page.tsx          # Login page
│   │       └── auth-buttons.tsx  # OAuth + password login buttons
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/    # NextAuth catch-all route
│       └── cv/
│           └── route.ts          # CV file download endpoint
│
├── components/                   # Shared UI components
│   ├── AppHeader.tsx             # Top navigation bar (theme toggle, shortcuts)
│   ├── AppFooter.tsx             # Footer
│   ├── TerminalPrompt.tsx        # `$ path~` terminal prompt decoration
│   ├── FilterableCard.tsx        # Card with tag filtering + entrance animation
│   ├── CodeBlock.tsx             # Syntax-highlighted code blocks (MDX)
│   ├── Popup.tsx                 # Generic modal popup
│   ├── ContactModal.tsx          # Contact form modal
│   ├── HelpModal.tsx             # Keyboard shortcut reference modal
│   ├── CvPicker.tsx              # CV download modal
│   ├── ReportModal.tsx           # Bug report modal
│   ├── SearchBar.tsx             # Search input with fzf-style highlighting
│   ├── SessionProvider.tsx       # NextAuth session provider wrapper
│   ├── SettingsDropdown.tsx      # Font size + zoom settings panel
│   ├── LangPill.tsx              # Language badge pill
│   ├── TagPill.tsx               # Tag badge pill
│   ├── ToastContainer.tsx        # Toast notification container
│   └── TrafficLightDots.tsx      # macOS-style window dots decoration
│
├── context/                      # React context providers
│   ├── ThemeContext.tsx           # Dark/light theme state + toggle
│   ├── SettingsContext.tsx        # Font size & zoom persistence
│   └── ToastContext.tsx           # Toast notification queue
│
├── hooks/                        # Custom React hooks
│   ├── useKeyboard.ts            # Global keyboard shortcut bindings
│   ├── useLenis.ts               # Lenis smooth scroll init
│   └── useLocalStorage.ts        # localStorage-backed state
│
├── lib/                          # Core logic (server + shared)
│   ├── content.ts                # MDX content fetchers — blog posts, projects, about
│   ├── auth.ts                   # NextAuth config export
│   ├── auth.config.ts            # Auth providers (Credentials, GitHub, Google)
│   ├── github-client.ts          # GitHub Contents API client (browser + server)
│   ├── github.ts                 # Additional GitHub helpers
│   ├── admin-actions.ts          # Server actions — CRUD for posts/projects via GitHub API
│   ├── admin-shared.ts           # Shared admin helpers (slug, frontmatter builder)
│   └── utils.ts                  # General utilities
│
├── content/                      # MDX content files (cloned from external repo at build)
│   ├── about.mdx                 # About page content
│   ├── blog/                     # Blog posts (MDX with frontmatter)
│   │   ├── fzf-workflows.mdx
│   │   ├── rust-cli-tools.mdx
│   │   └── tmux-workflow.mdx
│   └── projects/                 # Projects (MDX with frontmatter)
│       ├── dotfiles-manager.mdx
│       ├── fzf-scripts.mdx
│       └── neovim-config.mdx
│
├── public/                       # Static assets
│   ├── images/
│   │   ├── blog/                 # Blog post images
│   │   └── projects/             # Project images
│   └── cv/                       # CV/resume files
│
├── scripts/
│   └── prebuild.sh               # Clones content repo before Vercel build
│
├── middleware.ts                  # NextAuth middleware — protects /admin routes
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.mjs
├── .prettierrc
└── package.json
```

## Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Content Layer                         │
│  content/*.mdx  ←──  admin actions  ←──  GitHub API         │
│       │                     │                   │            │
│       ▼                     ▼                   ▼            │
│  lib/content.ts        lib/admin-actions.ts  lib/github-    │
│  (build-time reads)    (server actions)      client.ts      │
│                                          (Contents API)     │
└─────────────┬───────────────────────────┬───────────────────┘
              │                           │
              ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        App Router Pages                      │
│  /            →  Featured projects + recent posts             │
│  /blog        →  Blog listing (tag-filtered grid)            │
│  /blog/[slug] →  Single post (MDX render)                    │
│  /projects    →  Project listing (tag/language filter)       │
│  /projects/[slug] → Single project (MDX + GitHub README)     │
│  /about       →  About page (MDX content)                    │
│  /search      →  Fuzzy search across all content             │
│  /admin       →  CRUD dashboard (auth required)              │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Client Shell (providers.tsx)              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────┐  │
│  │  Theme   │  │ Settings │  │   Toast   │  │  Session  │  │
│  │ Context  │  │ Context  │  │  Context  │  │  Provider │  │
│  └──────────┘  └──────────┘  └───────────┘  └───────────┘  │
│         │              │              │              │        │
│         ▼              ▼              ▼              ▼        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AppShell — global header, footer, keyboard shortcuts │   │
│  │  modals (help, contact, CV, report), Lenis scroll     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Auth Modes

The admin panel supports two authentication modes controlled by `AUTH_MODE` env var:

| Mode | How it works |
|------|-------------|
| `cookie` (default) | NextAuth sessions via middleware. Server actions use `GITHUB_TOKEN` env var. |
| `oauth` | Client-side GitHub OAuth flow. Token stored in `sessionStorage`. API calls use browser token. |

Providers: Credentials (password), GitHub OAuth, Google OAuth. Conditionally enabled based on env vars.

### Content Architecture

- **Source of truth**: `content/` directory — MDX files with YAML frontmatter
- **Build time**: `lib/content.ts` reads files from disk, parses frontmatter with `gray-matter`
- **Remote content**: `scripts/prebuild.sh` clones a separate GitHub repo (`CONTENT_REPO`) before Vercel builds
- **Admin CRUD**: `lib/admin-actions.ts` writes directly to the content GitHub repo via Contents API
- **GitHub README fallback**: Projects with empty body + `repo_url` fetch their README from GitHub at render time
- **Git dates**: Blog post dates fall back to earliest git commit date when no frontmatter date is set

### Theme System

Dual Tokyo Night theme via CSS custom properties in `globals.css`:

| Token | Dark (default) | Light (`.light` class) |
|-------|---------------|----------------------|
| `--color-surface-container-low` | `#1a1b26` | `#e6e7ed` |
| `--color-primary` | `#7aa2f7` | `#2f6ed6` |
| `--color-tertiary` | `#ff9e64` | `#d96c1a` |

Toggle stored in `localStorage` via `ThemeContext`. Dot-grid background, custom scrollbar, and branded `::selection` included.

### Keyboard Shortcuts

Global shortcuts registered via `useKeyboard` in the app shell:

| Key | Action |
|-----|--------|
| `?` | Toggle help modal |
| `Escape` | Close all modals |
| `0` | Navigate to `/` |
| `1` | Navigate to `/blog` |
| `2` | Navigate to `/projects` |
| `3` | Navigate to `/about` |
| `g` | Scroll to top |
| `G` | Scroll to bottom |
| `/` | Navigate to `/search` (unless on a search page) |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type check |
| `npm run test` | Run Vitest test suite |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm run ci` | Full CI pipeline (typecheck → lint → format → test → build) |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Yes (admin) | GitHub PAT for content repo access |
| `CONTENT_REPO` | No | Content repo slug (default: `den-tanui/portfolio-content`) |
| `NEXT_PUBLIC_CONTENT_REPO` | No | Client-side content repo override |
| `ADMIN_PASSWORD` | For cookie auth | Password for credentials login |
| `AUTH_SECRET` | Yes | NextAuth secret |
| `AUTH_MODE` | No | `cookie` (default) or `oauth` |
| `AUTH_GITHUB_ID` | For GitHub OAuth | GitHub OAuth client ID |
| `AUTH_GITHUB_SECRET` | For GitHub OAuth | GitHub OAuth client secret |
| `AUTH_GOOGLE_ID` | For Google OAuth | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | For Google OAuth | Google OAuth client secret |
| `NEXT_PUBLIC_VERCEL_DEPLOY_HOOK` | No | Vercel deploy hook URL (triggered after admin edits) |

## Testing

```bash
npm test          # Single run
npm run test:watch  # Watch mode
```

Tests use Vitest with jsdom environment and `@testing-library/react`. Test files are co-located with source (e.g., `lib/utils.test.ts`, `hooks/useKeyboard.test.ts`).
