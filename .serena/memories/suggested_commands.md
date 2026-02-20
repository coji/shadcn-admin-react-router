# Suggested Commands

## Development
- `pnpm run dev` — Start dev server
- `pnpm run build` — Build (uses `react-router build`)

## Quality Checks
- `pnpm run lint` — Lint with Biome
- `pnpm run format` — Check formatting with Prettier
- `pnpm run format:fix` — Fix formatting
- `pnpm run typecheck` — Run `react-router typegen` then `tsc`
- `pnpm run validate` — Run lint + format + typecheck (use this after completing tasks)

## Notes
- No test runner is configured
- Always run `pnpm run validate` after completing a task
- Prettier uses `prettier-plugin-organize-imports` and `prettier-plugin-tailwindcss`
- Biome handles linting; import organization is handled by Prettier
