import Image from 'next/image'
import { MapPin, CalendarDays } from 'lucide-react'

interface MissionaryProfileProps {
  name: string
  photo: string
  country: string
  organization: string
  sentYear: number
  bio: string
}

export function MissionaryProfile({
  name,
  photo,
  country,
  organization,
  sentYear,
  bio,
}: MissionaryProfileProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm">
      <h2 className="text-base font-semibold text-foreground mb-4">선교사 소개</h2>
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
          <Image
            src={photo}
            alt={`${name} 선교사 프로필 사진`}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-lg leading-tight">{name} 선교사</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-primary flex-shrink-0" />
              {country} 파송
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays size={13} className="text-primary flex-shrink-0" />
              {sentYear}년 파송
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{organization}</p>
        </div>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed mt-4">{bio}</p>
    </div>
  )
}
