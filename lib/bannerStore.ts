'use client'

// Shared in-memory banner store — both AdminPage and HomePage import from here.
// In a real app this would be backed by a database. Here we use a module-level
// singleton so edits in the admin tab are instantly reflected on the homepage
// within the same browser session.

export interface BannerSlide {
  id: string
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
  videoUrl: string
  imageUrl: string
  order: number
  isActive: boolean
}

export const DEFAULT_BANNERS: BannerSlide[] = [
  {
    id: 'b1',
    title: '선교사와 함께 세상을 바꿉니다',
    subtitle: '전 세계 현장에서 복음을 전하는 선교사들을 후원하세요. 월 1만원으로도 한 아이의 삶이 달라집니다.',
    ctaLabel: '사역 자세히 보기',
    ctaHref: '/m/thailand-literacy',
    videoUrl: '',
    imageUrl: '/mission-cover.png',
    order: 1,
    isActive: true,
  },
  {
    id: 'b2',
    title: '미얀마 긴급 구호 사역',
    subtitle: '내전으로 피폐해진 카렌주에 의료와 복음을. 지금 바로 힘을 보태주세요.',
    ctaLabel: '긴급 후원하기',
    ctaHref: '/m/thailand-literacy',
    videoUrl: 'https://www.youtube.com/watch?v=example',
    imageUrl: '/mission-cover-3.png',
    order: 2,
    isActive: true,
  },
  {
    id: 'b3',
    title: '몽골 초원의 복음',
    subtitle: '유목민 공동체와 함께 살아가며 교회를 개척하는 최성민 선교사를 응원해 주세요.',
    ctaLabel: '프로젝트 보기',
    ctaHref: '/m/thailand-literacy',
    videoUrl: '',
    imageUrl: '/mission-cover-4.png',
    order: 3,
    isActive: false,
  },
]

// Module-level singleton (survives re-renders, shared across components in same tab)
let _banners: BannerSlide[] = [...DEFAULT_BANNERS]
const _listeners = new Set<() => void>()

export const bannerStore = {
  get(): BannerSlide[] {
    return _banners
  },
  set(banners: BannerSlide[]) {
    _banners = banners
    _listeners.forEach((fn) => fn())
  },
  subscribe(fn: () => void): () => void {
    _listeners.add(fn)
    return () => _listeners.delete(fn)
  },
}
