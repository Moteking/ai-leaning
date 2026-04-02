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
  const hpbPercent = Math.round((hpbCount / bookingCount) * 100)
  const savings = hpbCount * HPB_FEE_PER_BOOKING

  const handleComplete = (booking: Booking) => {
    setActiveBooking(booking)
  }

  const handleFlowClose = () => {
    if (activeBooking) {
      setCompletedIds((prev) => new Set(prev).add(activeBooking.id))
      const now = new Date()
      const t = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
      const newLogs: AutomationLog[] = [
        { id: `l${Date.now()}-1`, customerName: activeBooking.customer.name, action: 'お礼LINE送信完了', timestamp: t, status: 'success' },
        { id: `l${Date.now()}-2`, customerName: activeBooking.customer.name, action: 'リマインド設定完了', timestamp: t, status: 'success' },
        ...(activeBooking.customer.source === 'hpb' ? [{ id: `l${Date.now()}-3`, customerName: activeBooking.customer.name, action: 'HPB→自社誘導LINE送信', timestamp: t, status: 'success' as const }] : []),
      ]
      setLogs((prev) => [...newLogs, ...prev])
    }
    setActiveBooking(null)
  }

  return (
    <div className="pb-32 relative">
      {/* Hero header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-pink/10" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative px-5 pt-12 pb-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-text-secondary text-xs">おはようございます</p>
              <h1 className="text-2xl font-black tracking-tight">Beauty Harness</h1>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-pink flex items-center justify-center text-sm font-bold">
              Y
            </div>
          </div>
          <p className="text-text-tertiary text-xs">
            {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Live stats row */}
        <div className="grid grid-cols-3 gap-2 stagger">
          <div className="glass-light rounded-2xl p-3 animate-fade-in">
            <p className="text-[10px] text-text-tertiary mb-1">今月売上</p>
            <p className="text-lg font-black text-gradient">¥{(monthlyStats.revenue / 10000).toFixed(1)}<span className="text-xs text-text-secondary">万</span></p>
          </div>
          <div className="glass-light rounded-2xl p-3 animate-fade-in">
            <p className="text-[10px] text-text-tertiary mb-1">リピート率</p>
            <p className="text-lg font-black text-success">{monthlyStats.repeatRate}%</p>
            <p className="text-[8px] text-success">+3% ↑</p>
          </div>
          <div className="glass-light rounded-2xl p-3 animate-fade-in">
            <p className="text-[10px] text-text-tertiary mb-1">本日予約</p>
            <p className="text-lg font-black">{todayBookings.length}<span className="text-xs text-text-secondary">件</span></p>
          </div>
        </div>

        {/* HPB savings widget */}
        <div className="glass-light rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-danger/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold">予約経路</p>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-danger" />HPB {hpbPercent}%</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success" />自社 {100 - hpbPercent}%</span>
              </div>
            </div>
            {/* Bar */}
            <div className="flex h-3 rounded-full overflow-hidden mb-3">
              <div className="bg-danger/80 transition-all duration-1000" style={{ width: `${hpbPercent}%` }} />
              <div className="bg-success/80 transition-all duration-1000" style={{ width: `${100 - hpbPercent}%` }} />
            </div>
            {/* Savings */}
            <div className="bg-success/5 border border-success/20 rounded-xl p-3">
              <p className="text-[10px] text-text-secondary mb-0.5">全予約が自社経由になると</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-black text-success">月¥{savings.toLocaleString()}</p>
                <p className="text-[10px] text-text-tertiary">節約（年¥{(savings * 12).toLocaleString()}）</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's appointments */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">本日の予約</h2>
            <span className="text-[10px] text-text-tertiary">{completedIds.size}/{todayBookings.length} 完了</span>
          </div>
          <div className="space-y-2 stagger">
            {todayBookings.map((booking) => {
              const done = completedIds.has(booking.id)
              const isHpb = booking.customer.source === 'hpb'
              return (
                <div
                  key={booking.id}
                  className={`glass-light rounded-2xl p-4 transition-all duration-500 animate-fade-in ${
                    done ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Time pill */}
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center ${
                      done ? 'bg-success/10' : 'bg-surface-3'
                    }`}>
                      {done ? (
                        <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <>
                          <span className="text-sm font-black">{booking.time}</span>
                        </>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold truncate">{booking.customer.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          isHpb ? 'bg-danger/15 text-danger' : 'bg-success/15 text-success'
                        }`}>
                          {isHpb ? 'HPB' : '自社'}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary truncate">{booking.treatment}</p>
                      <p className="text-xs font-bold text-text-secondary mt-0.5">¥{booking.price.toLocaleString()}</p>
                    </div>

                    {/* Action */}
                    {!done && (
                      <button
                        onClick={() => handleComplete(booking)}
                        className="flex-shrink-0 bg-accent hover:bg-accent/80 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all glow-accent"
                      >
                        施術完了
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI Activity Log */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <h2 className="text-sm font-bold">AI自動処理ログ</h2>
          </div>
          <div className="glass-light rounded-2xl divide-y divide-white/5">
            {logs.slice(0, 8).map((log) => (
              <div key={log.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-primary truncate">{log.customerName} — {log.action}</p>
                </div>
                <span className="text-[10px] text-text-tertiary flex-shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Automation Flow Modal */}
      {activeBooking && (
        <AutomationFlow booking={activeBooking} onClose={handleFlowClose} />
      )}
    </div>
  )
}
