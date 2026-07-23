import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { MissionDetailPage } from '@/components/mission/MissionDetailPage'
import { SEED_MISSIONS } from '@/lib/mock/missions'

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export const generateStaticParams = () =>
  SEED_MISSIONS.filter((m) => m.status === 'published').map((m) => ({
    slug: m.slug,
  }))

export const generateMetadata = async ({ params }: PageProps) => {
  const { locale, slug } = await params
  const mission = SEED_MISSIONS.find((m) => m.slug === slug)
  const t = await getTranslations({ locale, namespace: 'mission' })

  if (!mission) {
    return { title: t('notFoundTitle') }
  }

  return {
    title: `${mission.title} | YWAMFund`,
    description: mission.subtitle,
  }
}

export default async function MissionSlugPage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const mission = SEED_MISSIONS.find((m) => m.slug === slug)
  if (!mission && process.env.NODE_ENV === 'production') {
    // Client store may have runtime-created missions; allow client notFound.
  }
  if (!mission && !slug) {
    notFound()
  }

  return <MissionDetailPage slug={slug} />
}
