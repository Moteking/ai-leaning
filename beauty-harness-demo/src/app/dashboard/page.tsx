'use client'

import { useState } from 'react'
import { todayBookings, automationLogs, monthlyStats, HPB_FEE_PER_BOOKING } from '@/lib/mockData'
import { Booking, AutomationLog } from '@/lib/types'
import AutomationFlow from '@/components/AutomationFlow'

export default function DashboardPage() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null)
  const [logs, setLogs] = useState<AutomationLog[]>(automationLogs)

  const { hpbCount, ownCount, bookingCount } = monthlyStats
  const hpbPct = Math.round((hpbCount / bookingCount) * 100)
  const savings = hpbCount * HPB_FEE_PER_BOOKING

  const handleComplete = (b: Booking) => setActiveBooking(b)

  const handleFlowClose = () => {
    if (activeBooking) {
      setCompletedIds(p => new Set(p).add(activeBooking.id))
      const t = `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`
      const nl: AutomationLog[] = [
        { id: `l${Date.now()}-1`, customerName: activeBooking.customer.name, action: 'お礼LINE送信完了', timestamp: t, status: 'success' },
        { id: `l${Date.now()}-2`, customerName: activeBooking.customer.name, action: 'リマインド設定完了', timestamp: t, status: 'success' },
        ...(activeBooking.customer.source === 'hpb' ? [{ id: `l${Date.now()}-3`, customerName: activeBooking.customer.name, action: 'HPB→自社誘導LINE送信', timestamp: t, status: 'success' as const }] : []),
      ]
      setLogs(p => [...nl, ...p])
    }
    setActiveBooking(null)
  }

  return (
    <div className="pb-32">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-pink/8" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent/8 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink/8 rounded-full blur-[60px]" />
        <div className="relative px-5 pt-12 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-t2 text-[11px]">Good morning</p>
              <h1 className="text-[26px] font-black tracking-tight mt-0.5">Beauty Harness</h1>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-pink flex items-center justify-center text-sm font-bold shadow-lg">Y</div>
          </div>
          <p className="text-t3 text-[11px] mt-1">{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 stagger">
          {[
            { label: '今月売上', value: `¥${(monthlyStats.revenue / 10000).toFixed(1)}万`, gradient: true },
            { label: 'リピート率', value: `${monthlyStats.repeatRate}%`, sub: '+3%', subColor: 'text-green' },
            { label: '本日予約', value: `${todayBookings.length}件` },
          ].map(s => (
            <div key={s.label} className="bg-s2 rounded-2xl p-3 border border-white/[0.04] ani-fade">
              <p className="text-[9px] text-t3">{s.label}</p>
              <p className={`text-lg font-black mt-0.5 ${s.gradient ? 'grad-text' : ''}`}>{s.value}</p>
              {s.sub && <p className={`text-[9px] ${s.subColor} font-bold`}>{s.sub} ↑</p>}
            </div>
          ))}
        </div>

        {/* HPB savings */}
        <div className="bg-s2 rounded-2xl p-4 border border-white/[0.04] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red/5 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-bold">予約経路</p>
              <div className="flex gap-3 text-[10px] text-t2">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red" />HPB {hpbPct}%</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green" />自社 {100 - hpbPct}%</span>
              </div>
            </div>
            <div className="flex h-2.5 rounded-full overflow-hidden mb-3 bg-s3">
              <div className="bg-red/70 rounded-l-full" style={{ width: `${hpbPct}%` }} />
              <div className="bg-green/70 rounded-r-full" style={{ width: `${100 - hpbPct}%` }} />
            </div>
            <div className="bg-green/[0.06] border border-green/10 rounded-xl p-3">
              <p className="text-[10px] text-t2">全予約を自社経由にすると</p>
              <p className="text-xl font-black text-green mt-0.5">月¥{savings.toLocaleString()}<span className="text-[10px] text-t3 ml-1.5">節約（年¥{(savings * 12).toLocaleString()}）</span></p>
            </div>
          </div>
        </div>

        {/* Today's bookings */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-bold">本日の予約</h2>
            <div className="flex items-center gap-1.5 bg-s3 rounded-full px-2.5 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green ani-pulse" />
              <span className="text-[10px] text-t2">{completedIds.size}/{todayBookings.length} 完了</span>
            </div>
          </div>
          <div className="space-y-2 stagger">
            {todayBookings.map(b => {
              const done = completedIds.has(b.id)
              const isHpb = b.customer.source === 'hpb'
              return (
                <div key={b.id} className={`bg-s2 rounded-2xl p-4 border border-white/[0.04] transition-all duration-500 ani-fade ${done ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center ${done ? 'bg-green/10' : 'bg-s3'}`}>
                      {done ? (
                        <svg className="w-5 h-5 text-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      ) : (
                        <span className="text-sm font-black">{b.time}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold truncate">{b.customer.name}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${isHpb ? 'bg-red/12 text-red' : 'bg-green/12 text-green'}`}>
                          {isHpb ? 'HPB' : '自社'}
                        </span>
                      </div>
                      <p className="text-[11px] text-t2 truncate">{b.treatment}</p>
                      <p className="text-[11px] font-bold text-t2 mt-0.5">¥{b.price.toLocaleString()}</p>
                    </div>
                    {!done && (
                      <button onClick={() => handleComplete(b)}
                        className="flex-shrink-0 bg-white text-black font-bold px-4 py-2.5 rounded-xl text-xs active:scale-95 transition-transform shadow-lg shadow-white/10">
                        施術完了
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI Log */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green ani-pulse" />
            <h2 className="text-sm font-bold">AI自動処理ログ</h2>
          </div>
          <div className="bg-s2 rounded-2xl border border-white/[0.04] divide-y divide-white/[0.04]">
            {logs.slice(0, 6).map(l => (
              <div key={l.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-5 h-5 rounded-full bg-green/12 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                </div>
                <p className="flex-1 text-[11px] text-t1 truncate">{l.customerName} — {l.action}</p>
                <span className="text-[10px] text-t3 flex-shrink-0">{l.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeBooking && <AutomationFlow booking={activeBooking} onClose={handleFlowClose} />}
    </div>
  )
}
