import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

import { db, isDbConfigured } from '@/lib/db'
import { ywamHealth } from '@/lib/db/schema'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = async () => {
  if (!isDbConfigured() || !db) {
    return NextResponse.json(
      {
        ok: false,
        error: 'DATABASE_URL is not configured',
        provider: process.env.DB_PROVIDER ?? null,
      },
      { status: 503 },
    )
  }

  try {
    const rows = await db
      .select()
      .from(ywamHealth)
      .where(eq(ywamHealth.id, true))
      .limit(1)

    return NextResponse.json({
      ok: true,
      provider: process.env.DB_PROVIDER ?? 'supabase',
      health: rows[0]
        ? { note: rows[0].note, checkedAt: rows[0].checkedAt }
        : null,
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'query failed',
      },
      { status: 500 },
    )
  }
}
