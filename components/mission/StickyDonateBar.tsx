'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { formatMoney } from '@/lib/formatMoney'

interface StickyDonateBarProps {
  missionTitle: string
  currentAmount: number
  goalAmount: number
  onDonateClick: () => void
}

export function StickyDonateBar({
  missionTitle,
  currentAmount,
  goalAmount,
  onDonateClick,
}: StickyDonateBarProps) {
  const t = useTranslations('mission')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const formatKRW = (amount: number) => formatMoney(amount, locale, tCommon)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const percentage = Math.min(Math.round((currentAmount / goalAmount) * 100), 100)

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-lg transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      role="complementary"
      aria-label={t('quickDonateAria')}
    >
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center gap-3 px-4 py-3 safe-area-pb">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{missionTitle}</p>
          <p className="text-sm font-bold text-foreground">
            {formatKRW(currentAmount)}{' '}
            <span className="text-primary font-semibold text-xs">
              {t('percentReached', { percent: percentage })}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={onDonateClick}
          className="flex-shrink-0 bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground font-bold text-sm px-5 py-3 rounded-xl transition-colors shadow-sm active:scale-95"
        >
          {t('donate')}
        </button>
      </div>
    </div>
  )
}
