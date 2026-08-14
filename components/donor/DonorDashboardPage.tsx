'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Heart,
  TrendingUp,
  RefreshCw,
  FileText,
  ChevronRight,
  Download,
  Search,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronDown,
  Star,
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
import { ReceiptModal } from './ReceiptModal'

// ─── Mock data ────────────────────────────────────────────────────────────────

const DONOR = {
  name: '이수현',
  email: 'lee.suhyun@gmail.com',
  phone: '010-1234-5678',
  birthDate: '1992.03.14',
  newsletterOptIn: true,
  joinedAt: '2024년 3월',
  avatarInitial: '이',
}

const KPI = [
  {
    label: '총 후원 금액',
    value: '₩ 820,000',
    sub: '누적 후원액',
    change: null,
    icon: TrendingUp,
  },
  {
    label: '후원한 프로젝트',
    value: '3개',
    sub: '진행 중 2개 포함',
    change: null,
    icon: Heart,
  },
  {
    label: '정기 후원',
    value: '₩ 80,000',
    sub: '월 정기 후원액',
    change: null,
    icon: RefreshCw,
  },
  {
    label: '기부 영수증',
    value: '12건',
    sub: '전체 발급 내역',
    change: null,
    icon: FileText,
  },
]

const MONTHLY_DATA = [
  { month: '2월', amount: 50_000 },
  { month: '3월', amount: 80_000 },
  { month: '4월', amount: 80_000 },
  { month: '5월', amount: 130_000 },
  { month: '6월', amount: 80_000 },
  { month: '7월', amount: 160_000 },
]

type DonationStatus = 'confirmed' | 'pending' | 'cancelled'

interface Donation {
  id: string
  campaign: string
  missionary: string
  country: string
  cover: string
  amount: number
  type: '일시' | '정기'
  date: string
  status: DonationStatus
  receiptId: string
  receiptIssued: boolean
}

const DONATIONS: Donation[] = [
  {
    id: 'don-01',
    campaign: '동남아시아 어린이 문해교육 및 복음화 사역',
    missionary: '김소연',
    country: '태국',
    cover: '/mission-cover.png',
    amount: 50_000,
    type: '정기',
    date: '2025-07-16',
    status: 'confirmed',
    receiptId: 'RCP-2025-0716-001',
    receiptIssued: true,
  },
  {
    id: 'don-02',
    campaign: '캄보디아 청소년 영어·성경 교육 사역',
    missionary: '박성민',
    country: '캄보디아',
    cover: '/mission-cover-2.png',
    amount: 30_000,
    type: '일시',
    date: '2025-07-10',
    status: 'confirmed',
    receiptId: 'RCP-2025-0710-004',
    receiptIssued: true,
  },
  {
    id: 'don-03',
    campaign: '미얀마 의료·식수 지원 및 복음 전도 사역',
    missionary: '최유진',
    country: '미얀마',
    cover: '/mission-cover-3.png',
    amount: 100_000,
    type: '정기',
    date: '2025-07-03',
    status: 'confirmed',
    receiptId: 'RCP-2025-0703-002',
    receiptIssued: true,
  },
  {
    id: 'don-04',
    campaign: '동남아시아 어린이 문해교육 및 복음화 사역',
    missionary: '김소연',
    country: '태국',
    cover: '/mission-cover.png',
    amount: 50_000,
    type: '정기',
    date: '2025-06-16',
    status: 'confirmed',
    receiptId: 'RCP-2025-0616-001',
    receiptIssued: true,
  },
  {
    id: 'don-05',
    campaign: '몽골 초원 교회 개척 및 예배 사역',
    missionary: '이준호',
    country: '몽골',
    cover: '/mission-cover-4.png',
    amount: 50_000,
    type: '일시',
    date: '2025-06-05',
    status: 'pending',
    receiptId: 'RCP-2025-0605-008',
    receiptIssued: false,
  },
  {
    id: 'don-06',
    campaign: '미얀마 의료·식수 지원 및 복음 전도 사역',
    missionary: '최유진',
    country: '미얀마',
    cover: '/mission-cover-3.png',
    amount: 100_000,
    type: '정기',
    date: '2025-06-03',
    status: 'confirmed',
    receiptId: 'RCP-2025-0603-002',
    receiptIssued: true,
  },
  {
    id: 'don-07',
    campaign: '캄보디아 청소년 영어·성경 교육 사역',
    missionary: '박성민',
    country: '캄보디아',
    cover: '/mission-cover-2.png',
    amount: 30_000,
    type: '일시',
    date: '2025-05-20',
    status: 'cancelled',
    receiptId: '',
    receiptIssued: false,
  },
  {
    id: 'don-08',
    campaign: '동남아시아 어린이 문해교육 및 복음화 사역',
    missionary: '김소연',
    country: '태국',
    cover: '/mission-cover.png',
    amount: 50_000,
    type: '정기',
    date: '2025-05-16',
    status: 'confirmed',
    receiptId: 'RCP-2025-0516-001',
    receiptIssued: true,
  },
]

// Active campaigns the donor currently supports
const ACTIVE_CAMPAIGNS = [
  {
    id: 'c1',
    title: '동남아시아 어린이 문해교육 및 복음화 사역',
    missionary: '김소연 선교사',
    country: '태국',
    cover: '/mission-cover.png',
    raised: 4_240_000,
    goal: 8_000_000,
    myTotal: 200_000,
    type: '정기 ₩50,000/월',
    dDay: 47,
  },
  {
    id: 'c2',
    title: '미얀마 의료·식수 지원 및 복음 전도 사역',
    missionary: '최유진 선교사',
    country: '미얀마',
    cover: '/mission-cover-3.png',
    raised: 6_100_000,
    goal: 7_500_000,
    myTotal: 400_000,
    type: '정기 ₩100,000/월',
    dDay: 12,
  },
]

const PAGE_SIZE = 6

function StatusBadge({ status }: { status: DonationStatus }) {
  if (status === 'confirmed')
    return (
      <span className="inline-flex items-center gap-1 bg-[oklch(0.94_0.06_165)] text-[oklch(0.38_0.12_165)] text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
        <CheckCircle2 size={11} />
        결제완료
      </span>
    )
  if (status === 'pending')
    return (
      <span className="inline-flex items-center gap-1 bg-[oklch(0.96_0.05_80)] text-[oklch(0.45_0.14_60)] text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
        <Clock size={11} />
        처리중
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
      <XCircle size={11} />
      취소됨
    </span>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export type DonorDashboardProfile = {
  name: string
  email: string
  phone: string
  birthDate: string
  newsletterOptIn: boolean
  joinedAt: string
  totalAmount: number
  donationCount: number
  regularAmount: number
  campaigns: string[]
  status: 'active' | 'inactive' | 'paused'
}

export function DonorDashboardPage({
  profile,
  embedded = false,
}: {
  profile?: DonorDashboardProfile
  embedded?: boolean
} = {}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'전체' | '일시' | '정기'>('전체')
  const [statusFilter, setStatusFilter] = useState<'전체' | 'confirmed' | 'pending' | 'cancelled'>('전체')
  const [page, setPage] = useState(1)
  const [receiptDonation, setReceiptDonation] = useState<Donation | null>(null)

  const donor = {
    name: profile?.name ?? DONOR.name,
    email: profile?.email ?? DONOR.email,
    phone: profile?.phone ?? DONOR.phone,
    birthDate: (profile?.birthDate ?? DONOR.birthDate).replace(/-/g, '.'),
    newsletterOptIn: profile?.newsletterOptIn ?? DONOR.newsletterOptIn,
    joinedAt: profile?.joinedAt ?? DONOR.joinedAt,
    avatarInitial: (profile?.name ?? DONOR.name)[0],
    status: profile?.status ?? ('active' as const),
  }

  const kpi = profile
    ? [
        {
          label: '총 후원 금액',
          value: `₩ ${profile.totalAmount.toLocaleString()}`,
          sub: '누적 후원액',
          change: null,
          icon: TrendingUp,
        },
        {
          label: '후원한 프로젝트',
          value: `${profile.campaigns.length}개`,
          sub: profile.campaigns.length > 0 ? '후원 중인 사역' : '후원 내역 없음',
          change: null,
          icon: Heart,
        },
        {
          label: '정기 후원',
          value: profile.regularAmount > 0 ? `₩ ${profile.regularAmount.toLocaleString()}` : '없음',
          sub: '월 정기 후원액',
          change: null,
          icon: RefreshCw,
        },
        {
          label: '기부 영수증',
          value: `${profile.donationCount}건`,
          sub: '전체 발급 내역',
          change: null,
          icon: FileText,
        },
      ]
    : KPI

  const donations = (() => {
    if (!profile) return DONATIONS
    if (profile.donationCount === 0 && profile.campaigns.length === 0) return [] as Donation[]
    const names = profile.campaigns.length > 0 ? profile.campaigns : ['후원 프로젝트']
    const count = Math.max(profile.donationCount, names.length)
    return Array.from({ length: Math.min(count, 12) }, (_, i) => {
      const base = DONATIONS[i % DONATIONS.length]
      return {
        ...base,
        id: `${profile.name}-don-${i + 1}`,
        campaign: names[i % names.length],
        amount: profile.regularAmount > 0 && i % 2 === 0 ? profile.regularAmount : base.amount,
        type: (profile.regularAmount > 0 && i % 2 === 0 ? '정기' : '일시') as '일시' | '정기',
      }
    })
  })()

  const monthlyData = profile
    ? MONTHLY_DATA.map((row, i) => ({
        ...row,
        amount: Math.max(
          0,
          Math.round((profile.totalAmount / 6) * (0.7 + (i % 3) * 0.2)),
        ),
      }))
    : MONTHLY_DATA

  const activeCampaigns = profile
    ? profile.campaigns.map((title, i) => ({
        id: `ac-${i + 1}`,
        title,
        missionary: 'YWAM KOREA 선교사',
        country: title.slice(0, 2),
        cover: ['/mission-cover.png', '/mission-cover-2.png', '/mission-cover-3.png'][i % 3],
        raised: 2_000_000 + i * 800_000,
        goal: 8_000_000,
        myTotal: Math.round(profile.totalAmount / Math.max(profile.campaigns.length, 1)),
        type: profile.regularAmount > 0 && i === 0
          ? `정기 ₩${profile.regularAmount.toLocaleString()}/월`
          : '일시 후원',
        dDay: 20 + i * 10,
      }))
    : ACTIVE_CAMPAIGNS

  const filtered = donations.filter((d) => {
    const matchesSearch =
      !searchQuery ||
      d.campaign.includes(searchQuery) ||
      d.missionary.includes(searchQuery)
    const matchesType = typeFilter === '전체' || d.type === typeFilter
    const matchesStatus = statusFilter === '전체' || d.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className={embedded ? 'bg-background' : 'min-h-screen bg-background'}>
      {!embedded && <Navbar />}

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-7">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-primary-foreground">{donor.avatarInitial}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground">{donor.name}님의 후원 현황</h1>
                <span className={cn(
                  'text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1',
                  donor.status === 'active'
                    ? 'bg-[oklch(0.96_0.05_80)] text-[oklch(0.45_0.14_60)]'
                    : donor.status === 'paused'
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-muted text-muted-foreground',
                )}>
                  <Star size={11} />
                  {donor.status === 'active' ? '활성 후원자' : donor.status === 'paused' ? '일시정지' : '비활성'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {donor.email} · 생년월일 {donor.birthDate} ·{' '}
                {donor.newsletterOptIn ? '뉴스레터 구독 중' : '뉴스레터 미구독'} ·{' '}
                {donor.joinedAt}부터 함께하고 있어요
              </p>
            </div>
          </div>
          {!embedded && (
            <Link
              href="/"
              className="flex items-center gap-2 bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
            >
              <Heart size={15} />
              새 프로젝트 후원하기
            </Link>
          )}
        </div>

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpi.map((item) => (
            <div key={item.label} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center mb-3">
                <item.icon size={18} className="text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
              <p className="text-xs text-primary font-medium mt-1">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Chart + active campaigns ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Monthly chart */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="font-bold text-foreground">월별 후원 내역</h2>
              <p className="text-xs text-muted-foreground mt-0.5">최근 6개월 후원 추이</p>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradDonor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.52 0.12 195)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="oklch(0.52 0.12 195)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0 0)" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: 'oklch(0.50 0 0)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'oklch(0.50 0 0)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v / 10_000}만`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid oklch(0.91 0 0)', fontSize: 12 }}
                  formatter={(v) => [`${(Number(v ?? 0) / 10_000).toLocaleString()}만원`, '후원금']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="oklch(0.52 0.12 195)"
                  strokeWidth={2.5}
                  fill="url(#gradDonor)"
                  dot={{ r: 3, fill: 'oklch(0.52 0.12 195)', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Active campaigns */}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">후원 중인 프로젝트</h2>
              <span className="text-xs text-muted-foreground">{activeCampaigns.length}개</span>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {activeCampaigns.length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center">후원 중인 프로젝트가 없습니다.</p>
              )}
              {activeCampaigns.map((c) => {
                const pct = Math.round((c.raised / c.goal) * 100)
                return (
                  <div key={c.id} className="group">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                        <Image src={c.cover} alt={c.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 text-balance">
                          {c.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {c.missionary} · {c.country}
                        </p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-1.5">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{pct}% 달성</span>
                      <span className="text-primary font-semibold">{c.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-muted-foreground">내 누적 후원</span>
                      <span className="font-semibold text-foreground">
                        ₩ {c.myTotal.toLocaleString()}
                      </span>
                    </div>
                    {c.dDay <= 14 && (
                      <span className="inline-block mt-1.5 bg-[oklch(0.96_0.05_80)] text-[oklch(0.45_0.14_60)] text-xs font-semibold px-2 py-0.5 rounded-full">
                        D-{c.dDay}
                      </span>
                    )}
                    <div className="mt-2 pt-2 border-t border-border">
                      <Link
                        href="/mission"
                        className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        프로젝트 페이지 보기 <ArrowUpRight size={11} />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Donation history table ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Table toolbar */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-foreground">후원 내역</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  총 {filtered.length}건 ·{' '}
                  {filtered
                    .filter((d) => d.status === 'confirmed')
                    .reduce((s, d) => s + d.amount, 0)
                    .toLocaleString()}
                  원 결제 완료
                </p>
              </div>
              <button className="flex items-center gap-2 bg-muted hover:bg-border text-foreground text-xs font-semibold px-3 py-2 rounded-xl transition-colors self-start sm:self-auto">
                <Download size={13} />
                내역 다운로드
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <div className="relative flex-1 max-w-xs">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  type="search"
                  placeholder="프로젝트 또는 선교사 검색"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                  className="w-full pl-8 pr-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="후원 내역 필터">
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
                    { id: 'confirmed' as const, label: '완료' },
                    { id: 'pending' as const, label: '처리중' },
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
                  <th className="text-left font-semibold text-muted-foreground px-6 py-3">프로젝트</th>
                  <th className="text-right font-semibold text-muted-foreground px-4 py-3">후원액</th>
                  <th className="text-center font-semibold text-muted-foreground px-4 py-3">유형</th>
                  <th className="text-left font-semibold text-muted-foreground px-4 py-3">후원일</th>
                  <th className="text-center font-semibold text-muted-foreground px-4 py-3">상태</th>
                  <th className="text-center font-semibold text-muted-foreground px-4 py-3">영수증</th>
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
                    {/* Campaign */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                          <Image src={d.cover} alt={d.campaign} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm leading-snug truncate max-w-xs">
                            {d.campaign}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {d.missionary} 선교사 · {d.country}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5 text-right font-semibold text-foreground whitespace-nowrap">
                      ₩ {d.amount.toLocaleString()}
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={cn(
                          'text-xs font-semibold px-2.5 py-1 rounded-full',
                          d.type === '정기'
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        )}
                      >
                        {d.type}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                      {d.date}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 text-center">
                      <StatusBadge status={d.status} />
                    </td>

                    {/* Receipt */}
                    <td className="px-4 py-3.5 text-center">
                      {d.receiptIssued ? (
                        <button
                          onClick={() => setReceiptDonation(d)}
                          className="inline-flex items-center gap-1.5 bg-accent hover:bg-[oklch(0.88_0.06_195)] text-accent-foreground text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <FileText size={12} />
                          영수증 보기
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="md:hidden divide-y divide-border">
            {paginated.map((d) => (
              <div key={d.id} className="px-4 py-4 flex items-start gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                  <Image src={d.cover} alt={d.campaign} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-snug line-clamp-1">
                    {d.campaign}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {d.missionary} · {d.date}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <StatusBadge status={d.status} />
                    <span
                      className={cn(
                        'text-xs font-semibold px-2.5 py-1 rounded-full',
                        d.type === '정기'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      )}
                    >
                      {d.type}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="font-bold text-foreground text-sm">
                    ₩ {d.amount.toLocaleString()}
                  </span>
                  {d.receiptIssued && (
                    <button
                      onClick={() => setReceiptDonation(d)}
                      className="flex items-center gap-1 text-xs font-semibold text-primary"
                    >
                      <FileText size={11} /> 영수증
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/20">
              <span className="text-xs text-muted-foreground">
                {page} / {totalPages} 페이지
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="이전 페이지"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-xs font-semibold transition-colors',
                      page === n
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    )}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="다음 페이지"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {!embedded && (
          <footer className="border-t border-border pt-6 pb-8">
            <div className="text-center text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">YWAMKOREAFUND</p>
              <p>기부금은 예수전도단 공식 계좌를 통해 100% 선교사에게 전달됩니다.</p>
              <p>후원 문의: support@ywamkoreafund.org · 02-0000-0000</p>
            </div>
          </footer>
        )}
      </div>

      {/* Receipt modal */}
      {receiptDonation && (
        <ReceiptModal
          donation={receiptDonation}
          donor={donor}
          onClose={() => setReceiptDonation(null)}
        />
      )}
    </div>
  )
}
