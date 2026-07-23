import { eq } from 'drizzle-orm'

import { closeDb, db, isDbConfigured } from '../lib/db'
import { ywamHealth } from '../lib/db/schema'

const run = async () => {
  if (!isDbConfigured() || !db) {
    console.error('DATABASE_URL is not set.')
    process.exit(1)
  }

  try {
    const rows = await db
      .select()
      .from(ywamHealth)
      .where(eq(ywamHealth.id, true))
      .limit(1)

    if (rows.length === 0) {
      console.error('_ywam_health has no row — run pnpm db:migrate first.')
      process.exitCode = 1
      return
    }

    console.log('OK', {
      note: rows[0].note,
      checkedAt: rows[0].checkedAt,
    })
  } finally {
    await closeDb()
  }
}

run().catch(async (error: unknown) => {
  console.error(error)
  await closeDb().catch(() => undefined)
  process.exit(1)
})
