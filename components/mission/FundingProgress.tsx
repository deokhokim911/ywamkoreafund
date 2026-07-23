'use client'

import { Users, Clock, TrendingUp } from 'lucide-react'

interface FundingProgressProps {
  currentAmount: number
  goalAmount: number
  donorCount: number
  daysLeft: number
  onDonateClick: () => void
}

function formatKRW(amount: number): string {
  if (amount >= 100_000_000) {
    return `${(amount / 100_000_000).toFixed(1)}억원`
  }
  if (amount >= 10_000) {
    return `${Math.floor(amount / 10_000).toLocaleString()}만원`
  }
  return `${amount.toLocaleString()}원`
}

export function FundingProgress({
  currentAmount,
  goalAmount,
  donorCount,
  daysLeft,
  onDonateClick,
}: FundingProgressProps) {
  const percentage = Math.min(Math.round((currentAmount / goalAmount) * 100), 100)

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-5 md:p-6">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-2xl md:text-3xl font-bold text-foreground">
              {formatKRW(currentAmount)}
            </span>
            <span className="text-muted-foreground text-sm ml-2">
              목표 {formatKRW(goalAmount)}
            </span>
          </div>
          <span className="text-primary font-bold text-lg">{percentage}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`모금 진행률 ${percentage}%`}
          className="w-full h-3 bg-muted rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-primary" />
          <span>후원자 <strong className="text-foreground">{donorCount.toLocaleString()}명</strong></span>
        </div>
        <div className="w-px h-3.5 bg-border" />
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-primary" />
          <span><strong className="text-foreground">{daysLeft}일</strong> 남음</span>
        </div>
        <div className="w-px h-3.5 bg-border" />
        <div className="flex items-center gap-1.5">
          <TrendingUp size={14} className="text-primary" />
          <span>모금중</span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onDonateClick}
        className="w-full bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground font-bold text-base py-4 rounded-xl transition-colors shadow-sm active:scale-[0.99]"
      >
        후원하기
      </button>

      <p className="text-center text-xs text-muted-foreground mt-3">
        기부금 영수증 발급 가능 · 안전 결제 보장
      </p>
    </div>
  )
}
