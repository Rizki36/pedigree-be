# Improvement Plan

This document contains a prioritized improvement plan for the `pedigree-be` repository based on a full codebase review.

---

## Critical

These items must be addressed before any production deployment.

### 1. Security

| Issue | Location | Recommendation |
|-------|----------|----------------|
| Real secrets committed to `.env` | `.env` | Rotate all credentials immediately and remove `.env` from git history. Use `.env.example` only for sample values. |
| Hardcoded JWT fallback | `src/modules/core/lib/elysia.ts:20` | Remove the fallback to `your-secret-key`. Throw at startup if `JWT_SECRET` is missing. |
| CORS is completely open | `src/app.ts` | Explicitly configure allowed origins per environment. |
| Auth cookie not HTTP-only/secure | `src/modules/auth/route.ts:114-119` | Enforce `httpOnly`, `secure`, and `sameSite: 'lax'` for production cookies. |
| No resource-level authorization | `src/modules/animal/route.ts`, `src/modules/animal/service.ts`, `src/modules/achievement/service.ts` | Add `userId` to all `where` clauses and verify ownership before mutating resources. |
| `/v1/auth/test-login` backdoor | `src/modules/auth/route.ts:12-48` | Remove the route or gate it behind a separate feature flag and restrict to verified test users. |

### 2. Data Ownership Bugs

| Issue | Location | Recommendation |
|-------|----------|----------------|
| `deleteAnimal` ignores ownership | `src/modules/animal/service.ts:152-166` | Include `userId` in the `where` clause. |
| `updateAnimal` accepts but ignores `userId` | `src/modules/animal/service.ts:93-126` | Use `userId` in the `where` clause or remove the parameter. |
| Pedigree tree can access cross-user animals | `src/modules/pedigree/service.ts` | Add `userId` to all lookups and verify `animal_id_eq` belongs to the current user. |

### 3. Architecture

| Issue | Location | Recommendation |
|-------|----------|----------------|
| Multiple PrismaClient instances | `src/modules/animal/route.ts`, `src/modules/achievement/route.ts`, `src/modules/auth/route.ts`, `src/modules/pedigree/route.ts` | Export a single `prisma` instance from `src/modules/core/lib/prisma.ts` and reuse it everywhere. |
| Inconsistent authentication handling | `src/modules/animal/route.ts` | Rely on the `isSignIn` macro and `store.user`; remove duplicate `jwt.verify` calls. |

---

## High Impact

### 4. Database / Prisma

| Issue | Location | Recommendation |
|-------|----------|----------------|
| `fatherId`/`motherId` are plain strings | `prisma/schema.prisma:29-31` | Convert to self-relations with proper foreign keys. |
| Redundant indexes on primary keys | `prisma/schema.prisma` | Remove all `@@index([id])` declarations. |
| Missing composite indexes | `prisma/schema.prisma` | Add indexes for common queries such as `userId + gender`, `userId + diedAt`, etc. |
| Missing ownership unique constraints | `prisma/schema.prisma` | Add `@@unique([code, userId])` and `@@unique([userId, name])` where appropriate. |
| No cascade rules for related data | `prisma/schema.prisma` | Define `onDelete` behavior for user -> animals, animal -> achievements, etc. |

### 5. Performance

| Issue | Location | Recommendation |
|-------|----------|----------------|
| Pedigree tree N+1 queries | `src/modules/pedigree/service.ts:12-84` | Load the entire subtree with a single recursive CTE or fetch all ancestors in one query and build the tree in memory. |
| No pagination on achievement list | `src/modules/achievement/service.ts:90-107` | Implement cursor or skip pagination. |
| No recursion depth limit | `src/modules/pedigree/model.ts:4` | Add `t.Number({ minimum: 1, maximum: 10 })` for `level`. |

### 6. API Design

| Issue | Location | Recommendation |
|-------|----------|----------------|
| Non-RESTful update/delete paths | `src/modules/animal/route.ts`, `src/modules/achievement/route.ts` | Use `PATCH /v1/animal/:id` and `DELETE /v1/animal/:id` instead of body-based IDs. |
| Inconsistent response envelopes | All routes | Standardize on `{ data, meta }` or `{ data, pagination, error }`. |
| Missing HTTP status codes | All routes | Return `201` for creation, `204` for deletion, and `400` for bad requests. |
| Swagger lacks descriptions | All routes | Add `detail` and `tags` to every route definition. |

---

## Medium / Low

### 7. DevOps / Tooling

| Issue | Location | Recommendation |
|-------|----------|----------------|
| Missing `build` and `start` scripts | `package.json` | Add `bun run build` and `bun run start` scripts. |
| Incorrect `module` field | `package.json` | Point to `dist/index.js` or remove the field. |
| `postinstall` does not run migrations | `package.json` | Add `prisma migrate deploy` after `prisma generate`, or update `AGENTS.md`. |
| No health check endpoint | `src/app.ts` | Add `GET /health` or `GET /healthz`. |
| No graceful shutdown | `src/index.ts` | Close Prisma and the server on `SIGINT`/`SIGTERM`. |
| Type check failures | `bun run check-types` | Resolve incompatible `@elysiajs/cookie` types or pin compatible versions. |
| Biome lints external files | `biome.json` | Add `.opencode/` to `files.ignore`. |

### 8. Testing

| Area | Recommendation |
|------|----------------|
| Service layer | Add unit tests for `AnimalService`, `AchievementService`, and `PedigreeService`. |
| Routes | Add integration tests using Elysia's `handle` or a test HTTP client. |
| Auth | Test login, logout, Google callback, and token verification. |
| Authorization | Verify users cannot access or mutate other users' resources. |
| Pedigree | Test circular reference detection and tree depth limits. |
| Setup | Create a test database in `docker-compose.yml` and a `.env.test` file. |

### 9. Documentation

| Area | Recommendation |
|------|----------------|
| README | Add architecture overview, API docs, deployment guide, and security notes. |
| Swagger | Add `detail` blocks to every route. |
| ADRs | Document major schema and API decisions. |
| `.env.example` | Add comments explaining required vs optional variables. |

---

## Recommended Implementation Order

1. **Security & authorization fixes** (rotate secrets, fix CORS/cookies, add ownership checks).
2. **Single PrismaClient instance and auth cleanup**.
3. **Database schema improvements** (self-relations, indexes, ownership constraints).
4. **API route restructuring** (RESTful path parameters, consistent response envelopes).
5. **Pedigree tree performance rewrite** (recursive CTE or in-memory build).
6. **Testing setup** (`bun:test`, test database, integration tests).
7. **DevOps improvements** (build/start scripts, health check, CI workflow).
8. **Documentation expansion** (README, Swagger details, ADRs).

---

*Generated: Sun Aug 02 2026*
