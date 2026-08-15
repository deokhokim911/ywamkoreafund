# 10. 다국어 · DB · 결제 플랫폼 결정 분석

> **목적:** ko/en 다국어 기반, Postgres 호스팅, 결제 제공자 선택 근거와 **확정 사항**을 기록한다.  
> **작성일:** 2026-07-21  
> **개정:** 2026-07-23 — **D0부터 Supabase를 기본 DB로 사용** ([09](./09_DEVELOPMENT_PHASES.md)). Docker는 오프라인 선택.

---

## 0. 확정 사항 (Decision Log)

| 영역 | 확정 | 일자 | 비고 |
|------|------|------|------|
| **1차 결제 (Phase 1 / D2)** | **토스페이먼츠 (Toss Payments)** | 2026-07-21 | 일시·정기(빌링키), KRW. 해외카드는 Toss 계약 범위 내 |
| **호스팅 DB (개발·스테이징·프로덕션)** | **Supabase (PostgreSQL)** | 2026-07-21 · **D0부터 연결** 2026-07-23 | Drizzle + `DATABASE_URL`. **Supabase Auth 미사용** (Better Auth 유지) |
| **로컬 개발 DB (선택)** | **Docker Postgres** | (선택) | 오프라인·재현성. 기본 경로는 아님 — 스키마는 동일 migrate |
| **국제 결제 (Phase 2 / D5)** | **Stripe 후보 유지** — 아직 미도입 | — | 비교·추상화는 §3 유지. 도입 시점은 T-19 |
| **i18n** | next-intl · `ko` 기본 · `en` | (권고=진행 방향) | D0부터 기반 ([09](./09_DEVELOPMENT_PHASES.md)) |

**구현 함의**

```text
개발(기본) → Supabase staging/dev project + DATABASE_URL (DB_PROVIDER=supabase)  ← D0부터
개발(선택) → Docker Postgres + DATABASE_URL(local) (DB_PROVIDER=local)
스테이징   → Supabase project connection string
프로덕션   → Supabase project connection string
결제 P1    → TossProvider only (PAYMENT_PROVIDERS_ENABLED=toss)
결제 P2    → (검토) StripeProvider 추가 — 기존 비교·인터페이스 삭제하지 않음
```

아래 §2·§3의 **비교표·대안(VPS Postgres, Stripe 등)은 의사결정 이력으로 보존**한다.  
“확정”과 “검토 당시 대안”을 혼동하지 말 것.

---

## 1. 다국어 (i18n) — ko / en 시작, 확장 가능한 기반

### 1.1 요구

- **1차:** 한국어(기본) + 영어  
- **이후:** 로케일 추가가 코드 전면 수정 없이 가능해야 함  
- UI 크롬(버튼·네비·에러)과 **사용자 생성 콘텐츠(미션 본문)** 정책을 분리

### 1.2 권고 스택 (= 채택 방향)

| 항목 | 선택 | 비고 |
|------|------|------|
| 라이브러리 | **next-intl** (TheSentAsset과 동일) | App Router · RSC 친화 |
| 라우팅 | `src/app/[locale]/...` | `localePrefix: 'as-needed'` → ko는 `/`, en은 `/en/...` |
| 메시지 | `messages/ko.json`, `messages/en.json` | 키 네임스페이스: `nav`, `home`, `mission`, `donate`, `admin`… |
| CI | `messages:check-keys` | ko/en 키 패리티 강제 |
| 날짜·숫자 | `Intl` + next-intl formatter | 금액은 **표시만** 로케일, **저장은 KRW 정수** (Phase 1) |
| HTML `lang` | `[locale]` layout에서 설정 | a11y |

### 1.3 콘텐츠 정책 (미션 본문)

| 구분 | Phase 1 | 이후 |
|------|---------|------|
| UI 문자열 | 전부 메시지 파일 | 로케일 추가 = JSON만 |
| 미션 title/body | **작성 언어 1개** 저장 (`missions.locale`) | 선택적 `title_en` / 번역 테이블 |
| 자동 번역 | 없음 (T-08) | D5 검토 |

### 1.4 개발 시 주의

- **하드코딩 한국어를 D1부터 신규 코드에 넣지 않는다** — 기존 프로토타입은 D1에서 점진 추출.  
- Locale switcher는 Navbar에 조기 배치 (동작만, 번역 미완이어도 됨).  
- 이메일(Resend)·PDF 영수증도 동일 메시지 키 또는 별도 `emails.*` 네임스페이스.

### 1.5 채택 결정

→ **D0에서 next-intl 스캐폴딩**, **D1에서 핵심 화면 키 이관**, D4에서 잔여 문자열·영문 QA.  
(이전 초안의 “D4에 i18n 몰아넣기”는 **채택하지 않음** — 늦게 넣으면 비용이 커짐.)

---

## 2. DB — 로컬 Postgres vs Supabase

공통 전제: **ORM은 Drizzle**, 스키마는 [03](./03_DATA_MODEL.md), Auth는 **Better Auth**(Supabase Auth와 이중화하지 않음).

### 2.0 확정 (반복)

| 환경 | 선택 |
|------|------|
| 개발 (기본) · 스테이징 · 프로덕션 | **Supabase PostgreSQL** (`DATABASE_URL`) — **D0부터** |
| 로컬 오프라인 (선택) | Docker Postgres |
| Auth | Better Auth only — **Supabase Auth 사용 안 함** |
| (검토했으나 미채택) | VPS/Linode 자체 Postgres — 아래 비교 참고, TheSentAsset형 대안 |

### 2.1 비교 (의사결정 당시 · 이력 보존)

| 관점 | 로컬 Postgres (Docker / 설치형) | Supabase (호스팅 Postgres) | VPS/Managed Postgres (대안) |
|------|--------------------------------|----------------------------|------------------------------|
| **역할(확정 후)** | **오프라인·선택** | **개발·스테이징·프로덕션 기본 (D0~)** | 미채택(이력) — TheSentAsset과 동일 운영 시 재검토 가능 |
| **개발 DX** | `docker compose up` 오프라인·재현 | 클라우드 + CLI | SSH·자체 백업 |
| **비용** | 로컬 무료 | Free/Pro 티어 | VPS 고정비 |
| **백업·PITR** | 직접 구성 | 대시보드 PITR(플랜별) | 직접 또는 매니지드 |
| **확장** | 직접 설치 | Realtime·Storage·Edge 등 — **본 프로젝트는 Postgres(+선택 Storage)만** | 직접 |
| **보안** | private + 앱만 | Data API 노출 시 RLS 필수 → **Data API 비활성·서버만 connection** 권장 | 네트워크 ACL |
| **벤더 락인** | 낮음 | Postgres 이식 가능. Auth/Realtime 쓰면 높아짐 → **쓰지 않기로 함** | 낮음 |
| **팀 온보딩** | Docker 필수 | 프로젝트 초대·공유 DB | 서버 접근 권한 |

### 2.2 확정 아키텍처

```text
개발(기본, D0~)       →  Supabase (dev/staging) + DATABASE_URL
개발(선택·오프라인)   →  Docker Postgres + DATABASE_URL(local)
스테이징 / 프로덕션   →  Supabase Postgres (connection string만)
                         Auth/Realtime/Data API: 사용하지 않음
                         Storage: 선택 (S3-compatible 추상화 유지 시 교체 가능)

(이력) 검토 대안 B     →  Linode/Managed Postgres — 채택하지 않음.
                         추후 비용·주권 이슈 시 재검토 가능.
```

**금지 (확정 운영 규칙)**

- Supabase Auth + Better Auth 병행  
- 클라이언트에 `service_role` 노출  
- 스키마 SSOT를 Supabase 대시보드 SQL로만 관리 (Drizzle migrate가 SSOT)

### 2.3 Drizzle 관점

- `drizzle.config.ts`의 `DATABASE_URL`만 환경별로 교체.  
- **기본:** `pnpm db:migrate` → **Supabase** (D0 스모크부터).  
- **선택:** 동일 migrate → Docker. 대시보드 SQL은 **비상용**.

### 2.4 결정 상태

| ID | 내용 | 상태 |
|----|------|------|
| T-18 | 프로덕션 DB = **Supabase** | ✅ **확정** (2026-07-21). 대안 B(VPS)는 이력으로 보존 |
| — | 개발 기본 = Supabase · Docker = 선택 | ✅ **2026-07-23** ([09](./09_DEVELOPMENT_PHASES.md) D0) |

---

## 3. 결제 — 토스페이먼츠 vs Stripe

### 3.0 확정 (반복)

| 단계 | 제공자 | 상태 |
|------|--------|------|
| **Phase 1 (D2)** | **Toss Payments** | ✅ **확정** — 1차 유일한 라이브/테스트 대상 |
| **Phase 2 (D5)** | Stripe | 후보 · 미도입. 비교·`PaymentProvider` 자리는 유지 |
| 설계 | `PaymentProvider` + `donations.pg_provider` | Phase 1부터 인터페이스 도입 (Stripe는 stub/flag off) |

### 3.1 제품 맥락

- **1차 시장:** 한국 후원자 · KRW 정산 · 국내 기부금 영수증 → **Toss**  
- **확장(검토):** 해외 거주 후원자 · 글로벌 카드 → **Stripe** (도입 시 D5)

### 3.2 비교 (의사결정 당시 · 이력 보존)

| 관점 | 토스페이먼츠 ✅ Phase 1 | Stripe (이후 후보) |
|------|-------------------------|---------------------|
| **국내 카드·간편결제·계좌** | 강함 (국내 표준) | 국내 수단 제한적 |
| **해외 카드** | 계약 시 해외카드 옵션 | 본업 — Visa/MC 등 |
| **정기결제** | 자동결제(빌링키) | Subscriptions / PaymentIntents |
| **정산 통화** | 주로 **KRW** | 다통화·다국가 |
| **기부/비영리** | 국내 사업자·지정기부금과 맞추기 쉬움 | 한국 법인·기부금 영수증은 별도 설계 |
| **PCI** | 위젯/빌링키 — 카드번호 미보유 | Elements/Checkout |
| **웹훅** | Toss 웹훅 | Stripe webhooks → 동일 `webhook_events` 추상화 |
| **수수료** | 국내 PG 요율 | 국제 + FX |
| **구현 복잡도 (한국 1차)** | 낮음~중간 → **1차 채택 이유** | 국내 수단까지면 높음 |
| **구현 복잡도 (글로벌)** | 해외카드만으로는 한계 | 낮음~중간 → Phase 2 후보 이유 |

### 3.3 전략 (확정 + 확장 여지)

| 단계 | 제공자 | 범위 |
|------|--------|------|
| **Phase 1 (D2)** ✅ | **Toss만** | 일시·정기, KRW, 국내+Toss 해외카드 계약 범위 |
| **설계** ✅ | `PaymentProvider` 인터페이스 | 원장 단일 · `pg_provider` 컬럼 |
| **Phase 2 (D5)** (미확정 도입) | Stripe 추가 검토 | 해외 후원자 경로. T-19로 시점·범위 결정 |
| **정산** | Phase 1 법인 통장 KRW | Stripe 도입 시 Q-66·법무 |

```text
DonationModal
    → paymentRouter.resolve(donorContext)
        → TossProvider   (Phase 1 기본 · 유일 활성)
        → StripeProvider (Phase 2 후보 · flag off)
    → donations.pg_provider = 'toss' | 'stripe'
```

### 3.4 하지 말 것

- Phase 1에서 Toss+Stripe **동시 라이브**  
- Stripe만으로 국내 카카오페이/계좌이체 대체 가정  
- Provider별 원장 테이블 분리 — **단일 `donations` + `pg_provider`**

### 3.5 결정 상태

| ID | 내용 | 상태 |
|----|------|------|
| T-10 | Phase 1 PG = **Toss** | ✅ **확정** (2026-07-21) |
| T-19 | Stripe 도입 시점·범위 | ☐ 미정 (D5 후보, 비교는 §3.2 유지) |
| Q-52 | Toss 해외카드만으로 충분한지 | 고객 확인 — 부족 시 Stripe(T-19) 가속 |

---

## 4. 개발 순서에 미치는 영향

| 요구 | 검토 이력 | **확정 후** |
|------|-----------|-------------|
| i18n | D4 몰아넣기안 폐기 | D0 스캐폴딩 → D1 핵심 키 → D4 QA |
| DB | A Supabase / B VPS 병기 | **D0부터 Supabase 기본** · Docker 선택 (B는 이력) |
| 결제 | Toss vs Stripe 병기 | **D2 Toss 확정** · Provider로 Stripe 자리 유지 · D5 후보 |

상세 작업 ID: [09](./09_DEVELOPMENT_PHASES.md). Toss 구현 순서: [15](./15_PG_DEVELOPMENT.md).

---

## 5. 관련 ENV

| 변수 | 용도 |
|------|------|
| `DATABASE_URL` | **기본 = Supabase** connection string · 선택 시 Docker |
| `DB_PROVIDER` | `local` \| `supabase` (문서·스크립트; 프로덕션은 `supabase`) |
| `NEXT_PUBLIC_SUPABASE_URL` | (선택) Storage 등 사용 시에만 — DB만 쓰면 불필요 |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `ko` |
| `TOSS_*` / `TOSS_WEBHOOK_SECRET` | **Phase 1 필수** |
| `STRIPE_*` | Phase 2 예비 — Phase 1에 설정하지 않아도 됨 |
| `PAYMENT_PROVIDERS_ENABLED` | Phase 1: `toss` |
