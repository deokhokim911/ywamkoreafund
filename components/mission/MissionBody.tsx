interface MissionUpdate {
  date: string
  title: string
  content: string
}

interface MissionBodyProps {
  description: string
  updates: MissionUpdate[]
}

export function MissionBody({ description, updates }: MissionBodyProps) {
  return (
    <div className="space-y-6">
      {/* Mission description */}
      <div className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground mb-3">미션 소개</h2>
        <div className="text-sm text-foreground/80 leading-[1.8] space-y-3">
          {description.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {/* Updates */}
      {updates.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-4">사역 업데이트</h2>
          <ol className="relative border-l-2 border-primary/20 ml-3 space-y-6">
            {updates.map((update, i) => (
              <li key={i} className="ml-5">
                <span className="absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                <time className="text-xs text-muted-foreground block mb-1">{update.date}</time>
                <h3 className="text-sm font-semibold text-foreground mb-1">{update.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{update.content}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Trust signals */}
      <div className="bg-[oklch(0.94_0.04_195)] rounded-2xl p-5 md:p-6">
        <h2 className="text-sm font-semibold text-[oklch(0.30_0.08_195)] mb-3">안전 후원 안내</h2>
        <ul className="space-y-2 text-sm text-[oklch(0.35_0.08_195)]">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-primary">✓</span>
            기부금 영수증 발급 가능 (연말정산 활용 가능)
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-primary">✓</span>
            모금액 100% 해당 선교사 사역에 사용
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-primary">✓</span>
            SSL 암호화 보안 결제 · 개인정보 보호
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-primary">✓</span>
            운영 단체: 예수전도단 (YWAM Korea)
          </li>
        </ul>
      </div>
    </div>
  )
}
