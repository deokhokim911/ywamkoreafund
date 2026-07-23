'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  Calendar,
  Target,
  FileText,
  Globe,
  User,
  ImageIcon,
  AlertCircle,
  X,
} from 'lucide-react'
import { Navbar } from '../layout/Navbar'
import { cn } from '@/lib/utils'
import { missionStore } from '@/lib/missionStore'

// ─── Step definitions ───────────────────────────────────────────
const STEPS = [
  { id: 1, label: '기본 정보', icon: User, description: '선교사 및 단체 정보를 입력하세요' },
  { id: 2, label: '사역 내용', icon: FileText, description: '사역의 목적과 내용을 상세히 작성하세요' },
  { id: 3, label: '목표 설정', icon: Target, description: '모금 목표와 기간을 설정하세요' },
  { id: 4, label: '미디어', icon: ImageIcon, description: '커버 이미지와 동영상을 첨부하세요' },
  { id: 5, label: '검토 · 제출', icon: Check, description: '입력 내용을 확인하고 제출하세요' },
]

const COUNTRIES = [
  '태국', '캄보디아', '미얀마', '몽골', '인도', '네팔', '필리핀', '인도네시아',
  '베트남', '라오스', '중국', '일본', '케냐', '우간다', '에티오피아', '기타',
]

const ORGANIZATIONS = [
  '예수전도단 (YWAM Korea)',
  '인터콥 (Intercp)',
  '한국선교연구원 (KRIM)',
  '두란노해외선교회 (TIM)',
  '기독교한국루터회',
  '기타 (직접 입력)',
]

interface FormData {
  // Step 1
  missionaryName: string
  organization: string
  organizationCustom: string
  country: string
  deployYear: string
  phone: string
  email: string
  // Step 2
  title: string
  subtitle: string
  body: string
  tags: string[]
  // Step 3
  goalAmount: string
  startDate: string
  endDate: string
  donationType: 'both' | 'onetime' | 'recurring'
  // Step 4
  coverImagePreview: string | null
  // Meta
  agreed: boolean
}

const INITIAL: FormData = {
  missionaryName: '',
  organization: '',
  organizationCustom: '',
  country: '',
  deployYear: '',
  phone: '',
  email: '',
  title: '',
  subtitle: '',
  body: '',
  tags: [],
  goalAmount: '',
  startDate: '',
  endDate: '',
  donationType: 'both',
  coverImagePreview: null,
  agreed: false,
}

const TAG_OPTIONS = ['어린이', '청년', '교육', '의료', '교회개척', '구호', '문해교육', '성경번역', '리더십훈련']

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = current > step.id
        const active = current === step.id
        return (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-200 flex-shrink-0',
              done ? 'bg-primary text-primary-foreground' :
              active ? 'bg-primary text-primary-foreground ring-4 ring-[oklch(0.52_0.12_195)]/20' :
              'bg-muted text-muted-foreground'
            )}>
              {done ? <Check size={14} /> : step.id}
            </div>
            {i < total - 1 && (
              <div className={cn(
                'h-0.5 w-10 md:w-16 transition-all duration-300',
                current > step.id ? 'bg-primary' : 'bg-border'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-foreground mb-1.5">
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  )
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full px-4 py-2.5 text-sm bg-background border border-border rounded-xl',
        'focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground',
        'transition-colors',
        className
      )}
      {...props}
    />
  )
}

function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full px-4 py-2.5 text-sm bg-background border border-border rounded-xl',
        'focus:outline-none focus:ring-2 focus:ring-ring',
        'transition-colors appearance-none',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full px-4 py-3 text-sm bg-background border border-border rounded-xl',
        'focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground',
        'transition-colors resize-none leading-relaxed',
        className
      )}
      {...props}
    />
  )
}

// ─── Step components ─────────────────────────────────────────────

function Step1({ data, update }: { data: FormData; update: (v: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <FieldLabel required>선교사 이름</FieldLabel>
          <Input
            placeholder="예) 김소연"
            value={data.missionaryName}
            onChange={(e) => update({ missionaryName: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel required>파송 국가</FieldLabel>
          <Select
            value={data.country}
            onChange={(e) => update({ country: e.target.value })}
          >
            <option value="">국가를 선택하세요</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
      </div>

      <div>
        <FieldLabel required>파송 단체</FieldLabel>
        <Select
          value={data.organization}
          onChange={(e) => update({ organization: e.target.value })}
        >
          <option value="">단체를 선택하세요</option>
          {ORGANIZATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </Select>
        {data.organization === '기타 (직접 입력)' && (
          <Input
            className="mt-2"
            placeholder="단체명 직접 입력"
            value={data.organizationCustom}
            onChange={(e) => update({ organizationCustom: e.target.value })}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <FieldLabel>파송 연도</FieldLabel>
          <Input
            placeholder="예) 2021"
            value={data.deployYear}
            maxLength={4}
            onChange={(e) => update({ deployYear: e.target.value.replace(/\D/g, '') })}
          />
        </div>
        <div>
          <FieldLabel required>연락처</FieldLabel>
          <Input
            placeholder="010-0000-0000"
            value={data.phone}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 11)
              const fmt = v.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
              update({ phone: fmt })
            }}
          />
        </div>
        <div>
          <FieldLabel required>이메일</FieldLabel>
          <Input
            type="email"
            placeholder="example@ywam.or.kr"
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}

function Step2({ data, update }: { data: FormData; update: (v: Partial<FormData>) => void }) {
  const toggleTag = (tag: string) => {
    const next = data.tags.includes(tag)
      ? data.tags.filter((t) => t !== tag)
      : [...data.tags, tag]
    update({ tags: next })
  }

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel required>캠페인 제목</FieldLabel>
        <Input
          placeholder="예) 동남아시아 어린이 문해교육 및 복음화 사역"
          value={data.title}
          maxLength={60}
          onChange={(e) => update({ title: e.target.value })}
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">{data.title.length}/60</p>
      </div>

      <div>
        <FieldLabel>부제목 (한 줄 소개)</FieldLabel>
        <Input
          placeholder="예) 태국 북부 산간지역 미전도 종족 아이들과 함께하는 5년간의 사역 여정"
          value={data.subtitle}
          maxLength={80}
          onChange={(e) => update({ subtitle: e.target.value })}
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">{data.subtitle.length}/80</p>
      </div>

      <div>
        <FieldLabel required>사역 상세 내용</FieldLabel>
        <Textarea
          rows={10}
          placeholder={`사역의 목적, 현장 상황, 구체적인 활동 내용, 후원금 사용 계획 등을 상세히 작성해 주세요.\n\n예)\n저는 2021년부터 태국 치앙마이 북부 산간 지역에서 카렌족 아이들을 대상으로 문해교육을 진행하고 있습니다. 이 지역의 아이들은 태국 공용어는 물론 자신의 모국어조차 읽고 쓰지 못하는 경우가 많아...`}
          value={data.body}
          onChange={(e) => update({ body: e.target.value })}
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">{data.body.length}자</p>
      </div>

      <div>
        <FieldLabel>사역 태그</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors border',
                data.tags.includes(tag)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step3({ data, update }: { data: FormData; update: (v: Partial<FormData>) => void }) {
  const presets = [1_000_000, 3_000_000, 5_000_000, 10_000_000, 20_000_000]

  return (
    <div className="space-y-6">
      <div>
        <FieldLabel required>모금 목표액</FieldLabel>
        <div className="flex flex-wrap gap-2 mb-3">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => update({ goalAmount: String(p) })}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-semibold border transition-colors',
                data.goalAmount === String(p)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
              )}
            >
              {(p / 10_000).toLocaleString()}만원
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₩</span>
          <Input
            className="pl-8"
            placeholder="직접 입력 (숫자만)"
            value={data.goalAmount ? Number(data.goalAmount).toLocaleString() : ''}
            onChange={(e) => update({ goalAmount: e.target.value.replace(/,/g, '').replace(/\D/g, '') })}
          />
        </div>
        {data.goalAmount && (
          <p className="text-xs text-primary font-semibold mt-1.5">
            목표: {Number(data.goalAmount).toLocaleString()}원
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <FieldLabel required>캠페인 시작일</FieldLabel>
          <div className="relative">
            <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="date"
              className="pl-9"
              value={data.startDate}
              onChange={(e) => update({ startDate: e.target.value })}
            />
          </div>
        </div>
        <div>
          <FieldLabel required>캠페인 종료일</FieldLabel>
          <div className="relative">
            <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="date"
              className="pl-9"
              value={data.endDate}
              onChange={(e) => update({ endDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div>
        <FieldLabel>후원 방식</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {([
            { value: 'both', label: '일시 · 정기 모두', desc: '후원자가 자유롭게 선택' },
            { value: 'onetime', label: '일시 후원만', desc: '단일 결제만 허용' },
            { value: 'recurring', label: '정기 후원만', desc: '매월 자동 결제' },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ donationType: opt.value })}
              className={cn(
                'text-left p-4 rounded-xl border-2 transition-colors',
                data.donationType === opt.value
                  ? 'border-primary bg-accent'
                  : 'border-border bg-background hover:border-primary/40'
              )}
            >
              <p className={cn(
                'text-sm font-semibold',
                data.donationType === opt.value ? 'text-accent-foreground' : 'text-foreground'
              )}>
                {opt.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step4({ data, update }: { data: FormData; update: (v: Partial<FormData>) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => update({ coverImagePreview: ev.target?.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <div>
        <FieldLabel required>커버 이미지</FieldLabel>
        <p className="text-xs text-muted-foreground mb-3">사역 현장을 잘 나타내는 가로형(16:9) 이미지를 권장합니다. 최대 10MB.</p>

        {data.coverImagePreview ? (
          <div className="relative">
            <img
              src={data.coverImagePreview}
              alt="커버 이미지 미리보기"
              className="w-full h-52 object-cover rounded-2xl border border-border"
            />
            <button
              type="button"
              onClick={() => update({ coverImagePreview: null })}
              className="absolute top-3 right-3 bg-foreground/70 hover:bg-foreground text-primary-foreground p-1.5 rounded-full transition-colors"
              aria-label="이미지 제거"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full h-52 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-accent/30 transition-colors group"
          >
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-accent transition-colors">
              <Upload size={22} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">클릭하여 이미지 업로드</p>
              <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WEBP · 최대 10MB</p>
            </div>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      <div className="bg-[oklch(0.96_0.05_80)] border border-[oklch(0.88_0.06_80)] rounded-2xl p-4 flex gap-3">
        <AlertCircle size={18} className="text-[oklch(0.55_0.14_70)] flex-shrink-0 mt-0.5" />
        <div className="text-sm text-[oklch(0.35_0.08_70)] leading-relaxed">
          <p className="font-semibold mb-0.5">업로드 가이드</p>
          <ul className="space-y-1 text-xs">
            <li>- 사역지 현장 사진을 사용하면 후원자의 신뢰를 높일 수 있습니다.</li>
            <li>- 타인의 얼굴이 포함된 경우 동의를 받아야 합니다.</li>
            <li>- 저작권 없는 이미지만 사용해 주세요.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function Step5({ data, update }: { data: FormData; update: (v: Partial<FormData>) => void }) {
  const org = data.organization === '기타 (직접 입력)' ? data.organizationCustom : data.organization

  return (
    <div className="space-y-5">
      <div className="bg-accent rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-foreground text-sm">입력 내용 요약</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          {[
            { label: '선교사', value: data.missionaryName || '—' },
            { label: '파송 국가', value: data.country || '—' },
            { label: '파송 단체', value: org || '—' },
            { label: '파송 연도', value: data.deployYear ? `${data.deployYear}년` : '—' },
            { label: '캠페인 제목', value: data.title || '—', wide: true },
            { label: '목표 모금액', value: data.goalAmount ? `${Number(data.goalAmount).toLocaleString()}원` : '—' },
            { label: '기간', value: (data.startDate && data.endDate) ? `${data.startDate} ~ ${data.endDate}` : '—' },
            { label: '후원 방식', value: data.donationType === 'both' ? '일시·정기 모두' : data.donationType === 'onetime' ? '일시 후원만' : '정기 후원만' },
          ].map((item) => (
            <div key={item.label} className={item.wide ? 'sm:col-span-2' : ''}>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-semibold text-foreground text-sm mt-0.5 break-all">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {data.coverImagePreview && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">커버 이미지</p>
          <img
            src={data.coverImagePreview}
            alt="커버 이미지 미리보기"
            className="w-full h-40 object-cover rounded-2xl border border-border"
          />
        </div>
      )}

      <div className="border border-border rounded-2xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.agreed}
            onChange={(e) => update({ agreed: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-border accent-primary flex-shrink-0"
          />
          <p className="text-sm text-muted-foreground leading-relaxed">
            입력한 정보가 사실임을 확인하며, 플랫폼{' '}
            <span className="text-primary font-semibold underline cursor-pointer">이용약관</span> 및{' '}
            <span className="text-primary font-semibold underline cursor-pointer">개인정보처리방침</span>에
            동의합니다. 허위 정보 등록 시 캠페인이 즉시 중단될 수 있습니다.
          </p>
        </label>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────
export function CreateCampaignPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>(INITIAL)
  const [submitted, setSubmitted] = useState(false)

  const update = (partial: Partial<FormData>) => setData((prev) => ({ ...prev, ...partial }))

  const canProceed = () => {
    if (step === 1) return !!(data.missionaryName && data.country && data.organization && data.phone && data.email)
    if (step === 2) return !!(data.title && data.body)
    if (step === 3) return !!(data.goalAmount && data.startDate && data.endDate)
    if (step === 4) return true
    if (step === 5) return data.agreed
    return true
  }

  const handleSubmit = () => {
    const org =
      data.organization === '기타 (직접 입력)'
        ? data.organizationCustom || data.organization
        : data.organization

    missionStore.createPending({
      title: data.title,
      subtitle: data.subtitle,
      body: data.body,
      country: data.country,
      missionaryName: data.missionaryName,
      organization: org,
      goalAmount: Number(data.goalAmount) || 0,
      coverImage: data.coverImagePreview || '/mission-cover.png',
      sentYear: data.deployYear ? Number(data.deployYear) : undefined,
    })
    setSubmitted(true)
  }

  const currentStep = STEPS[step - 1]

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[oklch(0.94_0.06_165)] flex items-center justify-center mb-6">
            <Check size={32} className="text-[oklch(0.42_0.12_165)]" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">캠페인이 제출되었습니다</h1>
          <p className="text-muted-foreground leading-relaxed max-w-sm mb-8">
            검토 후 영업일 기준 2-3일 이내에 이메일로 결과를 안내드립니다.
            제출된 캠페인은 관리자 승인 후 공개됩니다.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              내 대시보드 보기
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-muted hover:bg-border text-foreground font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              홈으로 가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">캠페인 만들기</p>
          <h1 className="text-2xl font-bold text-foreground mb-1">새 사역 캠페인 등록</h1>
          <p className="text-sm text-muted-foreground">
            단계별로 정보를 입력하면 후원 페이지가 자동 생성됩니다.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step indicator */}
        <div className="flex flex-col items-center mb-8">
          <StepIndicator current={step} total={STEPS.length} />
          <div className="mt-4 text-center">
            <p className="text-sm font-bold text-foreground">
              {step}단계 / {STEPS.length}단계 — {currentStep.label}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{currentStep.description}</p>
          </div>
        </div>

        {/* Step content */}
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
              <currentStep.icon size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">{currentStep.label}</h2>
              <p className="text-xs text-muted-foreground">{currentStep.description}</p>
            </div>
          </div>

          {step === 1 && <Step1 data={data} update={update} />}
          {step === 2 && <Step2 data={data} update={update} />}
          {step === 3 && <Step3 data={data} update={update} />}
          {step === 4 && <Step4 data={data} update={update} />}
          {step === 5 && <Step5 data={data} update={update} />}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors',
              step === 1
                ? 'opacity-0 pointer-events-none'
                : 'bg-muted hover:bg-border text-foreground'
            )}
          >
            <ChevronLeft size={16} />
            이전
          </button>

          <div className="flex gap-1.5">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={cn(
                  'rounded-full transition-all',
                  s.id === step ? 'w-5 h-2 bg-primary' :
                  s.id < step ? 'w-2 h-2 bg-primary/40' :
                  'w-2 h-2 bg-border'
                )}
              />
            ))}
          </div>

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                canProceed()
                  ? 'bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              다음
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed()}
              className={cn(
                'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                canProceed()
                  ? 'bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              <Check size={16} />
              캠페인 제출하기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
