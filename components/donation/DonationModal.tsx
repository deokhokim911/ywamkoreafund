'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ChevronRight, ChevronLeft, CheckCircle2, Shield, CreditCard } from 'lucide-react'

type DonationType = 'once' | 'monthly'
type Step = 'amount' | 'info' | 'payment' | 'success'

interface DonationModalProps {
  open: boolean
  missionTitle: string
  missionaryName: string
  onClose: () => void
}

const PRESET_AMOUNTS = [10_000, 30_000, 50_000, 100_000]

const IMPACT_MAP: Record<number, string> = {
  10_000: '어린이 1명에게 한 달 학교 교재를 지원해요',
  30_000: '현지 어린이 3명에게 한 달 식사를 지원해요',
  50_000: '소그룹 성경공부 교재 한 세트를 마련해요',
  100_000: '지역 교회 건축 자재 일부를 후원해요',
}

function formatKRW(amount: number): string {
  if (amount >= 10_000) return `${Math.floor(amount / 10_000).toLocaleString()}만원`
  return `${amount.toLocaleString()}원`
}

const STEPS: Step[] = ['amount', 'info', 'payment', 'success']

export function DonationModal(props: DonationModalProps) {
  if (!props.open) return null
  return <DonationModalContent {...props} />
}

const DonationModalContent = ({
  missionTitle,
  missionaryName,
  onClose,
}: DonationModalProps) => {
  const [step, setStep] = useState<Step>('amount')
  const [donationType, setDonationType] = useState<DonationType>('monthly')
  const [selectedAmount, setSelectedAmount] = useState<number>(30_000)
  const [customAmount, setCustomAmount] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [newsletterOptIn, setNewsletterOptIn] = useState(false)
  const [agreeAll, setAgreeAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const isBirthDateValid = (() => {
    if (!birthDate) return false
    const parsed = new Date(`${birthDate}T00:00:00`)
    if (Number.isNaN(parsed.getTime())) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return parsed <= today
  })()

  const canProceedInfo = Boolean(name.trim() && phone.length >= 12 && isBirthDateValid)

  const finalAmount = customAmount
    ? parseInt(customAmount.replace(/[^0-9]/g, ''), 10) || 0
    : selectedAmount

  // Trap focus / close on Escape
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

  const stepIndex = STEPS.indexOf(step)

  const stepLabels: Record<Step, string> = {
    amount: '금액 선택',
    info: '후원자 정보',
    payment: '결제',
    success: '완료',
  }

  const handleNext = () => {
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1])
  }

  const handleBack = () => {
    const idx = STEPS.indexOf(step)
    if (idx > 0) setStep(STEPS[idx - 1])
  }

  const handlePayment = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep('success')
    }, 1500)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    let formatted = val
    if (val.length > 3 && val.length <= 7) formatted = `${val.slice(0, 3)}-${val.slice(3)}`
    else if (val.length > 7) formatted = `${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7, 11)}`
    setPhone(formatted)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="후원하기"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        ref={modalRef}
        className="relative bg-card w-full md:max-w-md rounded-t-3xl md:rounded-2xl shadow-2xl max-h-[92dvh] overflow-y-auto"
      >
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 md:hidden" aria-hidden="true">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 md:pt-5">
          {step !== 'success' && step !== 'amount' ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors -ml-1 p-1"
              aria-label="이전 단계"
            >
              <ChevronLeft size={18} />
              이전
            </button>
          ) : (
            <div />
          )}
          <p className="text-sm font-semibold text-muted-foreground">
            {stepLabels[step]}
          </p>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress bar (not on success) */}
        {step !== 'success' && (
          <div className="px-5 mb-4">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-400"
                style={{ width: `${((stepIndex + 1) / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="px-5 pb-8">
          {/* ── STEP 1: AMOUNT ── */}
          {step === 'amount' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground">{missionaryName} 선교사 후원</h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{missionTitle}</p>
              </div>

              {/* One-time / Monthly toggle */}
              <div className="flex gap-2 p-1 bg-muted rounded-xl">
                {(['once', 'monthly'] as DonationType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setDonationType(type)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                      donationType === type
                        ? 'bg-card text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {type === 'once' ? '일시후원' : '정기후원'}
                  </button>
                ))}
              </div>

              {/* Monthly context */}
              {donationType === 'monthly' && (
                <div className="bg-[oklch(0.94_0.04_195)] rounded-xl p-3.5">
                  <p className="text-xs font-semibold text-[oklch(0.30_0.08_195)] mb-1">정기후원이란?</p>
                  <p className="text-xs text-[oklch(0.38_0.07_195)] leading-relaxed">
                    매월 같은 금액이 자동 결제됩니다. 언제든지 해지 가능하며, 선교사에게 안정적인 사역을 지원해요.
                  </p>
                </div>
              )}

              {/* Preset amounts */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2.5">후원 금액 선택</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {PRESET_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount)
                        setCustomAmount('')
                      }}
                      className={`py-3.5 rounded-xl text-sm font-bold border-2 transition-all ${
                        selectedAmount === amount && !customAmount
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                          : 'border-border bg-card text-foreground hover:border-primary/50'
                      }`}
                    >
                      {formatKRW(amount)}
                      <span className="block text-[10px] font-normal mt-0.5 opacity-70">
                        {donationType === 'monthly' ? '/월' : '일시'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">직접 입력</p>
                <div className="relative">
                  <input
                    type="number"
                    min={1000}
                    placeholder="금액을 입력하세요"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(0)
                    }}
                    className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-card"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">원</span>
                </div>
              </div>

              {/* Impact message */}
              {finalAmount > 0 && IMPACT_MAP[finalAmount] && (
                <div className="flex items-start gap-2.5 bg-amber-50 rounded-xl p-3.5">
                  <span className="text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true">✦</span>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <strong>{formatKRW(finalAmount)}{donationType === 'monthly' ? '/월' : ''}</strong>이면{' '}
                    {IMPACT_MAP[finalAmount]}
                  </p>
                </div>
              )}

              <button
                onClick={handleNext}
                disabled={finalAmount < 1000}
                className="w-full bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground font-bold text-base py-4 rounded-xl transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {formatKRW(finalAmount)} {donationType === 'monthly' ? '정기후원' : '일시후원'} 시작하기
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ── STEP 2: INFO ── */}
          {step === 'info' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground">후원자 정보 입력</h2>
                <p className="text-sm text-muted-foreground mt-1">기부금 영수증 발급에 사용됩니다.</p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label htmlFor="donor-name" className="text-sm font-medium text-foreground block mb-1.5">
                    이름 <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="donor-name"
                    type="text"
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-card"
                  />
                </div>
                <div>
                  <label htmlFor="donor-phone" className="text-sm font-medium text-foreground block mb-1.5">
                    휴대폰 번호 <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="donor-phone"
                    type="tel"
                    placeholder="010-0000-0000"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={13}
                    className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-card"
                  />
                </div>
                <div>
                  <label htmlFor="donor-email" className="text-sm font-medium text-foreground block mb-1.5">
                    이메일
                    <span className="text-xs text-muted-foreground ml-1.5">(영수증 발송)</span>
                  </label>
                  <input
                    id="donor-email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-card"
                  />
                </div>
                <div>
                  <label htmlFor="donor-birthdate" className="text-sm font-medium text-foreground block mb-1.5">
                    생년월일 <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="donor-birthdate"
                    type="date"
                    value={birthDate}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-card"
                    aria-required="true"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    기부금 영수증·연령 확인에 사용됩니다.
                  </p>
                </div>
                <label
                  htmlFor="donor-newsletter"
                  className="flex items-start gap-3 cursor-pointer rounded-xl border-2 border-border p-3.5 hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors"
                >
                  <input
                    id="donor-newsletter"
                    type="checkbox"
                    checked={newsletterOptIn}
                    onChange={(e) => setNewsletterOptIn(e.target.checked)}
                    className="mt-0.5 accent-primary w-4 h-4 flex-shrink-0"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">
                      뉴스레터 구독 (선택)
                    </span>
                    <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
                      사역 소식·캠페인 안내 메일을 받아봅니다. 언제든 수신 거부할 수 있습니다.
                    </span>
                  </span>
                </label>
              </div>

              {/* Anonymous option note */}
              <p className="text-xs text-muted-foreground bg-muted rounded-xl p-3.5">
                후원자 이름은 미션 페이지에 「홍○○님」 형태로 표시됩니다. 익명으로 후원하려면 이름을 「익명」으로 입력하세요.
              </p>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceedInfo}
                className="w-full bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground font-bold text-base py-4 rounded-xl transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                다음 단계
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ── STEP 3: PAYMENT ── */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground">결제 확인</h2>
                <p className="text-sm text-muted-foreground mt-1">결제 전 내용을 확인해 주세요.</p>
              </div>

              {/* Summary card */}
              <div className="bg-muted rounded-2xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">후원 대상</span>
                  <span className="font-semibold text-foreground text-right max-w-[60%]">{missionaryName} 선교사</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">후원 유형</span>
                  <span className="font-semibold text-foreground">
                    {donationType === 'monthly' ? '정기 (매월)' : '일시'}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">결제 금액</span>
                  <span className="font-bold text-primary text-lg">{formatKRW(finalAmount)}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">후원자</span>
                  <span className="font-semibold text-foreground">{name}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">생년월일</span>
                  <span className="font-semibold text-foreground">
                    {birthDate.replace(/-/g, '.')}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">뉴스레터</span>
                  <span className="font-semibold text-foreground">
                    {newsletterOptIn ? '구독' : '미구독'}
                  </span>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2.5">결제 수단</p>
                <div className="space-y-2">
                  {['카카오페이', '신용/체크카드', '계좌이체'].map((method) => (
                    <label
                      key={method}
                      className="flex items-center gap-3 border-2 border-border rounded-xl p-3.5 cursor-pointer hover:border-primary/40 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={method}
                        defaultChecked={method === '카카오페이'}
                        className="accent-primary w-4 h-4"
                      />
                      <CreditCard size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Agreement */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeAll}
                  onChange={(e) => setAgreeAll(e.target.checked)}
                  className="accent-primary w-4 h-4 mt-0.5 flex-shrink-0"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  개인정보 수집 및 이용에 동의하며, 정기후원의 경우 매월 자동 결제됨을 확인합니다.{' '}
                  <button className="underline text-primary" onClick={(e) => e.preventDefault()}>약관 보기</button>
                </span>
              </label>

              {/* Trust badge */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-xl p-3">
                <Shield size={14} className="text-primary flex-shrink-0" />
                SSL 암호화로 안전하게 결제됩니다. 결제 정보는 저장되지 않습니다.
              </div>

              <button
                onClick={handlePayment}
                disabled={!agreeAll || isLoading}
                className="w-full bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground font-bold text-base py-4 rounded-xl transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    결제 처리 중...
                  </span>
                ) : (
                  <>
                    {formatKRW(finalAmount)} 결제하기
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── STEP 4: SUCCESS ── */}
          {step === 'success' && (
            <div className="flex flex-col items-center text-center space-y-5 py-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 size={40} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">후원 완료!</h2>
                <p className="text-muted-foreground mt-2 leading-relaxed text-sm">
                  {name}님, {missionaryName} 선교사의 사역을<br />
                  {formatKRW(finalAmount)}{donationType === 'monthly' ? '/월 정기' : ' 일시'}
                  로 후원해 주셔서 감사합니다.
                </p>
              </div>
              <div className="w-full bg-muted rounded-2xl p-4 text-left space-y-2.5">
                <p className="text-xs text-muted-foreground">
                  결제 영수증은 입력하신 이메일로 발송됩니다.
                </p>
                <p className="text-xs text-muted-foreground">
                  기부금 영수증은 매년 1월 국세청 연말정산 간소화 서비스에서 확인하실 수 있습니다.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground font-bold text-base py-4 rounded-xl transition-colors shadow-sm"
              >
                확인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
