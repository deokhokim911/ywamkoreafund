'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  Users,
  Target,
  Clock,
  Plus,
  ChevronDown,
  ArrowUpRight,
  Download,
  Search,
  Filter,
  MoreHorizontal,
  Heart,
  RefreshCw,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Navbar } from '../layout/Navbar'
import { cn } from '@/lib/utils'

// ─── Mock data ───────────────────────────────────────────────────
const MISSIONARY = {
  name: '김소연',
  country: '태국',
  organization: '예수전도단 (YWAM Korea)',
  deployYear: 2021,
  avatarInitial: '김',
}

type CampaignStatus = 'active' | 'urgent' | 'ended' | 'pending'

type Campaign = {
  id: string
  slug: string
  title: string
  country: string
  status: CampaignStatus
  currentAmount: number
  goalAmount: number
  donorCount: number
  recurringCount: number
  daysLeft: number | null
  monthRaised: number
  newDonorsThisMonth: number
}

const CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    slug: 'thailand-literacy',
    title: '동남아시아 어린이 문해교육 및 복음화 사역',
    country: '태국',
    status: 'active',
    currentAmount: 4_240_000,
    goalAmount: 8_000_000,
    donorCount: 134,
    recurringCount: 61,
    daysLeft: 47,
    monthRaised: 1_840_000,
    newDonorsThisMonth: 18,
  },
  {
    id: 'c2',
    slug: 'thailand-youth',
    title: '치앙마이 청년 제자훈련 캠프',
    country: '태국',
    status: 'urgent',
    currentAmount: 1_850_000,
    goalAmount: 3_000_000,
    donorCount: 52,
    recurringCount: 19,
    daysLeft: 12,
    monthRaised: 620_000,
    newDonorsThisMonth: 9,
  },
  {
    id: 'c3',
    slug: 'thailand-library',
    title: '산간 마을 작은 도서관 조성',
    country: '태국',
    status: 'ended',
    currentAmount: 2_100_000,
    goalAmount: 2_000_000,
    donorCount: 78,
    recurringCount: 0,
    daysLeft: null,
    monthRaised: 0,
    newDonorsThisMonth: 0,
  },
  {
    id: 'c4',
    slug: 'thailand-medical',
    title: '북부 의료 봉사 단기 사역',
    country: '태국',
    status: 'pending',
    currentAmount: 0,
    goalAmount: 5_000_000,
    donorCount: 0,
    recurringCount: 0,
    daysLeft: null,
    monthRaised: 0,
    newDonorsThisMonth: 0,
  },
]

const CAMPAIGN_STATUS_FILTERS: Array<{ id: 'all' | CampaignStatus; label: string }> = [
  { id: 'all', label: '전체' },
  { id: 'active', label: '진행중' },
  { id: 'urgent', label: '긴급' },
  { id: 'ended', label: '종료' },
  { id: 'pending', label: '검토중' },
]

const CAMPAIGN_STATUS_META: Record<
  CampaignStatus,
  { label: string; className: string }
> = {
  active: {
    label: '진행중',
    className: 'bg-accent text-accent-foreground',
  },
  urgent: {
    label: '긴급',
    className: 'bg-[oklch(0.96_0.05_80)] text-[oklch(0.45_0.14_60)]',
  },
  ended: {
    label: '종료',
    className: 'bg-muted text-muted-foreground',
  },
  pending: {
    label: '검토중',
    className: 'bg-secondary text-secondary-foreground',
  },
}

const WEEKLY_DATA = [
  { week: '6/16', amount: 280_000, donors: 9 },
  { week: '6/23', amount: 450_000, donors: 14 },
  { week: '6/30', amount: 320_000, donors: 10 },
  { week: '7/7', amount: 610_000, donors: 19 },
  { week: '7/14', amount: 740_000, donors: 23 },
  { week: '7/21', amount: 580_000, donors: 18 },
  { week: '오늘', amount: 420_000, donors: 13 },
]

const DONORS: {
  id: string
  campaignId: string
  name: string
  email: string
  phone: string
  amount: number
  type: '일시' | '정기'
  date: string
  status: 'confirmed' | 'pending' | 'cancelled'
}[] = [
  { id: 'd1', campaignId: 'c1', name: '이수현', email: 'lee.suhyun@gmail.com', phone: '010-1234-5678', amount: 50_000, type: '정기', date: '2025-07-16', status: 'confirmed' },
  { id: 'd2', campaignId: 'c1', name: '박지훈', email: 'jhpark@naver.com', phone: '010-2345-6789', amount: 30_000, type: '일시', date: '2025-07-15', status: 'confirmed' },
  { id: 'd3', campaignId: 'c2', name: '김민지', email: 'minji.kim@kakao.com', phone: '010-3456-7890', amount: 100_000, type: '정기', date: '2025-07-14', status: 'confirmed' },
  { id: 'd4', campaignId: 'c2', name: '최유진', email: 'yujin.choi@daum.net', phone: '010-4567-8901', amount: 10_000, type: '일시', date: '2025-07-13', status: 'pending' },
  { id: 'd5', campaignId: 'c1', name: '정성훈', email: 'sunghoon@gmail.com', phone: '010-5678-9012', amount: 50_000, type: '정기', date: '2025-07-12', status: 'confirmed' },
  { id: 'd6', campaignId: 'c3', name: '한예진', email: 'yejin.han@naver.com', phone: '010-6789-0123', amount: 20_000, type: '일시', date: '2025-07-11', status: 'confirmed' },
  { id: 'd7', campaignId: 'c1', name: '오민준', email: 'minjun.oh@outlook.com', phone: '010-7890-1234', amount: 30_000, type: '정기', date: '2025-07-10', status: 'cancelled' },
  { id: 'd8', campaignId: 'c2', name: '윤서연', email: 'seoyeon.yun@gmail.com', phone: '010-8901-2345', amount: 50_000, type: '일시', date: '2025-07-09', status: 'confirmed' },
  { id: 'd9', campaignId: 'c1', name: '강도현', email: 'dohyun.kang@daum.net', phone: '010-9012-3456', amount: 100_000, type: '정기', date: '2025-07-08', status: 'confirmed' },
  { id: 'd10', campaignId: 'c3', name: '임지수', email: 'jisoo.lim@naver.com', phone: '010-0123-4567', amount: 30_000, type: '일시', date: '2025-07-07', status: 'confirmed' },
  { id: 'd11', campaignId: 'c2', name: '신현우', email: 'hyunwoo.shin@gmail.com', phone: '010-1357-2468', amount: 50_000, type: '정기', date: '2025-07-06', status: 'confirmed' },
  { id: 'd12', campaignId: 'c1', name: '배소영', email: 'soyoung.bae@kakao.com', phone: '010-2468-1357', amount: 20_000, type: '일시', date: '2025-07-05', status: 'pending' },
]

const formatKRW = (amount: number) => `₩ ${amount.toLocaleString()}`

const PAGE_SIZE = 8

function StatusBadge({ status }: { status: string }) {
  if (status === 'confirmed') return (
    <span className="inline-flex items-center gap-1 bg-[oklch(0.94_0.06_165)] text-[oklch(0.38_0.12_165)] text-xs font-semibold px-2.5 py-1 rounded-full">
      <CheckCircle2 size={11} /> 확인
    </span>
  )
  if (status === 'pending') return (
    <span className="inline-flex items-center gap-1 bg-[oklch(0.96_0.05_80)] text-[oklch(0.45_0.14_60)] text-xs font-semibold px-2.5 py-1 rounded-full">
      <Clock size={11} /> 대기
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
      <XCircle size={11} /> 취소
    </span>
  )
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={cn(
      'text-xs font-semibold px-2.5 py-1 rounded-full',
      type === '정기'
        ? 'bg-accent text-accent-foreground'
        : 'bg-secondary text-secondary-foreground'
    )}>
      {type}
    </span>
  )
}

// ─── Main component ───────────────────────────────────────────────
export type MissionaryDashboardProfile = {
  name: string
  country: string
  organization: string
  deployYear?: number
  totalRaised: number
  donorCount: number
  campaignCount: number
  status: 'active' | 'pending' | 'inactive'
}

export function MissionaryDashboardPage({
  profile,
  embedded = false,
}: {
  profile?: MissionaryDashboardProfile
  embedded?: boolean
} = {}) {
  const [chartView, setChartView] = useState<'amount' | 'donors'>('amount')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'전체' | '일시' | '정기'>('전체')
  const [statusFilter, setStatusFilter] = useState<'전체' | 'confirmed' | 'pending' | 'cancelled'>('전체')
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<'all' | CampaignStatus>('all')
  const [selectedCampaignId, setSelectedCampaignId] = useState<'all' | string>('all')
  const [page, setPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const missionary = {
    name: profile?.name ?? MISSIONARY.name,
    country: profile?.country ?? MISSIONARY.country,
    organization: profile?.organization ?? MISSIONARY.organization,
    deployYear: profile?.deployYear ?? MISSIONARY.deployYear,
    avatarInitial: (profile?.name ?? MISSIONARY.name)[0],
    status: profile?.status ?? ('active' as const),
  }

  const campaigns = useMemo(() => {
    if (!profile || profile.name === MISSIONARY.name) return CAMPAIGNS
    const n = Math.max(profile.campaignCount, profile.totalRaised > 0 ? 1 : 0)
    if (n === 0) return [] as Campaign[]
    const templates = Array.from({ length: n }, (_, i) => CAMPAIGNS[i % CAMPAIGNS.length])
    const baseSum = templates.reduce((s, c) => s + c.currentAmount, 0) || 1
    const amtScale = profile.totalRaised / baseSum
    const donorBase = templates.reduce((s, c) => s + c.donorCount, 0) || 1
    const donorScale = profile.donorCount / donorBase
    return templates.map((c, i) => ({
      ...c,
      id: `p-${i + 1}`,
      country: i === 0 ? profile.country : c.country,
      currentAmount: Math.round(c.currentAmount * amtScale),
      goalAmount: Math.max(Math.round(c.goalAmount * amtScale), Math.round(c.currentAmount * amtScale) + 1),
      donorCount: Math.max(0, Math.round(c.donorCount * donorScale)),
      recurringCount: Math.max(0, Math.round(c.recurringCount * donorScale)),
      monthRaised: Math.round(c.monthRaised * amtScale),
      newDonorsThisMonth: Math.max(0, Math.round(c.newDonorsThisMonth * donorScale)),
      status: (profile.status === 'pending' ? 'pending' : i === 0 ? 'active' : c.status) as CampaignStatus,
    }))
  }, [profile])

  const donors = useMemo(() => {
    if (!profile || profile.name === MISSIONARY.name) return DONORS
    if (campaigns.length === 0) return []
    return DONORS.map((d, i) => ({
      ...d,
      campaignId: campaigns[i % campaigns.length].id,
    }))
  }, [profile, campaigns])

  const classifiedCampaigns = useMemo(() => {
    if (campaignStatusFilter === 'all') return campaigns
    return campaigns.filter((c) => c.status === campaignStatusFilter)
  }, [campaignStatusFilter, campaigns])

  const statusCounts = useMemo(() => {
    return campaigns.reduce(
      (acc, c) => {
        acc.all += 1
        acc[c.status] += 1
        return acc
      },
      { all: 0, active: 0, urgent: 0, ended: 0, pending: 0 } as Record<'all' | CampaignStatus, number>,
    )
  }, [campaigns])

  const scopeCampaigns = useMemo(() => {
    if (selectedCampaignId === 'all') return classifiedCampaigns
    return campaigns.filter((c) => c.id === selectedCampaignId)
  }, [classifiedCampaigns, selectedCampaignId, campaigns])

  const selectedCampaign =
    selectedCampaignId === 'all'
      ? null
      : campaigns.find((c) => c.id === selectedCampaignId) ?? null

  const scopeTotals = useMemo(() => {
    const currentAmount = scopeCampaigns.reduce((s, c) => s + c.currentAmount, 0)
    const goalAmount = scopeCampaigns.reduce((s, c) => s + c.goalAmount, 0)
    const donorCount = scopeCampaigns.reduce((s, c) => s + c.donorCount, 0)
    const recurringCount = scopeCampaigns.reduce((s, c) => s + c.recurringCount, 0)
    const monthRaised = scopeCampaigns.reduce((s, c) => s + c.monthRaised, 0)
    const newDonorsThisMonth = scopeCampaigns.reduce((s, c) => s + c.newDonorsThisMonth, 0)
    const progress = goalAmount > 0 ? Math.round((currentAmount / goalAmount) * 100) : 0
    return {
      currentAmount,
      goalAmount,
      donorCount,
      recurringCount,
      monthRaised,
      newDonorsThisMonth,
      progress,
    }
  }, [scopeCampaigns])

  const kpiCards = [
    {
      label: '총 모금액',
      value: formatKRW(scopeTotals.currentAmount),
      sub: scopeTotals.goalAmount > 0 ? `목표의 ${scopeTotals.progress}%` : '목표 없음',
      change: 12.4,
      icon: TrendingUp,
      positive: true as boolean | null,
    },
    {
      label: '전체 후원자',
      value: `${scopeTotals.donorCount}명`,
      sub: `이번 달 +${scopeTotals.newDonorsThisMonth}명`,
      change: 15.5,
      icon: Users,
      positive: true as boolean | null,
    },
    {
      label: '목표 금액',
      value: formatKRW(scopeTotals.goalAmount),
      sub:
        selectedCampaign?.daysLeft != null
          ? `${selectedCampaign.daysLeft}일 남음`
          : selectedCampaignId === 'all'
            ? `${scopeCampaigns.length}개 프로젝트`
            : '종료/검토',
      change: null,
      icon: Target,
      positive: null as boolean | null,
    },
    {
      label: '정기 후원자',
      value: `${scopeTotals.recurringCount}명`,
      sub:
        scopeTotals.donorCount > 0
          ? `전체의 ${Math.round((scopeTotals.recurringCount / scopeTotals.donorCount) * 100)}%`
          : '0%',
      change: 8.2,
      icon: RefreshCw,
      positive: true as boolean | null,
    },
  ]

  const scopeCampaignIds = new Set(scopeCampaigns.map((c) => c.id))

  const filtered = donors.filter((d) => {
    const matchesCampaign = scopeCampaignIds.has(d.campaignId)
    const matchesSearch = !searchQuery || d.name.includes(searchQuery) || d.email.includes(searchQuery)
    const matchesType = typeFilter === '전체' || d.type === typeFilter
    const matchesStatus = statusFilter === '전체' || d.status === statusFilter
    return matchesCampaign && matchesSearch && matchesType && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalAmount = filtered
    .filter((d) => d.status === 'confirmed')
    .reduce((sum, d) => sum + d.amount, 0)

  const handleSelectCampaignStatus = (id: 'all' | CampaignStatus) => {
    setCampaignStatusFilter(id)
    setSelectedCampaignId('all')
    setPage(1)
  }

  const handleSelectCampaign = (id: 'all' | string) => {
    setSelectedCampaignId(id)
    setPage(1)
  }

  return (
    <div className={embedded ? 'bg-background' : 'min-h-screen bg-background'}>
      {!embedded && <Navbar />}

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-7">

        {/* Page header with missionary info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-primary-foreground">{missionary.avatarInitial}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground">{missionary.name} 선교사</h1>
                <span className={cn(
                  'text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1',
                  missionary.status === 'active'
                    ? 'bg-accent text-accent-foreground'
                    : missionary.status === 'pending'
                      ? 'bg-[oklch(0.96_0.05_80)] text-[oklch(0.45_0.14_60)]'
                      : 'bg-muted text-muted-foreground',
                )}>
                  <Heart size={11} />
                  {missionary.status === 'active' ? '활성 사역' : missionary.status === 'pending' ? '승인 대기' : '비활성'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {missionary.organization} · {missionary.country} · {missionary.deployYear}년 파송 · 프로젝트 {campaigns.length}개
              </p>
            </div>
          </div>
          {!embedded && (
            <Link
              href="/create"
              className="flex items-center gap-2 bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
            >
              <Plus size={15} />
              새 프로젝트 만들기
            </Link>
          )}
        </div>

        {/* Campaign classification */}
        <section className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
                <LayoutGrid size={18} className="text-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">내 프로젝트</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  상태별로 분류하고 프로젝트를 선택해 현황을 확인하세요
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSelectCampaign('all')}
              className={cn(
                'text-xs font-semibold px-3 py-2 rounded-xl transition-colors self-start sm:self-auto',
                selectedCampaignId === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              전체 합계 보기
            </button>
          </div>

          <div
            className="flex items-center gap-2 flex-wrap"
            role="tablist"
            aria-label="프로젝트 상태 분류"
          >
            {CAMPAIGN_STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={campaignStatusFilter === f.id}
                onClick={() => handleSelectCampaignStatus(f.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                  campaignStatusFilter === f.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {f.label}
                <span className="ml-1 opacity-80">({statusCounts[f.id]})</span>
              </button>
            ))}
          </div>

          {classifiedCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {classifiedCampaigns.map((campaign) => {
                const pct =
                  campaign.goalAmount > 0
                    ? Math.min(
                        100,
                        Math.round((campaign.currentAmount / campaign.goalAmount) * 100),
                      )
                    : 0
                const selected = selectedCampaignId === campaign.id
                const meta = CAMPAIGN_STATUS_META[campaign.status]

                return (
                  <button
                    key={campaign.id}
                    type="button"
                    onClick={() => handleSelectCampaign(campaign.id)}
                    className={cn(
                      'text-left rounded-xl border p-4 transition-all',
                      selected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-background hover:border-primary/40 hover:bg-muted/40',
                    )}
                    aria-pressed={selected}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                        {campaign.title}
                      </p>
                      <span
                        className={cn(
                          'flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full',
                          meta.className,
                        )}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {campaign.country}
                      {campaign.daysLeft != null ? ` · ${campaign.daysLeft}일 남음` : ''}
                      {campaign.status === 'ended' ? ' · 모금 종료' : ''}
                      {campaign.status === 'pending' ? ' · 승인 대기' : ''}
                    </p>
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-primary tabular-nums w-9 text-right">
                        {pct}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatKRW(campaign.currentAmount)}</span>
                      <span>후원자 {campaign.donorCount}명</span>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              해당 상태의 프로젝트가 없습니다.
            </div>
          )}
        </section>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi) => (
            <div key={kpi.label} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <kpi.icon size={18} className="text-primary" />
                </div>
                {kpi.change !== null && (
                  <div className={cn(
                    'flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full',
                    kpi.positive
                      ? 'bg-[oklch(0.94_0.06_165)] text-[oklch(0.38_0.12_165)]'
                      : 'bg-[oklch(0.96_0.04_27)] text-[oklch(0.50_0.16_27)]'
                  )}>
                    <ChevronDown size={12} className={kpi.positive ? 'rotate-180' : ''} />
                    {Math.abs(kpi.change)}%
                  </div>
                )}
              </div>
              <p className="text-xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
              <p className="text-xs text-primary font-medium mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Progress bar card */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="min-w-0">
              <h2 className="font-bold text-foreground truncate">
                {selectedCampaign?.title ?? '선택 범위 합계'}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedCampaign
                  ? `${selectedCampaign.country} · ${CAMPAIGN_STATUS_META[selectedCampaign.status].label}${
                      selectedCampaign.daysLeft != null
                        ? ` · 마감 ${selectedCampaign.daysLeft}일 전`
                        : ''
                    }`
                  : campaignStatusFilter === 'all'
                    ? `전체 프로젝트 ${scopeCampaigns.length}개`
                    : `${CAMPAIGN_STATUS_FILTERS.find((f) => f.id === campaignStatusFilter)?.label} ${scopeCampaigns.length}개`}
              </p>
            </div>
            {selectedCampaign && (
              <Link
                href={`/m/${selectedCampaign.slug}`}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline flex-shrink-0"
              >
                페이지 보기 <ArrowUpRight size={12} />
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${scopeTotals.progress}%` }}
              />
            </div>
            <span className="text-sm font-bold text-primary w-10 text-right">
              {scopeTotals.progress}%
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatKRW(scopeTotals.currentAmount)} 모금됨</span>
            <span>목표 {formatKRW(scopeTotals.goalAmount)}</span>
          </div>
        </div>

        {/* Chart + weekly summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Chart */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-foreground">주간 후원 현황</h2>
                <p className="text-xs text-muted-foreground mt-0.5">최근 7주 추이</p>
              </div>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                {(['amount', 'donors'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setChartView(v)}
                    className={cn(
                      'text-xs font-medium px-3 py-1.5 rounded-md transition-colors',
                      chartView === v
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {v === 'amount' ? '금액' : '후원자'}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={WEEKLY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradWeekly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.52 0.12 195)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="oklch(0.52 0.12 195)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0 0)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'oklch(0.50 0 0)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'oklch(0.50 0 0)' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => chartView === 'amount' ? `${v / 10_000}만` : `${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid oklch(0.91 0 0)', fontSize: 12 }}
                  formatter={(v) =>
                    chartView === 'amount'
                      ? [`${(Number(v ?? 0) / 10_000).toLocaleString()}만원`, '모금액']
                      : [`${Number(v ?? 0)}명`, '후원자']
                  }
                />
                <Area
                  type="monotone"
                  dataKey={chartView === 'amount' ? 'amount' : 'donors'}
                  stroke="oklch(0.52 0.12 195)"
                  strokeWidth={2.5}
                  fill="url(#gradWeekly)"
                  dot={{ r: 3, fill: 'oklch(0.52 0.12 195)', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick stats sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex-1">
              <h3 className="font-bold text-foreground mb-4">후원 유형 분포</h3>
              <div className="space-y-3">
                {[
                  {
                    label: '정기 후원',
                    count: scopeTotals.recurringCount,
                    total: Math.max(scopeTotals.donorCount, 1),
                    color: 'bg-primary',
                  },
                  {
                    label: '일시 후원',
                    count: Math.max(scopeTotals.donorCount - scopeTotals.recurringCount, 0),
                    total: Math.max(scopeTotals.donorCount, 1),
                    color: 'bg-[oklch(0.78_0.14_80)]',
                  },
                ].map((item) => {
                  const pct =
                    scopeTotals.donorCount > 0
                      ? Math.round((item.count / scopeTotals.donorCount) * 100)
                      : 0
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-foreground">{item.label}</span>
                        <span className="text-muted-foreground">{item.count}명 ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', item.color)} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <h3 className="font-bold text-foreground mb-3">이번 달 요약</h3>
              <div className="space-y-2.5">
                {[
                  { label: '신규 후원자', value: `+${scopeTotals.newDonorsThisMonth}명` },
                  { label: '이번 달 모금', value: formatKRW(scopeTotals.monthRaised) },
                  {
                    label: '후원 취소',
                    value: `${donors.filter((d) => scopeCampaignIds.has(d.campaignId) && d.status === 'cancelled').length}건`,
                  },
                  {
                    label: '평균 후원액',
                    value:
                      scopeTotals.donorCount > 0
                        ? formatKRW(Math.round(scopeTotals.currentAmount / scopeTotals.donorCount))
                        : formatKRW(0),
                  },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Donor table */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-foreground">후원자 목록</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedCampaign ? selectedCampaign.title : '선택 범위'} · 총 {filtered.length}명 · 확인된 합계 {totalAmount.toLocaleString()}원
                </p>
              </div>
              <button className="flex items-center gap-2 bg-muted hover:bg-border text-foreground text-xs font-semibold px-3 py-2 rounded-xl transition-colors self-start sm:self-auto">
                <Download size={13} />
                CSV 다운로드
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="search"
                  placeholder="이름 또는 이메일 검색"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                  className="w-full pl-8 pr-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="후원자 목록 필터">
                <Filter size={13} className="text-muted-foreground flex-shrink-0" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => {
                    setTypeFilter('전체')
                    setStatusFilter('전체')
                    setPage(1)
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                    typeFilter === '전체' && statusFilter === '전체'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  전체
                </button>
                {(['정기', '일시'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setTypeFilter(f)
                      setPage(1)
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                      typeFilter === f
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    {f}
                  </button>
                ))}
                <div className="w-px h-4 bg-border" aria-hidden="true" />
                {(
                  [
                    { id: 'confirmed' as const, label: '확인' },
                    { id: 'pending' as const, label: '대기' },
                    { id: 'cancelled' as const, label: '취소' },
                  ]
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setStatusFilter(f.id)
                      setPage(1)
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                      statusFilter === f.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left font-semibold text-muted-foreground px-6 py-3">후원자</th>
                  <th className="text-left font-semibold text-muted-foreground px-4 py-3">연락처</th>
                  <th className="text-right font-semibold text-muted-foreground px-4 py-3">후원액</th>
                  <th className="text-center font-semibold text-muted-foreground px-4 py-3">유형</th>
                  <th className="text-left font-semibold text-muted-foreground px-4 py-3">날짜</th>
                  <th className="text-center font-semibold text-muted-foreground px-4 py-3">상태</th>
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody>
                {paginated.map((d, i) => (
                  <tr
                    key={d.id}
                    className={cn(
                      'border-b border-border last:border-0 hover:bg-muted/30 transition-colors',
                      i % 2 === 1 && 'bg-muted/10'
                    )}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-accent-foreground">{d.name[0]}</span>
                        </div>
                        <span className="font-medium text-foreground">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail size={11} />
                          <span className="truncate max-w-[160px]">{d.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone size={11} />
                          {d.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-foreground">
                      {d.amount.toLocaleString()}원
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <TypeBadge type={d.type} />
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground text-xs">{d.date}</td>
                    <td className="px-4 py-3.5 text-center">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === d.id ? null : d.id)}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                          aria-label="더보기"
                        >
                          <MoreHorizontal size={15} className="text-muted-foreground" />
                        </button>
                        {openMenuId === d.id && (
                          <div className="absolute right-0 top-8 z-10 bg-card border border-border rounded-xl shadow-lg py-1.5 w-36">
                            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                              <Mail size={13} /> 감사 메일 발송
                            </button>
                            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                              <Download size={13} /> 영수증 발급
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground text-sm">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-border">
            {paginated.map((d) => (
              <div key={d.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-accent-foreground">{d.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground text-sm">{d.amount.toLocaleString()}원</p>
                    <p className="text-xs text-muted-foreground">{d.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TypeBadge type={d.type} />
                  <StatusBadge status={d.status} />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length}명
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-40"
                  aria-label="이전 페이지"
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-7 h-7 rounded-lg text-xs font-semibold transition-colors',
                      p === page ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-40"
                  aria-label="다음 페이지"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {!embedded && (
        <footer className="border-t border-border mt-8 py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">YWAMKOREAFUND — 선교사 포털</p>
            <p className="mt-1">개인정보처리방침 · 이용약관 · 문의: support@ywamkoreafund.org</p>
          </div>
        </footer>
      )}
    </div>
  )
}
