'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ChevronRight, ChevronLeft, CheckCircle2, Shield, CreditCard } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { formatMoney } from '@/lib/formatMoney'

type DonationType = 'once' | 'monthly'
type Step = 'amount' | 'info' | 'payment' | 'success'
type PaymentMethod = 'kakao' | 'card' | 'transfer'

interface DonationModalProps {
  open: boolean
  missionTitle: string
  missionaryName: string
  onClose: () => void
}

const PRESET_AMOUNTS = [10_000, 30_000, 50_000, 100_000]
const PAYMENT_METHODS: PaymentMethod[] = ['kakao', 'card', 'transfer']
const STEPS: Step[] = ['amount', 'info', 'payment', 'success']
const IMPACT_KEYS = ['10000', '30000', '50000', '100000'] as const

export function DonationModal(props: DonationModalProps) {
  if (!props.open) return null
  return <DonationModalContent {...props} />
}

const DonationModalContent = ({
  missionTitle,
  missionaryName,
  onClose,
}: DonationModalProps) => {
  const t = useTranslations('donate')
  const tCommon = useTranslations('common')
  const locale = useLocale()

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kakao')
  const [isLoading, setIsLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const formatAmount = (amount: number) => formatMoney(amount, locale, tCommon)

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

  const impactKey = IMPACT_KEYS.find((key) => Number(key) === finalAmount)
  const impactText = impactKey ? t(`amount.impact.${impactKey}`) : null

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
      aria-label={t('a11y.dialog')}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        className="relative bg-card w-full md:max-w-md rounded-t-3xl md:rounded-2xl shadow-2xl max-h-[92dvh] overflow-y-auto"
      >
        <div className="flex justify-center pt-3 md:hidden" aria-hidden="true">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-2 md:pt-5">
          {step !== 'success' && step !== 'amount' ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors -ml-1 p-1"
              aria-label={t('a11y.back')}
            >
              <ChevronLeft size={18} />
              {t('back')}
            </button>
          ) : (
            <div />
          )}
          <p className="text-sm font-semibold text-muted-foreground">
            {t(`steps.${step}`)}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-muted transition-colors"
            aria-label={t('a11y.close')}
          >
            <X size={18} />
          </button>
        </div>

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
          {step === 'amount' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {t('amount.heading', { name: missionaryName })}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{missionTitle}</p>
              </div>

              <div className="flex gap-2 p-1 bg-muted rounded-xl">
                {(['once', 'monthly'] as DonationType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDonationType(type)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                      donationType === type
                        ? 'bg-card text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t(type)}
                  </button>
                ))}
              </div>

              {donationType === 'monthly' && (
                <div className="bg-[oklch(0.94_0.04_195)] rounded-xl p-3.5">
                  <p className="text-xs font-semibold text-[oklch(0.30_0.08_195)] mb-1">
                    {t('amount.monthlyHelpTitle')}
                  </p>
                  <p className="text-xs text-[oklch(0.38_0.07_195)] leading-relaxed">
                    {t('amount.monthlyHelpBody')}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-foreground mb-2.5">{t('amount.selectAmount')}</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {PRESET_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
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
                      {formatAmount(amount)}
                      <span className="block text-[10px] font-normal mt-0.5 opacity-70">
                        {donationType === 'monthly' ? t('amount.perMonth') : t('amount.oneTime')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">{t('amount.customLabel')}</p>
                <div className="relative">
                  <input
                    type="number"
                    min={1000}
                    placeholder={t('amount.customPlaceholder')}
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(0)
                    }}
                    className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-card"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {t('amount.currencySuffix')}
                  </span>
                </div>
              </div>

              {finalAmount > 0 && impactText && (
                <div className="flex items-start gap-2.5 bg-amber-50 rounded-xl p-3.5">
                  <span className="text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true">✦</span>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <strong>
                      {t('amount.impactPrefix', {
                        amount: formatAmount(finalAmount),
                        period: donationType === 'monthly' ? t('amount.perMonth') : '',
                      })}
                    </strong>{' '}
                    {impactText}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={finalAmount < 1000}
                className="w-full bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground font-bold text-base py-4 rounded-xl transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {t('amount.startCta', {
                  amount: formatAmount(finalAmount),
                  type: t(donationType),
                })}
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 'info' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground">{t('info.title')}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t('info.subtitle')}</p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label htmlFor="donor-name" className="text-sm font-medium text-foreground block mb-1.5">
                    {t('info.name')} <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="donor-name"
                    type="text"
                    placeholder={t('info.namePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-card"
                  />
                </div>
                <div>
                  <label htmlFor="donor-phone" className="text-sm font-medium text-foreground block mb-1.5">
                    {t('info.phone')} <span className="text-destructive">*</span>
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
                    {t('info.email')}
                    <span className="text-xs text-muted-foreground ml-1.5">{t('info.emailHint')}</span>
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
                    {t('info.birthDate')} <span className="text-destructive">*</span>
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
                  <p className="text-xs text-muted-foreground mt-1.5">{t('info.birthHint')}</p>
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
                      {t('info.newsletterTitle')}
                    </span>
                    <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
                      {t('info.newsletterBody')}
                    </span>
                  </span>
                </label>
              </div>

              <p className="text-xs text-muted-foreground bg-muted rounded-xl p-3.5">
                {t('info.anonymousNote')}
              </p>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceedInfo}
                className="w-full bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground font-bold text-base py-4 rounded-xl transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {t('next')}
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground">{t('payment.title')}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t('payment.subtitle')}</p>
              </div>

              <div className="bg-muted rounded-2xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('payment.target')}</span>
                  <span className="font-semibold text-foreground text-right max-w-[60%]">
                    {t('payment.missionarySuffix', { name: missionaryName })}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('payment.type')}</span>
                  <span className="font-semibold text-foreground">
                    {donationType === 'monthly' ? t('payment.typeMonthly') : t('payment.typeOnce')}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">{t('payment.amount')}</span>
                  <span className="font-bold text-primary text-lg">{formatAmount(finalAmount)}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('payment.donor')}</span>
                  <span className="font-semibold text-foreground">{name}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('payment.birthDate')}</span>
                  <span className="font-semibold text-foreground">
                    {birthDate.replace(/-/g, '.')}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('payment.newsletter')}</span>
                  <span className="font-semibold text-foreground">
                    {newsletterOptIn ? t('payment.subscribed') : t('payment.notSubscribed')}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2.5">{t('payment.methodTitle')}</p>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method}
                      className="flex items-center gap-3 border-2 border-border rounded-xl p-3.5 cursor-pointer hover:border-primary/40 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="accent-primary w-4 h-4"
                      />
                      <CreditCard size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {t(`payment.methods.${method}`)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeAll}
                  onChange={(e) => setAgreeAll(e.target.checked)}
                  className="accent-primary w-4 h-4 mt-0.5 flex-shrink-0"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {t('payment.agree')}{' '}
                  <button
                    type="button"
                    className="underline text-primary"
                    onClick={(e) => e.preventDefault()}
                  >
                    {t('payment.terms')}
                  </button>
                </span>
              </label>

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-xl p-3">
                <Shield size={14} className="text-primary flex-shrink-0" />
                {t('payment.trust')}
              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={!agreeAll || isLoading}
                className="w-full bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground font-bold text-base py-4 rounded-xl transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {t('paying')}
                  </span>
                ) : (
                  <>
                    {t('payWithAmount', { amount: formatAmount(finalAmount) })}
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center text-center space-y-5 py-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 size={40} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{t('success')}</h2>
                <p className="text-muted-foreground mt-2 leading-relaxed text-sm">
                  {t('successDetail.thanks', { name, missionary: missionaryName })}
                  <br />
                  {t('successDetail.thanksAmount', {
                    amount: formatAmount(finalAmount),
                    period:
                      donationType === 'monthly'
                        ? t('successDetail.periodMonthly')
                        : t('successDetail.periodOnce'),
                  })}
                </p>
              </div>
              <div className="w-full bg-muted rounded-2xl p-4 text-left space-y-2.5">
                <p className="text-xs text-muted-foreground">{t('successDetail.receiptEmail')}</p>
                <p className="text-xs text-muted-foreground">{t('successDetail.taxNote')}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground font-bold text-base py-4 rounded-xl transition-colors shadow-sm"
              >
                {t('close')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
