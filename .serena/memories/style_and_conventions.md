# Style and Conventions

## Linting & Formatting
- **Biome** for linting (import organize disabled in Biome)
- **Prettier** with `prettier-plugin-organize-imports` and `prettier-plugin-tailwindcss`
- Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin, styles in `app/index.css`)

## Code Style
- TypeScript with strict mode
- No semicolons (Prettier default for this project — single quotes)
- Named exports preferred for components
- `cn()` helper from `~/lib/utils` for className merging (clsx + tailwind-merge)

## Component Organization
- `app/components/ui/` — shadcn/ui primitives (button, dialog, table, sidebar, etc.)
- `app/components/layout/` — Dashboard shell components (header, main, page-header, app-sidebar, nav-group, nav-user, team-switcher, profile-dropdown, search, command-menu, theme-switch)
- `app/components/` — Shared app components (confirm-dialog, password-input, long-text, coming-soon, theme-provider)
- Route-local components go in `+components/` directories within routes

## Layout Primitives
- `Header` — Sticky header bar with scroll detection
- `Main` — Main content area wrapper (applies `px-4 py-6`)
- `PageHeader` — Compound component for page titles (PageHeader, PageHeaderHeading, PageHeaderTitle, PageHeaderDescription, PageHeaderActions)
- Breakout pattern: `-mx-4 px-4` to negate Main's padding for full-width tables

## Route Handles
- `RouteHandle` interface exported from `_authenticated/_layout.tsx`
- Properties: `breadcrumb`, `headerFixed`, `mainFixed`
- Type-safe `href()` from react-router used for all route paths

## Forms
- Conform + Zod for validation
- Schemas extracted to `+schema.ts` files to avoid circular imports
