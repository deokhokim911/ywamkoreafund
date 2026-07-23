import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

type PageProps = {
  params: Promise<{ locale: string }>
}

/** Legacy route — redirect to first published mission slug. */
export default async function MissionRedirectPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  redirect('/m/thailand-literacy')
}
