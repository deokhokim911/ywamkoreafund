'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight, Play, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { useAuthStub } from '@/lib/auth-stub'
import { Navbar } from '../layout/Navbar'
import { MissionCard } from './MissionCard'
import { DonationMarquee } from './DonationMarquee'
import { FeaturedCarousel } from './FeaturedCarousel'
import { HomeStatsCards } from './HomeStatsCards'
import { RoleHomePanel } from './RoleHomePanel'
import { bannerStore, type BannerSlide } from '@/lib/bannerStore'
import { missionStore } from '@/lib/missionStore'
import type { Mission } from '@/lib/mock/missions'

const FILTER_KEYS = ['all', 'urgent', 'asia', 'africa'] as const
const ONGOING_LIMIT = 6
const FEATURED_LIMIT = 5

export function HomePage() {
  const t = useTranslations('home')
  const { role } = useAuthStub()
  const [activeFilter, setActiveFilter] = useState<(typeof FILTER_KEYS)[number]>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [missions, setMissions] = useState<Mission[]>(() => missionStore.getPublished())

  const [banners, setBanners] = useState<BannerSlide[]>(() =>
    bannerStore.get().filter((b) => b.isActive).sort((a, b) => a.order - b.order),
  )
  const [bannerIndex, setBannerIndex] = useState(0)

  useEffect(() => {
    const unsubBanner = bannerStore.subscribe(() => {
      setBanners(bannerStore.get().filter((b) => b.isActive).sort((a, b) => a.order - b.order))
      setBannerIndex(0)
    })
    const unsubMission = missionStore.subscribe(() => {
      setMissions(missionStore.getPublished())
    })
    return () => {
      unsubBanner()
      unsubMission()
    }
  }, [])

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
  const featured = useMemo(
    () => missions.filter((m) => m.isFeatured).slice(0, FEATURED_LIMIT),
    [missions],
  )

  const matchedMissions = useMemo(() => {
    return missions.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.title.includes(searchQuery) ||
        m.country.includes(searchQuery) ||
        m.missionaryName.includes(searchQuery)
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'urgent' && m.isUrgent) ||
        (activeFilter === 'asia' &&
          ['태국', '캄보디아', '미얀마', '몽골', '필리핀', '네팔'].includes(m.country)) ||
        (activeFilter === 'africa' && false)
      return matchesSearch && matchesFilter
    })
  }, [missions, searchQuery, activeFilter])

  const filtered = matchedMissions.slice(0, ONGOING_LIMIT)

  const showMarquee = role === 'guest' || role === 'donor'
  const showFeatured = role === 'guest' || role === 'donor' || role === 'admin'
  const showMyCampaign = role === 'missionary'

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Banner carousel ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pt-4 md:pt-6">
        <section className="relative overflow-hidden rounded-2xl bg-neutral-900 text-white h-[360px] md:h-[460px]">
          {activeBanner?.imageUrl && (
            <div className="absolute inset-0">
              <Image
                src={activeBanner.imageUrl}
                alt={activeBanner.title}
                fill
                className="object-cover"
                priority
                loading="eager"
                sizes="(max-width: 1152px) 100vw, 1152px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            </div>
          )}

          <div className="relative h-full px-5 md:px-8 flex items-center pb-10">
            {banners.length > 0 && activeBanner ? (
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-3">
                  YWAMKOREAFUND
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
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-3">
                  YWAMKOREAFUND
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

            {banners.length > 1 && (
              <div className="absolute bottom-5 right-5 flex items-center gap-3">
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
      </div>

      {/* ── Role panel (reacts to demo role combo) ────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <RoleHomePanel role={role} />
      </div>

      {showMarquee && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <DonationMarquee />
        </div>
      )}

      {/* Stats cards */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <HomeStatsCards />
      </div>

      {showFeatured && featured.length > 0 && (
        <FeaturedCarousel
          missions={featured}
          subtitle={role === 'admin' ? t('featuredSubtitleAdmin') : t('featuredSubtitle')}
        />
      )}

      {showMyCampaign && (
        <section className="max-w-6xl mx-auto px-4 pt-10 pb-2">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-foreground">{t('myCampaignTitle')}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{t('myCampaignSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {missions.slice(0, 1).map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        </section>
      )}

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-foreground">
              {role === 'missionary'
                ? t('otherMissionsTitle')
                : role === 'admin'
                  ? t('adminMissionsTitle')
                  : t('ongoingTitle')}
            </h2>
            <Link
              href="/missions"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              {t('viewAll')}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="relative w-full sm:w-60">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="search"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              aria-label={t('searchPlaceholder')}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
          {FILTER_KEYS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={
                activeFilter === f
                  ? 'flex-shrink-0 bg-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full transition-colors'
                  : 'flex-shrink-0 bg-muted text-muted-foreground text-sm font-medium px-4 py-1.5 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors'
              }
            >
              {t(`filters.${f}`)}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                href="/missions"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                {t('viewAllCta', { count: missions.length })}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Search size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">{t('emptyTitle')}</p>
            <p className="text-sm mt-1">{t('emptyHint')}</p>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-8 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">YWAMKOREAFUND · 예수전도단</p>
          <p>서울특별시 강서구 · 등록번호 123-45-67890 · 대표자: 홍길동</p>
          <p>기부금 영수증 발급 가능 단체 · 개인정보처리방침 · 이용약관</p>
        </div>
      </footer>
    </div>
  )
}
