'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const adminNav = [
  { href: '/dashboard', label: 'ホーム', icon: '📊' },
  { href: '/customers', label: '顧客', icon: '👥' },
  { href: '/analytics', label: '分析', icon: '📈' },
  { href: '/post', label: '投稿', icon: '📸' },
]

const customerNav = [
  { href: '/gallery', label: 'スタイル', icon: '💇' },
  { href: '/booking', label: '予約', icon: '📅' },
  { href: '/mypage', label: 'マイページ', icon: '👤' },
]

export default function Navigation() {
  const pathname = usePathname()

  const isCustomerPage = ['/gallery', '/booking', '/mypage'].includes(pathname)
  const navItems = isCustomerPage ? customerNav : adminNav

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50">
      <div className="max-w-lg mx-auto">
        {/* モード切替 */}
        <div className="flex justify-center pt-1">
          <div className="flex bg-gray-100 rounded-full p-0.5 text-[9px]">
            <Link
              href="/dashboard"
              className={`px-3 py-0.5 rounded-full font-bold transition-all ${
                !isCustomerPage
                  ? 'bg-primary text-white'
                  : 'text-gray-400'
              }`}
            >
              店舗管理
            </Link>
            <Link
              href="/gallery"
              className={`px-3 py-0.5 rounded-full font-bold transition-all ${
                isCustomerPage
                  ? 'bg-accent text-white'
                  : 'text-gray-400'
              }`}
            >
              お客様画面
            </Link>
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="flex justify-around">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-4 text-[10px] transition-colors ${
                  active
                    ? 'text-accent font-bold'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-lg mb-0.5">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
