import { setRequestLocale } from 'next-intl/server'

import { DonorDashboardPage } from '@/components/donor/DonorDashboardPage'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function MyPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <DonorDashboardPage />
}
