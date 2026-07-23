import { setRequestLocale } from 'next-intl/server'

import { CreateCampaignPage } from '@/components/create/CreateCampaignPage'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function CreatePage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <CreateCampaignPage />
}
