import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Beauty Harness - AI自動化予約管理',
  description: '美容師向けAI自動化予約管理システム デモ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen pb-20">
        <div className="max-w-lg mx-auto">
          {children}
        </div>
        <Navigation />
      </body>
    </html>
  )
}
