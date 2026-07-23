'use client'

import Image from 'next/image'
import { Share2, Heart } from 'lucide-react'
import { useState } from 'react'

interface MissionHeroProps {
  coverImage: string
  title: string
  subtitle: string
  organization: string
  onShareClick?: () => void
}

export function MissionHero({
  coverImage,
  title,
  subtitle,
  organization,
  onShareClick,
}: MissionHeroProps) {
  const [liked, setLiked] = useState(false)

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative w-full aspect-video max-h-[480px] overflow-hidden bg-muted">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top action bar */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setLiked((v) => !v)}
            aria-label="찜하기"
            className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-white transition-colors"
          >
            <Heart
              size={16}
              className={liked ? 'fill-rose-500 stroke-rose-500' : 'stroke-foreground'}
            />
            <span className={liked ? 'text-rose-500' : ''}>{liked ? '찜완료' : '찜하기'}</span>
          </button>
          <button
            onClick={onShareClick}
            aria-label="공유하기"
            className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-white transition-colors"
          >
            <Share2 size={16} />
            <span>공유</span>
          </button>
        </div>

        {/* Bottom overlay title */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
          <p className="text-white/80 text-sm font-medium mb-1">{organization}</p>
          <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight text-balance">
            {title}
          </h1>
          <p className="text-white/80 text-sm mt-2 leading-relaxed line-clamp-2">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
