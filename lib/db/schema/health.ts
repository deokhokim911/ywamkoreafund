import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

/** D0 connectivity smoke — not domain data. Domain schema lands in D2. */
export const ywamHealth = pgTable('_ywam_health', {
  id: boolean('id').primaryKey().default(true),
  checkedAt: timestamp('checked_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  note: text('note').notNull().default('d0-smoke'),
})
