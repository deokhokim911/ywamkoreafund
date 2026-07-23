import { setRequestLocale } from 'next-intl/server'

import { HomePage } from '@/components/home/HomePage'

type HomeProps = {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <HomePage />
}
