'use client'

import {
  SEED_MISSIONS,
  slugify,
  type Mission,
  type MissionStatus,
} from '@/lib/mock/missions'

let _missions: Mission[] = [...SEED_MISSIONS]
const _listeners = new Set<() => void>()

const notify = () => {
  _listeners.forEach((fn) => fn())
}

export type CreateMissionInput = {
  title: string
  subtitle: string
  body: string
  country: string
  missionaryName: string
  organization: string
  goalAmount: number
  coverImage?: string
  sentYear?: number
  daysLeft?: number
}

export const missionStore = {
  get(): Mission[] {
    return _missions
  },

  getPublished(): Mission[] {
    return _missions.filter((m) => m.status === 'published')
  },

  getPending(): Mission[] {
    return _missions.filter((m) => m.status === 'pending_review')
  },

  getBySlug(slug: string): Mission | undefined {
    return _missions.find((m) => m.slug === slug)
  },

  getById(id: string): Mission | undefined {
    return _missions.find((m) => m.id === id)
  },

  createPending(input: CreateMissionInput): Mission {
    const id = `m-${Date.now()}`
    let slug = slugify(input.title)
    if (_missions.some((m) => m.slug === slug)) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    const mission: Mission = {
      id,
      slug,
      status: 'pending_review',
      title: input.title,
      subtitle: input.subtitle,
      body: input.body,
      country: input.country,
      missionaryName: input.missionaryName,
      missionaryPhoto: '/missionary-profile.png',
      missionaryBio: '',
      organization: input.organization,
      sentYear: input.sentYear ?? new Date().getFullYear(),
      coverImage: input.coverImage || '/mission-cover.png',
      currentAmount: 0,
      goalAmount: input.goalAmount,
      donorCount: 0,
      daysLeft: input.daysLeft ?? 60,
      updates: [],
      createdAt: new Date().toISOString(),
    }

    _missions = [mission, ..._missions]
    notify()
    return mission
  },

  setStatus(id: string, status: MissionStatus): Mission | undefined {
    let updated: Mission | undefined
    _missions = _missions.map((m) => {
      if (m.id !== id) return m
      updated = { ...m, status }
      return updated
    })
    if (updated) notify()
    return updated
  },

  publish(id: string): Mission | undefined {
    return this.setStatus(id, 'published')
  },

  reject(id: string): Mission | undefined {
    return this.setStatus(id, 'rejected')
  },

  subscribe(fn: () => void): () => void {
    _listeners.add(fn)
    return () => {
      _listeners.delete(fn)
    }
  },
}
