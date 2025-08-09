# Shadcn Admin Dashboard

Admin Dashboard UI built with Shadcn and React Router v7. Built with responsiveness and accessibility in mind.

![alt text](public/images/shadcn-admin.png)

I've been creating dashboard UIs at work and for my personal projects. I always wanted to make a reusable collection of dashboard UI for future projects; and here it is now. While I've created a few custom components, some of the code is directly adapted from ShadcnUI examples.

> This is not a starter project (template) though. I'll probably make one in the future.

## Features

- Light/dark mode
- Responsive
- Accessible
- With built-in Sidebar component
- Global Search Command
- 10+ pages
- Extra custom components

## Tech Stack

**UI:** [ShadcnUI](https://ui.shadcn.com) (TailwindCSS + RadixUI)

**Build Tool:** [Vite](https://vitejs.dev/)

**Routing:** [React Router v7](https://reactrouter.com/en/main) (Framework)

**Form Validation:** [Conform](https://conform.guide/)

**Type Checking:** [TypeScript](https://www.typescriptlang.org/)

**Linting/Formatting:** [Biome](https://biomejs.dev/) & [Prettier](https://prettier.io/)

**Icons:** [Tabler Icons](https://tabler.io/icons)

## Run Locally

Clone the project

```bash
  git clone https://github.com/coji/shadcn-admin-react-router.git
```

Go to the project directory

```bash
  cd shadcn-admin-react-router
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm run dev
```

## Contributing

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for commit messages and automated releases via [Release Please](https://github.com/googleapis/release-please).

### Commit Message Format

```
<type>: <description>

[optional body]

[optional footer(s)]
```

#### Types

- `feat:` - A new feature (triggers minor version bump)
- `fix:` - A bug fix (triggers patch version bump)
- `docs:` - Documentation only changes
- `style:` - Changes that don't affect code meaning (formatting, etc.)
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `perf:` - Performance improvements
- `test:` - Adding or correcting tests
- `chore:` - Changes to build process or auxiliary tools
- `ci:` - CI configuration changes

#### Breaking Changes

Add `!` after the type or add `BREAKING CHANGE:` in the footer to trigger a major version bump.

```bash
feat!: remove support for Node 18

# or

feat: add new API endpoint

BREAKING CHANGE: removed deprecated endpoints
```

### Examples

```bash
# Feature
feat: add dark mode toggle to settings

# Bug fix
fix: resolve navigation issue on mobile devices

# Breaking change
feat!: migrate to React Router v7

# Chore
chore: update dependencies
```

## Author

Crafted with 🤍 by [@coji](https://github.com/coji)

This project is a fork of [shadcn-admin](https://github.com/satnaing/shadcn-admin) by [@satnaing](https://github.com/satnaing). Thanks for the great original work!

## License

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/)
