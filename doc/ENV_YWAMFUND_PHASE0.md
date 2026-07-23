# ENV · YWAMFund Phase 0 (D0)

> Supabase Postgres + next-intl 기준. 값은 `.env.local`에만 두고 **커밋하지 말 것**.

## 필수 (D0)

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | Supabase Postgres connection URI (Session 또는 Transaction pooler) |
| `DB_PROVIDER` | `supabase` (기본) · 오프라인만 `local` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `ko` |

## Supabase 연결 절차

1. [Dashboard](https://supabase.com/dashboard) → **YWAMFund** (`itwyvtcxaobfskgjhdqa`)
2. **Connect → Connection string → Session pooler** (port `5432`)
3. Username은 `postgres.[project-ref]` 형식 · `?sslmode=require` 권장
4. `.env.local`의 `DATABASE_URL`에 붙여넣기
5. `pnpm db:migrate` · `pnpm db:health`

> **주의:** `db.[ref].supabase.co` direct 호스트는 **IPv6 only**인 경우가 많아, IPv4 환경에서 `ENOTFOUND` / migrate 실패가 납니다. **Session/Transaction pooler**를 쓰세요.  
> 풀러 호스트의 `aws-0` / `aws-1` 접두사는 프로젝트마다 다릅니다 — Dashboard에 표시된 문자열을 그대로 복사하세요.

## Supabase 사용 규칙 (D0~)

| 사용 | 금지 |
|------|------|
| Postgres via `DATABASE_URL` + Drizzle | **Supabase Auth** (Better Auth는 D2) |
| (선택) Storage 버킷 | Realtime |
| Dashboard 백업 / SQL 비상용 | 브라우저에 `service_role` / Data API 직접 호출 |

스키마 SSOT는 **Drizzle 마이그레이션** (`drizzle/`). MCP `apply_migration` / Dashboard SQL은 반복 실험용이며, 확정 스키마는 파일로 커밋한다.

## 자리만 (D2에서 실사용)

`BETTER_AUTH_*`, `KAKAO_*`, `TOSS_*`, `SENTRY_DSN`, `UPSTASH_*`, `RESEND_*`, `CRON_SECRET`

## Health 확인

```bash
pnpm db:health
curl -s http://localhost:3000/api/health/db | jq
```

## 오프라인 (선택)

```bash
docker compose up -d
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ywamfund
# DB_PROVIDER=local
pnpm db:migrate
```
