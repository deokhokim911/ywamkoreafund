import { Analytics } from '@vercel/analytics/next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { HtmlLang } from '@/components/i18n/HtmlLang'
import { AuthStubProvider } from '@/lib/auth-stub'
import { routing } from '@/i18n/routing'

type LocaleLayoutProps = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export const generateStaticParams = () =>
  routing.locales.map((locale) => ({ locale }))

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0d9488',
  width: 'device-width',
  initialScale: 1,
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    title: t('title'),
    description: t('description'),
    icons: {
      icon: [
        { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
        { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-icon.png',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <HtmlLang locale={locale} />
      <AuthStubProvider>{children}</AuthStubProvider>
      {process.env.NODE_ENV === 'production' && <Analytics />}
    </NextIntlClientProvider>
  )
}
