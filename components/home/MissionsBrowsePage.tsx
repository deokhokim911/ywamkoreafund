'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Navbar } from '../layout/Navbar'
import { MissionCard } from './MissionCard'
import { missionStore } from '@/lib/missionStore'
import type { Mission } from '@/lib/mock/missions'

const FILTER_KEYS = ['all', 'urgent', 'asia', 'africa'] as const

export function MissionsBrowsePage() {
  const t = useTranslations('home')
  const [activeFilter, setActiveFilter] = useState<(typeof FILTER_KEYS)[number]>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [missions, setMissions] = useState<Mission[]>(() => missionStore.getPublished())

  useEffect(() => {
    return missionStore.subscribe(() => {
      setMissions(missionStore.getPublished())
    })
  }, [])

  const filtered = useMemo(() => {
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{t('allMissionsTitle')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('allMissionsSubtitle')}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
          <p className="text-sm text-muted-foreground flex-1">
            {t('allMissionsCount', { count: filtered.length })}
          </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Search size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">{t('emptyTitle')}</p>
            <p className="text-sm mt-1">{t('emptyHint')}</p>
          </div>
        )}
      </main>
    </div>
  )
}
