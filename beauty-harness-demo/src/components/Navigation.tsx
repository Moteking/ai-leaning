'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'ダッシュボード', icon: '📊' },
  { href: '/customers', label: '顧客リスト', icon: '👥' },
  { href: '/post', label: '写真投稿', icon: '📸' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-lg mx-auto flex justify-around">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-3 px-4 text-xs transition-colors ${
                active
                  ? 'text-accent font-bold'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
