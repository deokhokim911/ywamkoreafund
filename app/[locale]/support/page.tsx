import { setRequestLocale } from 'next-intl/server'

import { SupportPage } from '@/components/support/SupportPage'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <SupportPage />
}
