'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type BrandLogoProps = {
  href?: string
  className?: string
  showWordmark?: boolean
  onClick?: () => void
}

export const BrandLogo = ({
  href = '/',
  className,
  showWordmark = true,
  onClick,
}: BrandLogoProps) => {
  const t = useTranslations('common')

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn('flex items-center gap-2 group min-w-0', className)}
      aria-label={`${t('brand')} home`}
    >
      <Image
        src="/ywam-logo.png"
        alt={t('brand')}
        width={99}
        height={33}
        className="h-7 w-auto object-contain flex-shrink-0"
        priority
      />
      {showWordmark && (
        <span className="font-bold text-foreground text-sm truncate tracking-tight">
          {t('brand')}
        </span>
      )}
    </Link>
  )
}
