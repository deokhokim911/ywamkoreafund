import { setRequestLocale } from 'next-intl/server'

import { MissionsBrowsePage } from '@/components/home/MissionsBrowsePage'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function MissionsPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <MissionsBrowsePage />
}
