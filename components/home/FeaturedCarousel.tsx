'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { MissionCard, type MissionCardData } from './MissionCard'

type FeaturedCarouselProps = {
  missions: MissionCardData[]
  subtitle: string
}

export const FeaturedCarousel = ({ missions, subtitle }: FeaturedCarouselProps) => {
  const t = useTranslations('home')
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateNav = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft < maxScroll - 8)

    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-carousel-item]'))
    if (cards.length === 0) return
    const center = el.scrollLeft + el.clientWidth / 2
    let nearest = 0
    let nearestDist = Number.POSITIVE_INFINITY
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(cardCenter - center)
      if (dist < nearestDist) {
        nearestDist = dist
        nearest = i
      }
    })
    setActiveIndex(nearest)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateNav()
    el.addEventListener('scroll', updateNav, { passive: true })
    window.addEventListener('resize', updateNav)
    return () => {
      el.removeEventListener('scroll', updateNav)
      window.removeEventListener('resize', updateNav)
    }
  }, [updateNav, missions.length])

  const handleScrollBy = (direction: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-carousel-item]')
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8
    el.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  const handleGoTo = (index: number) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelectorAll<HTMLElement>('[data-carousel-item]')[index]
    if (!card) return
    el.scrollTo({ left: card.offsetLeft - 4, behavior: 'smooth' })
  }

  if (missions.length === 0) return null

  return (
    <section className="max-w-6xl mx-auto px-4 pt-10 pb-2" aria-label={t('featuredTitle')}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t('featuredTitle')}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        {missions.length > 1 && (
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => handleScrollBy(-1)}
              disabled={!canPrev}
              aria-label={t('carouselPrev')}
              className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => handleScrollBy(1)}
              disabled={!canNext}
              aria-label={t('carouselNext')}
              className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-1 px-1 scrollbar-none"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={t('featuredTitle')}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            handleScrollBy(-1)
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            handleScrollBy(1)
          }
        }}
      >
        {missions.map((mission) => (
          <div
            key={mission.id}
            data-carousel-item
            className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
          >
            <MissionCard mission={mission} />
          </div>
        ))}
      </div>

      {missions.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4" role="tablist" aria-label={t('carouselDots')}>
          {missions.map((mission, i) => (
            <button
              key={mission.id}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={t('carouselGoTo', { index: i + 1 })}
              onClick={() => handleGoTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-5 h-2 bg-primary'
                  : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
