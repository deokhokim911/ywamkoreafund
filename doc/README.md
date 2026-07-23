# YWAMFund 개발 문서 인덱스

> **프로젝트명(가칭):** YWAMFund / MissionFund  
> **유형:** 선교사 미션 후원 웹앱 (MissionFund.org · GoFundMe 유형)  
> **기준 스택:** [01_TECH_STACK.md](./01_TECH_STACK.md) (Next.js 16 · Better Auth · Drizzle · next-intl · **Toss** · **Supabase**)  · TheSentAsset 정렬  
> **작성일:** 2026-07-15  
> **지원 언어:** 한국어(ko, 기본) · 영어(en)

---

## 문서 목록

| 문서 | 내용 |
|------|------|
| [00_REQUIREMENTS_ANALYSIS.md](./00_REQUIREMENTS_ANALYSIS.md) | 요구사항 분석·사용자 역할·핵심 플로우 |
| [01_TECH_STACK.md](./01_TECH_STACK.md) | **기술 스택 상세** (레이어·패키지·ENV·단계별 도입) |
| [02_SYSTEM_ARCHITECTURE.md](./02_SYSTEM_ARCHITECTURE.md) | 시스템 아키텍처·도메인 경계 |
| [03_DATA_MODEL.md](./03_DATA_MODEL.md) | DB 스키마 초안(Drizzle) |
| [04_FEATURE_SPEC.md](./04_FEATURE_SPEC.md) | 기능 상세 명세(화면·API·권한) |
| [05_PHASE_ROADMAP.md](./05_PHASE_ROADMAP.md) | 단계별 개발 로드맵 |
| [06_OPEN_QUESTIONS.md](./06_OPEN_QUESTIONS.md) | 개발팀·기획 확인 필요 사항 |
| [07_CUSTOMER_QUESTIONS.md](./07_CUSTOMER_QUESTIONS.md) | **고객에게 물어볼 질문 체크리스트** |
| [08_UI_PROTOTYPE_PLAN.md](./08_UI_PROTOTYPE_PLAN.md) | UI 프로토타입 분석·이식 계획 |
| [09_DEVELOPMENT_PHASES.md](./09_DEVELOPMENT_PHASES.md) | UI 기반 개발 단계 (D0~D5) — **D0 완료 · D1 핵심 완료** |
| [10_I18N_DB_PAYMENTS.md](./10_I18N_DB_PAYMENTS.md) | 다국어 · DB · 결제 — **Decision Log + 비교 이력** |
| [11_DEV_PREPARATION.md](./11_DEV_PREPARATION.md) | **개발 사전 준비 가이드 · 체크리스트** |
| [12_GIVEHOPE_FEATURE_MIGRATION.md](./12_GIVEHOPE_FEATURE_MIGRATION.md) | **GiveHope 레퍼런스 분석 · YWAM UI 중심 기능 마이그레이션** |
| [ENV_YWAMFUND_PHASE0.md](./ENV_YWAMFUND_PHASE0.md) | D0 ENV · Supabase 연결 규칙 |
| [logs/2026-07-24_DEV_LOG.md](./logs/2026-07-24_DEV_LOG.md) | **개발 로그 2026-07-24** (D0·D1) |

---

## 빠른 요약

1. 선교사가 미션(텍스트·이미지·YouTube/Vimeo)을 등록 → **승인 후** 공개  
2. 후원자가 **카카오 OAuth** 로그인 → **QR/공유 링크**로 미션 접속 → **Toss**로 일시/정기 후원  
3. 선교사·후원자·관리자 **역할별 대시보드** (모금 현황, 후원자 목록, 기부금 영수증, 세계지도)  
4. 미션별 **Q&A / 업데이트**, 메일·메신저 메시지  
5. Phase 1: **Toss** · DB **Supabase**(D0~) → 1E 보안·법률·라이브 → 1F 베타  
6. **다국어** ko/en (D0~) · **Stripe는 Phase 2 후보** (비교는 [10](./10_I18N_DB_PAYMENTS.md) 보존)

**확정 (2026-07-21):** T-10 Toss · T-18 Supabase  
**진행 (2026-07-24):** D0 ✅ · D1 핵심 ✅ — [개발 로그](./logs/2026-07-24_DEV_LOG.md)
**착수 전 확인:** Q-07, T-24~T-25, Q-15, Q-55 · Stripe는 T-19(미정)  
**사전 준비:** [11_DEV_PREPARATION.md](./11_DEV_PREPARATION.md) (계정·키·인프라·법무 체크리스트)

---

## 작성 원칙

- UI 카피 소스: `ko.json` → `en.json` 번역 (TheSentAsset i18n 정책과 동일)
- 코드·주석·개발 문서: **한국어** 우선
- 결제·기부금 영수증·개인정보는 **법적/세무 요건을 고객 확인 후** 구현
- 2026-07-15 문서 분석 반영: 컴플라이언스 질문, 웹훅/환불 스키마, 탈퇴·a11y, Phase 1E/1F
