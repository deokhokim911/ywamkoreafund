'use client'

import { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'

interface DonationEvent {
  id: string
  donor: string
  campaign: string
  amount: number
  country: string
  timestamp: Date
}

// Simulated real-time feed — in production replace with WebSocket / SSE
const SEED_EVENTS: Omit<DonationEvent, 'id' | 'timestamp'>[] = [
  { donor: '김**',   campaign: '태국 어린이 문해교육', amount: 30_000,  country: '🇰🇷' },
  { donor: '이**',   campaign: '캄보디아 성경교육',   amount: 50_000,  country: '🇰🇷' },
  { donor: '박**',   campaign: '미얀마 의료 봉사',    amount: 100_000, country: '🇺🇸' },
  { donor: '최**',   campaign: '몽골 교회 개척',      amount: 20_000,  country: '🇯🇵' },
  { donor: '정**',   campaign: '태국 어린이 문해교육', amount: 50_000,  country: '🇰🇷' },
  { donor: '강**',   campaign: '미얀마 의료 봉사',    amount: 200_000, country: '🇦🇺' },
  { donor: '조**',   campaign: '캄보디아 성경교육',   amount: 10_000,  country: '🇰🇷' },
  { donor: '윤**',   campaign: '몽골 교회 개척',      amount: 30_000,  country: '🇸🇬' },
  { donor: '장**',   campaign: '태국 어린이 문해교육', amount: 50_000,  country: '🇰🇷' },
  { donor: '임**',   campaign: '미얀마 의료 봉사',    amount: 100_000, country: '🇨🇦' },
]

function makeEvent(seed: Omit<DonationEvent, 'id' | 'timestamp'>, index: number): DonationEvent {
  return { ...seed, id: `init-${index}`, timestamp: new Date(Date.now() - index * 45_000) }
}

function formatAmount(n: number) {
  return n >= 10_000
    ? `${(n / 10_000).toLocaleString('ko-KR')}만원`
    : `${n.toLocaleString('ko-KR')}원`
}

function timeAgo(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000)
  if (s < 60)  return `${s}초 전`
  if (s < 3600) return `${Math.floor(s / 60)}분 전`
  return `${Math.floor(s / 3600)}시간 전`
}

export function DonationMarquee() {
  const [events, setEvents] = useState<DonationEvent[]>(() =>
    SEED_EVENTS.map((s, i) => makeEvent(s, i))
  )
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // Add a new random event every 8 s to simulate incoming donations
  useEffect(() => {
    const id = setInterval(() => {
      const seed = SEED_EVENTS[Math.floor(Math.random() * SEED_EVENTS.length)]
      const fresh: DonationEvent = {
        ...seed,
        id: `live-${Date.now()}`,
        timestamp: new Date(),
        // Slightly randomise amount ±10 %
        amount: Math.round(seed.amount * (0.9 + Math.random() * 0.2) / 10_000) * 10_000,
      }
      setEvents((prev) => [fresh, ...prev.slice(0, 29)])
    }, 8_000)
    return () => clearInterval(id)
  }, [])

  // Duplicate items so the scroll loop is seamless
  const items = [...events, ...events]

  return (
    <div
      className="overflow-hidden relative rounded-2xl bg-primary/5 border border-primary/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[oklch(0.97_0.01_195)] to-transparent z-10 pointer-events-none rounded-l-2xl" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[oklch(0.97_0.01_195)] to-transparent z-10 pointer-events-none rounded-r-2xl" />

      {/* Label pill */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        LIVE
      </div>

      <div
        ref={trackRef}
        className="flex items-center gap-0 pl-28"
        style={{
          animation: paused ? 'none' : 'marquee 60s linear infinite',
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {items.map((ev, i) => (
          <div
            key={`${ev.id}-${i}`}
            className="flex-none flex items-center gap-2 px-5 py-2.5 border-r border-primary/10"
          >
            <Heart size={12} className="text-rose-500 fill-rose-500 flex-shrink-0" />
            <span className="text-sm text-foreground whitespace-nowrap">
              <span className="font-semibold">{ev.country} {ev.donor}</span>
              {' 님이 '}
              <span className="text-primary font-semibold">{ev.campaign}</span>
              {' 에 '}
              <span className="font-bold text-foreground">{formatAmount(ev.amount)}</span>
              {' 후원'}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
              {timeAgo(ev.timestamp)}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
