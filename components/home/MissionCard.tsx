import Link from 'next/link'
import Image from 'next/image'
import { Users, Clock, MapPin } from 'lucide-react'

export interface MissionCardData {
  id: string
  slug: string
  title: string
  subtitle: string
  country: string
  missionaryName: string
  organization: string
  coverImage: string
  currentAmount: number
  goalAmount: number
  donorCount: number
  daysLeft: number
  isUrgent?: boolean
  isFeatured?: boolean
}

function formatKRW(amount: number): string {
  if (amount >= 100_000_000) return `${(amount / 100_000_000).toFixed(1)}억원`
  if (amount >= 10_000) return `${Math.floor(amount / 10_000).toLocaleString()}만원`
  return `${amount.toLocaleString()}원`
}

export function MissionCard({ mission }: { mission: MissionCardData }) {
  const percentage = Math.min(Math.round((mission.currentAmount / mission.goalAmount) * 100), 100)

  return (
    <Link
      href={`/mission`}
      className="group bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Cover image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Image
          src={mission.coverImage}
          alt={mission.title}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {mission.isUrgent && (
            <span className="bg-[oklch(0.78_0.14_80)] text-[oklch(0.20_0.05_80)] text-xs font-semibold px-2.5 py-1 rounded-full">
              긴급
            </span>
          )}
        </div>
        {/* Country tag */}
        <div className="absolute bottom-3 left-3">
          <span className="flex items-center gap-1 bg-foreground/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
            <MapPin size={11} />
            {mission.country}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Organization */}
        <p className="text-xs text-muted-foreground font-medium">{mission.organization}</p>

        {/* Title */}
        <h3 className="font-bold text-foreground text-sm leading-snug line-clamp-2 text-balance group-hover:text-primary transition-colors">
          {mission.title}
        </h3>

        {/* Missionary */}
        <p className="text-xs text-muted-foreground">
          선교사 <span className="font-medium text-foreground">{mission.missionaryName}</span>
        </p>

        {/* Progress */}
        <div className="mt-auto pt-1">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="font-bold text-foreground">{formatKRW(mission.currentAmount)}</span>
            <span className="font-semibold text-primary text-xs">{percentage}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`모금 진행률 ${percentage}%`}
            className="w-full h-2 bg-muted rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users size={11} className="text-primary" />
              {mission.donorCount.toLocaleString()}명 후원
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-primary" />
              {mission.daysLeft}일 남음
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
