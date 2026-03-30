'use client'

import { monthlyStats } from '@/lib/mockData'

export default function StatsCards() {
  const stats = [
    {
      label: '今月の売上',
      value: `¥${monthlyStats.revenue.toLocaleString()}`,
      sub: `${monthlyStats.bookingCount}件`,
    },
    {
      label: 'リピート率',
      value: `${monthlyStats.repeatRate}%`,
      sub: '前月比 +3%',
    },
    {
      label: 'HPB手数料',
      value: `¥${monthlyStats.hpbFeeTotal.toLocaleString()}`,
      sub: `${monthlyStats.hpbCount}件 × ¥2,000`,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
        >
          <p className="text-[10px] text-gray-500 mb-1">{s.label}</p>
          <p className="text-base font-bold text-primary">{s.value}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
        </div>
      ))}
    </div>
  )
}
