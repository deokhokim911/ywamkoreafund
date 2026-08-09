'use client'

import {
  ArrowRight,
  ClipboardCheck,
  HeartHandshake,
  Shield,
  UserRound,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import type { DemoRole } from '@/lib/auth-stub'

type RoleHomePanelProps = {
  role: DemoRole
}

export const RoleHomePanel = ({ role }: RoleHomePanelProps) => {
  const t = useTranslations('home.rolePanel')

  if (role === 'guest') {
    return (
      <section
        className="rounded-2xl border border-border bg-card p-5 md:p-6"
        aria-label={t('guestTitle')}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
            <UserRound size={22} className="text-primary" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              {t('badgeGuest')}
            </p>
            <h2 className="text-lg font-bold text-foreground">{t('guestTitle')}</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {t('guestBody')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <Link
              href="/m/thailand-literacy"
              className="inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              {t('guestCtaDonate')}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center justify-center border border-border text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-muted transition-colors"
            >
              {t('guestCtaSupport')}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (role === 'donor') {
    return (
      <section
        className="rounded-2xl border border-border bg-card p-5 md:p-6"
        aria-label={t('donorTitle')}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
            <HeartHandshake size={22} className="text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              {t('badgeDonor')}
            </p>
            <h2 className="text-lg font-bold text-foreground">{t('donorTitle')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('donorBody')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <Metric label={t('donorMetricTotal')} value={t('donorMetricTotalValue')} />
          <Metric label={t('donorMetricMonthly')} value={t('donorMetricMonthlyValue')} />
          <Metric label={t('donorMetricCampaigns')} value={t('donorMetricCampaignsValue')} />
        </div>
        <Link
          href="/my"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          {t('donorCta')}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </section>
    )
  }

  if (role === 'missionary') {
    return (
      <section
        className="rounded-2xl border border-border bg-card p-5 md:p-6"
        aria-label={t('missionaryTitle')}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
            <ClipboardCheck size={22} className="text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              {t('badgeMissionary')}
            </p>
            <h2 className="text-lg font-bold text-foreground">{t('missionaryTitle')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('missionaryBody')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <Metric label={t('missionaryMetricRaised')} value={t('missionaryMetricRaisedValue')} />
          <Metric label={t('missionaryMetricDonors')} value={t('missionaryMetricDonorsValue')} />
          <Metric label={t('missionaryMetricStatus')} value={t('missionaryMetricStatusValue')} />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            {t('missionaryCtaDashboard')}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link
            href="/create"
            className="inline-flex items-center justify-center border border-border text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-muted transition-colors"
          >
            {t('missionaryCtaCreate')}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section
      className="rounded-2xl border border-border bg-card p-5 md:p-6"
      aria-label={t('adminTitle')}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
          <Shield size={22} className="text-primary" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            {t('badgeAdmin')}
          </p>
          <h2 className="text-lg font-bold text-foreground">{t('adminTitle')}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t('adminBody')}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <Metric label={t('adminMetricPending')} value={t('adminMetricPendingValue')} />
        <Metric label={t('adminMetricLive')} value={t('adminMetricLiveValue')} />
        <Metric label={t('adminMetricFeatured')} value={t('adminMetricFeaturedValue')} />
      </div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        {t('adminCta')}
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </section>
  )
}

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-muted/60 px-4 py-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-base font-bold text-foreground mt-0.5">{value}</p>
  </div>
)
