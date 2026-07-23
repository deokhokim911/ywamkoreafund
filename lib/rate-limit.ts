/**
 * Rate-limit placeholder (D0). Replace with Upstash Redis in D2.
 * Returns allowed=true until configured.
 */
export type RateLimitResult = {
  success: boolean
  remaining: number
  reset: number
}

export const checkRateLimit = async (
  key: string,
): Promise<RateLimitResult> => {
  void key
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return { success: true, remaining: 999, reset: Date.now() + 60_000 }
  }

  // D2: Upstash Ratelimit
  return { success: true, remaining: 999, reset: Date.now() + 60_000 }
}
