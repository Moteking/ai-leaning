'use client'

import { customers } from '@/lib/mockData'

function getCancelRisk(count: number) {
  if (count >= 2) return { label: '高', color: 'bg-danger/15 text-danger' }
  if (count >= 1) return { label: '中', color: 'bg-warning/15 text-warning' }
  return { label: '低', color: 'bg-success/15 text-success' }
}

export default function CustomersPage() {
  const hpbCustomers = customers.filter((c) => c.source === 'hpb')
  const ownCustomers = customers.filter((c) => c.source === 'own')

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-black tracking-tight">顧客管理</h1>
        <p className="text-xs text-text-tertiary mt-1">AI分析付き • {customers.length}名</p>
      </div>

      <div className="px-4 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="glass-light rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-danger">{hpbCustomers.length}</p>
            <p className="text-[10px] text-text-tertiary">HPB経由</p>
          </div>
          <div className="glass-light rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-success">{ownCustomers.length}</p>
            <p className="text-[10px] text-text-tertiary">自社予約</p>
          </div>
          <div className="glass-light rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-warning">{customers.filter((c) => c.cancelCount > 0).length}</p>
            <p className="text-[10px] text-text-tertiary">要注意</p>
          </div>
        </div>

        {/* Customer cards */}
        <div className="space-y-2 stagger">
          {customers.map((c) => {
            const risk = getCancelRisk(c.cancelCount)
            const isHpb = c.source === 'hpb'
            const daysAgo = Math.floor((Date.now() - new Date(c.lastVisit).getTime()) / 86400000)
            return (
              <div key={c.id} className="glass-light rounded-2xl p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black ${
                    isHpb ? 'bg-danger/15 text-danger' : 'bg-success/15 text-success'
                  }`}>
                    {c.name[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold truncate">{c.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        isHpb ? 'bg-danger/15 text-danger' : 'bg-success/15 text-success'
                      }`}>
                        {isHpb ? 'HPB' : '自社'}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${risk.color}`}>
                        リスク{risk.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mb-2">{c.treatment}</p>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-[9px] text-text-tertiary">来店間隔</p>
                        <p className="text-xs font-bold">{c.visitIntervalDays}日</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-text-tertiary">前回来店</p>
                        <p className="text-xs font-bold">{daysAgo}日前</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-text-tertiary">次回予測</p>
                        <p className="text-xs font-bold">{c.nextPredicted.slice(5)}</p>
                      </div>
                    </div>

                    {c.cancelCount > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 bg-danger/5 border border-danger/10 rounded-lg px-2.5 py-1.5">
                        <svg className="w-3 h-3 text-danger" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-[10px] text-danger">キャンセル{c.cancelCount}回 — リマインド強化推奨</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
