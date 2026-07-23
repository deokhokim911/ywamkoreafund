import type { ReactNode } from 'react'

import './globals.css'

type RootLayoutProps = {
  children: ReactNode
}

/** Next.js 16 requires <html> and <body> in the root layout. */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" className="bg-background" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased font-sans">{children}</body>
    </html>
  )
}
