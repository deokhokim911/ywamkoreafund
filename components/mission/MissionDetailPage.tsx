'use client'

import { useMemo, useState } from 'react'
import { notFound } from 'next/navigation'
import QRCode from 'react-qr-code'

import { DonationModal } from '@/components/donation/DonationModal'
import { Navbar } from '@/components/layout/Navbar'
import { DonorFeed } from '@/components/mission/DonorFeed'
import { FundingProgress } from '@/components/mission/FundingProgress'
import { MissionBody } from '@/components/mission/MissionBody'
import { MissionHero } from '@/components/mission/MissionHero'
import { MissionaryProfile } from '@/components/mission/MissionaryProfile'
import { StickyDonateBar } from '@/components/mission/StickyDonateBar'
import { SEED_DONORS } from '@/lib/mock/missions'
import { missionStore } from '@/lib/missionStore'
import { sharePage } from '@/lib/share'
import { useLocale, useTranslations } from 'next-intl'

type MissionDetailPageProps = {
  slug: string
}

export const MissionDetailPage = ({ slug }: MissionDetailPageProps) => {
  const t = useTranslations('mission')
  const locale = useLocale()
  const [donationOpen, setDonationOpen] = useState(false)
  const mission = useMemo(() => missionStore.getBySlug(slug), [slug])

  if (!mission || mission.status !== 'published') {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const localePrefix = locale === 'ko' ? '' : `/${locale}`
  const publicUrl = `${baseUrl}${localePrefix}/m/${mission.slug}`

  return (
    <>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
              <MissionHero
                coverImage={mission.coverImage}
                title={mission.title}
                subtitle={mission.subtitle}
                organization={mission.organization}
                onShareClick={() => {
                  void sharePage({ title: mission.title, url: window.location.href })
                }}
              />
              <MissionaryProfile
                name={mission.missionaryName}
                photo={mission.missionaryPhoto}
                country={mission.country}
                organization={mission.organization}
                sentYear={mission.sentYear}
                bio={mission.missionaryBio || mission.subtitle}
              />
              <MissionBody description={mission.body} updates={mission.updates} />

              <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <h2 className="text-sm font-bold text-foreground">{t('qrTitle')}</h2>
                <p className="text-xs text-muted-foreground">{t('qrHint')}</p>
                <div className="inline-flex rounded-xl bg-white p-3 border border-border">
                  <QRCode value={publicUrl} size={128} />
                </div>
                <p className="text-xs text-muted-foreground break-all">{publicUrl}</p>
              </section>
            </div>

            <div className="space-y-5 lg:sticky lg:top-20">
              <FundingProgress
                currentAmount={mission.currentAmount}
                goalAmount={mission.goalAmount}
                donorCount={mission.donorCount}
                daysLeft={mission.daysLeft}
                onDonateClick={() => setDonationOpen(true)}
              />
              <DonorFeed donors={SEED_DONORS} />
            </div>
          </div>
        </main>

        <footer className="border-t border-border mt-12 py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">{t('footerOrg')}</p>
            <p>{t('footerLegal')}</p>
          </div>
        </footer>
      </div>

      <StickyDonateBar
        missionTitle={mission.title}
        currentAmount={mission.currentAmount}
        goalAmount={mission.goalAmount}
        onDonateClick={() => setDonationOpen(true)}
      />

      <DonationModal
        open={donationOpen}
        missionTitle={mission.title}
        missionaryName={mission.missionaryName}
        onClose={() => setDonationOpen(false)}
      />
    </>
  )
}
