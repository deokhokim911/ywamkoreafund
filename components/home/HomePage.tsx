'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { Search, TrendingUp, Heart, Globe, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { Navbar } from '../layout/Navbar'
import { MissionCard, type MissionCardData } from './MissionCard'
import { DonationMarquee } from './DonationMarquee'
import { bannerStore, type BannerSlide } from '@/lib/bannerStore'

const MISSIONS: MissionCardData[] = [
  {
    id: '1',
    slug: 'thailand-literacy',
    title: '동남아시아 어린이 문해교육 및 복음화 사역',
    subtitle: '태국 북부 산간지역 미전도 종족 아이들과 함께하는 5년간의 사역 여정',
    country: '태국',
    missionaryName: '김소연',
    organization: '예수전도단 (YWAM Korea)',
    coverImage: '/mission-cover.png',
    currentAmount: 4_240_000,
    goalAmount: 8_000_000,
    donorCount: 134,
    daysLeft: 47,
    isFeatured: true,
  },
  {
    id: '2',
    slug: 'cambodia-bible',
    title: '캄보디아 청년 성경교육 및 리더십 훈련',
    subtitle: '캄보디아 시골 마을의 청년들을 다음 세대 리더로 세우는 사역',
    country: '캄보디아',
    missionaryName: '이준혁',
    organization: '인터콥 (Intercp)',
    coverImage: '/mission-cover-2.png',
    currentAmount: 2_100_000,
    goalAmount: 5_000_000,
    donorCount: 67,
    daysLeft: 23,
    isUrgent: true,
  },
  {
    id: '3',
    slug: 'myanmar-medical',
    title: '미얀마 분쟁 지역 의료 봉사 및 구호 사역',
    subtitle: '내전으로 피폐해진 미얀마 카렌주에 의료와 복음을 전하는 긴급 사역',
    country: '미얀마',
    missionaryName: '박지은·오민준',
    organization: '한국선교연구원 (KRIM)',
    coverImage: '/mission-cover-3.png',
    currentAmount: 6_800_000,
    goalAmount: 10_000_000,
    donorCount: 201,
    daysLeft: 12,
    isUrgent: true,
    isFeatured: true,
  },
  {
    id: '4',
    slug: 'mongolia-church',
    title: '몽골 초원 지역 교회 개척 및 현지 지도자 양성',
    subtitle: '유목민 공동체와 함께 살아가며 복음을 심는 장기 선교 사역',
    country: '몽골',
    missionaryName: '최성민',
    organization: '두란노해외선교회 (TIM)',
    coverImage: '/mission-cover-4.png',
    currentAmount: 1_500_000,
    goalAmount: 6_000_000,
    donorCount: 42,
    daysLeft: 61,
  },
]

const STATS = [
  { icon: TrendingUp, label: '총 모금액', value: '1억 4천만원+' },
  { icon: Heart, label: '후원자 수', value: '2,400명+' },
  { icon: Globe, label: '사역 국가', value: '18개국' },
]

const FILTERS = ['전체', '긴급', '아시아', '아프리카']

const FEATURED = MISSIONS.filter((m) => m.isFeatured)

export function HomePage() {
  const [activeFilter, setActiveFilter] = useState('전체')
  const [searchQuery, setSearchQuery] = useState('')

  // Banner carousel state — reads from shared store
  const [banners, setBanners] = useState<BannerSlide[]>(() =>
    bannerStore.get().filter((b) => b.isActive).sort((a, b) => a.order - b.order)
  )
  const [bannerIndex, setBannerIndex] = useState(0)

  // Subscribe to store updates (when admin edits banners)
  useEffect(() => {
    return bannerStore.subscribe(() => {
      setBanners(bannerStore.get().filter((b) => b.isActive).sort((a, b) => a.order - b.order))
      setBannerIndex(0)
    })
  }, [])

  // Auto-advance banner every 5 s
  const nextBanner = useCallback(() => {
    setBannerIndex((i) => (banners.length > 0 ? (i + 1) % banners.length : 0))
  }, [banners.length])
  useEffect(() => {
    if (banners.length <= 1) return
    const id = setInterval(nextBanner, 5000)
    return () => clearInterval(id)
  }, [nextBanner, banners.length])

  const prevBanner = () => setBannerIndex((i) => (i - 1 + banners.length) % banners.length)

  const activeBanner = banners[bannerIndex]

  const filtered = MISSIONS.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.title.includes(searchQuery) ||
      m.country.includes(searchQuery) ||
      m.missionaryName.includes(searchQuery)
    const matchesFilter =
      activeFilter === '전체' ||
      (activeFilter === '긴급' && m.isUrgent) ||
      (activeFilter === '아시아' && ['태국', '캄보디아', '미얀마', '몽골'].includes(m.country))
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Banner carousel ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-neutral-900 text-white h-[420px] md:h-[500px]">
        {/* Background image — full bleed, no colour tint */}
        {activeBanner?.imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={activeBanner.imageUrl}
              alt={activeBanner.title}
              fill
              className="object-cover"
              priority
              loading="eager"
              sizes="100vw"
            />
            {/* Lightweight dark scrim for text legibility only */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </div>
        )}

        <div className="relative h-full max-w-6xl mx-auto px-4 flex items-center pb-10">
          {banners.length > 0 && activeBanner ? (
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-3">
                예수전도단 선교 후원 플랫폼
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance mb-4 text-white">
                {activeBanner.title}
              </h1>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8">
                {activeBanner.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={activeBanner.ctaHref || '/mission'}
                  className="inline-flex items-center justify-center bg-white text-neutral-900 font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
                >
                  {activeBanner.ctaLabel || '자세히 보기'}
                </Link>
                {activeBanner.videoUrl && (
                  <a
                    href={activeBanner.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <Play size={15} />
                    영상 보기
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* Fallback when no active banners */
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-3">
                예수전도단 선교 후원 플랫폼
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance mb-4 text-white">
                선교사와 함께<br />세상을 바꿉니다
              </h1>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8">
                전 세계 현장에서 복음을 전하는 선교사들을 후원하세요.<br className="hidden md:block" />
                월 1만원으로도 한 아이의 삶이 달라집니다.
              </p>
              <Link
                href="/mission"
                className="inline-flex items-center justify-center bg-white text-neutral-900 font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
              >
                사역 자세히 보기
              </Link>
            </div>
          )}

          {/* Carousel controls */}
          {banners.length > 1 && (
            <div className="absolute bottom-6 right-4 flex items-center gap-3">
              {/* Dot indicators */}
              <div className="flex items-center gap-1.5">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setBannerIndex(i)}
                    aria-label={`슬라이드 ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === bannerIndex
                        ? 'w-5 h-2 bg-white'
                        : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
              {/* Prev / Next */}
              <button
                onClick={prevBanner}
                aria-label="이전 슬라이드"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextBanner}
                aria-label="다음 슬라이드"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Real-time donation marquee ───────────────────────────────────── */}
      <DonationMarquee />

      {/* Stats bar */}
      <section className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <stat.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured carousel ─────────────────────────────────────────────── */}
      {FEATURED.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pt-10 pb-2">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-foreground">추천 사역</h2>
            <p className="text-sm text-muted-foreground mt-0.5">담당자가 선정한 주목할 캠페인</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURED.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        </section>
      )}

      {/* ── All missions grid ─────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
          <h2 className="text-xl font-bold text-foreground flex-1">진행 중인 사역</h2>
          <div className="relative w-full sm:w-60">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="사역명, 국가, 선교사 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={
                activeFilter === f
                  ? 'flex-shrink-0 bg-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full transition-colors'
                  : 'flex-shrink-0 bg-muted text-muted-foreground text-sm font-medium px-4 py-1.5 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors'
              }
            >
              {f}
            </button>
          ))}
        </div>

        {/* Responsive card grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Search size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">검색 결과가 없습니다.</p>
            <p className="text-sm mt-1">다른 키워드로 검색해 보세요.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">예수전도단 (YWAM Korea)</p>
          <p>서울특별시 강서구 · 등록번호 123-45-67890 · 대표자: 홍길동</p>
          <p>기부금 영수증 발급 가능 단체 · 개인정보처리방침 · 이용약관</p>
        </div>
      </footer>
    </div>
  )
}
