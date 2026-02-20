# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `pnpm run dev`
- **Build:** `pnpm run build` (uses `react-router build`)
- **Lint:** `pnpm run lint` (Biome)
- **Format:** `pnpm run format` (Prettier with organize-imports and tailwindcss plugins)
- **Format fix:** `pnpm run format:fix`
- **Typecheck:** `pnpm run typecheck` (runs `react-router typegen` then `tsc`)
- **Validate all:** `pnpm run validate` (lint + format + typecheck)

No test runner is configured.

## Architecture

React Router v7 (framework mode, SSR enabled) admin dashboard using shadcn/ui components. Deployed to Vercel.

### Routing (`app/routes/`)

Uses **`react-router-auto-routes`** for file-system routing (configured in `app/routes.ts`). Three top-level route groups:

- **`_auth/`** — Auth pages (sign-in, sign-up, forgot-password, OTP). Layout in `_auth/_layout.tsx`.
- **`_authenticated/`** — Main dashboard. Layout in `_authenticated/_layout.tsx` wraps pages with sidebar, search provider.
- **`_errors/`** — Static error pages (401, 403, 404, 500, 503).

### Route file conventions

- **`index.tsx`** — Route module (loader, action, default component export)
- **`+schema.ts`** — Zod form validation schemas (extracted to avoid circular imports)
- **`+components/`** — Route-local components (prefixed with `+` so auto-routes excludes them)
- **`+hooks/`**, **`+shared/`**, **`+config/`**, **`+data/`**, **`+queries.server.ts`** — Route-local modules, all `+`-prefixed to prevent them from becoming routes

### App structure

- **`app/components/ui/`** — shadcn/ui primitives (button, dialog, table, sidebar, etc.). Also includes `stack.tsx` using `react-twc`.
- **`app/components/layout/`** — Dashboard shell: app-sidebar, header, main content area, nav groups, team switcher.
- **`app/components/`** — Shared app components (command-menu, confirm-dialog, search, theme-switch, profile-dropdown).
- **`app/context/`** — React contexts (search-context).
- **`app/hooks/`** — Shared hooks (use-debounce, use-dialog-state, use-mobile, use-smart-navigation).
- **`app/lib/forms.ts`** — `configureForms()` with prop-spreaders (`inputProps`, `selectProps`, etc.) and schema constraint forwarding.
- **`app/lib/utils.ts`** — `cn()` helper (clsx + tailwind-merge).
- **`app/components/conform/`** — Conform + shadcn/ui wrappers using `useControl` (Select, Checkbox, Switch, RadioGroup, DatePicker, Field, FieldError).
- **`app/data/`** — Sidebar navigation config and static data.

### Key patterns

- **Forms:** Conform future API (`@conform-to/react/future` + `@conform-to/zod/v4/future`). `app/lib/forms.ts` defines `configureForms()` with typed prop-spreaders. `app/components/conform/` provides shadcn/ui wrappers (Select, Checkbox, Switch, RadioGroup, DatePicker). See `docs/conform-future-api.md` for details.
- **Toasts:** `remix-toast` (server-side) + `sonner` (client-side). Toast data flows through root loader.
- **Theming:** `next-themes` ThemeProvider with class-based dark mode.
- **Tables:** `@tanstack/react-table` for data tables (see tasks and users routes).
- **Icons:** `@tabler/icons-react` (primary), `lucide-react` (some components).
- **Import alias:** `~/` maps to `app/` (configured via tsconfig paths).

### Linting/Formatting

- **Biome** for linting (import organize is off in Biome; handled by Prettier).
- **Prettier** with `prettier-plugin-organize-imports` and `prettier-plugin-tailwindcss`.
- Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin, styles in `app/index.css`).
