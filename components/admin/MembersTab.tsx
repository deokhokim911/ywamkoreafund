'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Search, MoreHorizontal, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, Mail, Phone, MapPin,
  ShieldCheck, Clock, CheckCircle, XCircle, X, Eye,
  UserCheck, UserX, Send, Users, Heart, Globe, Plus, Pencil,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RowActionMenu } from '@/components/ui/RowActionMenu'
import { MissionaryDashboardPage } from '@/components/dashboard/MissionaryDashboardPage'
import { DonorDashboardPage } from '@/components/donor/DonorDashboardPage'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Missionary {
  id: string
  name: string
  email: string
  phone: string
  country: string
  organization: string
  campaigns: number
  totalRaised: number
  donorCount: number
  joinedAt: string
  status: 'active' | 'pending' | 'inactive'
}

interface Donor {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string
  newsletterOptIn: boolean
  totalAmount: number
  donationCount: number
  regularAmount: number
  lastDonation: string
  joinedAt: string
  status: 'active' | 'inactive' | 'paused'
  campaigns: string[]
}

// ─── Initial mock data ─────────────────────────────────────────────────────────
const INIT_MISSIONARIES: Missionary[] = [
  { id: 'm1', name: '김소연',  email: 'soyeon.kim@ywam.or.kr',   phone: '010-2341-5678', country: '태국',      organization: '예수전도단', campaigns: 2, totalRaised: 4_240_000, donorCount: 134, joinedAt: '2022.03.14', status: 'active'   },
  { id: 'm2', name: '이준혁',  email: 'junhyuk.lee@ywam.or.kr',  phone: '010-3892-1234', country: '캄보디아',  organization: '예수전도단', campaigns: 1, totalRaised: 2_100_000, donorCount: 67,  joinedAt: '2023.01.08', status: 'active'   },
  { id: 'm3', name: '박지은',  email: 'jieun.park@ywam.or.kr',   phone: '010-5613-8902', country: '미얀마',    organization: '예수전도단', campaigns: 1, totalRaised: 6_800_000, donorCount: 201, joinedAt: '2021.07.22', status: 'active'   },
  { id: 'm4', name: '오민준',  email: 'minjun.oh@ywam.or.kr',    phone: '010-9120-3456', country: '미얀마',    organization: '예수전도단', campaigns: 1, totalRaised: 6_800_000, donorCount: 201, joinedAt: '2021.07.22', status: 'active'   },
  { id: 'm5', name: '최성민',  email: 'sungmin.choi@ywam.or.kr', phone: '010-7854-2109', country: '몽골',      organization: '예수전도단', campaigns: 1, totalRaised: 1_500_000, donorCount: 42,  joinedAt: '2023.09.01', status: 'active'   },
  { id: 'm6', name: '정하늘',  email: 'haneul.jung@ywam.or.kr',  phone: '010-4401-6789', country: '인도네시아',organization: '예수전도단', campaigns: 0, totalRaised: 0,          donorCount: 0,   joinedAt: '2025.06.10', status: 'pending'  },
  { id: 'm7', name: '이서영',  email: 'seoyoung.lee@ywam.or.kr', phone: '010-1102-4567', country: '인도',      organization: '예수전도단', campaigns: 0, totalRaised: 420_000,    donorCount: 14,  joinedAt: '2024.11.30', status: 'inactive' },
]

const INIT_DONORS: Donor[] = [
  { id: 'd1',  name: '이수현', email: 'suhyun.lee@gmail.com',   phone: '010-3312-9087', birthDate: '1992-03-14', newsletterOptIn: true,  totalAmount: 480_000,   donationCount: 12, regularAmount: 30_000,  lastDonation: '2025.07.14', joinedAt: '2024.07.20', status: 'active',   campaigns: ['태국 문해교육', '미얀마 의료봉사'] },
  { id: 'd2',  name: '박지훈', email: 'jihoon.park@naver.com',  phone: '010-5541-2031', birthDate: '1988-11-02', newsletterOptIn: false, totalAmount: 120_000,   donationCount: 4,  regularAmount: 0,        lastDonation: '2025.07.13', joinedAt: '2025.02.11', status: 'active',   campaigns: ['캄보디아 성경교육'] },
  { id: 'd3',  name: '김민지', email: 'minji.kim@kakao.com',    phone: '010-8820-3345', birthDate: '1995-07-21', newsletterOptIn: true,  totalAmount: 1_200_000, donationCount: 24, regularAmount: 50_000,  lastDonation: '2025.07.12', joinedAt: '2023.07.01', status: 'active',   campaigns: ['미얀마 의료봉사', '태국 문해교육', '몽골 교회개척'] },
  { id: 'd4',  name: '최유진', email: 'yujin.choi@gmail.com',   phone: '010-2293-8812', birthDate: '2001-01-08', newsletterOptIn: true,  totalAmount: 60_000,    donationCount: 6,  regularAmount: 0,        lastDonation: '2025.07.11', joinedAt: '2025.04.15', status: 'active',   campaigns: ['태국 문해교육'] },
  { id: 'd5',  name: '정성훈', email: 'sunghun.jung@naver.com', phone: '010-7710-5523', birthDate: '1985-09-30', newsletterOptIn: false, totalAmount: 600_000,   donationCount: 12, regularAmount: 50_000,  lastDonation: '2025.07.10', joinedAt: '2024.07.01', status: 'active',   campaigns: ['몽골 교회개척'] },
  { id: 'd6',  name: '한소희', email: 'sohee.han@gmail.com',    phone: '010-4430-1199', birthDate: '1990-05-16', newsletterOptIn: true,  totalAmount: 250_000,   donationCount: 5,  regularAmount: 50_000,  lastDonation: '2025.06.01', joinedAt: '2025.01.20', status: 'paused',   campaigns: ['캄보디아 성경교육'] },
  { id: 'd7',  name: '윤재원', email: 'jaewon.yun@kakao.com',   phone: '010-9900-8812', birthDate: '1998-12-03', newsletterOptIn: false, totalAmount: 90_000,    donationCount: 3,  regularAmount: 0,        lastDonation: '2025.04.22', joinedAt: '2025.03.05', status: 'active',   campaigns: ['태국 문해교육'] },
  { id: 'd8',  name: '임채원', email: 'chaewon.lim@naver.com',  phone: '010-3381-7745', birthDate: '1979-04-27', newsletterOptIn: false, totalAmount: 30_000,    donationCount: 1,  regularAmount: 0,        lastDonation: '2025.03.01', joinedAt: '2025.03.01', status: 'inactive', campaigns: ['미얀마 의료봉사'] },
  { id: 'd9',  name: '강다은', email: 'daeun.kang@gmail.com',   phone: '010-6612-4400', birthDate: '1993-08-11', newsletterOptIn: true,  totalAmount: 360_000,   donationCount: 12, regularAmount: 30_000,  lastDonation: '2025.07.08', joinedAt: '2024.07.08', status: 'active',   campaigns: ['태국 문해교육', '캄보디아 성경교육'] },
  { id: 'd10', name: '서준호', email: 'junho.seo@kakao.com',    phone: '010-1120-9923', birthDate: '1987-02-19', newsletterOptIn: true,  totalAmount: 800_000,   donationCount: 16, regularAmount: 50_000,  lastDonation: '2025.07.07', joinedAt: '2024.03.10', status: 'active',   campaigns: ['미얀마 의료봉사'] },
  { id: 'd11', name: '오지수', email: 'jisu.oh@naver.com',      phone: '010-7723-3310', birthDate: '1996-06-25', newsletterOptIn: false, totalAmount: 150_000,   donationCount: 3,  regularAmount: 50_000,  lastDonation: '2025.07.05', joinedAt: '2025.04.01', status: 'active',   campaigns: ['몽골 교회개척'] },
  { id: 'd12', name: '신예진', email: 'yejin.shin@gmail.com',   phone: '010-5534-6612', birthDate: '2000-10-09', newsletterOptIn: true,  totalAmount: 100_000,   donationCount: 2,  regularAmount: 0,        lastDonation: '2025.05.22', joinedAt: '2025.02.14', status: 'inactive', campaigns: ['캄보디아 성경교육'] },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatKRW(v: number) {
  if (v >= 10_000) return `${Math.floor(v / 10_000).toLocaleString()}만원`
  return `${v.toLocaleString()}원`
}
function today() {
  const d = new Date()
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}
function uid() { return Math.random().toString(36).slice(2, 9) }

const M_STATUS_LABEL: Record<string, string> = { active: '활성', pending: '승인 대기', inactive: '비활성' }
const M_STATUS_COLOR: Record<string, string>  = {
  active:   'bg-accent text-accent-foreground',
  pending:  'bg-[oklch(0.96_0.05_80)] text-[oklch(0.45_0.14_60)]',
  inactive: 'bg-muted text-muted-foreground',
}
const D_STATUS_LABEL: Record<string, string> = { active: '활성', inactive: '비활성', paused: '일시정지' }
const D_STATUS_COLOR: Record<string, string>  = {
  active:   'bg-accent text-accent-foreground',
  paused:   'bg-[oklch(0.96_0.05_80)] text-[oklch(0.45_0.14_60)]',
  inactive: 'bg-muted text-muted-foreground',
}

const PAGE_SIZE = 6

// ─── Field helpers ─────────────────────────────────────────────────────────────
function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const INPUT = 'w-full px-3 py-2.5 text-sm bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground'
const SELECT = 'w-full px-3 py-2.5 text-sm bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring appearance-none'

// ─── Missionary form modal ─────────────────────────────────────────────────────
interface MFormState {
  name: string; email: string; phone: string
  country: string; organization: string
  status: Missionary['status']
}
const EMPTY_M: MFormState = { name: '', email: '', phone: '', country: '', organization: '예수전도단', status: 'pending' }

function MissionaryFormModal({
  initial, target, onSave, onClose,
}: {
  initial: MFormState
  target: Missionary | null   // null = new
  onSave: (m: Missionary) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<MFormState>(initial)
  const [errors, setErrors] = useState<Partial<MFormState>>({})

  function set(k: keyof MFormState, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  function validate() {
    const e: Partial<MFormState> = {}
    if (!form.name.trim())         e.name = '이름을 입력하세요'
    if (!form.email.trim())        e.email = '이메일을 입력하세요'
    if (!form.country.trim())      e.country = '사역 국가를 입력하세요'
    if (!form.organization.trim()) e.organization = '소속 단체를 입력하세요'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    const saved: Missionary = target
      ? { ...target, ...form }
      : { id: `m${uid()}`, ...form, campaigns: 0, totalRaised: 0, donorCount: 0, joinedAt: today() }
    onSave(saved)
  }

  const isNew = !target
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-foreground text-base">{isNew ? '선교사 추가' : '선교사 정보 수정'}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{isNew ? '새 선교사를 수기로 등록합니다.' : `${target.name} 님의 정보를 수정합니다.`}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <Field label="이름" required>
              <input className={cn(INPUT, errors.name && 'border-destructive')} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="홍길동" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </Field>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Field label="상태">
              <select className={SELECT} value={form.status} onChange={(e) => set('status', e.target.value as Missionary['status'])}>
                <option value="active">활성</option>
                <option value="pending">승인 대기</option>
                <option value="inactive">비활성</option>
              </select>
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="이메일" required>
              <input className={cn(INPUT, errors.email && 'border-destructive')} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="example@ywam.or.kr" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </Field>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Field label="전화번호">
              <input className={INPUT} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="010-0000-0000" />
            </Field>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Field label="사역 국가" required>
              <input className={cn(INPUT, errors.country && 'border-destructive')} value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="태국" />
              {errors.country && <p className="text-xs text-destructive mt-1">{errors.country}</p>}
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="소속 단체" required>
              <input className={cn(INPUT, errors.organization && 'border-destructive')} value={form.organization} onChange={(e) => set('organization', e.target.value)} placeholder="예수전도단" />
              {errors.organization && <p className="text-xs text-destructive mt-1">{errors.organization}</p>}
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
            취소
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-[oklch(0.44_0.12_195)] transition-colors">
            {isNew ? '등록하기' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Donor form modal ──────────────────────────────────────────────────────────
interface DFormState {
  name: string; email: string; phone: string
  birthDate: string
  newsletterOptIn: boolean
  regularAmount: string; status: Donor['status']
  campaigns: string
}
const EMPTY_D: DFormState = {
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  newsletterOptIn: false,
  regularAmount: '',
  status: 'active',
  campaigns: '',
}

function DonorFormModal({
  initial, target, onSave, onClose,
}: {
  initial: DFormState
  target: Donor | null
  onSave: (d: Donor) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<DFormState>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof DFormState, string>>>({})

  function set(k: keyof DFormState, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  function validate() {
    const e: Partial<Record<keyof DFormState, string>> = {}
    if (!form.name.trim()) e.name = '이름을 입력하세요'
    if (!form.email.trim()) e.email = '이메일을 입력하세요'
    if (!form.birthDate) e.birthDate = '생년월일을 입력하세요'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    const campaignList = form.campaigns.split(',').map((c) => c.trim()).filter(Boolean)
    const regularAmt = parseInt(form.regularAmount.replace(/[^0-9]/g, ''), 10) || 0
    const saved: Donor = target
      ? {
          ...target,
          name: form.name,
          email: form.email,
          phone: form.phone,
          birthDate: form.birthDate,
          newsletterOptIn: form.newsletterOptIn,
          status: form.status,
          regularAmount: regularAmt,
          campaigns: campaignList,
        }
      : {
          id: `d${uid()}`,
          name: form.name,
          email: form.email,
          phone: form.phone,
          birthDate: form.birthDate,
          newsletterOptIn: form.newsletterOptIn,
          status: form.status,
          regularAmount: regularAmt,
          campaigns: campaignList,
          totalAmount: 0,
          donationCount: 0,
          lastDonation: '—',
          joinedAt: today(),
        }
    onSave(saved)
  }

  const isNew = !target
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-foreground text-base">{isNew ? '후원자 추가' : '후원자 정보 수정'}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{isNew ? '새 후원자를 수기로 등록합니다.' : `${target.name} 님의 정보를 수정합니다.`}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <Field label="이름" required>
              <input className={cn(INPUT, errors.name && 'border-destructive')} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="홍길동" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </Field>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Field label="상태">
              <select className={SELECT} value={form.status} onChange={(e) => set('status', e.target.value as Donor['status'])}>
                <option value="active">활성</option>
                <option value="paused">일시정지</option>
                <option value="inactive">비활성</option>
              </select>
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="이메일" required>
              <input className={cn(INPUT, errors.email && 'border-destructive')} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="example@gmail.com" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </Field>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Field label="전화번호">
              <input className={INPUT} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="010-0000-0000" />
            </Field>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Field label="생년월일" required>
              <input
                className={cn(INPUT, errors.birthDate && 'border-destructive')}
                type="date"
                value={form.birthDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => set('birthDate', e.target.value)}
              />
              {errors.birthDate && <p className="text-xs text-destructive mt-1">{errors.birthDate}</p>}
            </Field>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Field label="월 정기 후원액">
              <input className={INPUT} value={form.regularAmount} onChange={(e) => set('regularAmount', e.target.value)} placeholder="0" />
            </Field>
          </div>
          <div className="col-span-2">
            <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-border p-3 hover:bg-muted/40 transition-colors">
              <input
                type="checkbox"
                checked={form.newsletterOptIn}
                onChange={(e) => set('newsletterOptIn', e.target.checked)}
                className="mt-0.5 accent-primary w-4 h-4"
              />
              <span>
                <span className="block text-sm font-medium text-foreground">뉴스레터 구독</span>
                <span className="block text-xs text-muted-foreground mt-0.5">사역 소식·프로젝트 안내 메일 수신</span>
              </span>
            </label>
          </div>
          <div className="col-span-2">
            <Field label="후원 프로젝트">
              <input className={INPUT} value={form.campaigns} onChange={(e) => set('campaigns', e.target.value)} placeholder="태국 문해교육, 미얀마 의료봉사 (쉼표로 구분)" />
              <p className="text-xs text-muted-foreground mt-1">여러 프로젝트는 쉼표(,)로 구분해 입력하세요.</p>
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
            취소
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-[oklch(0.44_0.12_195)] transition-colors">
            {isNew ? '등록하기' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Confirm delete modal ──────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onClose }: { message: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[oklch(0.96_0.04_27)] flex items-center justify-center flex-shrink-0">
            <XCircle size={20} className="text-[oklch(0.50_0.16_27)]" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">비활성화 확인</h3>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">취소</button>
          <button onClick={() => { onConfirm(); onClose() }} className="flex-1 py-2.5 rounded-xl bg-[oklch(0.50_0.16_27)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">비활성화</button>
        </div>
      </div>
    </div>
  )
}

// ─── Sort header helpers ────────────────────────────────────────────────────────
function MSortTh({ col, label, current, dir, onSort }: {
  col: 'name' | 'totalRaised' | 'donorCount'
  label: string; current: string; dir: 'asc' | 'desc'
  onSort: (col: 'name' | 'totalRaised' | 'donorCount') => void
}) {
  const active = current === col
  return (
    <th className="text-right font-semibold text-muted-foreground px-4 py-3 cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => onSort(col)}>
      <span className="inline-flex items-center gap-1 justify-end">
        {label}
        {active ? (dir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />) : <ChevronDown size={12} className="opacity-30" />}
      </span>
    </th>
  )
}

function DSortTh({ col, label, current, dir, onSort }: {
  col: 'name' | 'totalAmount' | 'donationCount'
  label: string; current: string; dir: 'asc' | 'desc'
  onSort: (col: 'name' | 'totalAmount' | 'donationCount') => void
}) {
  const active = current === col
  return (
    <th className="text-right font-semibold text-muted-foreground px-4 py-3 cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => onSort(col)}>
      <span className="inline-flex items-center gap-1 justify-end">
        {label}
        {active ? (dir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />) : <ChevronDown size={12} className="opacity-30" />}
      </span>
    </th>
  )
}

function MemberDashboardPreview({
  missionary,
  donor,
  onClose,
}: {
  missionary?: Missionary
  donor?: Donor
  onClose: () => void
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const title = missionary
    ? `${missionary.name} 선교사 대시보드`
    : `${donor?.name ?? ''} 후원자 대시보드`

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-3 border-b border-border bg-card shadow-sm">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">관리자 미리보기</p>
          <p className="text-sm font-bold text-foreground truncate">{title}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          aria-label="대시보드 닫기"
        >
          <X size={15} />
          닫기
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {missionary && (
          <MissionaryDashboardPage
            embedded
            profile={{
              name: missionary.name,
              country: missionary.country,
              organization: missionary.organization,
              totalRaised: missionary.totalRaised,
              donorCount: missionary.donorCount,
              campaignCount: missionary.campaigns,
              status: missionary.status,
            }}
          />
        )}
        {donor && (
          <DonorDashboardPage
            embedded
            profile={{
              name: donor.name,
              email: donor.email,
              phone: donor.phone,
              birthDate: donor.birthDate,
              newsletterOptIn: donor.newsletterOptIn,
              joinedAt: donor.joinedAt,
              totalAmount: donor.totalAmount,
              donationCount: donor.donationCount,
              regularAmount: donor.regularAmount,
              campaigns: donor.campaigns,
              status: donor.status,
            }}
          />
        )}
      </div>
    </div>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export function MembersTab() {
  const [memberView, setMemberView] = useState<'missionary' | 'donor'>('missionary')

  // ── Missionary state ───────────────────────────────────────────────────────
  const [missionaries, setMissionaries] = useState<Missionary[]>(INIT_MISSIONARIES)
  const [mSearch, setMSearch] = useState('')
  const [mStatus, setMStatus] = useState<'all' | 'active' | 'pending' | 'inactive'>('all')
  const [mPage, setMPage]     = useState(1)
  const [mSort, setMSort]     = useState<'name' | 'totalRaised' | 'donorCount'>('totalRaised')
  const [mDir, setMDir]       = useState<'desc' | 'asc'>('desc')
  const [mOpenMenu, setMOpenMenu] = useState<string | null>(null)

  // missionary form/confirm modals
  const [mFormOpen, setMFormOpen]     = useState(false)
  const [mFormTarget, setMFormTarget] = useState<Missionary | null>(null)
  const [mConfirmTarget, setMConfirmTarget] = useState<Missionary | null>(null)
  const [mDashTarget, setMDashTarget] = useState<Missionary | null>(null)

  // ── Donor state ────────────────────────────────────────────────────────────
  const [donors, setDonors] = useState<Donor[]>(INIT_DONORS)
  const [dSearch, setDSearch] = useState('')
  const [dStatus, setDStatus] = useState<'all' | 'active' | 'inactive' | 'paused'>('all')
  const [dPage, setDPage]     = useState(1)
  const [dSort, setDSort]     = useState<'name' | 'totalAmount' | 'donationCount'>('totalAmount')
  const [dDir, setDDir]       = useState<'desc' | 'asc'>('desc')
  const [dOpenMenu, setDOpenMenu] = useState<string | null>(null)

  // donor form/confirm modals
  const [dFormOpen, setDFormOpen]     = useState(false)
  const [dFormTarget, setDFormTarget] = useState<Donor | null>(null)
  const [dConfirmTarget, setDConfirmTarget] = useState<Donor | null>(null)
  const [dDashTarget, setDDashTarget] = useState<Donor | null>(null)

  // ── Missionary list ────────────────────────────────────────────────────────
  const filteredM = useMemo(() => {
    return missionaries
      .filter((m) => mStatus === 'all' || m.status === mStatus)
      .filter((m) => !mSearch || m.name.includes(mSearch) || m.email.includes(mSearch) || m.country.includes(mSearch))
      .sort((a, b) => {
        const av = mSort === 'name' ? a.name : mSort === 'totalRaised' ? a.totalRaised : a.donorCount
        const bv = mSort === 'name' ? b.name : mSort === 'totalRaised' ? b.totalRaised : b.donorCount
        if (typeof av === 'string') return mDir === 'desc' ? av.localeCompare(bv as string) * -1 : av.localeCompare(bv as string)
        return mDir === 'desc' ? (bv as number) - (av as number) : (av as number) - (bv as number)
      })
  }, [missionaries, mSearch, mStatus, mSort, mDir])

  const mTotalPages = Math.max(1, Math.ceil(filteredM.length / PAGE_SIZE))
  const mPageData   = filteredM.slice((mPage - 1) * PAGE_SIZE, mPage * PAGE_SIZE)

  // ── Donor list ─────────────────────────────────────────────────────────────
  const filteredD = useMemo(() => {
    return donors
      .filter((d) => dStatus === 'all' || d.status === dStatus)
      .filter((d) => !dSearch || d.name.includes(dSearch) || d.email.includes(dSearch))
      .sort((a, b) => {
        const av = dSort === 'name' ? a.name : dSort === 'totalAmount' ? a.totalAmount : a.donationCount
        const bv = dSort === 'name' ? b.name : dSort === 'totalAmount' ? b.totalAmount : b.donationCount
        if (typeof av === 'string') return dDir === 'desc' ? av.localeCompare(bv as string) * -1 : av.localeCompare(bv as string)
        return dDir === 'desc' ? (bv as number) - (av as number) : (av as number) - (bv as number)
      })
  }, [donors, dSearch, dStatus, dSort, dDir])

  const dTotalPages = Math.max(1, Math.ceil(filteredD.length / PAGE_SIZE))
  const dPageData   = filteredD.slice((dPage - 1) * PAGE_SIZE, dPage * PAGE_SIZE)

  function handleMSort(col: typeof mSort) {
    if (mSort === col) setMDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    else { setMSort(col); setMDir('desc') }
    setMPage(1)
  }
  function handleDSort(col: typeof dSort) {
    if (dSort === col) setDDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    else { setDSort(col); setDDir('desc') }
    setDPage(1)
  }

  // ── Missionary mutations ───────────────────────────────────────────────────
  function openAddMissionary() { setMFormTarget(null); setMFormOpen(true) }
  function openEditMissionary(m: Missionary) { setMFormTarget(m); setMFormOpen(true); setMOpenMenu(null) }
  function saveMissionary(saved: Missionary) {
    setMissionaries((prev) =>
      prev.find((m) => m.id === saved.id) ? prev.map((m) => (m.id === saved.id ? saved : m)) : [...prev, saved]
    )
    setMFormOpen(false)
  }
  function deactivateMissionary(m: Missionary) {
    setMissionaries((prev) => prev.map((x) => (x.id === m.id ? { ...x, status: 'inactive' } : x)))
    setMOpenMenu(null)
  }
  function approveMissionary(id: string) {
    setMissionaries((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'active' } : m)))
    setMOpenMenu(null)
  }

  // ── Donor mutations ────────────────────────────────────────────────────────
  function openAddDonor() { setDFormTarget(null); setDFormOpen(true) }
  function openEditDonor(d: Donor) { setDFormTarget(d); setDFormOpen(true); setDOpenMenu(null) }
  function saveDonor(saved: Donor) {
    setDonors((prev) =>
      prev.find((d) => d.id === saved.id) ? prev.map((d) => (d.id === saved.id ? saved : d)) : [...prev, saved]
    )
    setDFormOpen(false)
  }
  function deactivateDonor(d: Donor) {
    setDonors((prev) => prev.map((x) => (x.id === d.id ? { ...x, status: 'inactive' } : x)))
    setDOpenMenu(null)
  }

  // KPI cards (derived from live state)
  const mKpis = [
    { label: '전체 선교사', value: `${missionaries.length}명`,                                         icon: Users,     bg: 'bg-accent' },
    { label: '활성',        value: `${missionaries.filter((m) => m.status === 'active').length}명`,    icon: UserCheck, bg: 'bg-accent' },
    { label: '승인 대기',   value: `${missionaries.filter((m) => m.status === 'pending').length}명`,   icon: Clock,     bg: 'bg-[oklch(0.96_0.05_80)]' },
    { label: '사역 국가',   value: `${new Set(missionaries.map((m) => m.country)).size}개국`,           icon: Globe,     bg: 'bg-accent' },
  ]
  const totalDonorAmount = donors.reduce((s, d) => s + d.totalAmount, 0)
  const dKpis = [
    { label: '전체 후원자',  value: `${donors.length}명`,                                              icon: Users,      bg: 'bg-accent' },
    { label: '정기 후원자', value: `${donors.filter((d) => d.regularAmount > 0).length}명`,            icon: Heart,      bg: 'bg-accent' },
    { label: '활성 후원자', value: `${donors.filter((d) => d.status === 'active').length}명`,          icon: UserCheck,  bg: 'bg-accent' },
    { label: '총 후원액',   value: formatKRW(totalDonorAmount),                                        icon: ShieldCheck,bg: 'bg-accent' },
  ]

  return (
    <div className="space-y-6">
      {/* Sub-tab toggle */}
      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-2xl border border-border w-fit">
        {([
          { id: 'missionary', label: '선교사 관리', icon: Globe },
          { id: 'donor',      label: '후원자 관리', icon: Heart },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setMemberView(t.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              memberView === t.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Missionary panel ─────────────────────────────────────────────────── */}
      {memberView === 'missionary' && (
        <div className="space-y-5">
          {/* KPI */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mKpis.map((k) => (
              <div key={k.label} className="bg-card rounded-2xl border border-border p-4 shadow-sm">
                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mb-3', k.bg)}>
                  <k.icon size={16} className="text-primary" />
                </div>
                <p className="text-lg font-bold text-foreground">{k.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Toolbar: search + filter + add button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={mSearch}
                onChange={(e) => { setMSearch(e.target.value); setMPage(1) }}
                placeholder="이름, 이메일, 국가 검색…"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex gap-1 bg-muted/60 p-1 rounded-xl border border-border">
                {(['all', 'active', 'pending', 'inactive'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setMStatus(s); setMPage(1) }}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                      mStatus === s ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {s === 'all' ? '전체' : M_STATUS_LABEL[s]}
                    {s !== 'all' && (
                      <span className="ml-1 text-[10px] opacity-70">
                        {missionaries.filter((m) => m.status === s).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={openAddMissionary}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[oklch(0.44_0.12_195)] transition-colors flex-shrink-0"
              >
                <Plus size={15} /> 선교사 추가
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">총 <strong className="text-foreground">{filteredM.length}명</strong></p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left font-semibold text-muted-foreground px-5 py-3">선교사</th>
                    <th className="text-left font-semibold text-muted-foreground px-4 py-3">국가</th>
                    <th className="text-center font-semibold text-muted-foreground px-4 py-3">상태</th>
                    <MSortTh col="totalRaised" label="누적 모금" current={mSort} dir={mDir} onSort={handleMSort} />
                    <MSortTh col="donorCount"  label="후원자"   current={mSort} dir={mDir} onSort={handleMSort} />
                    <th className="text-right font-semibold text-muted-foreground px-4 py-3">가입일</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {mPageData.map((m, i) => (
                    <tr
                      key={m.id}
                      className={cn('border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer', i % 2 === 1 && 'bg-muted/10')}
                      onClick={() => setMDashTarget(m)}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary">{m.name[0]}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground">{m.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">{m.country}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', M_STATUS_COLOR[m.status])}>
                          {M_STATUS_LABEL[m.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-primary">{formatKRW(m.totalRaised)}</td>
                      <td className="px-4 py-3.5 text-right text-foreground">{m.donorCount.toLocaleString()}명</td>
                      <td className="px-4 py-3.5 text-right text-muted-foreground text-xs">{m.joinedAt}</td>
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="relative flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setMDashTarget(m)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="대시보드 보기"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => openEditMissionary(m)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="수정"
                          >
                            <Pencil size={14} />
                          </button>
                          <RowActionMenu
                            open={mOpenMenu === m.id}
                            onClose={() => setMOpenMenu(null)}
                            trigger={
                              <button
                                type="button"
                                onClick={() => setMOpenMenu(mOpenMenu === m.id ? null : m.id)}
                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="더보기"
                                aria-expanded={mOpenMenu === m.id}
                              >
                                <MoreHorizontal size={15} />
                              </button>
                            }
                          >
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setMDashTarget(m)
                                setMOpenMenu(null)
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted"
                            >
                              <Eye size={13} /> 대시보드 보기
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                openEditMissionary(m)
                                setMOpenMenu(null)
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted"
                            >
                              <Pencil size={13} /> 정보 수정
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted"
                            >
                              <Send size={13} /> 메일 발송
                            </button>
                            {m.status === 'pending' && (
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => approveMissionary(m.id)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[oklch(0.38_0.12_165)] hover:bg-muted"
                              >
                                <CheckCircle size={13} /> 승인하기
                              </button>
                            )}
                            {m.status !== 'inactive' && (
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setMConfirmTarget(m)
                                  setMOpenMenu(null)
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-muted"
                              >
                                <UserX size={13} /> 비활성화
                              </button>
                            )}
                            {m.status === 'inactive' && (
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setMissionaries((prev) =>
                                    prev.map((x) =>
                                      x.id === m.id ? { ...x, status: 'active' } : x,
                                    ),
                                  )
                                  setMOpenMenu(null)
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[oklch(0.38_0.12_165)] hover:bg-muted"
                              >
                                <UserCheck size={13} /> 활성화
                              </button>
                            )}
                          </RowActionMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{mPage} / {mTotalPages} 페이지</p>
              <div className="flex gap-1">
                <button onClick={() => setMPage((p) => Math.max(1, p - 1))} disabled={mPage === 1} className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors">
                  <ChevronLeft size={14} />
                </button>
                <button onClick={() => setMPage((p) => Math.min(mTotalPages, p + 1))} disabled={mPage === mTotalPages} className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Donor panel ──────────────────────────────────────────────────────── */}
      {memberView === 'donor' && (
        <div className="space-y-5">
          {/* KPI */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {dKpis.map((k) => (
              <div key={k.label} className="bg-card rounded-2xl border border-border p-4 shadow-sm">
                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mb-3', k.bg)}>
                  <k.icon size={16} className="text-primary" />
                </div>
                <p className="text-lg font-bold text-foreground">{k.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={dSearch}
                onChange={(e) => { setDSearch(e.target.value); setDPage(1) }}
                placeholder="이름, 이메일 검색…"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex gap-1 bg-muted/60 p-1 rounded-xl border border-border">
                {(['all', 'active', 'paused', 'inactive'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setDStatus(s); setDPage(1) }}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                      dStatus === s ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {s === 'all' ? '전체' : D_STATUS_LABEL[s]}
                    {s !== 'all' && (
                      <span className="ml-1 text-[10px] opacity-70">
                        {donors.filter((d) => d.status === s).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={openAddDonor}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[oklch(0.44_0.12_195)] transition-colors flex-shrink-0"
              >
                <Plus size={15} /> 후원자 추가
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <p className="text-sm text-muted-foreground">총 <strong className="text-foreground">{filteredD.length}명</strong></p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left font-semibold text-muted-foreground px-5 py-3">후원자</th>
                    <th className="text-center font-semibold text-muted-foreground px-4 py-3">상태</th>
                    <th className="text-left font-semibold text-muted-foreground px-4 py-3">생년월일</th>
                    <th className="text-center font-semibold text-muted-foreground px-4 py-3">뉴스레터</th>
                    <DSortTh col="totalAmount"   label="총 후원액"  current={dSort} dir={dDir} onSort={handleDSort} />
                    <DSortTh col="donationCount" label="후원 횟수"  current={dSort} dir={dDir} onSort={handleDSort} />
                    <th className="text-right font-semibold text-muted-foreground px-4 py-3">정기 후원</th>
                    <th className="text-right font-semibold text-muted-foreground px-4 py-3">최근 후원</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {dPageData.map((d, i) => (
                    <tr
                      key={d.id}
                      className={cn('border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer', i % 2 === 1 && 'bg-muted/10')}
                      onClick={() => setDDashTarget(d)}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary">{d.name[0]}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground">{d.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{d.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', D_STATUS_COLOR[d.status])}>
                          {D_STATUS_LABEL[d.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-left text-muted-foreground text-xs tabular-nums">
                        {d.birthDate.replace(/-/g, '.')}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={cn(
                            'text-xs font-semibold px-2.5 py-1 rounded-full',
                            d.newsletterOptIn
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-muted text-muted-foreground',
                          )}
                        >
                          {d.newsletterOptIn ? '구독' : '미구독'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-primary">{formatKRW(d.totalAmount)}</td>
                      <td className="px-4 py-3.5 text-right text-foreground">{d.donationCount}회</td>
                      <td className="px-4 py-3.5 text-right text-muted-foreground text-xs">
                        {d.regularAmount ? formatKRW(d.regularAmount) : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-right text-muted-foreground text-xs">{d.lastDonation}</td>
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="relative flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setDDashTarget(d)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="대시보드 보기"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => openEditDonor(d)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="수정"
                          >
                            <Pencil size={14} />
                          </button>
                          <RowActionMenu
                            open={dOpenMenu === d.id}
                            onClose={() => setDOpenMenu(null)}
                            trigger={
                              <button
                                type="button"
                                onClick={() => setDOpenMenu(dOpenMenu === d.id ? null : d.id)}
                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="더보기"
                                aria-expanded={dOpenMenu === d.id}
                              >
                                <MoreHorizontal size={15} />
                              </button>
                            }
                          >
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setDDashTarget(d)
                                setDOpenMenu(null)
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted"
                            >
                              <Eye size={13} /> 대시보드 보기
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                openEditDonor(d)
                                setDOpenMenu(null)
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted"
                            >
                              <Pencil size={13} /> 정보 수정
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted"
                            >
                              <Send size={13} /> 메일 발송
                            </button>
                            {d.status !== 'inactive' && (
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setDConfirmTarget(d)
                                  setDOpenMenu(null)
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-muted"
                              >
                                <UserX size={13} /> 비활성화
                              </button>
                            )}
                            {d.status === 'inactive' && (
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setDonors((prev) =>
                                    prev.map((x) =>
                                      x.id === d.id ? { ...x, status: 'active' } : x,
                                    ),
                                  )
                                  setDOpenMenu(null)
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[oklch(0.38_0.12_165)] hover:bg-muted"
                              >
                                <UserCheck size={13} /> 활성화
                              </button>
                            )}
                          </RowActionMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{dPage} / {dTotalPages} 페이지</p>
              <div className="flex gap-1">
                <button onClick={() => setDPage((p) => Math.max(1, p - 1))} disabled={dPage === 1} className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors">
                  <ChevronLeft size={14} />
                </button>
                <button onClick={() => setDPage((p) => Math.min(dTotalPages, p + 1))} disabled={dPage === dTotalPages} className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Missionary modals ─────────────────────────────────────────────────── */}
      {mFormOpen && (
        <MissionaryFormModal
          initial={mFormTarget ? { name: mFormTarget.name, email: mFormTarget.email, phone: mFormTarget.phone, country: mFormTarget.country, organization: mFormTarget.organization, status: mFormTarget.status } : EMPTY_M}
          target={mFormTarget}
          onSave={saveMissionary}
          onClose={() => setMFormOpen(false)}
        />
      )}
      {mConfirmTarget && (
        <ConfirmModal
          message={`${mConfirmTarget.name} 선교사를 비활성화하시겠습니까?`}
          onConfirm={() => deactivateMissionary(mConfirmTarget)}
          onClose={() => setMConfirmTarget(null)}
        />
      )}

      {/* ── Donor modals ──────────────────────────────────────────────────────── */}
      {dFormOpen && (
        <DonorFormModal
          initial={dFormTarget ? {
            name: dFormTarget.name,
            email: dFormTarget.email,
            phone: dFormTarget.phone,
            birthDate: dFormTarget.birthDate,
            newsletterOptIn: dFormTarget.newsletterOptIn,
            regularAmount: dFormTarget.regularAmount ? String(dFormTarget.regularAmount) : '',
            status: dFormTarget.status,
            campaigns: dFormTarget.campaigns.join(', '),
          } : EMPTY_D}
          target={dFormTarget}
          onSave={saveDonor}
          onClose={() => setDFormOpen(false)}
        />
      )}
      {dConfirmTarget && (
        <ConfirmModal
          message={`${dConfirmTarget.name} 후원자를 비활성화하시겠습니까?`}
          onConfirm={() => deactivateDonor(dConfirmTarget)}
          onClose={() => setDConfirmTarget(null)}
        />
      )}

      {(mDashTarget || dDashTarget) && (
        <MemberDashboardPreview
          missionary={mDashTarget ?? undefined}
          donor={dDashTarget ?? undefined}
          onClose={() => {
            setMDashTarget(null)
            setDDashTarget(null)
          }}
        />
      )}
    </div>
  )
}
