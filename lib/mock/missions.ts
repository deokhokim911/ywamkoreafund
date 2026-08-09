export type MissionStatus = 'pending_review' | 'published' | 'rejected'

export type Mission = {
  id: string
  slug: string
  status: MissionStatus
  title: string
  subtitle: string
  body: string
  country: string
  missionaryName: string
  missionaryPhoto: string
  missionaryBio: string
  organization: string
  sentYear: number
  coverImage: string
  currentAmount: number
  goalAmount: number
  donorCount: number
  daysLeft: number
  isUrgent?: boolean
  isFeatured?: boolean
  updates: Array<{ date: string; title: string; content: string }>
  createdAt: string
}

export const SEED_MISSIONS: Mission[] = [
  {
    id: '1',
    slug: 'thailand-literacy',
    status: 'published',
    title: '동남아시아 어린이 문해교육 및 복음화 사역',
    subtitle: '태국 북부 산간지역 미전도 종족 아이들과 함께하는 5년간의 사역 여정',
    body: `태국 북부 치앙라이 인근 산간 지역에는 국적 미등록 상태로 교육 기회를 전혀 받지 못하는 소수 민족 어린이 수천 명이 살고 있습니다. 이들 중 상당수는 글을 읽지 못하며, 이는 복음 접근과 삶의 변화에 가장 큰 장벽이 됩니다.

본 사역은 지역 교회와 협력하여 이 어린이들에게 태국어 및 모국어 문해 교육을 무상 제공하고, 삶의 현장에서 복음을 나누는 사역입니다.`,
    country: '태국',
    missionaryName: '김소연',
    missionaryPhoto: '/missionary-profile.png',
    missionaryBio:
      '안녕하세요, 태국 치앙라이에서 사역 중인 김소연 선교사입니다. 북부 산간 지역의 아카족과 라후족 어린이들에게 문해 교육과 복음을 전하고 있습니다.',
    organization: '예수전도단 (YWAM Korea)',
    sentYear: 2019,
    coverImage: '/mission-cover.png',
    currentAmount: 4_240_000,
    goalAmount: 8_000_000,
    donorCount: 134,
    daysLeft: 47,
    isFeatured: true,
    updates: [
      {
        date: '2025년 6월 22일',
        title: '새 마을 학습공동체 시작',
        content: '나코무앙 마을에서 17명의 아이들과 새 학습공동체가 시작되었습니다.',
      },
      {
        date: '2025년 4월 8일',
        title: '도서관 개관식',
        content: '반파쿤 마을 작은 도서관이 문을 열었습니다. 후원자 여러분 덕분에 책 120권이 비치되었습니다.',
      },
    ],
    createdAt: '2026-06-01T00:00:00.000Z',
  },
  {
    id: '2',
    slug: 'cambodia-bible',
    status: 'published',
    title: '캄보디아 청년 성경교육 및 리더십 훈련',
    subtitle: '캄보디아 시골 마을의 청년들을 다음 세대 리더로 세우는 사역',
    body: '캄보디아 시골 마을 청년들에게 성경 교육과 리더십 훈련을 제공합니다.',
    country: '캄보디아',
    missionaryName: '이준혁',
    missionaryPhoto: '/missionary-profile.png',
    missionaryBio: '캄보디아에서 청년 사역 중인 이준혁 선교사입니다.',
    organization: '인터콥 (Intercp)',
    sentYear: 2020,
    coverImage: '/mission-cover-2.png',
    currentAmount: 2_100_000,
    goalAmount: 5_000_000,
    donorCount: 67,
    daysLeft: 23,
    isUrgent: true,
    isFeatured: true,
    updates: [],
    createdAt: '2026-06-10T00:00:00.000Z',
  },
  {
    id: '3',
    slug: 'myanmar-medical',
    status: 'published',
    title: '미얀마 분쟁 지역 의료 봉사 및 구호 사역',
    subtitle: '내전으로 피폐해진 미얀마 카렌주에 의료와 복음을 전하는 긴급 사역',
    body: '미얀마 카렌주 긴급 의료·구호 사역입니다.',
    country: '미얀마',
    missionaryName: '박지은·오민준',
    missionaryPhoto: '/missionary-profile.png',
    missionaryBio: '미얀마에서 의료 봉사 중인 박지은·오민준 선교사입니다.',
    organization: '한국선교연구원 (KRIM)',
    sentYear: 2018,
    coverImage: '/mission-cover-3.png',
    currentAmount: 6_800_000,
    goalAmount: 10_000_000,
    donorCount: 201,
    daysLeft: 12,
    isUrgent: true,
    isFeatured: true,
    updates: [],
    createdAt: '2026-06-15T00:00:00.000Z',
  },
  {
    id: '4',
    slug: 'mongolia-church',
    status: 'published',
    title: '몽골 초원 지역 교회 개척 및 현지 지도자 양성',
    subtitle: '유목민 공동체와 함께 살아가며 복음을 심는 장기 선교 사역',
    body: '몽골 초원 지역 교회 개척 사역입니다.',
    country: '몽골',
    missionaryName: '최성민',
    missionaryPhoto: '/missionary-profile.png',
    missionaryBio: '몽골에서 교회 개척 중인 최성민 선교사입니다.',
    organization: '두란노해외선교회 (TIM)',
    sentYear: 2017,
    coverImage: '/mission-cover-4.png',
    currentAmount: 1_500_000,
    goalAmount: 6_000_000,
    donorCount: 42,
    daysLeft: 61,
    isFeatured: true,
    updates: [],
    createdAt: '2026-06-20T00:00:00.000Z',
  },
  {
    id: '5',
    slug: 'philippines-youth',
    status: 'published',
    title: '필리핀 도시 빈민가 청소년 직업훈련 사역',
    subtitle: '마닐라 슬럼 청소년에게 기술 교육과 복음을 전하는 사역',
    body: '필리핀 마닐라 도시 빈민가 청소년을 위한 직업훈련과 제자훈련 사역입니다.',
    country: '필리핀',
    missionaryName: '한지우',
    missionaryPhoto: '/missionary-profile.png',
    missionaryBio: '필리핀 마닐라에서 청소년 사역 중인 한지우 선교사입니다.',
    organization: '예수전도단 (YWAM Korea)',
    sentYear: 2021,
    coverImage: '/mission-cover.png',
    currentAmount: 3_200_000,
    goalAmount: 7_000_000,
    donorCount: 89,
    daysLeft: 38,
    isFeatured: true,
    updates: [],
    createdAt: '2026-06-25T00:00:00.000Z',
  },
  {
    id: '6',
    slug: 'nepal-church',
    status: 'published',
    title: '네팔 히말라야 산간 마을 교회 개척',
    subtitle: '접근이 어려운 산간 지역에 예배 공동체를 세우는 장기 사역',
    body: '네팔 산간 마을에서 현지 리더와 함께 교회를 개척하는 사역입니다.',
    country: '네팔',
    missionaryName: '서유진',
    missionaryPhoto: '/missionary-profile.png',
    missionaryBio: '네팔에서 교회 개척 중인 서유진 선교사입니다.',
    organization: '두란노해외선교회 (TIM)',
    sentYear: 2016,
    coverImage: '/mission-cover-2.png',
    currentAmount: 980_000,
    goalAmount: 4_500_000,
    donorCount: 31,
    daysLeft: 72,
    updates: [],
    createdAt: '2026-07-01T00:00:00.000Z',
  },
]

export const SEED_DONORS = [
  { id: '1', name: '이수현', amount: 50_000, message: '선교사님 건강 챙기시고 화이팅!', timeAgo: '1시간 전', isRecurring: true },
  { id: '2', name: '박지훈', amount: 30_000, message: '아이들에게 빛을 전해주세요.', timeAgo: '3시간 전', isRecurring: false },
  { id: '3', name: '김민지', amount: 100_000, message: '', timeAgo: '어제', isRecurring: true },
  { id: '4', name: '최유진', amount: 10_000, message: '작은 정성이지만 응원해요!', timeAgo: '2일 전', isRecurring: false },
]

export const slugify = (title: string): string => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 48)
  return base || `mission-${Date.now()}`
}
