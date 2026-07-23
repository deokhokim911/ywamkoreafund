import { setRequestLocale } from 'next-intl/server'

import { AdminPage } from '@/components/admin/AdminPage'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <AdminPage />
}
