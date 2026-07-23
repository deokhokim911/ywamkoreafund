'use client'

import { useEffect } from 'react'

type HtmlLangProps = {
  locale: string
}

/** Sync <html lang> when locale changes (root layout owns the tags). */
export const HtmlLang = ({ locale }: HtmlLangProps) => {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}
