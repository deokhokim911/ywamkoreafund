# 04. 기능 상세 명세

## 0. 공통

- 모든 UI 문자열: `next-intl` (`ko` / `en`)
- 인증: Better Auth + **Kakao OAuth**
- 권한: 서버에서 role 검사
- 공개 리소스: `missions.status = published`만

---

## 1. 인증 · 온보딩

### 1.1 로그인

| 항목 | 내용 |
|------|------|
| 화면 | `/login` |
| 수단 | Kakao Talk OAuth (필수) |
| 후처리 | `account` 연결 → 기본 role `donor` 부여 |
| 선교사 전환 | “선교사로 등록” CTA → 온보딩 |

### 1.2 선교사 온보딩 (`/onboarding/missionary`)

필수(초안): 이름, 전화번호, 휴대폰, 비상연락처, 주소, 선교파송국가, 거주기간  
선택: 소개, 아바타  
완료 시 `missionary` role 추가 + `onboarding_completed_at`

### 1.3 후원자 프로필

첫 결제 전 또는 영수증 발급 시: 영수증 명의·연락처 수집

### 1.4 계정 탈퇴

| 항목 | 내용(초안) |
|------|------------|
| 화면 | 설정 → 계정 탈퇴 |
| 활성 정기후원 | 탈퇴 전 **해지 필수** (또는 탈퇴 시 일괄 해지 + 안내) |
| 공개 미션 | 선교사: 활성 미션 `archived` 처리 또는 관리자 이관 — 고객 확인 |
| 결제 원장 | **삭제 금지**. `donor_user_id` 익명화, 영수증 PII 마스킹 |
| 프로필 PII | 법정 보존 기간 경과 후 파기 ([07 Q-15](./07_CUSTOMER_QUESTIONS.md), [06 T-26](./06_OPEN_QUESTIONS.md)) |
| Kakao | Better Auth 계정 unlink + 세션 무효화 |

---

## 2. 미션 (선교사)

### 2.1 목록·한도

- 활성 미션 수 ≤ `max_active_missions` (시스템 기본 + 프로필 오버라이드)
- 상태별 필터: draft / pending / published / rejected / archived

### 2.2 생성·수정

| 필드 | 규칙 |
|------|------|
| title, summary, body | 필수 |
| goal_amount_krw | 선택 |
| cover + 추가 이미지 | 이미지 MIME, 장당 크기 제한(예: 10MB), 장수 제한 |
| youtube_url / vimeo_url | URL 화이트리스트 검증 |
| 저장 | draft 또는 바로 pending_review |

### 2.3 제출·승인

- `draft` → `pending_review`
- 관리자/승인자: approve → `published` + `published_at` + slug 확정  
  reject → `rejected` + reason → 선교사 수정 후 재제출
- 공개 후 수정: **재승인 필요 여부** → 고객 확인 (기본안: 본문 중요 변경 시 재승인)

### 2.4 QR · 공유

- 미션 상세에 QR 표시·다운로드
- 카카오톡/링크 공유용 절대 URL

---

## 3. 공개 미션 페이지 (후원자)

| 경로 | `/m/[slug]` 또는 `/missions/[slug]` |
|------|-------------------------------------|
| SEO | title/summary **OG 태그**, `sitemap.xml`, `robots.txt`, 구조화 데이터(schema.org 기부/조직 — 가능 범위) |
| 콘텐츠 | 본문, 이미지, 영상 embed, 목표/현재 모금액, 업데이트 |
| CTA | 일시후원 / 정기후원 |
| 비로그인 | 조회 가능, 후원 클릭 시 로그인 |
| 아동 보호 | 업로드 가이드(얼굴 노출 동의·신원 마스킹) 링크 — [07 Q-38](./07_CUSTOMER_QUESTIONS.md) |

---

## 4. 결제

### 4.1 일시후원

1. 금액 프리셋 + 직접입력 (최소/최대 고객 확인)
2. 익명 여부, 응원 메시지
3. PG 결제 → 웹훅 확정
4. 성공 화면 + 영수증 링크

### 4.2 정기후원

1. 월 금액 선택
2. 빌링키 등록
3. 즉시 첫 결제 여부 (고객 확인)
4. 대시보드에서 해지/일시정지

### 4.3 실패·환불

- 실패: 사용자 안내 + (정기) 재시도
- **정기 자동 해지(기본안):** 3회 연속 실패(각 약 3일 간격) → `paused` + 후원자 알림. 상세는 [02 §4.5](./02_SYSTEM_ARCHITECTURE.md)
- 환불: 관리자 콘솔에서 `refunds` 기록 + PG 환불 API — Phase 1 범위 고객 확인
- 웹훅 실패분: 관리자 Payments에서 수동 재처리

---

## 5. 선교사 대시보드

| 화면 | 기능 |
|------|------|
| Overview | 전체 모금액, 활성 미션 수, 최근 후원 |
| Mission detail | 미션별 모금 그래프, 후원자 목록(금액·일자·익명 처리) |
| Donors | 후원자 연락(허용 범위), 메시지 발송 |
| Messages | 받은/보낸 메시지 |
| Updates | 미션 업데이트 작성 |
| Q&A | 댓글 답변 |

**후원자 PII 노출 범위**는 익명·동의·법적 이슈 → 고객 필수 확인.

---

## 6. 후원자 대시보드

| 화면 | 기능 |
|------|------|
| Overview | 총 후원액, 활성 정기 |
| By mission | 미션별 금액·이력 |
| Subscriptions | 정기 관리(해지) |
| Receipts | 연도별/건별 PDF 다운로드 |
| Receipt correction | 명의·주민번호 등 오기재 시 **정정 요청** → 재발행(`revision`) |

---

## 7. 메시징

| Phase 1 | 앱 내 메시지 보관 + Resend 이메일 알림 |
|---------|----------------------------------------|
| Phase 2 | 카카오 알림톡 (비즈 채널 계약 시) |

선교사 → 후원자: 개별 / (선택) 미션 후원자 전체  
스팸 방지: rate limit, 수신 거부

---

## 8. 미션 업데이트 · Q&A

- **Updates**: 선교사 작성, 공개 또는 후원자만
- **Q&A**: 로그인 사용자 질문, 선교사/관리자 답변, 비속어/숨김(관리)
- **신고**: 댓글·업데이트에 신고 버튼 → `content_reports` 큐 → 관리자 처리

---

## 9. 관리자 대시보드

| 모듈 | 기능 |
|------|------|
| Approval queue | 미션 승인/반려 · revision 변경분 검토 |
| World map | 대륙·국가별 선교사 수 마커/choropleth |
| Fundraising | 전체/기간/국가/미션 모금액 |
| Users | 역할 부여, 선교사 미션 한도, 자격 검증(해당 시) |
| Payments | 실패·환불·웹훅 재처리·일일 정산 대사 결과 |
| Reports | 콘텐츠 신고 큐 |
| Settings | org 정보, 영수증 템플릿, 기본 미션 한도, 정기실패 한도 |
| Audit | 주요 행위 로그 |

지도 라이브러리: MapLibre 등. 국가 좌표는 `countries` + GeoJSON.

---

## 10. API · Server Actions (초안)

| 영역 | 예시 |
|------|------|
| Missions | `createMission`, `submitMission`, `listMyMissions` |
| Admin | `approveMission`, `rejectMission`, `resolveContentReport` |
| Donations | `POST /api/payments/toss/confirm`, `POST /api/payments/webhook` |
| Billing | `POST /api/cron/charge-subscriptions`, `POST /api/cron/reconcile-settlements` |
| Receipts | `GET /api/receipts/[id]/pdf`, `requestReceiptCorrection` |
| QR | `GET /api/missions/[id]/qr` |
| Messages | `sendMessage` action |
| Account | `deleteAccount` action |

모든 변경 API는 권한·감사 로그.

---

## 11. 알림 매트릭스

| 이벤트 | 수신자 | 채널 |
|--------|--------|------|
| 미션 승인/반려 | 선교사 | email + in-app |
| 새 후원 | 선교사 | email + in-app |
| 결제 성공 | 후원자 | email |
| 정기결제 실패 | 후원자 | email |
| 정기 자동 일시정지 | 후원자 | email |
| 새 Q&A | 선교사 | in-app |
| 새 메시지 | 상대방 | email + in-app |
| 신고 접수 | 관리자 | email / in-app |

수신 거부는 `notification_preferences`에 반영.

---

## 12. 보안 체크

- 결제·영수증·PII 페이지: 인증 필수
- 웹훅: 서명/IP 검증 + 멱등 + `webhook_events` 원본 보관
- 업로드: MIME/크기/멀웨어 스캔(가능 시)
- XSS: 미션 body sanitize
- CSRF: SameSite cookie + Better Auth 기본
- 탈퇴·파기: 법정 보존 원장과 PII 분리 처리
- 시크릿: ENV 커밋 금지, 로테이션 정책

---

## 13. 접근성 (a11y)

| 항목 | 요구(초안) |
|------|------------|
| 키보드 | 주요 CTA·폼·모달 키보드만으로 조작 가능 |
| 스크린리더 | 버튼/링크 `aria-label`, 폼 오류와 필드 연결 |
| 명도 대비 | WCAG 2.1 AA 목표 (본문·버튼) |
| 포커스 | 가시적 포커스 링, 모달 포커스 트랩 |
| 이미지 | `alt` 필수(장식 이미지는 빈 alt) |
| 언어 | `lang` / next-intl locale과 일치 |