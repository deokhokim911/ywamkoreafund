import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString && process.env.NODE_ENV !== 'production') {
  console.warn(
    '[db] DATABASE_URL is not set. Set it in .env.local (Supabase connection string).',
  )
}

const client = connectionString
  ? postgres(connectionString, { prepare: false, max: 1 })
  : null

export const db = client ? drizzle(client, { schema }) : null

export const isDbConfigured = (): boolean => Boolean(client)

export const closeDb = async (): Promise<void> => {
  if (client) {
    await client.end({ timeout: 5 })
  }
}

export type Db = NonNullable<typeof db>
