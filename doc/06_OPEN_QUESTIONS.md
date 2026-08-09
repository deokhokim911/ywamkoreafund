# 06. 개발팀·기획 확인 필요 사항 (Open Questions)

고객 질문이 아닌, **구현 전에 팀/기획이 결정할 기술·제품 이슈**입니다.  
고객 확인이 필요한 항목은 [07_CUSTOMER_QUESTIONS.md](./07_CUSTOMER_QUESTIONS.md)로 분리했습니다.

---

## A. 제품·UX

| ID | 질문 | 제안(기본안) | 결정 |
|----|------|--------------|------|
| T-01 | 선교사와 후원자 역할 동시 보유 허용? | 허용 (role multi) | ☐ |
| T-02 | 미션 공개 URL 형식 | `/m/[slug]` | ☐ |
| T-03 | 미션 body 포맷 | Markdown + sanitize | ☐ |
| T-04 | 공개 후 본문 수정 시 재승인? | 중요 필드 변경 시 재승인 | ☐ |
| T-05 | 익명 후원 시 선교사에게 이름 숨김? | 금액만 표시 · **연락처(전화·이메일) 선교사 비공개** · 소식=앱 메시지 | ✅ **v7 확정** 2026-08 |
| T-06 | 정기후원 첫 결제 즉시 실행? | 즉시 1회 + next month | ☐ |
| T-07 | 미션 목표액 초과 후원 허용? | 허용 | ☐ |
| T-08 | 사용자 생성 콘텐츠(미션) 자동 번역? | **Phase 1 없음** · AI 번역은 **부가·과금 트랙**(v7) | ✅ Phase1 제외 · 부가 협의 |
| T-09 | 정기결제 N회 실패 시 자동 일시정지? | 3회 연속(각 ~3일) → paused | ☐ |
| T-29 | OAuth 제공자 | **Kakao + Google** (v7) | ✅ **v7 확정** 2026-08 |
| T-30 | 승인 단계 | 본부·선교본부 **2단계** + 약 1주 SLA (v7) | ✅ 목표 확정 · 상세 권한은 구현 시 |
| T-31 | 선교사 직접 송금 | **1차 제외** (회계팀 처리) | ✅ v7 |
| T-32 | 선교사 기준 영수증 | 필요 언급 · **문서 종류 ★미확정** | ☐ [13](./13_CUSTOMER_SCHEDULE_MILESTONE_v7.md) |
| T-33 | “프로젝트” 캠페인·사역 카테고리 | 필요 언급 · **정의 ★미확정** | ☐ [13](./13_CUSTOMER_SCHEDULE_MILESTONE_v7.md) |

---

## B. 기술

| ID | 질문 | 제안(기본안) | 결정 |
|----|------|--------------|------|
| T-10 | PG Phase 1 | **토스페이먼츠** | ✅ **확정** 2026-07-21 |
| T-11 | Better Auth Kakao/Google 연동 | socialProviders 또는 generic OAuth | ☐ Google 추가 |
| T-12 | 지도 라이브러리 | MapLibre GL + 국가 GeoJSON | ☐ |
| T-13 | 배포 환경 | TheSentAsset와 동일 Linode/PM2 (앱 서버; DB는 Supabase) | ☐ |
| T-14 | 영수증 PDF 생성 위치 | 서버 `@react-pdf/renderer` + S3 저장 | ☐ |
| T-15 | 정기결제 스케줄러 | `/api/cron/charge-subscriptions` + 외부 cron | ☐ |
| T-16 | 동영상 직접 업로드 | Phase 1 제외 (YouTube/Vimeo만) | ☐ |
| T-17 | 권한 모델 | role enum (L1–L7 대신) | ☐ |
| T-18 | **프로덕션 DB 호스팅** | **Supabase Postgres** (로컬=Docker). Auth=Better Auth만. *이력: VPS 대안은 [10](./10_I18N_DB_PAYMENTS.md)* | ✅ **확정** 2026-07-21 |
| T-19 | **Stripe 도입 시점·범위** | D5 후보. 해외 일시만 vs 정기. 비교는 [10](./10_I18N_DB_PAYMENTS.md) 유지 | ☐ |
| T-27 | i18n `localePrefix` | `as-needed` (ko=`/`, en=`/en`) | ☐ |
| T-28 | 미션 본문 다국어 | Phase 1: 작성 언어 1개(`missions.locale`) | ☐ |

---

## C. 보안·컴플라이언스 (구현 전 체크)

| ID | 항목 | 상태 |
|----|------|------|
| T-20 | 영수증용 주민등록번호 등 수집 여부·암호화·보관기간 | 고객 답변 대기 |
| T-21 | 후원자 연락처 선교사 노출 | **비공개 확정**(v7). 동의 문구는 약관에 명시 | ✅ v7 · 약관 반영 ☐ |
| T-22 | PCI: 카드번호 직접 저장 금지 (빌링키만) | 원칙 확정 |
| T-23 | 개인정보처리방침·이용약관 페이지 | 법무/고객 초안 필요 |
| T-24 | **기부금품의 모집 및 사용에 관한 법률** 등록 대상 여부·등록 주체 (법무) | ★ 최우선 — 고객·법무 |
| T-25 | 정산 흐름상 플랫폼의 **전자금융업** 등록 필요 여부 (법무) | ★ Q-55 답변 후 |
| T-26 | 개인정보 보존기간·파기 절차와 법정 보존 의무(결제 원장 등) 정합성 | ★ Q-15 연동 |

---

## D. TheSentAsset 재사용 체크리스트

- [ ] `src/lib/storage/s3-compatible.ts` 포팅
- [ ] `proxy.ts` + next-intl 라우팅 포팅
- [ ] UI `components/ui/*` 포팅
- [ ] Resend 발송·delivery 테이블 패턴
- [ ] QR 컴포넌트 포팅
- [ ] PDF + Noto Sans KR 포팅
- [ ] audit log 패턴
- [ ] Vitest/Playwright/CI 워크플로 포팅

---

## E. 나에게(에이전트) 확인이 필요한 것

아래는 다음 작업 전에 **사용자(개발 담당)에게 확인**하면 좋은 항목입니다.

1. **레포 부트스트랩 시점:** 지금 YWAMFund에 TheSentAsset 스캐폴딩을 바로 시작할까요, 고객 질문 회신 후일까요?
2. **브랜드명·도메인:** **YWAMKoreaFund** · `ywamkoreafund.org` (v7)  
3. **디자인:** 기존 UI 프로토타입 베이스 + 고객 브랜드  
4. **PG:** **토스페이먼츠** 확정 · 가맹·라이브 심사는 M1~M7  
5. **운영 주체:** 사단법인 예수전도단 (v7)  
6. **일정 SSOT:** [13_CUSTOMER_SCHEDULE_MILESTONE_v7.md](./13_CUSTOMER_SCHEDULE_MILESTONE_v7.md)
