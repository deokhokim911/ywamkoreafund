'use client'

import { useEffect, useRef } from 'react'
import { X, Download, Printer, CheckCircle2 } from 'lucide-react'

interface Donation {
  id: string
  campaign: string
  missionary: string
  country: string
  amount: number
  type: '일시' | '정기'
  date: string
  receiptId: string
}

interface Donor {
  name: string
  email: string
  phone: string
}

interface ReceiptModalProps {
  donation: Donation
  donor: Donor
  onClose: () => void
}

export function ReceiptModal({ donation, donor, onClose }: ReceiptModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  const issueDate = donation.date
  const taxYear = donation.date.slice(0, 4)

  const rows = [
    { label: '영수증 번호', value: donation.receiptId },
    { label: '후원자 성명', value: donor.name },
    { label: '연락처', value: donor.phone },
    { label: '이메일', value: donor.email },
    { label: '후원 프로젝트', value: donation.campaign },
    { label: '선교사', value: `${donation.missionary} (${donation.country})` },
    { label: '후원 금액', value: `₩ ${donation.amount.toLocaleString()}` },
    { label: '후원 방식', value: donation.type === '정기' ? '정기 후원' : '일시 후원' },
    { label: '결제일', value: issueDate },
    { label: '발행일', value: issueDate },
  ]

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="기부금 영수증"
    >
      <div className="bg-card w-full max-w-md rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-primary" />
            <h2 className="font-bold text-foreground">기부금 영수증</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>

        {/* Receipt body — scrollable */}
        <div className="overflow-y-auto flex-1">
          <div className="px-6 py-6">

            {/* Organization stamp area */}
            <div className="text-center mb-6 pb-5 border-b border-dashed border-border">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary mb-3">
                <span className="text-lg font-bold text-primary-foreground">Y</span>
              </div>
              <h3 className="font-bold text-lg text-foreground">기부금 영수증</h3>
              <p className="text-xs text-muted-foreground mt-1">
                소득세법 제34조 및 조세특례제한법에 의한 기부금 영수증
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-[oklch(0.94_0.06_165)] text-[oklch(0.38_0.12_165)] text-xs font-semibold px-3 py-1.5 rounded-full">
                <CheckCircle2 size={12} />
                {taxYear}년 연말정산 공제 가능
              </div>
            </div>

            {/* Amount highlight */}
            <div className="bg-accent rounded-2xl p-5 text-center mb-5">
              <p className="text-xs text-muted-foreground mb-1">기부 금액</p>
              <p className="text-3xl font-bold text-primary">
                ₩ {donation.amount.toLocaleString()}
              </p>
              <p className="text-xs text-accent-foreground font-medium mt-1">
                {donation.type === '정기' ? '정기 후원' : '일시 후원'} · {donation.date}
              </p>
            </div>

            {/* Detail rows */}
            <div className="space-y-0 rounded-2xl border border-border overflow-hidden">
              {rows.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex gap-3 px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-card' : 'bg-muted/30'}`}
                >
                  <span className="text-muted-foreground flex-shrink-0 w-28">{row.label}</span>
                  <span className="font-medium text-foreground break-all">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Issuer info */}
            <div className="mt-5 pt-5 border-t border-dashed border-border text-center space-y-1">
              <p className="text-xs text-muted-foreground">발행 단체</p>
              <p className="text-sm font-bold text-foreground">예수전도단 (YWAM Korea)</p>
              <p className="text-xs text-muted-foreground">사업자등록번호: 000-00-00000</p>
              <p className="text-xs text-muted-foreground">서울특별시 서초구 서초대로 000</p>
              <p className="text-xs text-muted-foreground mt-2">
                위와 같이 기부금을 정히 영수합니다.
              </p>
              <p className="text-xs font-semibold text-foreground mt-1">
                {issueDate} &nbsp; 예수전도단 대표 홍길동 (인)
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-6 py-4 border-t border-border flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <Printer size={14} />
            인쇄하기
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Download size={14} />
            PDF 저장
          </button>
        </div>
      </div>
    </div>
  )
}
