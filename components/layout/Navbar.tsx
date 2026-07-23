'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'
import { useAuthStub, type DemoRole } from '@/lib/auth-stub'
import { cn } from '@/lib/utils'

const NAV_HREFS = [
  { href: '/', key: 'home' as const },
  { href: '/my', key: 'my' as const },
  { href: '/dashboard', key: 'dashboard' as const },
  { href: '/create', key: 'create' as const },
  { href: '/support', key: 'support' as const },
]

const ROLE_OPTIONS: DemoRole[] = ['guest', 'donor', 'missionary', 'admin']

export function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const locale = useLocale()
  const { role, setRole } = useAuthStub()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleCloseMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="YWAMFund home"
          onClick={handleCloseMobile}
        >
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">Y</span>
          </div>
          <span className="font-bold text-foreground text-sm">YWAMFund</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label={t('mainMenu')}>
          {NAV_HREFS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <label className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground">
            <span className="sr-only">{t('demoRole')}</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as DemoRole)}
              className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground"
              aria-label={t('demoRole')}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <LocaleSwitcher currentLocale={locale} />

          <Link
            href="/admin"
            className={cn(
              'hidden sm:inline-flex text-sm font-medium px-3 py-1.5 rounded-lg transition-colors',
              pathname === '/admin'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted',
            )}
          >
            {t('admin')}
          </Link>
          <Link
            href="/m/thailand-literacy"
            className="hidden md:flex bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            {t('donate')}
          </Link>

          <button
            type="button"
            className="md:hidden inline-flex size-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted"
            aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1"
          aria-label={t('mainMenu')}
        >
          {NAV_HREFS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleCloseMobile}
              className={cn(
                'block px-3 py-2.5 rounded-lg text-sm font-medium',
                pathname === link.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {t(link.key)}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={handleCloseMobile}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            {t('admin')}
          </Link>
          <Link
            href="/m/thailand-literacy"
            onClick={handleCloseMobile}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground text-center"
          >
            {t('donate')}
          </Link>
        </nav>
      )}
    </header>
  )
}

type LocaleSwitcherProps = {
  currentLocale: string
}

const LOCALE_FLAGS = {
  ko: { flag: '🇰🇷', labelKey: 'localeKo' as const },
  en: { flag: '🇺🇸', labelKey: 'localeEn' as const },
} as const

const LocaleSwitcher = ({ currentLocale }: LocaleSwitcherProps) => {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const nextLocale = currentLocale === 'ko' ? 'en' : 'ko'
  const next = LOCALE_FLAGS[nextLocale]

  return (
    <Link
      href={pathname}
      locale={nextLocale}
      className="inline-flex items-center justify-center size-9 rounded-lg border border-border hover:bg-muted transition-colors text-lg leading-none"
      aria-label={`Switch language to ${t(next.labelKey)}`}
      title={t(next.labelKey)}
      tabIndex={0}
    >
      <span aria-hidden="true">{next.flag}</span>
    </Link>
  )
}
