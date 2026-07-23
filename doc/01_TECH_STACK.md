# 01. 기술 스택 상세

> **프로젝트:** YWAMFund  
> **기준:** TheSentAsset 코어 정렬 + YWAMFund 도메인 확장  
> **확정 (2026-07-21):** 호스팅 DB = **Supabase** · Phase 1 결제 = **Toss** · i18n = **next-intl (ko/en)**  
> **대안·비교 이력:** [10_I18N_DB_PAYMENTS.md](./10_I18N_DB_PAYMENTS.md)  
> **도입 단계:** [09_DEVELOPMENT_PHASES.md](./09_DEVELOPMENT_PHASES.md)  
> **개정:** 2026-07-21

---

## 0. 한눈에 보기

```text
┌─────────────────────────────────────────────────────────────┐
│  Browser (ko / en) — Next.js App Router + React 19          │
│  Tailwind 4 · shadcn/base-ui · next-intl · recharts · maps  │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────▼─────────────────────────────────┐
│  Next.js 16 (Node ≥ 20.9) — RSC / Server Actions / API      │
│  Better Auth (Kakao) · Drizzle · PaymentProvider(Toss)      │
│  Resend · Sentry · Upstash rate limit · Cron routes         │
└───────┬─────────────────┬─────────────────┬─────────────────┘
        │                 │                 │
   ┌────▼────┐     ┌──────▼──────┐   ┌──────▼──────┐
   │ Postgres│     │ Object      │   │ Toss /      │
   │ Drizzle │     │ Storage     │   │ (Stripe D5) │
   │ 기본:   │     │ S3-compat   │   │ Webhooks    │
   │Supabase │     │ or Supabase │   └─────────────┘
   │(D0~)    │     │ Storage     │
   │선택:    │     └─────────────┘
   │ Docker  │
   └─────────┘
```

| 구분 | 기술 | 상태 |
|------|------|------|
| 앱 프레임워크 | Next.js 16 · React 19 · TypeScript | 프로토타입 사용 중 → 프로덕션 유지 |
| UI | Tailwind 4 · CVA · lucide · shadcn(base-nova) | 프로토타입 사용 중 |
| i18n | next-intl (`ko`/`en`) | **D0 도입** |
| Auth | Better Auth + Kakao OAuth | **D2** |
| DB | PostgreSQL + Drizzle | **Supabase ✅ (D0~)** · Docker는 선택 |
| 결제 | Toss Payments (`PaymentProvider`) | **Phase 1 ✅** · Stripe는 D5 후보 |
| 이메일 | Resend | D2~D3 |
| 관측 | Sentry · Upstash Redis(레이트리밋) | Phase 1 필수 |
| 테스트 | Vitest · Playwright · MSW | D0~ |
| 배포(앱) | VPS (Linode+PM2+Nginx 등) — T-13 | Phase 0+ |

---

## 1. 런타임 · 언어 · 패키지 매니저

| 항목 | 선택 | 버전/비고 | 도입 |
|------|------|-----------|------|
| Runtime | **Node.js** | ≥ **20.9** (CI·프로덕션 **22** 권장) | D0 |
| Language | **TypeScript** | strict · 프로토타입 `5.7.3` | 유지 |
| Package manager | **pnpm** | `pnpm-lock.yaml` 커밋 | 유지 |
| Module | ESM / App Router bundler | `moduleResolution: bundler` | 유지 |

**스크립트(목표)**

| 스크립트 | 용도 |
|----------|------|
| `pnpm dev` | Next 개발 서버 |
| `pnpm build` / `start` | 프로덕션 빌드·실행 |
| `pnpm lint` / `typecheck` | ESLint · `tsc --noEmit` |
| `pnpm test` / `test:e2e` | Vitest · Playwright |
| `pnpm db:up` | (선택) Docker Compose Postgres |
| `pnpm db:migrate` / `db:studio` / `db:health` | drizzle-kit · **Supabase 기본** |
| `pnpm messages:check-keys` | ko/en 키 패리티 |

---

## 2. 프론트엔드

### 2.1 프레임워크

| 항목 | 선택 | 상세 |
|------|------|------|
| Framework | **Next.js App Router** | **16.2.x** (프로토타입 `16.2.6`) |
| UI 라이브러리 | **React 19** | RSC + Client Components 혼용 |
| 라우팅 | `src/app/[locale]/...` | D1~D2에서 현 `app/` → `src/`+locale 이전 |
| 렌더링 | 공개 미션: SSR/ISR · 대시보드: `force-dynamic` | [02](./02_SYSTEM_ARCHITECTURE.md) |
| 이미지 | `next/image` | CDN 캐시 · LCP는 `priority` / `loading="eager"` |

### 2.2 스타일 · 컴포넌트

| 항목 | 선택 | 상세 |
|------|------|------|
| CSS | **Tailwind CSS 4** | `@import 'tailwindcss'` · `@theme` oklch 토큰 |
| 애니메이션 | `tw-animate-css` | 프로토타입 사용 |
| 유틸 | `clsx` · `tailwind-merge` · `cn()` | `lib/utils.ts` |
| Variant | **CVA** (`class-variance-authority`) | 버튼 등 |
| 헤드리스 UI | **@base-ui/react** + shadcn **base-nova** | 프로토타입; Radix 정렬은 점진 |
| 아이콘 | **lucide-react** | |
| 폰트 | **Pretendard Variable** (CDN) → 이후 self-host 검토 | `layout` |

**디자인 토큰(현 프로토타입):** Primary warm teal · Accent amber · Radius `0.75rem` — `app/globals.css`.

### 2.3 폼 · 클라이언트 상태 (목표 — D2+)

| 항목 | 선택 | 용도 |
|------|------|------|
| Forms | **react-hook-form** + **Zod** | 온보딩·캠페인·후원 정보 |
| 서버/캐시 상태 | **TanStack Query** | 목록·대시보드 fetch |
| UI 상태 | **Zustand** (필요 시) | 모달·위자드 |
| 프로토타입 현재 | `useState` + `bannerStore` | D1 mock store → D2 API |

### 2.4 시각화 · 지도 · QR

| 항목 | 선택 | 용도 | 도입 |
|------|------|------|------|
| Charts | **recharts** | 대시보드 | 프로토타입 ✅ |
| Maps | **react-simple-maps** (현) → **MapLibre GL** 검토(T-12) | 세계지도 | 프로토타입 |
| Geo | ISO 3166-1 + `countries` · GeoJSON | 대륙/국가 | D3 |
| QR | **react-qr-code** | 미션 URL QR | D1 |

### 2.5 다국어 (i18n)

| 항목 | 선택 | 상세 |
|------|------|------|
| 라이브러리 | **next-intl** | TheSentAsset과 동일 |
| Locales | **`ko`** (default) · **`en`** | 이후 = JSON 추가 |
| Prefix | `as-needed` (T-27) | `/` = ko, `/en/...` = en |
| 메시지 | `messages/ko.json`, `en.json` | `nav`, `home`, `mission`, `donate`, `admin`, `emails`… |
| CI | `messages:check-keys` | 키 패리티 |
| UGC | `missions.locale` 작성 언어 1개 | 자동번역 Phase 1 없음 |
| 도입 | **D0 → D1 핵심 화면 → D4 en QA** | [10 §1](./10_I18N_DB_PAYMENTS.md) |

---

## 3. 백엔드 · API (Next.js 내부)

| 항목 | 선택 | 상세 |
|------|------|------|
| API | Route Handlers `app/api/**` | 웹훅·cron·PDF·QR |
| Mutations | **Server Actions** | 미션 CRUD·승인 |
| 세션 게이트 | `proxy.ts` / middleware | 공개 `/m/*` 예외 |
| 권한 | `requireAuth` · `requireRole` | donor / missionary / approver / admin |
| 검증 | Zod | API·Action 입출력 |
| Cron | `/api/cron/*` + `CRON_SECRET` | 정기청구·정산대사·알림 |
| 스케줄 트리거 | 외부 cron → curl | VPS crontab 등 |

**주요 API (목표)**

| 경로 | 역할 | 단계 |
|------|------|------|
| `/api/auth/[...all]` | Better Auth | D2 |
| `/api/payments/toss/confirm` | 결제 승인 | D2 |
| `/api/payments/webhook` | Toss(·향후 Stripe) 웹훅 | D2 |
| `/api/cron/charge-subscriptions` | 정기 청구 | D2 |
| `/api/cron/reconcile-settlements` | 정산 대사 | D3 |
| `/api/receipts/[id]/pdf` | 영수증 PDF | D3 |
| `/api/missions/[id]/qr` | QR PNG | D1~D2 |

---

## 4. 인증 · 인가

| 항목 | 선택 | 상세 |
|------|------|------|
| Auth | **Better Auth** | TheSentAsset 패턴 |
| IdP (Phase 1) | **Kakao OAuth** | 필수 |
| 세션 | 쿠키 (Better Auth) | HTTPS · SameSite |
| 역할 | `user_roles` multi-role | donor 기본 · missionary 온보딩 추가 |
| **미사용** | Supabase Auth | DB만 Supabase |
| 탈퇴 | unlink + 익명화 | D3 · Q-15 |

---

## 5. 데이터베이스

### 5.1 엔진 · ORM · 호스팅

| 항목 | 선택 | 상태 |
|------|------|------|
| RDBMS | **PostgreSQL 16** (권장) | |
| ORM | **Drizzle ORM** + **drizzle-kit** | 스키마 SSOT = 코드 |
| 로컬 (선택) | **Docker Compose** Postgres | 오프라인용 |
| 개발·스테이징·프로덕션 | **Supabase (PostgreSQL)** ✅ | **D0부터** connection string |
| (이력 대안) | VPS/Linode Managed Postgres | 미채택 — [10 §2](./10_I18N_DB_PAYMENTS.md) |
| 마이그레이션 | `drizzle-kit migrate` | Supabase 기본 · Docker 동일 명령 |

### 5.2 Supabase 사용 범위 (확정)

| 사용 | 미사용 |
|------|--------|
| PostgreSQL (`DATABASE_URL`) | **Auth** |
| (선택) Storage | Realtime (Phase 1) |
| 대시보드 백업·PITR | 클라이언트 Data API 직접 호출 |
| | `service_role` 브라우저 노출 |

### 5.3 스키마 모듈 (개요)

상세: [03_DATA_MODEL.md](./03_DATA_MODEL.md)

| 모듈 | 테이블 예 |
|------|-----------|
| Identity | Better Auth tables + `user_roles` |
| Profile | `missionary_profiles`, `donor_profiles`, `countries` |
| Mission | `missions`, `mission_media`, `mission_approvals`, `mission_revisions` |
| Donation | `donations`, `subscriptions`, `billing_keys`, `webhook_events`, `refunds` |
| Receipt | `donation_receipts` |
| Engagement | `mission_updates`, `mission_comments`, `content_reports`, `messages` |
| System | `system_settings`, `audit_logs`, `notification_preferences`, `banners` |

금액 = KRW 정수. 원장 하드 삭제 금지. `pg_provider` = `toss` \| `stripe`.

---

## 6. 결제

### 6.1 Phase 1 — Toss ✅

| 항목 | 선택 |
|------|------|
| 제공자 | **토스페이먼츠** |
| 일시 | 결제위젯 / 일반결제 |
| 정기 | **자동결제(빌링키)** |
| 정산 | **KRW** |
| 해외카드 | Toss 계약 범위 (Q-52) |
| 웹훅 | 서명 검증 + `webhook_events` + 멱등 |
| 실패 | 연속 실패 → `paused` (기본 3회, T-09) |

### 6.2 추상화 · Phase 2 후보

| 항목 | 선택 |
|------|------|
| 인터페이스 | `PaymentProvider` |
| Phase 1 | `TossProvider` · `PAYMENT_PROVIDERS_ENABLED=toss` |
| Phase 2 후보 | `StripeProvider` (D5, T-19) — [10 §3](./10_I18N_DB_PAYMENTS.md) |
| 원장 | 단일 `donations` — provider별 테이블 분리 금지 |

```text
src/lib/payments/
  types.ts   # PaymentProvider
  toss.ts    # Phase 1
  stripe.ts  # stub → D5
  router.ts
```

### 6.3 PCI

카드번호 미저장 · 빌링키만 암호화 · 웹훅/confirm 레이트리밋 · 시크릿 ENV 전용.

---

## 7. 스토리지 · 미디어

| 항목 | 선택 |
|------|------|
| 오브젝트 | S3-compatible (MinIO/Linode/AWS) **또는 Supabase Storage** — `lib/storage` 추상화 |
| SDK | AWS SDK v3 (S3 API) |
| 이미지 | Next/Image + CDN |
| 영상 | YouTube/Vimeo URL만 (T-16) |
| PDF | `@react-pdf/renderer` + Noto Sans KR |

---

## 8. 이메일 · 알림

| 항목 | Phase 1 | Phase 2+ |
|------|---------|----------|
| 메일 | **Resend** | |
| 앱 내 메시지 | `messages` | |
| 수신거부 | `notification_preferences` | |
| 알림톡 | — | 비즈 채널 후 |
| 카피 | next-intl `emails.*` | |

---

## 9. 관측 · 보안 · 품질

| 항목 | 선택 | 필수 |
|------|------|------|
| 오류 | **Sentry** | Phase 1 **필수** |
| 레이트리밋 | **Upstash Redis** | 결제·웹훅·메시지 **필수** |
| Analytics | Vercel Analytics/GA — Q-113 | 배포처에 맞게 정리 |
| XSS | 미션 body sanitize | |
| a11y | WCAG 2.1 AA 목표 | [04 §13](./04_FEATURE_SPEC.md) |

| 도구 | 용도 | 단계 |
|------|------|------|
| Vitest | 단위 | D0+ |
| MSW | API 모킹 | D2 |
| Playwright | E2E | D1+ |
| CI | lint · typecheck · message keys · unit | D0 |

---

## 10. 인프라 · 배포

| 계층 | 선택 |
|------|------|
| 앱 | VPS (Linode + PM2 + Nginx) 등 — T-13 |
| DB | **Supabase** ✅ (**D0~**) |
| 로컬 DB (선택) | Docker Compose |
| Cron | crontab → `/api/cron/*` |
| 백업 | Supabase PITR + 로컬 덤프 · RPO ≤ 24h 목표 |
| CDN | Cloudflare 등 |

```text
Internet → Nginx(TLS) → Next.js (PM2)
                ↓
         Supabase Postgres · Object Storage
         Cron → /api/cron/...
```

---

## 11. 현재 프로토타입 vs 목표 스택

| 영역 | 지금 (`package.json`) | 목표 (Phase 1) |
|------|----------------------|----------------|
| Next / React / TW4 | ✅ 16.2 / 19 / 4 | 유지 |
| recharts / simple-maps / lucide | ✅ | 유지 (지도 T-12) |
| next-intl | ❌ | **D0** |
| Better Auth · Kakao | ❌ | **D2** |
| Drizzle · **Supabase (D0~)** · Docker 선택 | ❌ | **D0~D2** |
| Toss | ❌ (가짜 모달) | **D2** |
| Resend · Sentry · Upstash | ❌ | D0 자리 · D2 실사용 |
| RHF · Zod · TanStack Query | ❌ | **D2** |
| Vitest · Playwright | ❌ | **D0~D1** |

---

## 12. npm 의존성 맵 (목표)

### 12.1 이미 있음

`next`, `react`, `react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `typescript`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `@base-ui/react`, `shadcn`, `recharts`, `react-simple-maps`, `@vercel/analytics`

### 12.2 Phase 1 추가 예정

| 패키지 | 용도 |
|--------|------|
| `next-intl` | i18n |
| `better-auth` | Auth |
| `drizzle-orm` · `drizzle-kit` · `postgres`/`pg` | DB |
| `zod` · `react-hook-form` · `@hookform/resolvers` | 폼 |
| `@tanstack/react-query` | 클라이언트 데이터 |
| `zustand` | (선택) UI 상태 |
| `@react-pdf/renderer` | 영수증 |
| `react-qr-code` | QR |
| `resend` | 이메일 |
| `@sentry/nextjs` | 관측 |
| `@upstash/ratelimit` · `@upstash/redis` | 레이트리밋 |
| `@aws-sdk/client-s3` · `@aws-sdk/s3-request-presigner` | 스토리지 |
| `vitest` · `playwright` · `msw` · `eslint` | 품질 |

Stripe 패키지는 **D5**까지 필수 아님.

---

## 13. 환경 변수 (상세 초안)

| 변수 | 필수 시기 | 용도 |
|------|-----------|------|
| `NEXT_PUBLIC_APP_URL` | D0 | 공개 URL · QR · OAuth |
| `DATABASE_URL` | D0 | **Supabase** (기본) 또는 Docker |
| `DB_PROVIDER` | D0 | `local` \| `supabase` |
| `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL` | D2 | Auth |
| `KAKAO_CLIENT_ID` / `KAKAO_CLIENT_SECRET` | D2 | Kakao |
| `TOSS_SECRET_KEY` / `NEXT_PUBLIC_TOSS_CLIENT_KEY` | D2 | **Phase 1 PG** |
| `TOSS_WEBHOOK_SECRET` | D2 | 웹훅 |
| `PAYMENT_PROVIDERS_ENABLED` | D2 | Phase 1: `toss` |
| `STRIPE_*` | D5 | 후보 |
| `RESEND_API_KEY` / `RESEND_FROM` | D2~D3 | 메일 |
| `S3_COMPAT_*` 또는 Storage 키 | D2 | 업로드 |
| `CRON_SECRET` | D2 | cron |
| `SENTRY_DSN` | D0~D2 | 오류 |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | D2 | 레이트리밋 |

→ `doc/ENV_YWAMFUND_PHASE0.md`로 Phase 0에서 분리.

---

## 14. 권장 디렉터리 구조 (목표)

```
YWAMFund/
├── docker-compose.yml
├── drizzle.config.ts
├── messages/ko.json, en.json
├── src/
│   ├── app/[locale]/(marketing|auth|dashboard)/...
│   ├── app/api/{auth,payments,cron,receipts}/...
│   ├── components/
│   ├── i18n/
│   ├── lib/{auth,db,payments,missions,donations,receipts,storage,validators,actions}/
│   └── proxy.ts
├── e2e/
├── doc/
└── package.json
```

현재는 루트 `app/`·`components/`·`lib/`(프로토타입). D1~D2에서 이전.

---

## 15. TheSentAsset에서 가져올 패턴

App Router + `[locale]` · `proxy.ts` · Better Auth(Kakao) · `requireAuth` · Drizzle 모듈 · S3 업로드 · QR · PDF · Resend · cron · audit · `messages:check-keys` · 승인 워크플로(미션은 1단계로 단순화).

---

## 16. TheSentAsset vs YWAMFund

| 항목 | TheSentAsset | YWAMFund |
|------|--------------|----------|
| 도메인 | 자산·구매·승인 | 미션 후원·결제 |
| OAuth | Google (Kakao stub) | **Kakao 필수** |
| DB 호스팅 | VPS Postgres 전형 | **Supabase** ✅ (D0~ · Docker 선택) |
| 결제 | 없음 | **Toss ✅** (+ Stripe 후보) |
| 공개 페이지 | 거의 없음 | 미션 공개·SEO·QR |
| PDF | 리포트 | 기부금 영수증 |
| 지도 | 없음 | 세계지도 |
| 역할 | L1–L7 | role enum |

---

## 17. 단계별 스택 도입 체크

| 단계 | 추가되는 스택 |
|------|----------------|
| **D0** | next-intl · **Supabase + Drizzle migrate** · CI · Sentry 자리 · (선택) Docker |
| **D1** | react-qr-code · mock stores · `[locale]/m/[slug]` · P0 메시지 키 |
| **D2** | Better Auth·Kakao · 전 스키마 · Toss · Upstash · Resend · RHF+Zod · TanStack Query · Storage |
| **D3** | @react-pdf · 정산 cron · Q&A/메시지 |
| **D4** | 라이브 Toss · en QA · 보안 하드닝 |
| **D5** | Stripe SDK · (선택) MapLibre · 알림톡 |

---

## 18. 관련 문서

| 문서 | 내용 |
|------|------|
| [10](./10_I18N_DB_PAYMENTS.md) | i18n·DB·결제 확정 + 비교 이력 |
| [09](./09_DEVELOPMENT_PHASES.md) | 개발 단계·작업 ID |
| [02](./02_SYSTEM_ARCHITECTURE.md) | 아키텍처·결제·PII |
| [03](./03_DATA_MODEL.md) | 스키마 |
| [06](./06_OPEN_QUESTIONS.md) | T-10✅ T-18✅ T-12·T-13·T-19 등 |
| [11](./11_DEV_PREPARATION.md) | **개발 전 계정·키·인프라 준비 체크리스트** |
