# Codebase Structure

```
app/
├── root.tsx                    # Root layout (ThemeProvider, toast setup)
├── routes.ts                   # Auto-routes configuration
├── index.css                   # Tailwind CSS v4 styles
├── routes/
│   ├── _auth/                  # Auth pages (sign-in, sign-up, forgot-password, OTP)
│   │   └── _layout.tsx         # Auth layout wrapper
│   ├── _authenticated/         # Main dashboard
│   │   ├── _layout.tsx         # Dashboard layout (sidebar, header, breadcrumbs, main)
│   │   ├── _index/             # Dashboard page
│   │   ├── tasks/              # Tasks (data table with CRUD)
│   │   ├── apps/               # App integrations
│   │   ├── chats/              # Chat interface
│   │   ├── users/              # User management (data table)
│   │   ├── settings/           # Settings with sidebar nav
│   │   └── help-center.tsx     # Help center (coming soon)
│   └── _errors/                # Error pages (401, 403, 404, 500, 503)
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── layout/                 # Dashboard shell components
│   └── *.tsx                   # Shared app components
├── context/                    # React contexts (search-context)
├── hooks/                      # Shared hooks
├── lib/                        # Utilities (cn helper)
└── data/                       # Sidebar navigation config, static data
```

## Key Files
- `app/routes/_authenticated/_layout.tsx` — Main layout, exports `RouteHandle` interface
- `app/components/layout/page-header.tsx` — Page header compound component
- `app/components/layout/main.tsx` — Main content wrapper
- `app/data/sidebar-data.ts` — Sidebar navigation configuration
- `app/hooks/use-breadcrumbs.tsx` — Breadcrumb hook with route handle integration
