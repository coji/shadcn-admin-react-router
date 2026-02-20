# Project Overview

## Purpose
React Router v7 (framework mode, SSR enabled) admin dashboard template using shadcn/ui components. Deployed to Vercel.

## Tech Stack
- **Framework**: React Router v7 (framework mode with SSR)
- **Language**: TypeScript
- **UI**: shadcn/ui components + Tailwind CSS v4
- **Icons**: @tabler/icons-react (primary), lucide-react (some components)
- **Forms**: Conform (@conform-to/react + @conform-to/zod) with Zod schemas
- **Tables**: @tanstack/react-table
- **Toasts**: remix-toast (server) + sonner (client)
- **Theming**: next-themes with class-based dark mode
- **Package Manager**: pnpm
- **Build**: Vite with @tailwindcss/vite plugin

## Routing
Uses `react-router-auto-routes` for file-system routing (configured in `app/routes.ts`).

Three top-level route groups:
- `_auth/` — Auth pages (sign-in, sign-up, forgot-password, OTP). Layout in `_auth/_layout.tsx`
- `_authenticated/` — Main dashboard. Layout in `_authenticated/_layout.tsx` wraps pages with sidebar, search provider
- `_errors/` — Static error pages (401, 403, 404, 500, 503)

### Route file conventions
- `index.tsx` — Route module (loader, action, default component)
- `+schema.ts` — Zod form validation schemas
- `+components/` — Route-local components (+ prefix excludes from auto-routes)
- `+hooks/`, `+shared/`, `+config/`, `+data/`, `+queries.server.ts` — Route-local modules

## Import Alias
`~/` maps to `app/` (via tsconfig paths)
