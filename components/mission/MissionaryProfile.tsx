'use client'

import Image from 'next/image'
import { MapPin, CalendarDays } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface MissionaryProfileProps {
  name: string
  photo: string
  country: string
  organization: string
  sentYear: number
  bio: string
}

export function MissionaryProfile({
  name,
  photo,
  country,
  organization,
  sentYear,
  bio,
}: MissionaryProfileProps) {
  const t = useTranslations('mission')

  return (
    <div className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm">
      <h2 className="text-base font-semibold text-foreground mb-4">{t('missionaryIntro')}</h2>
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
          <Image
            src={photo}
            alt={t('missionaryPhotoAlt', { name })}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-lg leading-tight">
            {t('missionaryTitle', { name })}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-primary flex-shrink-0" />
              {t('sentTo', { country })}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays size={13} className="text-primary flex-shrink-0" />
              {t('sentYear', { year: sentYear })}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{organization}</p>
        </div>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed mt-4">{bio}</p>
    </div>
  )
}
