/** Web Share API helper — ignores user cancel (AbortError). */
export const sharePage = async (data: ShareData): Promise<void> => {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return
  }

  try {
    await navigator.share(data)
  } catch (error) {
    const name = error instanceof DOMException ? error.name : (error as { name?: string })?.name
    if (name === 'AbortError') return
    console.error('Share failed', error)
  }
}
