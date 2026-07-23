# 08. UI 프로토타입 분석 · 개발 계획

> **원본:** `Ref/donation-page-redesign` (v0 기반 Next.js UI)  
> **목표:** DB·Auth·PG 없이 **사용자 인터페이스를 먼저** 실행·검증  
> **작성일:** 2026-07-21  
> **상태:** 워크스페이스 루트에 프로토타입 앱으로 이식 완료

---

## 1. 한 줄 요약

레퍼런스는 **Next.js 16 + React 19 + Tailwind 4 + shadcn(base-nova)** 로 만든 **클릭 가능한 UI 목업**이다.  
하드코딩 mock 데이터로 홈·미션·후원 모달·선교사/후원자 대시보드·캠페인 생성·관리자(승인·지도·배너)까지 동작한다.  
이 문서는 그 분석 결과와, `doc/00~07` 설계와의 매핑, UI-first 개발 순서를 정리한다.  
**구현 단계·특징 갭·작업 ID 단위 상세는 [09_DEVELOPMENT_PHASES.md](./09_DEVELOPMENT_PHASES.md)를 본다.**

---

## 2. 레퍼런스 분석

### 2.1 기술 스택

| 영역 | 레퍼런스 | 본 프로젝트 계획(`01_TECH_STACK`) | UI 단계 대응 |
|------|----------|----------------------------------|--------------|
| Framework | Next.js **16.2** App Router | Next.js 16 | ✅ 동일 — 그대로 사용 |
| React | 19 | 19 | ✅ |
| Style | Tailwind **4** + CSS variables (oklch teal) | Tailwind 4 + CVA | ✅ |
| UI kit | shadcn **base-nova** (`@base-ui/react`), `button`만 존재 | Radix + shadcn-style | 프로토타입 유지 → 추후 정렬 |
| 차트 | recharts | recharts | ✅ |
| 지도 | `react-simple-maps` | MapLibre 등 (검토) | UI 단계에선 simple-maps 유지 |
| Auth / DB / PG | **없음** | Better Auth · Drizzle · Toss(+Stripe D5) | ❌ UI 이후 — [10](./10_I18N_DB_PAYMENTS.md) |
| i18n | **없음** (한국어 하드코딩) | next-intl ko/en | **D0부터 기반** ([09](./09_DEVELOPMENT_PHASES.md)) |
| 상태 | 컴포넌트 내 `useState` + `bannerStore` 싱글톤 | TanStack Query 등 | mock → API 교체 |

### 2.2 라우트 · 화면 맵

| 경로 | 컴포넌트 | 역할 | mock 수준 |
|------|----------|------|-----------|
| `/` | `HomePage` | 배너 캐러셀, 통계, 미션 카드 목록·검색·필터, 후원 마퀴 | 높음 |
| `/mission` | `MissionPage` | 히어로·진행률·선교사 프로필·본문/업데이트·후원자 피드·스티키 후원바 | 높음 (단일 미션 고정) |
| `/my` | `DonorDashboardPage` | 후원 이력·정기·영수증 모달 | 높음 |
| `/dashboard` | `MissionaryDashboardPage` | 선교사 KPI·차트·후원자 목록 | 높음 |
| `/create` | `CreateCampaignPage` | 5단계 캠페인 생성 위자드 | UI만 (제출 → `/dashboard`) |
| `/support` | `SupportPage` | Q&A / FAQ형 지원 | 중간 |
| `/admin` | `AdminPage` | 대시보드·승인·세계지도·회원·배너·피처드 | 매우 높음 |

**공통:** `Navbar` — 프로토타입용 역할 전환 링크(홈/내후원/선교사/만들기/Q&A/관리자).

### 2.3 데이터·상태 패턴

- 거의 모든 페이지가 **파일 상단 상수 mock** (`MISSIONS`, `DONORS`, `KPI` …).
- 예외: `lib/bannerStore.ts` — 모듈 싱글톤 + subscribe. 관리자 배너 편집이 **같은 탭 세션**에서 홈에 반영.
- 후원 모달: 금액 → 정보 → 결제(가짜 로딩) → 성공. **실제 PG 호출 없음**.
- 미션 카드 `slug`가 있어도 링크는 전부 `/mission` — **동적 `[slug]` 미구현**.

### 2.4 디자인 시스템 (요약)

- 브랜드: **warm teal** primary (`oklch` ~ teal-600), amber 액센트.
- 폰트: **Pretendard Variable** (jsDelivr CDN).
- 레이아웃: `max-w-6xl`, sticky header, 모바일 스티키 후원바.
- 생성기 흔적: `metadata.generator: 'v0.app'`, `typescript.ignoreBuildErrors: true`.

### 2.5 규모

- 페이지 래퍼: thin (`app/*/page.tsx` → 컴포넌트 위임).
- 컴포넌트 합계 약 **8k LOC** (Admin·Approval·Create·Donor 대시보드가 대부분).
- `components/ui`는 **button 1개** — shadcn 풀셋이 아님. 대부분 raw Tailwind.

---

## 3. 기획 문서(`00~07`)와의 정합

| 기획 기능 | UI 프로토타입 | 갭 |
|-----------|---------------|-----|
| 공개 미션 목록·상세 | ✅ 홈 + `/mission` | slug 동적 라우트, SEO OG |
| QR·공유 | 공유 Web Share만 | QR 컴포넌트 없음 |
| 일시/정기 후원 UX | ✅ `DonationModal` | Kakao 로그인·PG·웹훅 |
| 선교사 온보딩·프로필 | create 위자드에 일부 | 별도 onboarding, 자격 검증 |
| 미션 승인 | ✅ Admin Approval 탭 | 재승인 revision, 실 DB |
| 후원자 대시보드·영수증 | ✅ `/my` + ReceiptModal | PDF 실발급, 정정 |
| 선교사 대시보드 | ✅ `/dashboard` | 메시지 발송 실연동 |
| 관리자 지도 | ✅ WorldMapTab | GeoJSON·집계 API |
| Q&A | ✅ `/support` (사이트 FAQ 성격) | **미션별** Q&A와 다름 |
| i18n en | ❌ | Phase 이후 |
| 계정 탈퇴·수신거부 | ❌ | 명세만 있음 |
| 로그인(Kakao) | ❌ | UI 스텁 필요 시 추가 |

**결론:** 공개·후원·역할별 대시보드·관리자 **화면 골격은 기획의 80%+를 커버**.  
빠진 것은 Auth/결제/스키마와 **미션 단위 동적 URL·미션별 Q&A·QR**.

---

## 4. 권장 개발 전략 (UI-first)

### 원칙

1. **지금 단계:** 프로토타입을 워크스페이스에서 `pnpm dev`로 돌리며 UI/UX 확정.
2. **mock 유지:** DB 대신 `lib/mock/*`로 데이터를 한곳으로 모은다 (점진 리팩터).
3. **TheSentAsset 풀 스캐폴딩은 UI 합의 후** — 지금은 Auth/Drizzle를 억지로 끼우지 않는다.
4. **라우트는 기획에 맞게 조금씩 정렬** (`/m/[slug]` 등)하되, 한 번에 전면 리라이트하지 않는다.

### Phase U0 — 실행 가능 이식 (완료 대상)

- [x] `donation-page-redesign` → YWAMFund 루트로 복사
- [x] `doc/` 유지, 루트 `README`에 실행법
- [x] `pnpm install` + `pnpm dev` 동작 확인
- [x] package name → `ywamfund`, generator 메타 정리

### Phase U1 — mock 정리 · 라우트 정렬 (UI만)

| 작업 | 설명 |
|------|------|
| `lib/mock/missions.ts` 등 | 홈/미션/어드민 중복 mock 통합 |
| `/mission` → `/m/[slug]` | 카드 클릭 시 slug별 상세 (데이터는 여전히 mock) |
| 로그인 스텁 | Navbar에 “카카오 로그인(데모)” 버튼 → 토스트/모달만 |
| QR 플레이스홀더 | 미션 상세에 QR 이미지/컴포넌트 자리 |

### Phase U2 — UX 폴리시

- 접근성: 모달 포커스·aria (DonationModal은 Escape/overflow 일부 구현됨)
- 모바일 Navbar (현재 desktop nav 위주)
- 빈 상태·에러·로딩 스켈레톤
- `ignoreBuildErrors` 제거 후 타입 에러 정리

### Phase U3 — 설계 스택 합류 (DB 직전)

`01_TECH_STACK` 디렉터리로 이전할 때:

```
현재(프로토타입)          →  목표(TheSentAsset형)
app/                      →  src/app/[locale]/...
components/               →  src/components/
lib/bannerStore.ts        →  API + DB (배너 테이블)
하드코딩 한국어           →  messages/ko.json, en.json
```

권장 순서: **UI 컴포넌트 이동 → next-intl 래핑 → Better Auth → Drizzle mock→실테이블 → PG**.

---

## 5. 디렉터리 (이식 후)

```
YWAMFund/
├── app/                 # Next.js App Router
├── components/          # home, mission, donation, donor, dashboard, create, admin, layout, ui
├── lib/                 # utils, bannerStore → 이후 mock/ 분리
├── public/              # 커버·프로필 이미지
├── doc/                 # 기획·본 문서
├── package.json
├── next.config.mjs
└── README.md            # 실행 방법
```

원본 백업 위치(참고용):  
`/Users/deokhokim/DavidKim/YWAMLTS/Project/YWAMFund/Ref/donation-page-redesign`

---

## 6. 실행 방법

```bash
cd /Users/deokhokim/Development/TheSent_workspace/YWAMFund
pnpm install
pnpm dev
```

브라우저: [http://localhost:3000](http://localhost:3000)

| 확인 시나리오 | 경로 |
|---------------|------|
| 홈·배너·카드 | `/` |
| 후원 플로우(가짜 결제) | `/mission` → 후원하기 |
| 후원자 | `/my` |
| 선교사 | `/dashboard` |
| 캠페인 작성 | `/create` |
| 관리자·지도·배너 | `/admin` (배너 수정 후 `/`에서 반영) |

---

## 7. 리스크 · 주의

| 항목 | 내용 |
|------|------|
| v0 생성물 | 타입 느슨함(`ignoreBuildErrors`), UI 컴포넌트 최소 — 프로덕션 전 정리 필요 |
| 역할 혼재 Navbar | 실제 서비스에서는 role별 메뉴 분리 |
| `/support` vs 미션 Q&A | 기획의 미션별 Q&A와 별개 — 추후 `/m/[slug]` 하위에 추가 |
| Analytics | `@vercel/analytics` — Vercel 외 배포 시 제거/교체 |
| 이미지 | `images.unoptimized: true` — CDN/Next Image 최적화는 이후 |

---

## 8. 다음 액션 (제안)

1. **고객/내부 UX 리뷰** — 프로토타입 클릭 동선으로 피드백 수집  
2. **U1:** mock 통합 + `/m/[slug]`  
3. 고객 질문 Top (Q-07, Q-15, Q-55) 병행  
4. UI 동결 후 Phase 0(TheSentAsset 스캐폴딩 + Auth) 착수  

이 문서의 “완료” 기준: 로컬에서 위 시나리오가 DB 없이 재현 가능할 것.
