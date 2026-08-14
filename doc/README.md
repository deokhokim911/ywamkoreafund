# YWAMFund / YWAMKoreaFund 개발 문서 인덱스

> **프로젝트명:** YWAMKoreaFund (레포·내부 약칭 YWAMFund)  
> **도메인:** `ywamkoreafund.org`  
> **유형:** 선교사 미션 후원 웹앱  
> **운영:** 사단법인 예수전도단 · **개발:** JIOS  
> **기준 스택:** [01](./01_TECH_STACK.md) — Next.js 16 · Better Auth(**Kakao+Google**) · Drizzle · next-intl · **Toss** · **Supabase**  
> **작성일:** 2026-07-15 · **개정:** 2026-08-09 (고객 일정 v7)  
> **지원 언어:** 한국어(ko, 기본) · 영어(en)

---

## 문서 목록

| 문서 | 내용 |
|------|------|
| [00_REQUIREMENTS_ANALYSIS.md](./00_REQUIREMENTS_ANALYSIS.md) | 요구사항 분석·사용자 역할·핵심 플로우 |
| [01_TECH_STACK.md](./01_TECH_STACK.md) | **기술 스택 상세** |
| [02_SYSTEM_ARCHITECTURE.md](./02_SYSTEM_ARCHITECTURE.md) | 시스템 아키텍처 |
| [03_DATA_MODEL.md](./03_DATA_MODEL.md) | DB 스키마 초안 |
| [04_FEATURE_SPEC.md](./04_FEATURE_SPEC.md) | 기능 상세 명세 |
| [05_PHASE_ROADMAP.md](./05_PHASE_ROADMAP.md) | 단계별 로드맵 + **고객 캘린더 M1~M8** |
| [06_OPEN_QUESTIONS.md](./06_OPEN_QUESTIONS.md) | 개발팀 확인 사항 |
| [07_CUSTOMER_QUESTIONS.md](./07_CUSTOMER_QUESTIONS.md) | 고객 질문 · **v7 답변 반영** |
| [08_UI_PROTOTYPE_PLAN.md](./08_UI_PROTOTYPE_PLAN.md) | UI 프로토타입 계획 |
| [09_DEVELOPMENT_PHASES.md](./09_DEVELOPMENT_PHASES.md) | D0~D5 작업 ID — D0·D1 핵심 완료 |
| [10_I18N_DB_PAYMENTS.md](./10_I18N_DB_PAYMENTS.md) | i18n · DB · 결제 Decision Log |
| [11_DEV_PREPARATION.md](./11_DEV_PREPARATION.md) | 개발 사전 준비 체크리스트 |
| [12_GIVEHOPE_FEATURE_MIGRATION.md](./12_GIVEHOPE_FEATURE_MIGRATION.md) | GiveHope 레퍼런스 마이그레이션 |
| [13_CUSTOMER_SCHEDULE_MILESTONE_v7.md](./13_CUSTOMER_SCHEDULE_MILESTONE_v7.md) | **고객 일정·범위 SSOT (v7)** |
| [14_CUSTOMER_INFO_REQUEST.md](./14_CUSTOMER_INFO_REQUEST.md) | **고객 준비·제공 요청서** (운영측 회신용) |
| [ENV_YWAMFUND_PHASE0.md](./ENV_YWAMFUND_PHASE0.md) | D0 ENV · Supabase |
| [logs/2026-07-24_DEV_LOG.md](./logs/2026-07-24_DEV_LOG.md) | 개발 로그 2026-07-24 |
| [logs/2026-08-09_DEV_LOG.md](./logs/2026-08-09_DEV_LOG.md) | 개발 로그 2026-08-09 |
| [logs/2026-08-11_DEV_LOG.md](./logs/2026-08-11_DEV_LOG.md) | 개발 로그 2026-08-11 (D1 i18n 마무리) |
| [logs/2026-08-14_DEV_LOG.md](./logs/2026-08-14_DEV_LOG.md) | 개발 로그 2026-08-14 (프로젝트 용어·승인 2단계·관리자 UX) |
| [reference/YWAMKoreaFund_세부일정_마일스톤_v7.docx](./reference/YWAMKoreaFund_세부일정_마일스톤_v7.docx) | 고객 원본 일정서 |

---

## 빠른 요약

1. 선교사가 미션 등록 → **본부·선교본부 2단계 승인** 후 공개  
2. 후원자 **카카오·구글** 로그인 → QR/링크로 미션 접속 → **Toss** 일시/정기 후원  
3. 선교사에게 후원자 **이름·금액만** 공개 (익명·연락처 비공개 · 소식=앱 메시지)  
4. 영수증·**국세청 파일**(M5 핵심) · 관리자 8영역 · 세계지도  
5. **착수 2026-09-11 → 오픈 2027-02-12** (~22주)  
6. 1차 **직접 송금·AI 번역·AI 캐릭터화 제외** (부가/추후)

**확정:** Toss · Supabase · Kakao+Google · 도메인 ywamkoreafund.org  
**선행:** D0 ✅ · D1 핵심 ✅  
**일정 SSOT:** [13](./13_CUSTOMER_SCHEDULE_MILESTONE_v7.md) · [05](./05_PHASE_ROADMAP.md)  
**★ 미결:** 선교사 기준 영수증 종류 · “프로젝트” 캠페인 정의 · 법무 Q-07/T-24  

---

## 작성 원칙

- UI 카피: `ko.json` → `en.json`  
- 코드·개발 문서: **한국어** 우선  
- 결제·영수증·개인정보: 법적/세무 요건을 고객·회계 확인 후 구현  
- 고객 계약 일정과 내부 D-단계는 [13](./13_CUSTOMER_SCHEDULE_MILESTONE_v7.md)에서 동기화
