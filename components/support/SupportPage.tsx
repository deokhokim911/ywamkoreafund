'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Mail, MessageSquare, Phone, Clock, CheckCircle2, Send } from 'lucide-react'
import { Navbar } from '../layout/Navbar'
import { cn } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────────────────────────
interface FaqItem {
  id: string
  category: string
  question: string
  answer: string
}

interface ContactForm {
  name: string
  email: string
  phone: string
  category: string
  subject: string
  message: string
  agree: boolean
}

// ── FAQ data ───────────────────────────────────────────────────────────────────
const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'f1',
    category: '후원',
    question: '후원은 어떻게 시작할 수 있나요?',
    answer:
      '홈페이지에서 원하시는 사역 캠페인을 선택하신 후 "후원하기" 버튼을 눌러 주세요. 일시 후원과 정기 후원 중 선택하실 수 있으며, 원하시는 금액을 직접 입력하거나 제시된 프리셋 금액을 선택하실 수 있습니다.',
  },
  {
    id: 'f2',
    category: '후원',
    question: '정기 후원은 어떻게 해지하나요?',
    answer:
      '"내 후원" 대시보드에서 진행 중인 정기 후원 항목을 선택한 뒤 "후원 취소" 버튼을 누르시면 됩니다. 취소 요청 이후에는 다음 결제일부터 자동 결제가 중단됩니다. 문의 사항이 있으시면 고객센터로 연락해 주세요.',
  },
  {
    id: 'f3',
    category: '후원',
    question: '후원 금액을 변경할 수 있나요?',
    answer:
      '현재는 기존 정기 후원을 취소하고 원하시는 금액으로 새롭게 신청하시는 방식으로 변경 가능합니다. 빠른 시일 내에 금액 변경 기능을 직접 지원할 예정입니다.',
  },
  {
    id: 'f4',
    category: '영수증',
    question: '기부금 영수증은 어떻게 받나요?',
    answer:
      '"내 후원" 페이지의 후원 내역 테이블에서 각 건별로 "영수증 보기" 버튼을 클릭하시면 즉시 PDF 형태로 확인하고 저장하실 수 있습니다. 국세청 연말정산 자료로 활용 가능한 공식 기부금 영수증입니다.',
  },
  {
    id: 'f5',
    category: '영수증',
    question: '연말정산에 기부금 공제를 받을 수 있나요?',
    answer:
      '네, 예수전도단 한국본부는 지정기부금 단체로 등록되어 있어 개인의 경우 기부금의 15~30%를 세액공제 받으실 수 있습니다. 법인의 경우 손금 산입이 가능합니다. 구체적인 공제 한도는 소득 수준에 따라 다를 수 있으니 세무사 상담을 권장드립니다.',
  },
  {
    id: 'f6',
    category: '캠페인',
    question: '선교사가 캠페인을 등록하려면 어떻게 해야 하나요?',
    answer:
      '상단 내비게이션의 "캠페인 만들기"를 통해 신청서를 제출하시면 됩니다. 제출된 캠페인은 담당자 검토 → 승인자 검토 → 최종 승인의 4단계 심사를 거쳐 홈페이지에 게시됩니다. 심사에는 영업일 기준 3~5일이 소요됩니다.',
  },
  {
    id: 'f7',
    category: '캠페인',
    question: '모금 목표액을 달성하지 못하면 어떻게 되나요?',
    answer:
      '목표액에 미달하더라도 모금된 전액은 해당 선교사님의 사역비로 100% 사용됩니다. 단, 캠페인 기간 종료 후 환불을 원하시는 후원자분께는 개별 연락을 통해 처리해 드립니다.',
  },
  {
    id: 'f8',
    category: '계정',
    question: '후원 내역은 어디에서 확인하나요?',
    answer:
      '로그인 후 상단 메뉴의 "내 후원"을 클릭하시면 내가 후원한 캠페인 목록, 후원 금액, 정기 후원 현황 및 기부금 영수증을 한눈에 확인하실 수 있습니다.',
  },
  {
    id: 'f9',
    category: '계정',
    question: '비밀번호를 분실했습니다.',
    answer:
      '로그인 화면의 "비밀번호 찾기" 링크를 클릭하시면 가입하신 이메일 주소로 재설정 링크를 보내드립니다. 이메일을 받지 못하셨다면 스팸 폴더를 확인하시거나 고객센터로 문의해 주세요.',
  },
  {
    id: 'f10',
    category: '결제',
    question: '사용 가능한 결제 수단은 무엇인가요?',
    answer:
      '신용카드, 체크카드, 계좌이체, 카카오페이, 네이버페이를 지원합니다. 정기 후원의 경우 카드 자동결제 및 CMS 계좌이체 방식을 이용하실 수 있습니다.',
  },
  {
    id: 'f11',
    category: '결제',
    question: '결제가 실패했는데 어떻게 해야 하나요?',
    answer:
      '카드 한도 초과, 유효기간 만료, 분실 신고 등이 주요 원인입니다. "내 후원" 페이지에서 결제 실패 건을 확인하고 결제 수단을 업데이트하신 후 재시도해 주세요. 문제가 지속될 경우 고객센터로 문의해 주세요.',
  },
]

const FAQ_CATEGORIES = ['전체', '후원', '영수증', '캠페인', '계정', '결제']
const CONTACT_CATEGORIES = ['후원 문의', '캠페인 등록', '기부금 영수증', '결제/환불', '계정 문의', '기타']

const INITIAL_FORM: ContactForm = {
  name: '',
  email: '',
  phone: '',
  category: '',
  subject: '',
  message: '',
  agree: false,
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function FaqAccordion({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-card hover:bg-muted transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-foreground leading-relaxed">{item.question}</span>
        {open ? (
          <ChevronUp size={16} className="flex-shrink-0 text-primary" />
        ) : (
          <ChevronDown size={16} className="flex-shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="px-5 py-4 border-t border-border bg-accent/30">
          <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export function SupportPage() {
  const [activeCategory, setActiveCategory] = useState('전체')
  const [searchQuery, setSearchQuery] = useState('')
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<ContactForm>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchCat = activeCategory === '전체' || item.category === activeCategory
    const matchSearch =
      !searchQuery ||
      item.question.includes(searchQuery) ||
      item.answer.includes(searchQuery)
    return matchCat && matchSearch
  })

  // ── Form validation ──────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: Partial<ContactForm> = {}
    if (!form.name.trim()) errs.name = '이름을 입력해 주세요.'
    if (!form.email.trim()) errs.email = '이메일을 입력해 주세요.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = '올바른 이메일 형식을 입력해 주세요.'
    if (!form.category) errs.category = '문의 유형을 선택해 주세요.'
    if (!form.subject.trim()) errs.subject = '제목을 입력해 주세요.'
    if (form.message.trim().length < 10) errs.message = '내용을 10자 이상 입력해 주세요.'
    if (!form.agree) errs.agree = '개인정보 수집에 동의해 주세요.' as unknown as boolean
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    // Simulate async email send
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1200)
  }

  const handleChange = (field: keyof ContactForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page header */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-3">
            고객 지원
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-balance mb-3">
            무엇을 도와드릴까요?
          </h1>
          <p className="text-white/80 text-base leading-relaxed">
            자주 묻는 질문을 확인하시거나, 메일로 직접 문의해 주세요.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-16">

        {/* ── FAQ section ─────────────────────────────────────────────────── */}
        <section aria-labelledby="faq-heading">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare size={20} className="text-primary" />
            <h2 id="faq-heading" className="text-xl font-bold text-foreground">
              자주 묻는 질문
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            아래에서 궁금하신 내용을 먼저 확인해 보세요.
          </p>

          {/* Search */}
          <div className="relative mb-5">
            <MessageSquare size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="질문 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'text-sm font-medium px-4 py-1.5 rounded-full transition-colors',
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion list */}
          {filteredFaqs.length > 0 ? (
            <div className="space-y-3">
              {filteredFaqs.map((item) => (
                <FaqAccordion key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-14 text-muted-foreground">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-25" />
              <p className="font-medium">일치하는 질문이 없습니다.</p>
              <p className="text-sm mt-1">아래 메일 문의를 이용해 주세요.</p>
            </div>
          )}
        </section>

        {/* ── Divider ──────────────────────────────────────────────────────── */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-sm text-muted-foreground">
              원하시는 답변을 찾지 못하셨나요?
            </span>
          </div>
        </div>

        {/* ── Contact section ──────────────────────────────────────────────── */}
        <section aria-labelledby="contact-heading">
          <div className="flex items-center gap-3 mb-2">
            <Mail size={20} className="text-primary" />
            <h2 id="contact-heading" className="text-xl font-bold text-foreground">
              메일 문의
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            문의 내용을 작성해 주시면 담당자가 이메일로 답변 드립니다.
          </p>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              {
                icon: Mail,
                title: '이메일',
                value: 'support@ywamkoreafund.org',
                sub: '24시간 접수 가능',
              },
              {
                icon: Phone,
                title: '전화',
                value: '02-000-0000',
                sub: '평일 09:00 – 18:00',
              },
              {
                icon: Clock,
                title: '답변 소요 시간',
                value: '영업일 1–2일',
                sub: '공휴일 제외',
              },
            ].map((info) => (
              <div
                key={info.title}
                className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl"
              >
                <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <info.icon size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{info.title}</p>
                  <p className="text-sm font-semibold text-foreground">{info.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{info.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-4">
                <CheckCircle2 size={28} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">문의가 접수되었습니다.</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                입력하신 이메일 주소로 영업일 1~2일 이내에 답변을 드리겠습니다.<br />
                감사합니다.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm(INITIAL_FORM) }}
                className="mt-6 text-sm font-medium text-primary hover:underline"
              >
                새 문의 작성하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Row 1: name + email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground" htmlFor="name">
                    이름 <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="홍길동"
                    className={cn(
                      'w-full px-4 py-2.5 text-sm bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-colors',
                      errors.name ? 'border-destructive' : 'border-border'
                    )}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground" htmlFor="email">
                    이메일 <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="example@email.com"
                    className={cn(
                      'w-full px-4 py-2.5 text-sm bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-colors',
                      errors.email ? 'border-destructive' : 'border-border'
                    )}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>

              {/* Row 2: phone + category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground" htmlFor="phone">
                    연락처 <span className="text-muted-foreground text-xs font-normal">(선택)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground" htmlFor="category">
                    문의 유형 <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className={cn(
                      'w-full px-4 py-2.5 text-sm bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-colors appearance-none',
                      errors.category ? 'border-destructive' : 'border-border',
                      !form.category && 'text-muted-foreground'
                    )}
                  >
                    <option value="" disabled>선택해 주세요</option>
                    {CONTACT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground" htmlFor="subject">
                  제목 <span className="text-destructive">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  placeholder="문의 제목을 입력해 주세요."
                  className={cn(
                    'w-full px-4 py-2.5 text-sm bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-colors',
                    errors.subject ? 'border-destructive' : 'border-border'
                  )}
                />
                {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground" htmlFor="message">
                  문의 내용 <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="문의하실 내용을 자세히 작성해 주세요."
                  className={cn(
                    'w-full px-4 py-3 text-sm bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-colors resize-none leading-relaxed',
                    errors.message ? 'border-destructive' : 'border-border'
                  )}
                />
                <div className="flex items-center justify-between">
                  {errors.message
                    ? <p className="text-xs text-destructive">{errors.message}</p>
                    : <span />}
                  <p className="text-xs text-muted-foreground">{form.message.length}자</p>
                </div>
              </div>

              {/* Consent */}
              <div className="p-4 bg-muted rounded-xl space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => handleChange('agree', e.target.checked)}
                    className="mt-0.5 accent-primary w-4 h-4 flex-shrink-0"
                  />
                  <span className="text-sm text-foreground">
                    <span className="font-medium">개인정보 수집 및 이용에 동의합니다.</span>{' '}
                    <span className="text-muted-foreground">
                      수집 항목: 이름, 이메일, 연락처 / 목적: 문의 답변 / 보유 기간: 3년
                    </span>
                  </span>
                </label>
                {errors.agree && (
                  <p className="text-xs text-destructive pl-7">{errors.agree as unknown as string}</p>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-[oklch(0.44_0.12_195)] disabled:opacity-60 text-primary-foreground font-semibold text-sm px-8 py-3 rounded-xl transition-colors"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      전송 중...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      문의 전송
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">YWAMKOREAFUND · 예수전도단</p>
          <p>서울특별시 강서구 · 등록번호 123-45-67890 · 대표자: 홍길동</p>
          <p>기부금 영수증 발급 가능 단체 · 개인정보처리방침 · 이용약관</p>
        </div>
      </footer>
    </div>
  )
}
