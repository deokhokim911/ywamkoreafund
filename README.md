# YWAMFund

선교사 미션 후원 웹앱 — **현재는 UI 프로토타입** (DB · Auth · PG 미연동).

기획·설계 문서: [`doc/`](./doc/) · UI 분석·개발 계획: [`doc/08_UI_PROTOTYPE_PLAN.md`](./doc/08_UI_PROTOTYPE_PLAN.md)

## 실행

```bash
pnpm install
pnpm dev
```

→ [http://localhost:3000](http://localhost:3000)

| 화면 | URL |
|------|-----|
| 홈 | `/` |
| 미션·후원 | `/mission` |
| 내 후원 | `/my` |
| 선교사 대시보드 | `/dashboard` |
| 캠페인 만들기 | `/create` |
| Q&A | `/support` |
| 관리자 | `/admin` |

## 스택 (프로토타입)

- Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript
- shadcn (base-nova) · recharts · react-simple-maps
- 데이터: 하드코딩 mock / `lib/bannerStore` (세션 내 배너 공유)

## 원본 레퍼런스

`~/DavidKim/YWAMLTS/Project/YWAMFund/Ref/donation-page-redesign`
