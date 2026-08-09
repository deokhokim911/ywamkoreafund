'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Globe2, HeartHandshake, Landmark, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

const useCountUp = (target: number, durationMs = 1200) => {
  const [value, setValue] = useState(target)

  useEffect(() => {
    let frame = 0
    let cancelled = false
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      setValue(target)
      return
    }

    setValue(0)
    const start = performance.now()

    const tick = (now: number) => {
      if (cancelled) return
      const t = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(target * eased)
      if (t < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [target, durationMs])

  return value
}

const DonutGauge = ({
  percent,
  color,
  track = 'oklch(0.93 0.01 195)',
  size = 92,
  stroke = 10,
  sublabel,
}: {
  percent: number
  color: string
  track?: string
  size?: number
  stroke?: number
  sublabel: string
}) => {
  const animated = useCountUp(percent, 1000)
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (animated / 100) * c

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1">
        <span className="text-lg font-bold tabular-nums text-foreground leading-none">
          {Math.round(animated)}%
        </span>
        <span className="mt-1 text-[11px] font-medium text-muted-foreground leading-tight">
          {sublabel}
        </span>
      </div>
    </div>
  )
}

const SplitBar = ({
  leftPct,
  leftColor,
  rightColor,
  leftLabel,
  rightLabel,
}: {
  leftPct: number
  leftColor: string
  rightColor: string
  leftLabel: string
  rightLabel: string
}) => (
  <div>
    <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
      <div
        className="stats-progress-bar h-full"
        style={{ width: `${leftPct}%`, background: leftColor }}
      />
      <div
        className="stats-progress-bar h-full"
        style={{
          width: `${100 - leftPct}%`,
          background: rightColor,
          animationDelay: '120ms',
        }}
      />
    </div>
    <div className="mt-2 flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ background: leftColor }} aria-hidden="true" />
        {leftLabel}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ background: rightColor }} aria-hidden="true" />
        {rightLabel}
      </span>
    </div>
  </div>
)

const MiniBars = ({ values, color, labels }: { values: number[]; color: string; labels: string[] }) => {
  const max = Math.max(...values)
  return (
    <div className="flex h-14 items-end gap-1.5" aria-hidden="true">
      {values.map((v, i) => (
        <div key={`bar-${i}`} className="flex flex-1 flex-col items-center gap-1">
          <div className="relative flex h-10 w-full items-end justify-center">
            <div
              className="stats-bar-grow w-[70%] max-w-4 rounded-t-sm"
              style={{
                height: `${Math.max(18, (v / max) * 100)}%`,
                background: color,
                animationDelay: `${i * 50}ms`,
              }}
            />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

const MetricBox = ({
  label,
  value,
  accent,
  center,
}: {
  label: string
  value: string
  accent: string
  center?: boolean
}) => (
  <div
    className={`rounded-xl bg-background/80 px-3 py-2.5 ring-1 ring-border/60 ${center ? 'text-center' : ''}`}
  >
    <p className="text-xs text-muted-foreground leading-snug">{label}</p>
    <p className="mt-0.5 text-base font-bold tabular-nums" style={{ color: accent }}>
      {value}
    </p>
  </div>
)

const CardShell = ({
  index,
  accent,
  accentSoft,
  icon: Icon,
  live,
  badge,
  children,
}: {
  index: number
  accent: string
  accentSoft: string
  icon: LucideIcon
  live: string
  badge: string
  children: ReactNode
}) => (
  <article
    className="stats-card group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    style={{ animationDelay: `${index * 90}ms` }}
  >
    <div
      className="pointer-events-none absolute inset-0"
      style={{ background: `linear-gradient(165deg, ${accentSoft} 0%, transparent 50%)` }}
      aria-hidden="true"
    />
    <div className="relative">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: accent }}
          >
            <Icon size={18} aria-hidden="true" />
          </div>
          <p className="truncate text-sm font-semibold text-muted-foreground">{badge}</p>
        </div>
        <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground/70">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ background: accent }}
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          </span>
          {live}
        </span>
      </div>
      {children}
    </div>
  </article>
)

export const HomeStatsCards = () => {
  const t = useTranslations('home.stats')
  const raised = useCountUp(140, 1200)
  const donors = useCountUp(2400, 1300)
  const countries = useCountUp(18, 1000)

  const teal = 'oklch(0.52 0.12 195)'
  const tealSoft = 'oklch(0.94 0.04 195)'
  const coral = 'oklch(0.58 0.16 25)'
  const coralSoft = 'oklch(0.96 0.04 25)'
  const green = 'oklch(0.55 0.11 160)'
  const greenSoft = 'oklch(0.94 0.04 160)'
  const amber = 'oklch(0.78 0.14 80)'

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label={t('sectionLabel')}>
      <CardShell
        index={0}
        accent={teal}
        accentSoft={tealSoft}
        icon={Landmark}
        live={t('live')}
        badge={t('raisedHint')}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-3xl md:text-4xl font-bold tracking-tight tabular-nums text-foreground">
              ₩{Math.round(raised)}M+
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">{t('raised')}</p>
            <p className="mt-1 text-xs font-bold" style={{ color: teal }}>
              {t('raisedDelta')} · {t('raisedMonth')}
            </p>
          </div>
          <DonutGauge percent={68} color={teal} sublabel={t('raisedGoal')} />
        </div>
        <div className="mt-5">
          <SplitBar
            leftPct={62}
            leftColor={teal}
            rightColor={amber}
            leftLabel={t('raisedOnce')}
            rightLabel={t('raisedRecurring')}
          />
        </div>
        <div className="mt-4">
          <MiniBars
            values={[42, 48, 45, 58, 62, 76]}
            color={teal}
            labels={t('raisedMonths').split(',')}
          />
        </div>
      </CardShell>

      <CardShell
        index={1}
        accent={coral}
        accentSoft={coralSoft}
        icon={HeartHandshake}
        live={t('live')}
        badge={t('donorsHint')}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-3xl md:text-4xl font-bold tracking-tight tabular-nums text-foreground">
              {Math.round(donors).toLocaleString()}+
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">{t('donors')}</p>
            <p className="mt-1 text-xs font-bold" style={{ color: coral }}>
              {t('donorsDelta')} {t('donorsWeek')}
            </p>
          </div>
          <DonutGauge
            percent={16}
            color={coral}
            track="oklch(0.94 0.02 25)"
            sublabel={t('donorsRecurringLabel')}
          />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <MetricBox label={t('donorsRecurring')} value="380" accent={coral} />
          <MetricBox label={t('donorsAvg')} value="₩58K" accent={coral} />
        </div>
        <div className="mt-4">
          <SplitBar
            leftPct={16}
            leftColor={coral}
            rightColor="oklch(0.82 0.06 25)"
            leftLabel={t('donorsRecurringShort')}
            rightLabel={t('donorsOnceShort')}
          />
        </div>
      </CardShell>

      <CardShell
        index={2}
        accent={green}
        accentSoft={greenSoft}
        icon={Globe2}
        live={t('live')}
        badge={t('countriesHint')}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-3xl md:text-4xl font-bold tracking-tight tabular-nums text-foreground">
              {Math.round(countries)}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">{t('countries')}</p>
            <p className="mt-1 text-xs font-bold" style={{ color: green }}>
              {t('countriesDelta')} {t('countriesNew')}
            </p>
          </div>
          <DonutGauge
            percent={55}
            color={green}
            track="oklch(0.93 0.02 160)"
            sublabel={t('countriesCoverage')}
          />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <MetricBox label={t('countriesMissionaries')} value="42" accent={green} center />
          <MetricBox label={t('countriesCampaigns')} value="6" accent={green} center />
          <MetricBox label={t('countriesUrgent')} value="2" accent={green} center />
        </div>
        <div className="mt-4">
          <SplitBar
            leftPct={72}
            leftColor={green}
            rightColor="oklch(0.78 0.08 200)"
            leftLabel={t('countriesAsia')}
            rightLabel={t('countriesOther')}
          />
        </div>
      </CardShell>
    </section>
  )
}
