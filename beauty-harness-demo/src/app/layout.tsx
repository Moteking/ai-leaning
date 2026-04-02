import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Beauty Harness — AI自動化サロン管理',
  description: '美容師向けAI自動化予約管理システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen">
        <div className="max-w-lg mx-auto relative">
          {children}
        </div>
        <Navigation />
      </body>
    </html>
  )
}
