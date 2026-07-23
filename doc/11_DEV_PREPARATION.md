# 11. 개발 사전 준비 가이드 · 체크리스트

> **목적:** 코딩·연동에 들어가기 전에 **계정·키·인프라·법무·콘텐츠**를 미리 갖춰 블로커를 줄인다.  
> **확정 스택:** Toss(Phase 1) · Supabase(호스팅 DB) · Kakao OAuth · next-intl(ko/en) — [01](./01_TECH_STACK.md) · [10](./10_I18N_DB_PAYMENTS.md)  
> **개발 단계:** [09](./09_DEVELOPMENT_PHASES.md)  
> **고객 확인:** [07](./07_CUSTOMER_QUESTIONS.md)  
> **작성일:** 2026-07-21

---

## 0. 사용법

1. **§1 타임라인**에서 “지금 당장 / D0 전 / D2 전 / 라이브 전”을 확인한다.  
2. **§2~§8**에서 항목별로 **어떻게 준비하는지** 따라 한다.  
3. **§9 마스터 체크리스트**에 체크하며 진행한다.  
4. 고객·법무 의존 항목은 [07](./07_CUSTOMER_QUESTIONS.md) 답변과 함께 둔다.

**원칙**

- 시크릿(키·비밀번호)은 **저장소에 커밋하지 않는다**. `.env.local` + 비밀번호 매니저/팀 시크릿 보관함.  
- **테스트 키와 라이브 키를 분리**한다 (Toss·Kakao·Resend 등).  
- 로컬은 Docker DB, 공유 스테이징은 **Supabase** — 같은 Drizzle 마이그레이션을 쓴다.

---

## 1. 언제 무엇을 준비할까 (타임라인)

| 시기 | 준비하면 좋은 것 | 막히면 영향 |
|------|------------------|-------------|
| **지금 (D0 전)** | 로컬 도구(Node/pnpm/Docker) · GitHub · Supabase 프로젝트 · 도메인/가칭 · `.env.example` | D0 스캐폴딩 지연 |
| **D0~D1 병행** | Kakao **개발** 앱 · Resend · Sentry · Upstash · 브랜드 에셋 | 로그인·메일·관측 연동 지연 |
| **D2 직전 ★** | Toss **테스트** 키·웹훅 URL · Kakao 콜백 URL 확정 · Supabase `DATABASE_URL` · 사업자/정산 정보(고객) | **결제·Auth 불가** |
| **D3 전** | 영수증 문구·단체 정보 · 약관 초안 · 발신 도메인(DNS) | PDF·메일 프로덕션 품질 |
| **라이브(D4) 전** | Toss **라이브** 심사 · 법무(Q-07 등) · 프로덕션 Supabase · 도메인 TLS · 백업 확인 | 오픈 불가 |

```mermaid
flowchart LR
  Now[지금] --> D0[D0 도구·Supabase·i18n]
  D0 --> D1[D1 UI·Kakao개발앱]
  D1 --> D2[D2 Toss테스트·Auth]
  D2 --> D3[D3 영수증·약관]
  D3 --> D4[D4 라이브·법무]
```

---

## 2. 로컬 개발 환경

### 2.1 어떻게 준비하는가

1. **Node.js 22** (또는 ≥20.9) 설치 — [nodejs.org](https://nodejs.org) / `nvm install 22`  
2. **pnpm** 활성화 — `corepack enable && corepack prepare pnpm@latest --activate`  
3. **Docker Desktop** (또는 Docker Engine) 설치 — 로컬 Postgres용  
4. 레포 클론 후:
   ```bash
   pnpm install
   # D0 이후: docker compose up -d
   # cp .env.example .env.local
   pnpm dev
   ```
5. IDE: VS Code/Cursor + ESLint·Tailwind 확장 권장  
6. (선택) TablePlus / DBeaver / `drizzle-kit studio`로 DB 확인

### 2.2 체크리스트

| # | 항목 | ☐ |
|---|------|---|
| L1 | Node ≥ 20.9 (권장 22) · `node -v` | ☐ |
| L2 | pnpm · `pnpm -v` | ☐ |
| L3 | Docker 기동 · `docker ps` | ☐ |
| L4 | 레포 `pnpm install` 성공 | ☐ |
| L5 | `pnpm dev` → http://localhost:3000 | ☐ |
| L6 | (D0 후) `docker compose up -d` 후 DB 접속 | ☐ |
| L7 | `.env.local` gitignore 확인 (커밋 안 됨) | ☐ |
| L8 | GitHub 원격·브랜치 전략 합의 (main / develop) | ☐ |

---

## 3. Supabase (호스팅 DB) ✅ 확정

### 3.1 어떻게 준비하는가

1. [supabase.com](https://supabase.com) 계정 · **Organization** 생성 (팀 초대)  
2. 프로젝트 생성  
   - 권장: `ywamfund-staging` 먼저, 이후 `ywamfund-prod`  
   - Region: 한국/가까운 리전 (지연·개인정보 이전 고려)  
   - DB 비밀번호를 **비밀번호 매니저에 보관**  
3. **Project Settings → Database**  
   - `Connection string` (URI, **Session/Transaction** 모드 중 Drizzle에 맞는 것 — 보통 pooled는 서버리스, VPS는 direct도 가능)  
   - `DATABASE_URL`로 `.env.local`(스테이징용) / CI 시크릿에 저장  
4. **Auth / Realtime / Data API**  
   - 본 프로젝트는 **Better Auth만 사용** → Supabase Auth로 로그인 구현하지 않음  
   - 클라이언트에서 `service_role` 사용 금지 · DB는 **서버의 `DATABASE_URL`만**  
5. (선택) Storage 버킷 `mission-media` — 또는 별도 S3. 추상화는 [01 §7](./01_TECH_STACK.md)  
6. 백업: Pro 플랜이면 PITR 확인 · Free면 주기적 `pg_dump` 스크립트 준비  
7. Drizzle: 로컬 migrate 검증 후 **동일 명령으로 스테이징 URL에 적용**

### 3.2 체크리스트

| # | 항목 | ☐ |
|---|------|---|
| S1 | Supabase 계정·팀 멤버 초대 | ☐ |
| S2 | Staging 프로젝트 생성 · region 기록 | ☐ |
| S3 | DB password · connection string 시크릿 보관 | ☐ |
| S4 | `DATABASE_URL` (staging)을 `.env` 템플릿에 슬롯만 명시 | ☐ |
| S5 | Auth를 앱 로그인에 쓰지 않기로 팀 공유 | ☐ |
| S6 | (선택) Storage 버킷 · 정책(비공개+서명 URL) | ☐ |
| S7 | Production 프로젝트는 라이브 직전 생성 계획 | ☐ |
| S8 | 백업/PITR 정책 한 줄 문서화 | ☐ |

---

## 4. 카카오 로그인 (Better Auth)

### 4.1 어떻게 준비하는가

1. [Kakao Developers](https://developers.kakao.com) 로그인 · **애플리케이션** 추가 (`YWAMFund Dev`)  
2. **앱 키** 확인: REST API 키 → 보통 Client ID로 사용. Client Secret 필요 시 켜기  
3. **플랫폼**  
   - Web: 사이트 도메인 `http://localhost:3000` (개발) · 추후 스테이징/프로덕션 도메인  
4. **카카오 로그인** 활성화  
   - Redirect URI 예:  
     - `http://localhost:3000/api/auth/callback/kakao`  
     - (next-intl·Better Auth 실제 경로에 맞춰 D2에서 확정 — 문서와 코드 일치 필수)  
5. **동의 항목:** 닉네임·이메일(필요 시) — 이메일은 비즈니스 앱/검수 조건 확인  
6. 키를 `.env.local`에만:
   ```env
   KAKAO_CLIENT_ID=...
   KAKAO_CLIENT_SECRET=...
   ```
7. **프로덕션용** 앱을 분리하거나, 동일 앱에 프로덕션 URI 추가 (팀 정책)  
8. 해외 선교사 Kakao 가능 여부 → 고객 **Q-14**

### 4.2 체크리스트

| # | 항목 | ☐ |
|---|------|---|
| K1 | Kakao Developers 앱 생성 (Dev) | ☐ |
| K2 | REST API 키 · Client Secret 발급·보관 | ☐ |
| K3 | localhost Redirect URI 등록 | ☐ |
| K4 | 카카오 로그인 활성화 · 동의 항목 초안 | ☐ |
| K5 | Staging/Prod 도메인 URI 추가 일정 | ☐ |
| K6 | Q-10/Q-14 고객 확인 (Kakao 단독·해외) | ☐ |

---

## 5. 토스페이먼츠 (Phase 1 ✅)

### 5.1 어떻게 준비하는가

1. [Toss Payments](https://www.tosspayments.com) / 개발자센터 계정  
2. **사업자·계약**은 고객(운영 법인) — **Q-01, Q-02, Q-50~52, Q-55**  
   - 개발자는 우선 **테스트(샌드박스) 키**로 연동  
3. 개발자센터에서  
   - `TOSS_SECRET_KEY` (서버)  
   - `NEXT_PUBLIC_TOSS_CLIENT_KEY` (브라우저 위젯)  
4. **웹훅**  
   - 로컬: [ngrok](https://ngrok.com) / Cloudflare Tunnel 등으로 `https://xxxx/api/payments/webhook`  
   - 스테이징: 공개 HTTPS URL 등록 · `TOSS_WEBHOOK_SECRET`(또는 문서상 검증 방식) 보관  
5. **자동결제(빌링)** 상품/권한 — 정기 후원(D2-C)에 필요. 콘솔에서 빌링 가능 여부 확인  
6. **해외카드** — 계약 옵션인지 Q-52. Phase 1은 Toss만 ([10](./10_I18N_DB_PAYMENTS.md))  
7. 테스트 카드 번호·시나리오(성공/실패) 북마크  
8. **라이브 전환**은 D4 — 심사·실명·정산 계좌는 고객·법무

참고: `doc/YWAMFund_PG_분석_연동가이드.docx` (팀 PG 분석 자료)

### 5.2 체크리스트

| # | 항목 | ☐ |
|---|------|---|
| T1 | Toss 개발자 계정 · 테스트 상점 | ☐ |
| T2 | 테스트 Client/Secret 키 시크릿 보관 | ☐ |
| T3 | 웹훅 수신 URL 계획 (로컬 터널 + staging) | ☐ |
| T4 | 빌링(자동결제) 테스트 가능 여부 확인 | ☐ |
| T5 | 테스트 결제 성공/실패 시나리오 문서화 | ☐ |
| T6 | Q-50~55·Q-58 고객 답변 (계약·정산·환불) | ☐ |
| T7 | (라이브 전) 라이브 키·심사·정산 계좌 | ☐ |
| T8 | Stripe는 Phase 1 불필요 — T-19만 메모 | ☐ |

---

## 6. 이메일 · 관측 · 레이트리밋 · 스토리지

### 6.1 Resend (트랜잭션 메일)

1. [resend.com](https://resend.com) 계정 · API 키  
2. 발신 도메인 추가 (예: `mail.ywamfund.org`) → DNS에 SPF/DKIM 레코드  
3. 개발 중에는 Resend 제공 테스트 도메인/`RESEND_FROM`으로 충분할 수 있음  
4. `.env`: `RESEND_API_KEY`, `RESEND_FROM`

| # | 항목 | ☐ |
|---|------|---|
| R1 | Resend 계정·API 키 | ☐ |
| R2 | (스테이징+) 커스텀 도메인 DNS | ☐ |
| R3 | 알림 메일 수신 테스트 주소 확보 | ☐ |

### 6.2 Sentry

1. [sentry.io](https://sentry.io) · Next.js 프로젝트 생성  
2. `SENTRY_DSN` · (선택) auth token for source maps  
3. 환경 태그: `development` / `staging` / `production`

| # | 항목 | ☐ |
|---|------|---|
| E1 | Sentry 프로젝트 · DSN | ☐ |
| E2 | 알림 채널(슬랙/메일) 연결 | ☐ |

### 6.3 Upstash Redis (레이트리밋)

1. [upstash.com](https://upstash.com) · Redis 데이터베이스 생성 (가까운 리전)  
2. REST URL · TOKEN → `UPSTASH_REDIS_*`  
3. 결제·웹훅·메시지 API에 적용 예정 ([01](./01_TECH_STACK.md))

| # | 항목 | ☐ |
|---|------|---|
| U1 | Upstash Redis · REST 자격증명 | ☐ |

### 6.4 오브젝트 스토리지

**옵션 A — Supabase Storage**  
- 버킷 `mission-covers` (private) · 서버에서 서명 URL  

**옵션 B — S3 호환** (Linode Objects / AWS / MinIO 로컬)  
- Access Key · Bucket · Endpoint → `S3_COMPAT_*`

| # | 항목 | ☐ |
|---|------|---|
| O1 | Storage 방식 선택 (Supabase vs S3) — T 미정이면 A로 시작 가능 | ☐ |
| O2 | 버킷 생성 · 키 발급 · CORS(필요 시) | ☐ |
| O3 | 로컬 업로드 스모크 계획 (D2) | ☐ |

---

## 7. 도메인 · 앱 호스팅 · CI

### 7.1 어떻게 준비하는가

1. **도메인** (Q-06): 구입·DNS 관리 권한 확보 (`ywamfund.org` 등)  
2. 개발: `localhost` · 스테이징: `staging.example.com` · 프로덕션: apex/`www`  
3. **앱 서버** (T-13): Linode 등 VPS 계정, SSH 키, Nginx+TLS(Let’s Encrypt) 계획  
4. **GitHub**  
   - Private repo · Secrets에 `DATABASE_URL`(staging), `TOSS_*` 등 (라이브 키는 최소화)  
   - Actions: lint / typecheck / (추후) e2e  
5. `NEXT_PUBLIC_APP_URL`을 환경별로 다르게

### 7.2 체크리스트

| # | 항목 | ☐ |
|---|------|---|
| H1 | 도메인 확보 또는 가칭·임시 도메인 | ☐ |
| H2 | DNS 편집 권한자 지정 | ☐ |
| H3 | Staging 호스트 계획 (VPS 또는 임시) | ☐ |
| H4 | GitHub repo · branch 보호 · Secrets 슬롯 | ☐ |
| H5 | TLS 발급 방법 합의 | ☐ |
| H6 | Cron: 서버 crontab으로 `/api/cron/*` 호출 계획 | ☐ |

---

## 8. 법무 · 운영 · 콘텐츠 (개발 블로커)

코드만으로는 못 여는 항목. **미리 고객/법무에 요청**한다.

### 8.1 반드시 라이브 전 (가능하면 D2 전에 초안)

| 주제 | 질문/문서 | 왜 필요한가 |
|------|-----------|-------------|
| 운영 주체·사업자 | Q-01~Q-02 | Toss·약관·영수증 |
| 기부금 영수증 가능 여부 | Q-03, Q-60 | PDF 문구·명칭 |
| **기부금품모집법** | Q-07, T-24 | 모집 자체 적법성 |
| 정산 흐름 | Q-55~Q-56, T-25 | 전자금융업 이슈 |
| 환불 | Q-58 | 결제·Admin UX |
| 개인정보·탈퇴 | Q-05, Q-15, Q-63, T-26 | 스키마·암호화·탈퇴 |
| 이용약관·개인정보처리방침 | Q-05 | `/terms`, `/privacy` |
| 아동 보호 | Q-38 | 업로드 가이드 |

### 8.2 브랜드·콘텐츠

| # | 항목 | ☐ |
|---|------|---|
| C1 | 서비스 공식 명칭·로고 SVG/PNG (Q-06, Q-111) | ☐ |
| C2 | 파비콘 · OG 기본 이미지 | ☐ |
| C3 | 랜딩 히어로 카피·이미지 (Q-112) | ☐ |
| C4 | 영수증에 찍힐 단체명·사업자번호·주소·직인(선택) | ☐ |
| C5 | 고객지원 이메일/채널 (Q-101) | ☐ |
| C6 | ko/en 법적 문구 초안 담당자 | ☐ |

### 8.3 법무·운영 체크리스트

| # | 항목 | ☐ |
|---|------|---|
| P1 | Q-01~Q-07 답변 회신 | ☐ |
| P2 | Q-50~Q-58 결제·정산·환불 | ☐ |
| P3 | Q-60~Q-65 영수증 | ☐ |
| P4 | Q-15 탈퇴·보존 | ☐ |
| P5 | 약관·개인정보 초안 파일 공유 | ☐ |
| P6 | T-24/T-25 법무 메모 (있으면) | ☐ |

---

## 9. 마스터 체크리스트 (복사해서 사용)

### 9-A. 이번 주 안에 (D0 블로커 제거)

- [ ] L1~L5 로컬 환경  
- [ ] S1~S4 Supabase staging  
- [ ] H1 도메인/가칭 · H4 GitHub  
- [ ] `.env.example`에 슬롯만 작성 (값은 로컬)  
- [ ] 팀: Toss·Supabase 확정 인지 ([10](./10_I18N_DB_PAYMENTS.md))

### 9-B. D2 결제·로그인 직전

- [ ] K1~K4 Kakao Dev  
- [ ] T1~T5 Toss 테스트  
- [ ] R1 Resend · E1 Sentry · U1 Upstash  
- [ ] O1~O2 Storage  
- [ ] S3 connection으로 drizzle migrate 스모크  
- [ ] P2 결제 관련 고객 답변 최소치 (상점·정산 주체)

### 9-C. 베타·라이브 직전

- [ ] T7 Toss 라이브  
- [ ] S7 Production Supabase  
- [ ] H3~H6 호스팅·TLS·cron  
- [ ] R2 메일 도메인  
- [ ] P1~P6 법무·약관  
- [ ] C1~C6 브랜드·영수증 메타  
- [ ] 백업 복구 리허설 1회  

---

## 10. `.env.example` 슬롯 (커밋용 · 값 없음)

개발자가 로컬에 채울 목록. **실제 값은 커밋하지 말 것.**

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (local Docker OR Supabase)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ywamfund
DB_PROVIDER=local

# Auth (D2)
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=

# Toss Phase 1 (D2)
TOSS_SECRET_KEY=
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_WEBHOOK_SECRET=
PAYMENT_PROVIDERS_ENABLED=toss

# Email / Observability
RESEND_API_KEY=
RESEND_FROM=
SENTRY_DSN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
CRON_SECRET=

# Storage (fill according to choice)
# S3_COMPAT_ENDPOINT=
# S3_COMPAT_REGION=
# S3_COMPAT_ACCESS_KEY=
# S3_COMPAT_SECRET_KEY=
# S3_COMPAT_BUCKET=
```

Phase 0에서 `doc/ENV_YWAMFUND_PHASE0.md`로 확장한다.

---

## 11. 역할별 할 일 (누가 준비?)

| 역할 | 담당 준비 |
|------|-----------|
| **풀스택 개발** | 로컬·Docker·GitHub·Supabase 프로젝트·ENV·Kakao Dev 앱·Toss 테스트 연동·Sentry/Upstash/Resend |
| **고객/운영** | 사업자·Toss 계약·정산 계좌·약관·영수증 문구·브랜드·Q-01~Q-07·Q-50~ |
| **법무** | 기부금품모집법·전자금융·개인정보·약관 검토 (T-24~T-26) |
| **디자인** | 로고·가이드·히어로 (C1~C3) — UI 프로토타입은 이미 있음 |

---

## 12. 관련 문서

| 문서 | 용도 |
|------|------|
| [01](./01_TECH_STACK.md) | 스택·패키지·ENV |
| [09](./09_DEVELOPMENT_PHASES.md) | D0~D5 작업 |
| [10](./10_I18N_DB_PAYMENTS.md) | Toss·Supabase 확정 |
| [07](./07_CUSTOMER_QUESTIONS.md) | 고객 질문 |
| [06](./06_OPEN_QUESTIONS.md) | 팀 결정 (T-*) |
| PG 연동 docx | Toss 상세 참고 |

---

## 부록. 빠른 링크

| 서비스 | URL |
|--------|-----|
| Kakao Developers | https://developers.kakao.com |
| Toss Payments | https://www.tosspayments.com · 개발자센터 |
| Supabase | https://supabase.com/dashboard |
| Resend | https://resend.com |
| Sentry | https://sentry.io |
| Upstash | https://upstash.com |
| ngrok (로컬 웹훅) | https://ngrok.com |
