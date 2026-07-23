'use client'

import { useState } from 'react'
import { MissionHero } from './MissionHero'
import { FundingProgress } from './FundingProgress'
import { MissionaryProfile } from './MissionaryProfile'
import { MissionBody } from './MissionBody'
import { DonorFeed } from './DonorFeed'
import { StickyDonateBar } from './StickyDonateBar'
import { DonationModal } from '../donation/DonationModal'
import { Navbar } from '../layout/Navbar'

const MISSION_DATA = {
  title: '동남아시아 어린이 문해교육 및 복음화 사역',
  subtitle: '태국 북부 산간지역 미전도 종족 아이들과 함께하는 5년간의 사역 여정',
  organization: '예수전도단 (YWAM Korea)',
  coverImage: '/mission-cover.png',
  currentAmount: 4_240_000,
  goalAmount: 8_000_000,
  donorCount: 134,
  daysLeft: 47,
}

const MISSIONARY_DATA = {
  name: '김소연',
  photo: '/missionary-profile.png',
  country: '태국',
  organization: '예수전도단 (YWAM Korea) 태국 지부',
  sentYear: 2019,
  bio:
    '안녕하세요, 태국 치앙라이에서 사역 중인 김소연 선교사입니다. 북부 산간 지역의 아카족과 라후족 어린이들에게 문해 교육과 복음을 전하고 있습니다. 2019년 파송 이후 지역 교회 3곳과 파트너십을 맺어 매주 100명 이상의 어린이들을 섬기고 있습니다. 여러분의 후원이 이 아이들의 미래를 바꾸고 있습니다.',
}

const MISSION_DESCRIPTION = `태국 북부 치앙라이 인근 산간 지역에는 국적 미등록 상태로 교육 기회를 전혀 받지 못하는 소수 민족 어린이 수천 명이 살고 있습니다. 이들 중 상당수는 글을 읽지 못하며, 이는 복음 접근과 삶의 변화에 가장 큰 장벽이 됩니다.

본 사역은 지역 교회와 협력하여 이 어린이들에게 태국어 및 모국어 문해 교육을 무상 제공하고, 삶의 현장에서 복음을 나누는 사역입니다. 현재까지 3개 마을에서 소규모 학습공동체를 운영하고 있으며, 더 많은 마을로 확장하기 위한 재정적 지원이 필요합니다.

이번 모금을 통해 교재 제작, 교사 훈련, 마을 이동 교통비, 그리고 소규모 도서관 설치를 목표로 하고 있습니다. 아이들의 눈에서 빛이 나는 순간, 그 기쁨을 여러분과 함께 나누고 싶습니다.`

const MISSION_UPDATES = [
  {
    date: '2025년 6월 22일',
    title: '새 마을 학습공동체 시작',
    content: '나코무앙 마을에서 17명의 아이들과 새 학습공동체가 시작되었습니다. 첫날 아이들의 열정이 정말 놀라웠어요.',
  },
  {
    date: '2025년 4월 8일',
    title: '도서관 개관식',
    content: '반파쿤 마을 작은 도서관이 문을 열었습니다. 후원자 여러분 덕분에 책 120권이 비치되었고, 매일 아이들이 찾아옵니다.',
  },
  {
    date: '2025년 1월 15일',
    title: '2025년 사역 계획 공유',
    content: '올해는 3개 마을에서 5개 마을로 사역을 확장할 계획입니다. 교사 2명을 추가 훈련하여 더 많은 어린이를 섬기겠습니다.',
  },
]

const DONORS = [
  { id: '1', name: '이수현', amount: 50_000, message: '선교사님 건강 챙기시고 화이팅!', timeAgo: '1시간 전', isRecurring: true },
  { id: '2', name: '박지훈', amount: 30_000, message: '아이들에게 빛을 전해주세요.', timeAgo: '3시간 전', isRecurring: false },
  { id: '3', name: '김민지', amount: 100_000, message: '', timeAgo: '어제', isRecurring: true },
  { id: '4', name: '최유진', amount: 10_000, message: '작은 정성이지만 응원해요!', timeAgo: '2일 전', isRecurring: false },
  { id: '5', name: '정성훈', amount: 50_000, message: '매달 함께할게요.', timeAgo: '3일 전', isRecurring: true },
  { id: '6', name: '안서연', amount: 30_000, message: '', timeAgo: '4일 전', isRecurring: false },
  { id: '7', name: '오동현', amount: 20_000, message: '아이들을 위해 기도합니다.', timeAgo: '5일 전', isRecurring: false },
  { id: '8', name: '황미래', amount: 50_000, message: '선교사님 사역 응원해요!', timeAgo: '6일 전', isRecurring: true },
]

export function MissionPage() {
  const [donationOpen, setDonationOpen] = useState(false)

  return (
    <>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <MissionHero
          coverImage={MISSION_DATA.coverImage}
          title={MISSION_DATA.title}
          subtitle={MISSION_DATA.subtitle}
          organization={MISSION_DATA.organization}
          onShareClick={() => {
            if (navigator.share) {
              navigator.share({ title: MISSION_DATA.title, url: window.location.href })
            }
          }}
        />

        {/* Main content */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left / main column */}
            <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
              <MissionaryProfile {...MISSIONARY_DATA} />
              <MissionBody
                description={MISSION_DESCRIPTION}
                updates={MISSION_UPDATES}
              />
            </div>

            {/* Right / sidebar */}
            <div className="space-y-5 order-1 lg:order-2">
              <FundingProgress
                currentAmount={MISSION_DATA.currentAmount}
                goalAmount={MISSION_DATA.goalAmount}
                donorCount={MISSION_DATA.donorCount}
                daysLeft={MISSION_DATA.daysLeft}
                onDonateClick={() => setDonationOpen(true)}
              />
              <DonorFeed donors={DONORS} />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-12 py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">예수전도단 (YWAM Korea)</p>
            <p>서울특별시 강서구 등록번호 123-45-67890 · 대표자: 홍길동</p>
            <p>기부금 영수증 발급 가능 단체 · 개인정보처리방침 · 이용약관</p>
          </div>
        </footer>
      </div>

      {/* Sticky bottom bar (mobile only) */}
      <StickyDonateBar
        missionTitle={MISSION_DATA.title}
        currentAmount={MISSION_DATA.currentAmount}
        goalAmount={MISSION_DATA.goalAmount}
        onDonateClick={() => setDonationOpen(true)}
      />

      {/* Donation modal */}
      <DonationModal
        open={donationOpen}
        missionTitle={MISSION_DATA.title}
        missionaryName={MISSIONARY_DATA.name}
        onClose={() => setDonationOpen(false)}
      />
    </>
  )
}
