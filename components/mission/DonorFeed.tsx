'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { formatMoney } from '@/lib/formatMoney'

interface DonorEntry {
  id: string
  name: string
  amount: number
  message?: string
  timeAgo: string
  isRecurring?: boolean
}

interface DonorFeedProps {
  donors: DonorEntry[]
}

function getInitial(name: string): string {
  return name.charAt(0)
}

const avatarColors = [
  'bg-teal-100 text-teal-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
]

export function DonorFeed({ donors }: DonorFeedProps) {
  const t = useTranslations('mission')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const formatKRW = (amount: number) => formatMoney(amount, locale, tCommon)
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? donors : donors.slice(0, 5)

  return (
    <div className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">{t('recentDonors')}</h2>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {t('totalDonors', { count: donors.length })}
        </span>
      </div>
      <ul className="space-y-3">
        {visible.map((donor, i) => (
          <li key={donor.id} className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${avatarColors[i % avatarColors.length]}`}
              aria-hidden="true"
            >
              {getInitial(donor.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-sm text-foreground">{donor.name}</span>
                {donor.isRecurring && (
                  <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                    {t('recurringBadge')}
                  </span>
                )}
                <span className="text-sm font-bold text-primary ml-auto flex-shrink-0">
                  {formatKRW(donor.amount)}
                </span>
              </div>
              {donor.message && (
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                  {donor.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground/60 mt-0.5">{donor.timeAgo}</p>
            </div>
          </li>
        ))}
      </ul>
      {donors.length > 5 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 w-full text-sm text-primary hover:text-[oklch(0.44_0.12_195)] font-medium py-2 border border-primary/30 rounded-xl hover:bg-primary/5 transition-colors"
        >
          {expanded ? t('showLess') : t('showMore', { count: donors.length - 5 })}
        </button>
      )}

      <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-border">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <span className="text-xs text-muted-foreground">{t('liveUpdating')}</span>
      </div>
    </div>
  )
}
