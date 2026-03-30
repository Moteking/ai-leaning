'use client'

import { customers } from '@/lib/mockData'

function getCancelRisk(count: number): { label: string; color: string } {
  if (count >= 2) return { label: '高リスク', color: 'bg-red-100 text-red-700' }
  if (count >= 1) return { label: '注意', color: 'bg-yellow-100 text-yellow-700' }
  return { label: '良好', color: 'bg-green-100 text-green-700' }
}

export default function CustomerTable() {
  return (
    <div className="space-y-3">
      {customers.map((c) => {
        const risk = getCancelRisk(c.cancelCount)
        return (
          <div
            key={c.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary text-sm">
                  {c.name}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    c.source === 'hpb'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  {c.source === 'hpb' ? 'HPB経由' : '自社予約'}
                </span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${risk.color}`}
              >
                {risk.label}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
              <div>
                <p className="text-[10px] text-gray-400">施術</p>
                <p className="font-medium text-gray-700">{c.treatment}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400">来店間隔</p>
                <p className="font-medium text-gray-700">{c.visitIntervalDays}日</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400">次回予測</p>
                <p className="font-medium text-gray-700">
                  {c.nextPredicted.slice(5)}
                </p>
              </div>
            </div>

            {c.cancelCount > 0 && (
              <p className="text-[10px] text-red-500 mt-2">
                キャンセル {c.cancelCount}回
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
