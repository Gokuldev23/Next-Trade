# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Production build (also type-checks)
pnpm lint         # Biome lint check
pnpm lint:fix     # Biome lint + auto-fix
pnpm format       # Biome format
pnpm test         # Run Jest tests
pnpm test:ci      # Jest with coverage (CI mode)
```

Run a single test file:
```bash
pnpm test -- path/to/file.test.ts
```

> **Note:** ESLint is not installed — linting is handled entirely by Biome (`@biomejs/biome`).

## Environment Variables

Required in `.env.local`:
- `DB_CONNECT_STRING` — PostgreSQL connection string (used by both `lib/db/index.ts` and `lib/db/postgres.ts`)
- `SESSION_SECRET` — Base64-encoded 256-bit key used to encrypt/decrypt JWE session tokens

## Architecture

### Auth Flow
Session auth is custom-built (no NextAuth). Flow:
1. `lib/actions/auth.action.ts` — `login`/`register`/`logout` server actions using Zod validation + bcrypt
2. `lib/auth/encryption.ts` — JWE encrypt/decrypt via `jose` (A256GCM, `dir` alg)
3. `lib/auth/session.ts` — `setSession`/`getSession`/`deleteSession` read/write an encrypted JWT cookie (`sessionId`, 10-min TTL)
4. `middleware.ts` — Protects `/dashboard/*`, `/profile/*`, `/settings/*` routes by calling `getSession()`
5. `app/dashboard/layout.tsx` — Secondary auth guard that redirects to `/sign-in` if no session

### Database
Two files exist for DB access — use the appropriate one:
- `lib/db/index.ts` — Exports `query()` helper + TypeScript types (`User`, `Trade`, `TradeType`, `TradeStatus`). Used in trade server actions.
- `lib/db/postgres.ts` — Exports raw `db` Pool. Used in auth actions.

Schema is in `lib/db/schema.sql`. Only two tables: **`users`** and **`trades`**.

### Route Structure
- `app/(public)/` — Unauthenticated pages (`/sign-in`, `/sign-up`) with their own layout
- `app/dashboard/` — All protected pages under a shared layout with Sidebar + Navbar
- Server actions live in `lib/actions/` (`auth.action.ts`, `trade.action.ts`, `profile.action.ts`)

### Component Conventions
- `lib/components/ui/` — Primitive UI components (shadcn-style, built on Radix UI)
- `lib/components/custom/` — Feature-specific components
- `lib/types/` — Shared TypeScript types (`trade.type.ts`, `user.type.ts`, `auth.type.ts`)
- Trade table uses `@tanstack/react-table` with columns defined in `lib/components/custom/TableColumns.tsx` typed against `TradeWithJoins` from `lib/types/trade.type.ts`
