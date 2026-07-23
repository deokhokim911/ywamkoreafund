import { setRequestLocale } from 'next-intl/server'

import { MissionaryDashboardPage } from '@/components/dashboard/MissionaryDashboardPage'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function DashboardPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <MissionaryDashboardPage />
}
