# 12. GiveHope 레퍼런스 분석 · YWAMFund 기능 마이그레이션

> **원본:** `Ref/givehope-donation-portal-main` (GiveHope Donation Portal)  
> **대상:** 현재 YWAMFund 앱 (`donation-page-redesign` UI + `doc/00~11` 설계)  
> **원칙:** **기존 소스·디자인·확정 스택(Toss·Supabase DB·Better Auth·Kakao)을 중심**으로,  
> GiveHope에서 **후원자·선교사·관리자 UX에 유용한 기능만** 이식한다. 앱 전체를 교체하지 않는다.  
> **작성일:** 2026-07-23  
> **관련:** [08](./08_UI_PROTOTYPE_PLAN.md) · [09](./09_DEVELOPMENT_PHASES.md) · [01](./01_TECH_STACK.md) · [10](./10_I18N_DB_PAYMENTS.md)

---

## 0. 한 줄 요약

GiveHope는 **영미권 일반 기부 포털**(Stripe/PayPal/Square · Supabase Auth · 키오스크)이다.  
YWAMFund는 **선교 미션 후원**(Kakao · Toss · 선교사/후원자/승인/지도)이다.  
공통 UX(신뢰 배지, slug 상세, 성공 페이지, 수수료 부담, 종료일, 공유 등)는 **기존 컴포넌트에 흡수**하고,  
결제·Auth·스키마는 **YWAMFund 확정안을 유지**한다.

---

## 1. GiveHope 개요

### 1.1 스택 (레퍼런스 그대로)

| 영역 | GiveHope | YWAMFund (확정/목표) |
|------|----------|----------------------|
| Framework | Next.js **14** | Next.js **16** |
| React | 18 | 19 |
| UI | Radix shadcn 풀셋 | base-nova + 최소 ui (점진 확장) |
| DB | Supabase + **클라이언트 from()** | Supabase Postgres + **Drizzle** (Auth≠Supabase) |
| Auth | **Supabase Auth** (email) | **Better Auth + Kakao** |
| 결제 | Stripe · PayPal · Square | **Toss** (Stripe는 D5 후보만) |
| i18n | 영어 단일 | **ko/en** next-intl |
| 특수 | `/kiosk` 터치 UI | 없음 (교회/행사 키오스크는 선택) |

### 1.2 라우트 · 화면

| 경로 | 역할 |
|------|------|
| `/` | 마케팅 홈 · 캠페인 그리드 · TrustBadges · 뉴스레터 CTA |
| `/campaign/[slug]` | 캠페인 상세 · 진행률 · 최근 후원 · DonationWidget |
| `/donate/[slug]` | 다단계 후원 폼 (금액→정보→결제) |
| `/donation-success` | 후원 완료 감사 페이지 |
| `/kiosk`, `/kiosk/[slug]` | 비회원·대형 터치 후원 플로우 |
| `/auth/login\|signup\|verify-email` | 이메일 가입 |
| `/admin`, `/admin/campaigns/*` | 캠페인 CRUD·목록 |

### 1.3 데이터 모델 (요약)

- `campaigns`: slug, goal, current_amount, org name/logo, status, end_date  
- `donations`: tip_amount, cover fees 개념, recurring frequency, `source: web|kiosk`, payment_method  
- `recurring_subscriptions`: monthly / **quarterly** / **yearly**  
- SQL: `scripts/001~005` + trigger로 금액 집계

### 1.4 사용자 관점 기능 목록 (GiveHope)

| ID | 기능 | 후원자 | 캠페인 주체 | 관리자 | 비고 |
|----|------|--------|-------------|--------|------|
| G01 | 캠페인 목록·카드·진행률 | ✅ | | | |
| G02 | `/campaign/[slug]` 상세 | ✅ | | | |
| G03 | 전용 `/donate/[slug]` 결제 페이지 | ✅ | | | 모달과 별도 풀페이지 |
| G04 | 프리셋+직접 금액 | ✅ | | | |
| G05 | 정기: 월/분기/년 | ✅ | | | YWAM은 Phase1 월 중심 |
| G06 | 익명 후원 | ✅ | | | YWAM에 이미 개념 있음 |
| G07 | 응원 메시지 | ✅ | | | YWAM DonationModal에 있음 |
| G08 | **결제 수수료 부담(cover fees)** | ✅ | | | GiveHope 특화 |
| G09 | **플랫폼 tip** | ✅ | | | tip_amount |
| G10 | 다중 PG 선택 UI (Stripe/PayPal/Square) | ✅ | | | YWAM은 Toss만 Phase1 |
| G11 | **Trust badges** (보안·검증 캠페인) | ✅ | | | UX 신뢰 |
| G12 | Verified campaign 표시 | ✅ | | | 승인 후 배지와 연결 가능 |
| G13 | **후원 성공 전용 페이지** | ✅ | | | |
| G14 | 최근 후원자 리스트 | ✅ | | | YWAM DonorFeed와 유사 |
| G15 | Share 버튼 | ✅ | | | YWAM Web Share 일부 |
| G16 | **종료일(end_date)·남은 일수** | ✅ | ✅ | | |
| G17 | 캠페인 status paused/completed/archived | | ✅ | ✅ | YWAM status enum과 유사 |
| G18 | Org name + logo | | ✅ | | missionary/org 브랜딩 |
| G19 | **키오스크 모드** | ✅(현장) | | | 교회·행사 |
| G20 | 이메일 가입/로그인 | ✅ | ✅ | ✅ | YWAM은 Kakao |
| G21 | Admin 캠페인 CRUD | | | ✅ | YWAM create/admin이 더 풍부 |
| G22 | Dark/Light theme | ✅ | | | next-themes |
| G23 | Footer·Header 사이트 셸 | ✅ | | | |
| G24 | SEO meta / OG (캠페인별) | ✅ | | | |
| G25 | 뉴스레터 구독 CTA (홈) | ✅ | | | 마케팅 |

---

## 2. YWAMFund 현재 UI와 대조

### 2.1 이미 있는 것 (이식이 아니라 **유지·강화**)

| YWAMFund | GiveHope 대응 | 조치 |
|----------|---------------|------|
| `HomePage` 배너·카드·필터·마퀴 | G01, 홈 | 유지. TrustBadges·종료일 배지만 추가 검토 |
| `MissionPage` + StickyDonateBar + DonationModal | G02~G07 | 유지. 모달 중심 UX 유지 |
| `DonorFeed` | G14 | 유지 |
| `CreateCampaignPage` 5스텝 | G21 | 유지 (GiveHope form보다 풍부) |
| Admin 승인·지도·배너·회원 | — | **YWAM 고유** — GiveHope admin보다 우선 |
| `/my`, `/dashboard` | — | **YWAM 고유** — 역할 대시보드 유지 |
| 익명·메시지·정기후원(월) UI | G05~G07 | 유지 |

### 2.2 사용자에게 가치 있는 **갭** (마이그레이션 후보)

우선순위: ★★★ 높음 · ★★ 중간 · ★ 낮음/후순위

| 우선 | 갭 (사용자 가치) | GiveHope 참고 | YWAM 이식 위치 |
|------|------------------|---------------|----------------|
| ★★★ | **후원 완료 전용 화면** (감사·영수증 안내·홈/미션 복귀) | `/donation-success` | 신규 `/[locale]/donate/success` + Modal success 스텝 강화 |
| ★★★ | **신뢰 신호** (보안·검증 미션·투명성) | `TrustBadges`, DonationWidget 상단 | `HomePage` 섹션 + `MissionPage`/`DonationModal` |
| ★★★ | **slug 기반 공개 URL** (이미 기획) | `/campaign/[slug]` | D1 `/m/[slug]` — GiveHope는 패턴만 참고 |
| ★★ | **결제 수수료 부담 옵션** (“수수료를 제가 낼게요”) | coverFees | `DonationModal` + donations 메타 |
| ★★ | **미션 종료일·D-day** | end_date | `missions.ends_at` + `MissionCard`/`FundingProgress` |
| ★★ | **풀페이지 후원 플로우** (모바일·공유 링크 직행) | `/donate/[slug]` | 선택: `/m/[slug]/donate` — 모달과 병행 |
| ★★ | **공유 UX 강화** (카카오톡/링크 복사 피드백) | Share2 | `MissionHero` |
| ★★ | **Verified 배지** = 승인 완료 미션 | Verified Campaign | `published` + 선택적 자격검증 후 |
| ★ | **Org 로고** | organization_logo | `organizations` 또는 missionary avatar |
| ★ | **키오스크** (교회 로비·집회) | `/kiosk` | Phase 2+ `/kiosk` — Kakao 없이 일시후원만 |
| ★ | **분기/년 정기** | quarterly/yearly | Phase 2 (Phase1=월, T-09/Q-53) |
| ★ | **플랫폼 tip** | tip_amount | 고객 확인 후 (Q 신규) — 선교 후원과 혼동 주의 |
| ★ | Dark mode | next-themes | 비우선 (브랜드 teal 라이트 우선) |
| ❌ | Stripe/PayPal/Square UI | payment method tabs | **이식 안 함** — Toss만 (Stripe는 D5) |
| ❌ | Supabase Auth 화면 | `/auth/*` | **이식 안 함** — Kakao |
| ❌ | 클라이언트에서 campaigns insert | campaign-form | **이식 안 함** — Server Actions+승인 |

### 2.3 YWAM에만 있고 GiveHope에 없는 것 (보호)

선교사 프로필·파송국 지도·미션 승인 큐·기부금 영수증 PDF·Kakao·QR·미션 Q&A·아동 보호 가이드 — **삭제·축소하지 않는다.**

---

## 3. 마이그레이션 원칙

1. **UI 셸은 YWAMFund** (`components/home|mission|donation|…`). GiveHope 파일을 통째로 복사해 라우트를 덮어쓰지 않는다.  
2. **아이디어·부분 UI만 포팅** — 예: `TrustBadges` → `components/home/TrustBadges.tsx`로 새로 작성(카피 ko/en).  
3. **결제**는 항상 `PaymentProvider` / Toss ([10](./10_I18N_DB_PAYMENTS.md)). GiveHope `lib/stripe.ts`·PayPal/Square API는 참고용만.  
4. **DB**는 Drizzle 스키마([03](./03_DATA_MODEL.md))에 필드 추가. GiveHope SQL을 그대로 Supabase에 돌리지 않는다 (테이블명·Auth 모델이 다름).  
5. **i18n**: 신규 문자열은 `messages/ko.json`·`en.json`부터.  
6. 충돌 시 **YWAM 기획·확정 스택 우선**.

```text
GiveHope (참고)
    │  UX 패턴 / 소량 컴포넌트 아이디어
    ▼
YWAMFund components/*  (중심)
    │  Server Actions / Toss / Drizzle
    ▼
제품 (선교 후원)
```

---

## 4. 기능별 마이그레이션 명세

### M1 — 후원 성공 페이지 ★★★

| 항목 | 내용 |
|------|------|
| **사용자 가치** | 결제 후 “됐는지” 명확 · 영수증/홈 복귀 CTA |
| **참고** | `app/donation-success/page.tsx` |
| **YWAM 작업** | 1) Modal `success` 스텝에 영수증 링크·미션 돌아가기 강화 2) `/[locale]/donate/success?donationId=` 페이지 추가 (PG redirect용) |
| **단계** | D1(UI) → D2(실 donationId) |
| **수락** | 일시/정기 성공 후 동일 톤의 감사 화면 + 다음 행동 2개 이상 |

### M2 — Trust / 보안 배지 ★★★

| 항목 | 내용 |
|------|------|
| **사용자 가치** | 첫 방문 후원자 신뢰 · 이탈 감소 |
| **참고** | `trust-badges.tsx`, `donation-widget.tsx` 상단 체크리스트 |
| **YWAM 작업** | `components/home/TrustBadges.tsx` · 홈 캠페인 섹션 위/아래 · Modal 결제 스텝에 “Toss 안전결제·개인정보 최소” 카피 (허위 인증 마크 금지) |
| **단계** | D1 |
| **주의** | “PCI/SSL” 등 **사실인 것만** i18n 카피. 미검증 통계(15K+ donors) 복붙 금지 |

### M3 — 미션 종료일 · D-day ★★

| 항목 | 내용 |
|------|------|
| **사용자 가치** | 긴급감 · 캠페인 생명주기 |
| **참고** | Campaign `end_date`, days remaining |
| **YWAM 작업** | `missions.ends_at` timestamptz nullable · Create 위자드 기간 필드 연동 · `MissionCard`/`FundingProgress`에 “N일 남음” (이미 daysLeft mock 있음 → DB 연결) |
| **단계** | D1 mock → D2 스키마 |
| **수락** | 종료 후 CTA 비활성 또는 “캠페인 종료” 상태 (정책 Q와 합의) |

### M4 — 수수료 부담 (cover fees) ★★

| 항목 | 내용 |
|------|------|
| **사용자 가치** | 선교비가 수수료로 깎이지 않게 선택 |
| **참고** | donation-form `coverFees` ≈ 2.9%+$0.3 (Stripe식) |
| **YWAM 작업** | Toss 실제 수수료율로 계산식 교체 · `DonationModal` 체크박스 · `donations`에 `fee_covered` / `fee_amount_krw` |
| **단계** | D2-C (Toss 연동 시) |
| **블로커** | 실제 요율·부가세 — 고객/계약 확인 |

### M5 — 풀페이지 후원 (`/m/[slug]/donate`) ★★

| 항목 | 내용 |
|------|------|
| **사용자 가치** | QR/공유로 “바로 후원” · 모바일 키보드 공간 |
| **참고** | `/donate/[slug]` |
| **YWAM 작업** | StickyDonateBar/CTA → Modal **또는** `/donate` 페이지 (동일 `DonationModal` 로직 공용 훅으로 추출) |
| **단계** | D1 라우트 스텁 · D2 결제 연결 |
| **원칙** | 로직 중복 금지 — `useDonationFlow` 공유 |

### M6 — 공유 UX ★★

| 항목 | 내용 |
|------|------|
| **사용자 가치** | 바이럴 · 교회 단톡 공유 |
| **참고** | Share2 버튼 |
| **YWAM 작업** | `MissionHero`: Web Share + 클립보드 복사 토스트 · (선택) 카카오 공유 링크 문서화 |
| **단계** | D1 |

### M7 — Verified 배지 ★★

| 항목 | 내용 |
|------|------|
| **사용자 가치** | 승인된 미션 신뢰 |
| **참고** | “Verified Campaign” |
| **YWAM 작업** | `status===published` → “승인된 미션” 배지 · 자격검증(Q-12) 완료 시 추가 배지 |
| **단계** | D1 UI · D2/D3 검증 연동 |

### M8 — 키오스크 모드 ★ (Phase 2+)

| 항목 | 내용 |
|------|------|
| **사용자 가치** | 예배당·집회장 무인 후원 |
| **참고** | `kiosk-donation-flow.tsx` — 큰 버튼·자동 리셋 |
| **YWAM 작업** | `/kiosk` · 로그인 없이 Toss 위젯 · `donations.source='kiosk'` · 관리자 PIN(선택) |
| **단계** | D5 또는 별도 스프린트 |
| **주의** | Kakao 강제와 충돌 → 키오스크만 게스트 결제 예외 정책 필요 |

### M9 — 이식하지 않는 것 (명시)

| GiveHope | 이유 |
|----------|------|
| Stripe/PayPal/Square 선택 UI | Phase 1 = Toss only |
| Supabase Auth login/signup | Kakao + Better Auth |
| 캠페인 생성 즉시 `status: active` | YWAM은 **승인 후 published** |
| 영문 전용 카피·가짜 소셜프루프 숫자 | 브랜드·진실성 |
| next-themes dark 우선 적용 | 디자인 시스템 안정화 후 선택 |
| GiveHope `components/ui/*` 전체 복사 | 필요 시 개별 shadcn 추가만 |

---

## 5. 단계별 이식 계획 (기존 09와 정렬)

| 09 단계 | GiveHope 관련 작업 | 산출물 |
|---------|-------------------|--------|
| **D1** | M1 UI · M2 TrustBadges · M3 daysLeft 정리 · M5 라우트 스텁 · M6 Share · M7 배지 | 컴포넌트 + mock |
| **D2** | M1 donationId · M3 `ends_at` · M4 cover fees · M5 실결제 · slug `/m/[slug]` | DB·Toss |
| **D3** | 성공 페이지 ↔ 영수증 CTA · Verified↔자격검증 | |
| **D5+** | M8 키오스크 · 분기/년 정기 · tip(고객 승인 시) | |

작업 ID 제안 (09에 추가 가능):

| ID | 작업 |
|----|------|
| D1-G1 | `TrustBadges` + 홈 배치 (ko/en) |
| D1-G2 | `donate/success` 페이지 + Modal success CTA 정렬 |
| D1-G3 | Share 복사 토스트 · Verified 배지 |
| D1-G4 | `/m/[slug]/donate` 스텁 (공용 훅 추출 시작) |
| D2-G1 | `ends_at` · fee_covered 컬럼 · Toss 수수료 계산 |
| D5-G1 | Kiosk MVP |

---

## 6. 컴포넌트 매핑 (포팅 가이드)

| GiveHope 파일 | YWAM 대상 | 방식 |
|---------------|-----------|------|
| `trust-badges.tsx` | `components/home/TrustBadges.tsx` | **재작성** (카피·토큰만 참고) |
| `donation-success/page.tsx` | `app/.../donate/success/page.tsx` | 재작성 + i18n |
| `donation-form.tsx` coverFees/frequency UI | `DonationModal.tsx` | **부분 이식** (로직만) |
| `donation-widget.tsx` | `StickyDonateBar` / 사이드 CTA | 신뢰 문구만 |
| `campaign/[slug]/page.tsx` 레이아웃 | `MissionPage.tsx` | 레이아웃 아이디어만 — 디자인 유지 |
| `kiosk-*.tsx` | 신규 `components/kiosk/*` | D5 때 참고 구현 |
| `site-footer.tsx` | `components/layout/Footer.tsx` | 약관·지원 링크용으로 신규 |
| `lib/types.ts` | `03` / Drizzle | 필드 아이디어만 (`tip`, `source`, `end_date`) |
| `scripts/*.sql` | Drizzle migrations | **직접 실행 금지** — 동등 컬럼만 반영 |
| `app/api/*stripe|paypal|square*` | — | 이식 금지 |

---

## 7. 스키마 영향 (Drizzle에 추가 검토)

GiveHope → YWAM 필드 매핑 (채택 시 [03](./03_DATA_MODEL.md) 개정):

| 컬럼 | 테이블 | 출처 | 단계 |
|------|--------|------|------|
| `ends_at` | `missions` | end_date | D2 |
| `fee_covered` boolean | `donations` | coverFees | D2 |
| `fee_amount_krw` | `donations` | feeAmount | D2 |
| `tip_amount_krw` | `donations` | tip (선택) | 고객 확인 후 |
| `source` enum `web\|kiosk\|qr` | `donations` | source | D2/D5 |
| `interval` 확장 | `subscriptions` | quarterly/yearly | D5 |

---

## 8. UX 카피 가이드 (이식 시)

- GiveHope 영어 마케팅 톤 → **YWAM 선교·동역** 톤으로 재작성.  
- “Tax-deductible” → 한국 **기부금 영수증** 가능 여부에 따라 조건부 표시 (Q-03).  
- “Money-back guarantee for unverified” → YWAM **승인제**와 맞추어 “승인된 미션만 공개”로 대체.

---

## 9. 체크리스트

### 분석·합의

- [ ] 본 문서 M1~M8 우선순위를 팀/고객과 확정  
- [ ] tip·키오스크·cover fees 요율 고객 확인  
- [ ] GiveHope를 디자인 소스 오브 트루스로 쓰지 않기로 합의 (YWAM UI 유지)

### D1

- [ ] TrustBadges 홈 배치  
- [ ] success 페이지/모달 CTA  
- [ ] Share·Verified 배지  
- [ ] (선택) `/m/[slug]/donate` 스텁  

### D2

- [ ] `ends_at` · fee 필드 마이그레이션  
- [ ] Toss 기준 cover fees  
- [ ] success URL ↔ webhook/confirm  

### 하지 않음

- [ ] GiveHope Auth/결제 프로바이더 코드 머지 안 함  
- [ ] GiveHope SQL 스크립트 프로덕션 미적용  

---

## 10. 관련 문서

| 문서 | 관계 |
|------|------|
| [08](./08_UI_PROTOTYPE_PLAN.md) | 현재 UI 베이스 (donation-page-redesign) |
| [09](./09_DEVELOPMENT_PHASES.md) | D0~D5 — 본 문서 M*를 작업으로 흡수 |
| [04](./04_FEATURE_SPEC.md) | 기능 명세 갱신 시 M1~M4 반영 |
| [03](./03_DATA_MODEL.md) | ends_at·fee 컬럼 |
| [10](./10_I18N_DB_PAYMENTS.md) | Toss/Supabase — GiveHope Stripe/Auth와 구분 |

---

## 부록. 레퍼런스 경로

```text
/Users/deokhokim/DavidKim/YWAMLTS/Project/YWAMFund/Ref/givehope-donation-portal-main/
```

주요 파일: `README.md`, `components/donation-form.tsx`, `trust-badges.tsx`, `kiosk-donation-flow.tsx`, `app/campaign/[slug]/page.tsx`, `app/donation-success/page.tsx`, `lib/types.ts`, `scripts/*.sql`
