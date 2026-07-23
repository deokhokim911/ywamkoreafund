'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: '홈' },
  { href: '/my', label: '내 후원' },
  { href: '/dashboard', label: '선교사 대시보드' },
  { href: '/create', label: '캠페인 만들기' },
  { href: '/support', label: 'Q&A' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">Y</span>
          </div>
          <span className="font-bold text-foreground text-sm">YWAMFund</span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-1" aria-label="주요 메뉴">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className={cn(
              'text-sm font-medium px-3 py-1.5 rounded-lg transition-colors',
              pathname === '/admin'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            관리자
          </Link>
          <Link
            href="/mission"
            className="hidden md:flex bg-primary hover:bg-[oklch(0.44_0.12_195)] text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            후원하기
          </Link>
        </div>
      </div>
    </header>
  )
}
