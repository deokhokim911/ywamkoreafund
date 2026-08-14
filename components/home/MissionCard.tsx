'use client'

import Image from 'next/image'
import { Clock, MapPin, Users } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { formatMoney } from '@/lib/formatMoney'
import type { Mission } from '@/lib/mock/missions'

export type MissionCardData = Pick<
  Mission,
  | 'id'
  | 'slug'
  | 'title'
  | 'subtitle'
  | 'country'
  | 'missionaryName'
  | 'organization'
  | 'coverImage'
  | 'currentAmount'
  | 'goalAmount'
  | 'donorCount'
  | 'daysLeft'
  | 'isUrgent'
  | 'isFeatured'
>

export function MissionCard({ mission }: { mission: MissionCardData }) {
  const t = useTranslations('home')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const formatKRW = (amount: number) => formatMoney(amount, locale, tCommon)
  const percentage = Math.min(
    Math.round((mission.currentAmount / mission.goalAmount) * 100),
    100,
  )

  return (
    <Link
      href={`/m/${mission.slug}`}
      className="group bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Image
          src={mission.coverImage}
          alt={mission.title}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {mission.isUrgent && (
            <span className="bg-[oklch(0.78_0.14_80)] text-[oklch(0.20_0.05_80)] text-xs font-semibold px-2.5 py-1 rounded-full">
              {t('urgent')}
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="flex items-center gap-1 bg-foreground/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
            <MapPin size={11} />
            {mission.country}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <p className="text-xs text-muted-foreground font-medium">{mission.organization}</p>
        <h3 className="font-bold text-foreground text-sm leading-snug line-clamp-2 text-balance group-hover:text-primary transition-colors">
          {mission.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {t('missionary')}{' '}
          <span className="font-medium text-foreground">{mission.missionaryName}</span>
        </p>
        <div className="mt-auto pt-1">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="font-bold text-foreground">{formatKRW(mission.currentAmount)}</span>
            <span className="font-semibold text-primary text-xs">{percentage}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t('progressAria', { percent: percentage })}
            className="w-full h-2 bg-muted rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users size={11} className="text-primary" />
              {t('donorCount', { count: mission.donorCount })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-primary" />
              {t('daysLeft', { days: mission.daysLeft })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
