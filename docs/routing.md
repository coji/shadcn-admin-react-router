# Routing Guide

This project uses [react-router-auto-routes](https://github.com/coji/react-router-auto-routes) for automatic folder-based routing with colocation support.

## Configuration

```ts
// app/routes.ts
import type { RouteConfig } from '@react-router/dev/routes'
import { autoRoutes } from 'react-router-auto-routes'

export default autoRoutes() satisfies RouteConfig
```

Zero config. Routes are auto-discovered from `app/routes/`.

## Route Files

| Pattern | Meaning | Example |
|---|---|---|
| `folder/index.tsx` | Folder route | `account/index.tsx` → `/settings/account` |
| `name.tsx` | Flat route | `create.tsx` → `/tasks/create` |
| `_layout.tsx` or `_layout/index.tsx` | Layout (renders `<Outlet />`) | `settings/_layout/index.tsx` |
| `$param` | Dynamic segment | `$task._index.tsx` → `/tasks/:task` |
| `name.action` | Dot-delimited nesting | `$task.delete.tsx` → `/tasks/:task/delete` |

### Flat vs Folder Route

- Colocated files **あり** → folder route (`sign-in/index.tsx` + `sign-in/+components/`)
- Colocated files **なし** → flat route (`help-center.tsx`)

## `_` Prefix Folder (Pathless Layout)

URL segment を追加せずにルートをグループ化する。

```
_auth/
  _layout.tsx         ← Layout (URL に /auth は含まれない)
  sign-in/index.tsx   ← /sign-in
  sign-up/index.tsx   ← /sign-up
```

This project uses three groups:

| Folder | Purpose |
|---|---|
| `_auth/` | Authentication pages (sign-in, sign-up, forgot-password, otp) |
| `_authenticated/` | All pages behind login |
| `_errors/` | Error pages (401, 403, 404, 500, 503) |

## `+` Prefix (Colocation)

`+` で始まるファイル/フォルダはルートとして認識されない。

```
account/
  index.tsx            ← Route: /settings/account
  +account-form.tsx    ← Not a route (colocated file)
  +components/         ← Not a route (colocated folder)
    some-component.tsx
```

### Colocation Patterns

| Pattern | Usage | Example |
|---|---|---|
| `+file.tsx` | Single colocated file | `account/+account-form.tsx` |
| `+components/` | Component folder | `sign-in/+components/user-auth-form.tsx` |
| `+data/` | Data/fixture folder | `apps/+data/apps.tsx` |
| `+hooks/` | Hook folder | `_index/+hooks/use-data-table-state.ts` |
| `+config/` | Config folder | `_index/+config/columns.tsx` |
| `+queries.server.ts` | Server-only file | `_index/+queries.server.ts` |
| `+shared/` | Shared across sibling routes | `tasks/+shared/data/tasks.ts` |

> **Note:** `+types/` is reserved by React Router's typegen. Do not use it.

## Dynamic Segments

```
tasks/
  $task._index.tsx    ← /tasks/:task (index)
  $task.delete.tsx    ← /tasks/:task/delete
  $task.label.ts      ← /tasks/:task/label
```

Dot-delimited notation creates nested URL paths without folder nesting. Equivalent to `tasks/$task/delete.tsx` but flatter.

## Layout Nesting

`_layout.tsx` があるフォルダの子ルートは自動的にそのレイアウト内にネストされる。

```
_authenticated/
  _layout.tsx                   ← App shell (sidebar, header)
  settings/
    _layout/index.tsx           ← Settings layout (sub-nav)
      _index/index.tsx          ← /settings
      account/index.tsx         ← /settings/account (nested in settings layout)
```

Layout をフォルダルートにするのは colocated files がある場合:

```
settings/_layout/
  index.tsx           ← Layout route
  +components/        ← Colocated (sidebar-nav)
```

Colocated files がなければフラットのまま: `_auth/_layout.tsx`

## Shared Files

複数の sibling route で共有するファイルは親フォルダに `+shared/` として配置する。

```
tasks/
  +shared/
    data/tasks.ts
    data/schema.ts
    components/tasks-mutate-form.tsx
  create.tsx             ← import from './+shared/data/tasks'
  $task._index.tsx       ← import from './+shared/data/tasks'
```

Parent folder level の共有コンポーネント:

```
settings/
  +components/
    content-section.tsx  ← Used by _index, account, appearance, display, notifications
```

## Project Structure

```
routes/
  _auth/                             Pathless: authentication
    _layout.tsx                      Auth layout
    sign-in/
      index.tsx                      /sign-in
      +components/
    sign-up/
      index.tsx                      /sign-up
      +components/
    forgot-password/
      index.tsx                      /forgot-password
      +components/
    otp/
      index.tsx                      /otp
      +components/

  _authenticated/                    Pathless: behind login
    _layout.tsx                      App layout (sidebar, header)
    _index/
      index.tsx                      / (dashboard)
      +components/
    apps/
      index.tsx                      /apps
      +data/
    chats/
      index.tsx                      /chats
      +data/
    help-center.tsx                  /help-center

    settings/
      +components/                   Shared (content-section)
      _layout/
        index.tsx                    Settings layout
        +components/                 Layout-only (sidebar-nav)
      _index/
        index.tsx                    /settings
        +form.tsx
      account/
        index.tsx                    /settings/account
        +account-form.tsx
      appearance/
        index.tsx                    /settings/appearance
        +appearance-form.tsx
      display/
        index.tsx                    /settings/display
        +display-form.tsx
      notifications/
        index.tsx                    /settings/notifications
        +notifications-form.tsx

    tasks/
      +shared/                       Shared data/components
      _layout/
        index.tsx                    Tasks layout
        +hooks/
      _index/
        _layout.tsx                  /tasks
        +components/
        +config/
        +hooks/
        +queries.server.ts
      create.tsx                     /tasks/create
      import.tsx                     /tasks/import
      $task._index.tsx               /tasks/:task
      $task.delete.tsx               /tasks/:task/delete
      $task.label.ts                 /tasks/:task/label

    users/
      +shared/                       Shared data/components
      _layout/
        index.tsx                    Users layout
        +components/
        +hooks/
        +queries.server.ts
      add.tsx                        /users/add
      invite/
        index.tsx                    /users/invite
        +components/
      $user.delete/
        index.tsx                    /users/:user/delete
        +components/
      $user.update.tsx               /users/:user/update

  _errors/                           Pathless: error pages
    401.tsx                          /401
    403.tsx                          /403
    404.tsx                          /404
    500.tsx                          /500
    503.tsx                          /503
```
