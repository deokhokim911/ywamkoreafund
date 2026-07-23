# YWAMFund

선교사 미션 후원 웹앱. **D0:** next-intl (ko/en) + Supabase Postgres (Drizzle) 연결.

기획·설계: [`doc/`](./doc/) · 개발 단계: [`doc/09_DEVELOPMENT_PHASES.md`](./doc/09_DEVELOPMENT_PHASES.md) · ENV: [`doc/ENV_YWAMFUND_PHASE0.md`](./doc/ENV_YWAMFUND_PHASE0.md)

## 실행

```bash
pnpm install
cp .env.example .env.local
# DATABASE_URL = Supabase connection URI (Dashboard → Database)
pnpm db:migrate
pnpm db:health
pnpm dev
```

- 한국어: [http://localhost:3000](http://localhost:3000)
- English: [http://localhost:3000/en](http://localhost:3000/en)

| 화면 | URL (ko) | URL (en) |
|------|----------|----------|
| 홈 | `/` | `/en` |
| 미션·후원 | `/mission` | `/en/mission` |
| 내 후원 | `/my` | `/en/my` |
| 선교사 대시보드 | `/dashboard` | `/en/dashboard` |
| 캠페인 만들기 | `/create` | `/en/create` |
| Q&A | `/support` | `/en/support` |
| 관리자 | `/admin` | `/en/admin` |
| DB health | `/api/health/db` | — |

## Supabase 규칙

- **사용:** Postgres (`DATABASE_URL`) + Drizzle. (선택) Storage.
- **미사용:** Supabase Auth · Realtime · 클라이언트 Data API / `service_role`.
- Auth는 **Better Auth + Kakao (D2)**.

오프라인만 필요하면: `pnpm db:up` 후 `DB_PROVIDER=local` + 로컬 `DATABASE_URL`.

## 스택

- Next.js 16 · React 19 · Tailwind 4 · TypeScript · next-intl
- Drizzle · Supabase Postgres · Vitest · ESLint
- shadcn (base-nova) · recharts · react-simple-maps

## CI

`pnpm typecheck` · `pnpm lint` · `pnpm test` · `pnpm messages:check-keys`
