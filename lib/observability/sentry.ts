/**
 * Sentry placeholder (D0). Wire @sentry/nextjs in D2 when DSN is available.
 * Call `captureException` / `captureMessage` from server routes once installed.
 */
export const captureException = (error: unknown): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error('[sentry:stub]', error)
  }
}

export const captureMessage = (message: string): void => {
  if (process.env.NODE_ENV === 'development') {
    console.info('[sentry:stub]', message)
  }
}

export const isSentryConfigured = (): boolean => Boolean(process.env.SENTRY_DSN)
