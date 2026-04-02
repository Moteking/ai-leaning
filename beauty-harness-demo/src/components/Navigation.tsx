'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const adminNav = [
  { href: '/dashboard', label: 'ホーム',
    icon: (a: boolean) => <svg className="w-6 h-6" fill={a?'currentColor':'none'} stroke={a?'none':'currentColor'} viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>},
  { href: '/customers', label: '顧客',
    icon: (a: boolean) => <svg className="w-6 h-6" fill={a?'currentColor':'none'} stroke={a?'none':'currentColor'} viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>},
  { href: '/analytics', label: '分析',
    icon: (a: boolean) => <svg className="w-6 h-6" fill={a?'currentColor':'none'} stroke={a?'none':'currentColor'} viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>},
  { href: '/post', label: '投稿',
    icon: (a: boolean) => <svg className="w-6 h-6" fill={a?'currentColor':'none'} stroke={a?'none':'currentColor'} viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>},
]

const customerNav = [
  { href: '/gallery', label: 'ホーム',
    icon: (a: boolean) => <svg className="w-6 h-6" fill={a?'currentColor':'none'} stroke={a?'none':'currentColor'} viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>},
  { href: '/booking', label: '予約',
    icon: (a: boolean) => <svg className="w-6 h-6" fill={a?'currentColor':'none'} stroke={a?'none':'currentColor'} viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>},
  { href: '/mypage', label: 'マイページ',
    icon: (a: boolean) => <svg className="w-6 h-6" fill={a?'currentColor':'none'} stroke={a?'none':'currentColor'} viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>},
]

export default function Navigation() {
  const pathname = usePathname()
  const isCust = ['/gallery', '/booking', '/mypage'].includes(pathname)
  const items = isCust ? customerNav : adminNav

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="max-w-lg mx-auto px-3 pb-1">
        {/* Mode switch pill */}
        <div className="flex justify-center mb-1">
          <div className="glass-heavy rounded-full p-0.5 flex text-[9px]">
            <Link href="/dashboard" className={`px-3.5 py-1 rounded-full font-bold transition-all ${!isCust ? 'bg-white text-black' : 'text-t2'}`}>管理</Link>
            <Link href="/gallery" className={`px-3.5 py-1 rounded-full font-bold transition-all ${isCust ? 'bg-white text-black' : 'text-t2'}`}>お客様</Link>
          </div>
        </div>

        {/* Tab bar */}
        <div className="glass-heavy rounded-2xl flex justify-around items-center py-1">
          {items.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={`relative flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-all ${active ? 'text-white' : 'text-t3'}`}>
                {active && <div className="absolute -top-0.5 w-4 h-0.5 rounded-full bg-white" />}
                {item.icon(active)}
                <span className="text-[9px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
