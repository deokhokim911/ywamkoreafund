'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  TrendingUp,
  Users,
  Heart,
  Globe,
  MoreHorizontal,
  Plus,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  Eye,
  Pencil,
  Trash2,
  LayoutDashboard,
  Image as ImageIcon,
  Star,
  GripVertical,
  Video,
  Link2,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Upload,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { Navbar } from '../layout/Navbar'
import { WorldMapTab } from './WorldMapTab'
import { MembersTab } from './MembersTab'
import { CampaignApprovalTab } from './CampaignApprovalTab'
import { cn } from '@/lib/utils'
import { RowActionMenu } from '@/components/ui/RowActionMenu'
import { bannerStore, type BannerSlide } from '@/lib/bannerStore'

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'approval' | 'worldmap' | 'members' | 'banner' | 'featured'

interface CampaignItem {
  id: string
  title: string
  missionary: string
  country: string
  coverImage: string
  currentAmount: number
  goalAmount: number
  donorCount: number
  daysLeft: number
  status: 'active' | 'urgent' | 'ended'
  isFeatured: boolean
  featuredOrder: number | null
}

// ─── Mock data — dashboard ────────────────────────────────────────────────────
const KPI = [
  { label: '이번 달 모금액', value: '₩ 14,320,000', change: +18.4, icon: TrendingUp, color: 'text-primary', bg: 'bg-accent' },
  { label: '전체 후원자',     value: '2,438명',        change: +6.2,  icon: Users,     color: 'text-primary', bg: 'bg-accent' },
  { label: '활성 사역',       value: '4건',            change: 0,     icon: Heart,     color: 'text-primary', bg: 'bg-accent' },
  { label: '사역 국가',       value: '18개국',          change: +2,    icon: Globe,     color: 'text-primary', bg: 'bg-accent' },
]

const MONTHLY_DATA = [
  { month: '1월', amount: 5_200_000, donors: 180 },
  { month: '2월', amount: 6_800_000, donors: 210 },
  { month: '3월', amount: 4_900_000, donors: 165 },
  { month: '4월', amount: 8_300_000, donors: 280 },
  { month: '5월', amount: 9_100_000, donors: 310 },
  { month: '6월', amount: 12_400_000, donors: 390 },
  { month: '7월', amount: 14_320_000, donors: 438 },
]

const MISSIONS_TABLE = [
  { id: '1', title: '동남아시아 어린이 문해교육 및 복음화 사역', missionary: '김소연', country: '태국',    current: 4_240_000, goal: 8_000_000,  donors: 134, daysLeft: 47, status: 'active' },
  { id: '2', title: '캄보디아 청년 성경교육 및 리더십 훈련',     missionary: '이준혁', country: '캄보디아', current: 2_100_000, goal: 5_000_000,  donors: 67,  daysLeft: 23, status: 'urgent' },
  { id: '3', title: '미얀마 분쟁 지역 의료 봉사 및 구호 사역',   missionary: '박지은·오민준', country: '미얀마', current: 6_800_000, goal: 10_000_000, donors: 201, daysLeft: 12, status: 'urgent' },
  { id: '4', title: '몽골 초원 지역 교회 개척 및 현지 지도자 양성', missionary: '최성민', country: '몽골', current: 1_500_000, goal: 6_000_000,  donors: 42,  daysLeft: 61, status: 'active' },
] as const

const RECENT_DONATIONS = [
  { name: '이수현', mission: '태국 문해교육',    amount: 50_000,  type: '정기', time: '7분 전'   },
  { name: '박지훈', mission: '캄보디아 성경교육', amount: 30_000,  type: '일시', time: '23분 전'  },
  { name: '김민지', mission: '미얀마 의료봉사',   amount: 100_000, type: '정기', time: '1시간 전' },
  { name: '최유진', mission: '태국 문해교육',    amount: 10_000,  type: '일시', time: '2시간 전' },
  { name: '정성훈', mission: '몽골 교회개척',    amount: 50_000,  type: '정기', time: '3시간 전' },
]

// ─── Mock data — campaigns ────────────────────────────────────────────────────
const INITIAL_CAMPAIGNS: CampaignItem[] = [
  { id: '1', title: '동남아시아 어린이 문해교육 및 복음화 사역', missionary: '김소연', country: '태국',    coverImage: '/mission-cover.png',   currentAmount: 4_240_000, goalAmount: 8_000_000,  donorCount: 134, daysLeft: 47, status: 'active', isFeatured: true,  featuredOrder: 1 },
  { id: '2', title: '캄보디아 청년 성경교육 및 리더십 훈련',     missionary: '이준혁', country: '캄보디아', coverImage: '/mission-cover-2.png',  currentAmount: 2_100_000, goalAmount: 5_000_000,  donorCount: 67,  daysLeft: 23, status: 'urgent', isFeatured: false, featuredOrder: null },
  { id: '3', title: '미얀마 분쟁 지역 의료 봉사 및 구호 사역',   missionary: '박지은·오민준', country: '미얀마', coverImage: '/mission-cover-3.png',  currentAmount: 6_800_000, goalAmount: 10_000_000, donorCount: 201, daysLeft: 12, status: 'urgent', isFeatured: true,  featuredOrder: 2 },
  { id: '4', title: '몽골 초원 지역 교회 개척 및 현지 지도자 양성', missionary: '최성민', country: '몽골', coverImage: '/mission-cover-4.png',  currentAmount: 1_500_000, goalAmount: 6_000_000,  donorCount: 42,  daysLeft: 61, status: 'active', isFeatured: false, featuredOrder: null },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatKRW(amount: number): string {
  if (amount >= 10_000) return `${Math.floor(amount / 10_000).toLocaleString()}만원`
  return `${amount.toLocaleString()}원`
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'urgent') return (
    <span className="inline-flex items-center gap-1 bg-[oklch(0.96_0.05_80)] text-[oklch(0.45_0.14_60)] text-xs font-semibold px-2.5 py-1 rounded-full">긴급</span>
  )
  if (status === 'active') return (
    <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full">진행중</span>
  )
  return (
    <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-xs font-semibold px-2.5 py-1 rounded-full">종료</span>
  )
}

// ─── Sub-components ───────────────────���───────────────────────────────────────

/** Inline form for adding / editing a banner slide */
function BannerSlideForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<BannerSlide>
  onSave: (slide: Omit<BannerSlide, 'id' | 'order'>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    title:    initial.title    ?? '',
    subtitle: initial.subtitle ?? '',
    ctaLabel: initial.ctaLabel ?? '자세히 보기',
    ctaHref:  initial.ctaHref  ?? '/mission',
    videoUrl: initial.videoUrl ?? '',
    imageUrl: initial.imageUrl ?? '',
    isActive: initial.isActive ?? true,
  })
  const set = (key: string, val: string | boolean) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <div className="bg-muted/40 border border-border rounded-2xl p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">배너 제목 *</label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="예) 선교사와 함께 세상을 바꿉니다"
            className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>
        {/* Subtitle */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">부제목</label>
          <textarea
            value={form.subtitle}
            onChange={(e) => set('subtitle', e.target.value)}
            rows={2}
            placeholder="배너 아래 표시될 짧은 설명을 입력하세요"
            className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
          />
        </div>
        {/* CTA label */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">버튼 텍스트</label>
          <input
            value={form.ctaLabel}
            onChange={(e) => set('ctaLabel', e.target.value)}
            placeholder="자세히 보기"
            className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>
        {/* CTA href */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <Link2 size={12} /> 버튼 링크
          </label>
          <input
            value={form.ctaHref}
            onChange={(e) => set('ctaHref', e.target.value)}
            placeholder="/mission"
            className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>
        {/* Image URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <Upload size={12} /> 배경 이미지 경로
          </label>
          <input
            value={form.imageUrl}
            onChange={(e) => set('imageUrl', e.target.value)}
            placeholder="/mission-cover.png"
            className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>
        {/* Video URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <Video size={12} /> 동영상 링크 (선택)
          </label>
          <input
            value={form.videoUrl}
            onChange={(e) => set('videoUrl', e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>
        {/* Active toggle */}
        <div className="md:col-span-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => set('isActive', !form.isActive)}
            className="flex items-center gap-2"
            aria-pressed={form.isActive}
          >
            {form.isActive
              ? <ToggleRight size={28} className="text-primary" />
              : <ToggleLeft size={28} className="text-muted-foreground" />}
            <span className="text-sm font-medium text-foreground">
              {form.isActive ? '활성화 (홈페이지에 노출됨)' : '비활성화 (노출 안됨)'}
            </span>
          </button>
        </div>
      </div>

      {/* Image preview */}
      {form.imageUrl && (
        <div className="rounded-xl overflow-hidden border border-border h-36 relative bg-muted">
          <Image src={form.imageUrl} alt="배너 미리보기" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
            <p className="text-white font-bold text-base line-clamp-1">{form.title || '배너 제목'}</p>
            {form.subtitle && <p className="text-white/80 text-xs mt-0.5 line-clamp-1">{form.subtitle}</p>}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-1">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          취소
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={!form.title}
          className="flex items-center gap-1.5 bg-primary hover:bg-[oklch(0.44_0.12_195)] disabled:opacity-50 text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Check size={14} /> 저장
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('worldmap')

  // Dashboard state
  const [chartView, setChartView]   = useState<'amount' | 'donors'>('amount')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Banner state — initialised from shared store so HomePage sees the same data
  const [banners, setBanners]               = useState<BannerSlide[]>(() => bannerStore.get())

  // Write-through: keep the store in sync whenever banners change
  useEffect(() => { bannerStore.set(banners) }, [banners])
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null)
  const [showAddBanner, setShowAddBanner]   = useState(false)
  const [previewIndex, setPreviewIndex]     = useState(0)

  // Campaign feature state
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(INITIAL_CAMPAIGNS)

  // ── Banner helpers ──────────────────────────────────────��─────────────────
  const activeBanners = banners.filter((b) => b.isActive).sort((a, b) => a.order - b.order)

  function addBanner(data: Omit<BannerSlide, 'id' | 'order'>) {
    const newBanner: BannerSlide = {
      ...data,
      id: `b${Date.now()}`,
      order: banners.length + 1,
    }
    setBanners((prev) => [...prev, newBanner])
    setShowAddBanner(false)
  }

  function updateBanner(id: string, data: Omit<BannerSlide, 'id' | 'order'>) {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)))
    setEditingBannerId(null)
  }

  function deleteBanner(id: string) {
    setBanners((prev) => prev.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i + 1 })))
  }

  function moveBanner(id: string, dir: 'up' | 'down') {
    setBanners((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order)
      const idx = sorted.findIndex((b) => b.id === id)
      const target = dir === 'up' ? idx - 1 : idx + 1
      if (target < 0 || target >= sorted.length) return prev
      const updated = [...sorted]
      ;[updated[idx].order, updated[target].order] = [updated[target].order, updated[idx].order]
      return updated
    })
  }

  function toggleBannerActive(id: string) {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b)))
  }

  // ── Campaign feature helpers ───────────────────────────────────────────────
  const featuredCampaigns = campaigns
    .filter((c) => c.isFeatured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))

  const nextFeaturedOrder = Math.max(0, ...featuredCampaigns.map((c) => c.featuredOrder ?? 0)) + 1

  function toggleFeatured(id: string) {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        if (c.isFeatured) return { ...c, isFeatured: false, featuredOrder: null }
        return { ...c, isFeatured: true, featuredOrder: nextFeaturedOrder }
      })
    )
  }

  function moveFeatured(id: string, dir: 'up' | 'down') {
    setCampaigns((prev) => {
      const sorted = [...prev].filter((c) => c.isFeatured).sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
      const idx = sorted.findIndex((c) => c.id === id)
      const target = dir === 'up' ? idx - 1 : idx + 1
      if (target < 0 || target >= sorted.length) return prev
      const aOrder = sorted[idx].featuredOrder
      const bOrder = sorted[target].featuredOrder
      return prev.map((c) => {
        if (c.id === sorted[idx].id)    return { ...c, featuredOrder: bOrder }
        if (c.id === sorted[target].id) return { ...c, featuredOrder: aOrder }
        return c
      })
    })
  }

  // ── Tabs config ───────────────────────────────────────────────────────────
  const TABS: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'worldmap',  label: '세계 선교지도',  icon: Globe },
    { id: 'dashboard', label: '대시보드',      icon: LayoutDashboard },
    { id: 'approval',  label: '프로젝트 승인',   icon: Check },
    { id: 'members',   label: '회원 관리',    icon: Users },
    { id: 'banner',    label: '배너 관리',    icon: ImageIcon, count: banners.length },
    { id: 'featured',  label: '추천 프로젝트',  icon: Star, count: featuredCampaigns.length },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">

        {/* Page header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">관리자 대시보드</h1>
            <p className="text-muted-foreground text-sm mt-0.5">2025년 7월 기준 — 실시간 데이터</p>
          </div>
          <Link
            href="/mission"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
          >
            <Plus size={15} />
            사역 추가
          </Link>
        </div>

        {/* Tab nav — scroll on mobile, compact row on desktop */}
        <div className="-mx-4 px-4 md:mx-0 md:px-0">
          <div
            role="tablist"
            aria-label="관리자 메뉴"
            className="flex items-center gap-1 bg-muted/60 p-1 rounded-2xl border border-border w-full md:w-fit overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0',
                  activeTab === tab.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon size={15} />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={cn(
                    'text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5',
                    activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground'
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab: Dashboard ─────────────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {KPI.map((kpi) => (
                <div key={kpi.label} className="bg-card rounded-2xl border border-border p-3 sm:p-5 shadow-sm min-w-0">
                  <div className="flex items-start justify-between mb-3 gap-1">
                    <div className={cn('w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0', kpi.bg)}>
                      <kpi.icon size={18} className={kpi.color} />
                    </div>
                    {kpi.change !== 0 && (
                      <div className={cn(
                        'flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full',
                        kpi.change > 0 ? 'bg-[oklch(0.94_0.06_165)] text-[oklch(0.38_0.12_165)]' : 'bg-[oklch(0.96_0.04_27)] text-[oklch(0.50_0.16_27)]'
                      )}>
                        {kpi.change > 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        {Math.abs(kpi.change)}%
                      </div>
                    )}
                  </div>
                  <p className="text-base sm:text-xl font-bold text-foreground break-words leading-tight">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Charts + recent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-4 sm:p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
                  <div>
                    <h2 className="font-bold text-foreground">월별 모금 현황</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">2025년 1월 — 7월</p>
                  </div>
                  <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    {(['amount', 'donors'] as const).map((v) => (
                      <button key={v} onClick={() => setChartView(v)} className={cn(
                        'text-xs font-medium px-3 py-1.5 rounded-md transition-colors',
                        chartView === v ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      )}>
                        {v === 'amount' ? '금액' : '후원자'}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={MONTHLY_DATA} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.52 0.12 195)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="oklch(0.52 0.12 195)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0 0)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'oklch(0.50 0 0)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'oklch(0.50 0 0)' }} axisLine={false} tickLine={false}
                      tickFormatter={(v) => chartView === 'amount' ? `${v / 10_000}만` : `${v}`} />
                    <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid oklch(0.91 0 0)', fontSize: 12 }}
                      formatter={(v) => chartView === 'amount' ? [`${(Number(v ?? 0) / 10_000).toLocaleString()}만원`, '모금액'] : [`${Number(v ?? 0).toLocaleString()}명`, '후원자']} />
                    <Area type="monotone" dataKey={chartView === 'amount' ? 'amount' : 'donors'} stroke="oklch(0.52 0.12 195)" strokeWidth={2.5} fill="url(#colorPrimary)" dot={{ r: 3, fill: 'oklch(0.52 0.12 195)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-foreground">최근 후원</h2>
                  <button className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline">전체 보기 <ArrowUpRight size={12} /></button>
                </div>
                <ul className="space-y-3 flex-1">
                  {RECENT_DONATIONS.map((d, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-accent-foreground">{d.name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{d.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{d.mission}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-foreground">{d.amount.toLocaleString()}원</p>
                        <p className="text-xs text-muted-foreground">{d.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mission table */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
                <h2 className="font-bold text-foreground">사역 목록</h2>
                <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">총 {MISSIONS_TABLE.length}건</span>
              </div>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left font-semibold text-muted-foreground px-6 py-3">사역명</th>
                      <th className="text-left font-semibold text-muted-foreground px-4 py-3">국가</th>
                      <th className="text-left font-semibold text-muted-foreground px-4 py-3">진행률</th>
                      <th className="text-right font-semibold text-muted-foreground px-4 py-3">후원자</th>
                      <th className="text-right font-semibold text-muted-foreground px-4 py-3">마감</th>
                      <th className="text-center font-semibold text-muted-foreground px-4 py-3">상태</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {MISSIONS_TABLE.map((m, i) => {
                      const pct = Math.round((m.current / m.goal) * 100)
                      return (
                        <tr key={m.id} className={cn('border-b border-border last:border-0 hover:bg-muted/30 transition-colors', i % 2 === 1 && 'bg-muted/10')}>
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground line-clamp-1">{m.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{m.missionary}</p>
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">{m.country}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden flex-shrink-0">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs font-semibold text-primary w-8">{pct}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{formatKRW(m.current)} / {formatKRW(m.goal)}</p>
                          </td>
                          <td className="px-4 py-4 text-right font-medium text-foreground">{m.donors.toLocaleString()}명</td>
                          <td className="px-4 py-4 text-right text-muted-foreground">{m.daysLeft}일</td>
                          <td className="px-4 py-4 text-center"><StatusBadge status={m.status} /></td>
                          <td className="px-4 py-4">
                            <div className="flex justify-end">
                              <RowActionMenu
                                open={openMenuId === m.id}
                                onClose={() => setOpenMenuId(null)}
                                widthClassName="w-32"
                                trigger={
                                  <button
                                    type="button"
                                    onClick={() => setOpenMenuId(openMenuId === m.id ? null : m.id)}
                                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                    aria-label="더보기"
                                    aria-expanded={openMenuId === m.id}
                                  >
                                    <MoreHorizontal size={16} className="text-muted-foreground" />
                                  </button>
                                }
                              >
                                <Link
                                  href="/mission"
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                  onClick={() => setOpenMenuId(null)}
                                  role="menuitem"
                                >
                                  <Eye size={14} /> 보기
                                </Link>
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                >
                                  <Pencil size={14} /> 수정
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                                >
                                  <Trash2 size={14} /> 삭제
                                </button>
                              </RowActionMenu>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden divide-y divide-border">
                {MISSIONS_TABLE.map((m) => {
                  const pct = Math.round((m.current / m.goal) * 100)
                  return (
                    <div key={m.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm line-clamp-2">{m.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{m.missionary} · {m.country}</p>
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{formatKRW(m.current)} / {formatKRW(m.goal)}</span>
                          <span className="font-semibold text-primary">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{m.donors.toLocaleString()}명 후원</span>
                        <span>{m.daysLeft}일 남음</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Country bar chart */}
            <div className="bg-card rounded-2xl border border-border p-4 sm:p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="font-bold text-foreground">국가별 모금 현황</h2>
                <p className="text-xs text-muted-foreground mt-0.5">현재까지 누적 금액</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[{ country: '태국', amount: 4_240_000 }, { country: '캄보디아', amount: 2_100_000 }, { country: '미얀마', amount: 6_800_000 }, { country: '몽골', amount: 1_500_000 }]} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0 0)" vertical={false} />
                  <XAxis dataKey="country" tick={{ fontSize: 12, fill: 'oklch(0.50 0 0)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'oklch(0.50 0 0)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 10_000}만`} />
                  <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid oklch(0.91 0 0)', fontSize: 12 }} formatter={(v) => [`${(Number(v ?? 0) / 10_000).toLocaleString()}만원`, '누적 모금액']} />
                  <Bar dataKey="amount" fill="oklch(0.52 0.12 195)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Tab: Campaign approval ─────────────────────────────────────────── */}
        {activeTab === 'approval' && <CampaignApprovalTab />}

        {/* ── Tab: World map ─────────────────────────────────────────────────── */}
        {activeTab === 'worldmap' && <WorldMapTab />}

        {/* ── Tab: Member management ─────────────────────────────────────────── */}
        {activeTab === 'members' && <MembersTab />}

        {/* ── Tab: Banner management ──────────────────────────────────────────── */}
        {activeTab === 'banner' && (
          <div className="space-y-6">
            {/* Live preview */}
            {activeBanners.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-bold text-foreground">홈페이지 배너 미리보기</h2>
                  <p className="text-xs text-muted-foreground flex-shrink-0">활성 {activeBanners.length}개</p>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-border h-44 sm:h-52 bg-primary">
                  {activeBanners[previewIndex]?.imageUrl && (
                    <Image
                      src={activeBanners[previewIndex].imageUrl}
                      alt={activeBanners[previewIndex].title}
                      fill
                      className="object-cover opacity-30"
                    />
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.85_0.06_195)] mb-2">YWAMKOREAFUND</p>
                    <h3 className="text-lg sm:text-2xl font-bold text-white text-balance mb-1.5 line-clamp-2">
                      {activeBanners[previewIndex].title}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-2 mb-4">
                      {activeBanners[previewIndex].subtitle}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex bg-white text-primary font-bold text-sm px-4 py-2 rounded-xl">
                        {activeBanners[previewIndex].ctaLabel}
                      </span>
                      {activeBanners[previewIndex].videoUrl && (
                        <span className="inline-flex items-center gap-1.5 border border-white/40 text-white text-sm px-3 py-2 rounded-xl">
                          <Video size={14} /> 영상 보기
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Carousel nav */}
                  {activeBanners.length > 1 && (
                    <>
                      <button
                        onClick={() => setPreviewIndex((i) => (i - 1 + activeBanners.length) % activeBanners.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => setPreviewIndex((i) => (i + 1) % activeBanners.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                        {activeBanners.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setPreviewIndex(i)}
                            className={cn('w-1.5 h-1.5 rounded-full transition-all', i === previewIndex ? 'bg-white w-4' : 'bg-white/50')}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Add new banner */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="font-bold text-foreground">배너 슬라이드 관리</h2>
                <p className="text-xs text-muted-foreground mt-0.5">순서를 변경하거나 활성/비활성으로 노출 여부를 제어할 수 있습니다.</p>
              </div>
              <button
                onClick={() => { setShowAddBanner(true); setEditingBannerId(null) }}
                className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
              >
                <Plus size={14} /> 슬라이드 추가
              </button>
            </div>

            {/* Add form */}
            {showAddBanner && (
              <BannerSlideForm
                initial={{}}
                onSave={addBanner}
                onCancel={() => setShowAddBanner(false)}
              />
            )}

            {/* Slide list */}
            <div className="space-y-3">
              {banners.sort((a, b) => a.order - b.order).map((banner) => (
                <div key={banner.id}>
                  <div className={cn(
                    'bg-card border rounded-2xl overflow-hidden shadow-sm transition-all',
                    banner.isActive ? 'border-border' : 'border-border opacity-60'
                  )}>
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4">
                      {/* Drag handle / order */}
                      <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                        <button onClick={() => moveBanner(banner.id, 'up')} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <ChevronUp size={14} />
                        </button>
                        <span className="text-xs font-bold text-muted-foreground w-5 text-center">{banner.order}</span>
                        <button onClick={() => moveBanner(banner.id, 'down')} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      {/* Thumbnail */}
                      <div className="w-14 h-10 sm:w-20 sm:h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0 relative">
                        {banner.imageUrl ? (
                          <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon size={20} className="text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-foreground text-sm line-clamp-1">{banner.title}</p>
                          {banner.videoUrl && (
                            <span className="inline-flex items-center gap-1 bg-[oklch(0.94_0.03_270)] text-[oklch(0.45_0.12_270)] text-xs font-medium px-2 py-0.5 rounded-full">
                              <Video size={10} /> 영상
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{banner.subtitle}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          버튼: <span className="font-medium text-foreground">{banner.ctaLabel}</span>
                          {banner.ctaHref && <span className="ml-1 text-primary">{banner.ctaHref}</span>}
                        </p>
                      </div>

                      {/* Active toggle */}
                      <button
                        onClick={() => toggleBannerActive(banner.id)}
                        className="flex-shrink-0 self-center"
                        aria-label={banner.isActive ? '비활성화' : '활성화'}
                      >
                        {banner.isActive
                          ? <ToggleRight size={26} className="text-primary" />
                          : <ToggleLeft size={26} className="text-muted-foreground" />}
                      </button>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0 self-center">
                        <button
                          onClick={() => { setEditingBannerId(editingBannerId === banner.id ? null : banner.id); setShowAddBanner(false) }}
                          className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="수정"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => deleteBanner(banner.id)}
                          className="p-2 rounded-xl hover:bg-[oklch(0.97_0.02_27)] text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="삭제"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Inline edit form */}
                    {editingBannerId === banner.id && (
                      <div className="border-t border-border p-4">
                        <BannerSlideForm
                          initial={banner}
                          onSave={(data) => updateBanner(banner.id, data)}
                          onCancel={() => setEditingBannerId(null)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {banners.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
                <ImageIcon size={36} className="mx-auto mb-3 text-muted-foreground opacity-40" />
                <p className="font-medium text-muted-foreground">등록된 배너 슬라이드가 없습니다.</p>
                <button onClick={() => setShowAddBanner(true)} className="mt-3 text-sm text-primary font-medium hover:underline">
                  첫 번째 슬라이드 추가하기
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Featured campaigns ─────────────────────────────────────────── */}
        {activeTab === 'featured' && (
          <div className="space-y-6">

            {/* Info banner */}
            <div className="flex items-start gap-3 bg-accent rounded-2xl p-4 border border-border">
              <AlertCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-accent-foreground leading-relaxed">
                추천 프로젝트는 홈페이지 &apos;진행 중인 사역&apos; 섹션의 <strong>추천 필터</strong>에서 우선 노출됩니다. 순서를 변경하려면 위·아래 화살표를 사용하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Featured list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-foreground">추천 프로젝트 순서</h2>
                  <span className="text-xs bg-primary text-primary-foreground font-bold px-2.5 py-1 rounded-full">
                    {featuredCampaigns.length}개 선정됨
                  </span>
                </div>

                {featuredCampaigns.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                    <Star size={32} className="mx-auto mb-2 text-muted-foreground opacity-30" />
                    <p className="text-sm text-muted-foreground">선정된 추천 프로젝트가 없습니다.</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="lg:hidden">아래 목록에서 프로젝트를 선택하세요.</span>
                      <span className="hidden lg:inline">오른쪽 목록에서 프로젝트를 선택하세요.</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {featuredCampaigns.map((c, idx) => (
                      <div key={c.id} className="flex items-center gap-3 bg-card border border-primary/30 rounded-2xl p-3 shadow-sm">
                        {/* Order controls */}
                        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                          <button onClick={() => moveFeatured(c.id, 'up')} disabled={idx === 0} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
                            <ChevronUp size={13} />
                          </button>
                          <span className="text-xs font-bold text-primary w-4 text-center">{idx + 1}</span>
                          <button onClick={() => moveFeatured(c.id, 'down')} disabled={idx === featuredCampaigns.length - 1} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
                            <ChevronDown size={13} />
                          </button>
                        </div>
                        {/* Thumb */}
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-muted relative flex-shrink-0">
                          <Image src={c.coverImage} alt={c.title} fill className="object-cover" />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground line-clamp-1">{c.title}</p>
                          <p className="text-xs text-muted-foreground">{c.missionary} · {c.country}</p>
                        </div>
                        {/* Star badge */}
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[oklch(0.96_0.06_85)] flex items-center justify-center">
                          <Star size={12} className="text-[oklch(0.55_0.16_75)] fill-[oklch(0.55_0.16_75)]" />
                        </span>
                        {/* Remove */}
                        <button onClick={() => toggleFeatured(c.id)} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* All campaigns list */}
              <div className="space-y-3">
                <h2 className="font-bold text-foreground">전체 프로젝트</h2>
                <div className="space-y-2">
                  {campaigns.map((c) => {
                    const pct = Math.round((c.currentAmount / c.goalAmount) * 100)
                    return (
                      <div key={c.id} className={cn(
                        'flex items-start sm:items-center gap-3 bg-card border rounded-2xl p-3 shadow-sm transition-all',
                        c.isFeatured ? 'border-primary/30' : 'border-border'
                      )}>
                        {/* Thumb */}
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-muted relative flex-shrink-0">
                          <Image src={c.coverImage} alt={c.title} fill className="object-cover" />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-sm font-semibold text-foreground line-clamp-1">{c.title}</p>
                            <StatusBadge status={c.status} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{c.missionary} · {c.country}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-primary flex-shrink-0">{pct}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatKRW(c.currentAmount)} · {c.donorCount.toLocaleString()}명 · {c.daysLeft}일 남음
                          </p>
                        </div>
                        {/* Toggle featured */}
                        <button
                          onClick={() => toggleFeatured(c.id)}
                          aria-label={c.isFeatured ? '추천 해제' : '추천 지정'}
                          className={cn(
                            'flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all self-center',
                            c.isFeatured
                              ? 'bg-[oklch(0.96_0.06_85)] border-[oklch(0.88_0.10_80)] text-[oklch(0.45_0.15_70)]'
                              : 'bg-muted border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                          )}
                        >
                          <Star size={12} className={c.isFeatured ? 'fill-[oklch(0.55_0.16_75)]' : ''} />
                          <span className="hidden sm:inline">{c.isFeatured ? '추천 중' : '추천 지정'}</span>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Homepage preview of featured section */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-bold text-foreground">홈페이지 노출 미리보기</h2>
                <span className="text-xs text-muted-foreground">추천 필터 선택 시 표시되는 순서</span>
              </div>
              {featuredCampaigns.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border rounded-2xl text-muted-foreground text-sm">
                  추천 프로젝트를 선정하면 여기서 미리볼 수 있습니다.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredCampaigns.map((c, idx) => {
                    const pct = Math.round((c.currentAmount / c.goalAmount) * 100)
                    return (
                      <div key={c.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                        <div className="relative h-36">
                          <Image src={c.coverImage} alt={c.title} fill className="object-cover" />
                          <div className="absolute top-2 left-2 flex items-center gap-1 bg-[oklch(0.96_0.06_85)] text-[oklch(0.45_0.15_70)] text-xs font-bold px-2 py-0.5 rounded-full">
                            <Star size={10} className="fill-[oklch(0.55_0.16_75)]" /> 추천 #{idx + 1}
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">{c.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{c.missionary} · {c.country}</p>
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{formatKRW(c.currentAmount)}</span>
                              <span className="font-semibold text-primary">{pct}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-4 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">YWAMKOREAFUND — 관리자 전용</p>
          <p>무단 접근을 금지합니다 · 개인정보처리방침 · 이용약관</p>
        </div>
      </footer>
    </div>
  )
}
