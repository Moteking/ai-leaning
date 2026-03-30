'use client'

import { useState } from 'react'
import { todayBookings, automationLogs } from '@/lib/mockData'
import { Booking, AutomationLog } from '@/lib/types'
import BookingCard from '@/components/BookingCard'
import AutomationFlow from '@/components/AutomationFlow'
import StatsCards from '@/components/StatsCards'
import HpbRatioChart from '@/components/HpbRatioChart'

export default function DashboardPage() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null)
  const [logs, setLogs] = useState<AutomationLog[]>(automationLogs)

  const handleComplete = (booking: Booking) => {
    setActiveBooking(booking)
  }

  const handleFlowClose = () => {
    if (activeBooking) {
      setCompletedIds((prev) => new Set(prev).add(activeBooking.id))

      // ログ追加
      const now = new Date()
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
      const newLogs: AutomationLog[] = [
        {
          id: `log-${Date.now()}-1`,
          customerName: activeBooking.customer.name,
          action: 'お礼LINE送信',
          timestamp: timeStr,
          status: 'success',
        },
        {
          id: `log-${Date.now()}-2`,
          customerName: activeBooking.customer.name,
          action: 'リマインド設定',
          timestamp: timeStr,
          status: 'success',
        },
        ...(activeBooking.customer.source === 'hpb'
          ? [
              {
                id: `log-${Date.now()}-3`,
                customerName: activeBooking.customer.name,
                action: 'HPB→自社誘導LINE送信',
                timestamp: timeStr,
                status: 'success' as const,
              },
            ]
          : []),
      ]
      setLogs((prev) => [...newLogs, ...prev])
    }
    setActiveBooking(null)
  }

  return (
    <div className="p-4 space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-primary">Beauty Harness</h1>
          <p className="text-xs text-gray-400">AI自動化予約管理</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">本日</p>
          <p className="text-sm font-bold text-primary">
            {new Date().toLocaleDateString('ja-JP', {
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </p>
        </div>
      </div>

      {/* 統計カード */}
      <StatsCards />

      {/* HPB比率グラフ + 節約計算 */}
      <HpbRatioChart />

      {/* 本日の予約 */}
      <div>
        <h2 className="text-sm font-bold text-primary mb-2">
          本日の予約（{todayBookings.length}件）
        </h2>
        <div className="space-y-3">
          {todayBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onComplete={handleComplete}
              isCompleted={completedIds.has(booking.id)}
            />
          ))}
        </div>
      </div>

      {/* 自動化ログ */}
      <div>
        <h2 className="text-sm font-bold text-primary mb-2">
          AI自動処理ログ
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 p-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">
                  {log.customerName} - {log.action}
                </p>
              </div>
              <span className="text-[10px] text-gray-400 flex-shrink-0">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 施術完了フローモーダル */}
      {activeBooking && (
        <AutomationFlow
          booking={activeBooking}
          onClose={handleFlowClose}
        />
      )}
    </div>
  )
}
