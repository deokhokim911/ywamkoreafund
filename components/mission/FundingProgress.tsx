'use client'

import { Users, Clock, TrendingUp } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { formatMoney } from '@/lib/formatMoney'

interface FundingProgressProps {
  currentAmount: number
  goalAmount: number
  donorCount: number
  daysLeft: number
  onDonateClick: () => void
}

export function FundingProgress({
  currentAmount,
  goalAmount,
  donorCount,
  daysLeft,
  onDonateClick,
}: FundingProgressProps) {
  const t = useTranslations('mission')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const formatKRW = (amount: number) => formatMoney(amount, locale, tCommon)
  const percentage = Math.min(Math.round((currentAmount / goalAmount) * 100), 100)

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-5 md:p-6">
      <div className="mb-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-2xl md:text-3xl font-bold text-foreground">
              {formatKRW(currentAmount)}
            </span>
            <span className="text-muted-foreground text-sm ml-2">
              {t('goal', { amount: formatKRW(goalAmount) })}
            </span>
          </div>
          <span className="text-primary font-bold text-lg">{percentage}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('progressAria', { percent: percentage })}
          className="w-full h-3 bg-muted rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-primary" />
          <span>
            {t('donorCount', { count: donorCount.toLocaleString() })}
          </span>
        </div>
        <div className="w-px h-3.5 bg-border" />
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-primary" />
          <span>{t('daysLeft', { days: daysLeft })}</span>
        </div>
        <div className="w-px h-3.5 bg-border" />
        <div className="flex items-center gap-1.5">
          <TrendingUp size={14} className="text-primary" />
          <span>{t('fundraising')}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onDonateClick}
        className="w-full bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground font-bold text-base py-4 rounded-xl transition-colors shadow-sm active:scale-[0.99]"
      >
        {t('donate')}
      </button>

      <p className="text-center text-xs text-muted-foreground mt-3">{t('receiptNote')}</p>
    </div>
  )
}
