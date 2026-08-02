# AGENTS.md

Compact guide for agents working in this repo.

## Runtime & stack

- **Bun** backend, not Node.js. Build target is `bun`.
- Framework is **Elysia** (`src/app.ts`). App entrypoint is `src/index.ts` (just imports `./app`).
- Routes are mounted under `/v1` in `src/app.ts`; modules live in `src/modules/<domain>/{route,service,model}.ts`.
- Auth/session core is in `src/modules/core/lib/elysia.ts` (JWT + Google OAuth2 + `isSignIn` macro).
- Database is **PostgreSQL** via **Prisma**; schema is `prisma/schema.prisma`.

## First-time setup

1. `cp .env.example .env` and fill real values.
2. `docker compose up` — starts Postgres on `5432` with user `admin`, password `admin`, DB `pedigree`.
3. Update `.env` `DATABASE_URL` to match Docker, e.g. `postgresql://admin:admin@localhost:5432/pedigree?schema=public`.
4. `bun install` — runs `postinstall` which does `prisma generate && prisma migrate deploy`. This requires the DB to be running first.
5. `bun dev` — runs `bun run --watch src/index.ts` on port `3011`.

## Environment variables

Required at runtime:
- `DATABASE_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` (used by `/v1/auth/google`)
- `JWT_SECRET`
- `FRONTEND_URL`, `DOMAIN`
- `NODE_ENV` (`development` or `production`)

Development shortcut: `/v1/auth/test-login` lets you log in by email without Google OAuth, but only when `NODE_ENV=development`.

## Build & run commands

- `bun dev` — dev server with watch.
- `bun run build` — bundles `src/index.ts` to `./dist` with `bun build --target bun`.
- `bun run start` — runs `dist/index.js` in production. Must build first.
- `bun run check-types` — `tsc -b --noEmit`.
- `bun run lint` / `bun run lint:fix` — Biome.
- `bun run format` — Biome format with `--write`.
- `bun run db:migrate` — `prisma migrate dev`.
- `bun run postinstall` — regenerate Prisma client and deploy migrations.

## Prisma / database

- Generator output is `prisma/generated/client` (gitignored). The generated client is imported from relative paths like `../../../prisma/generated/client` in routes.
- After schema changes, run `bun run postinstall` (or `bunx prisma generate`) to regenerate the client.
- Migrations are in `prisma/migrations/`; lock provider is `postgresql`.
- `bun install` auto-runs `migrate deploy`, so the DB must be reachable during install.
- `docker-compose.yml` mounts Postgres data to `~/apps/postgres` on the host.

## Code style & tooling

- Biome config: `biome.json`. Formatter uses **tabs**, double quotes, organizes imports.
- Biome ignores `node_modules`, `dist`, `prisma`, lockfiles, etc.
- Linter is `recommended` plus `style.noNonNullAssertion` disabled.
- TypeScript: strict, `target: ES2021`, `module: ES2022`, `types: ["bun-types"]`. `tsconfig.json` includes only `src/**/*.ts`.

## Tests & fixtures

- There are no tests. `bun test` exits with the placeholder error from `package.json`.
- Seed helper: `bun run scripts/generateRandomAnimals.ts [count]` creates a `Test User` and random animals via Faker.

## Logs

- The app writes to `logs/<YYYY-MM-DD>.log` via `logixlysia`. The directory is gitignored, so ensure it is writable at runtime.

## Notes

- No CI workflows or pre-commit hooks exist in this repo.
- Server port is hardcoded to `3011` in `src/app.ts`.
- The `module` field in `package.json` points to `src/index.js` even though the source is TypeScript.
