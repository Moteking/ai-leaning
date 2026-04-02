'use client'

import { monthlyRevenue, monthlyStats, HPB_FEE_PER_BOOKING } from '@/lib/mockData'

export default function AnalyticsPage() {
  const maxRev = Math.max(...monthlyRevenue.map((m) => m.revenue))
  const totalRev = monthlyRevenue.reduce((s, m) => s + m.revenue, 0)
  const totalHpbFee = monthlyRevenue.reduce((s, m) => s + m.hpbCount * HPB_FEE_PER_BOOKING, 0)
  const ownRates = monthlyRevenue.map((m) => ({
    month: m.month,
    rate: Math.round((m.ownCount / (m.hpbCount + m.ownCount)) * 100),
  }))

  return (
    <div className="pb-32">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-black tracking-tight">売上分析</h1>
        <p className="text-xs text-t3 mt-1">AIインサイト付き</p>
      </div>

      <div className="px-4 space-y-4">
        {/* KPI row */}
        <div className="grid grid-cols-2 gap-2 stagger">
          <div className="bg-s2 border border-white/[0.04] rounded-2xl p-3 ani-fade">
            <p className="text-[10px] text-t3">6ヶ月売上</p>
            <p className="text-lg font-black grad-text">¥{(totalRev / 10000).toFixed(0)}万</p>
          </div>
          <div className="bg-s2 border border-white/[0.04] rounded-2xl p-3 ani-fade">
            <p className="text-[10px] text-t3">HPB手数料累計</p>
            <p className="text-lg font-black text-red">-¥{(totalHpbFee / 10000).toFixed(1)}万</p>
          </div>
          <div className="bg-s2 border border-white/[0.04] rounded-2xl p-3 ani-fade">
            <p className="text-[10px] text-t3">リピート率</p>
            <p className="text-lg font-black text-green">{monthlyStats.repeatRate}%</p>
            <p className="text-[8px] text-green">+3% 前月比</p>
          </div>
          <div className="bg-s2 border border-white/[0.04] rounded-2xl p-3 ani-fade">
            <p className="text-[10px] text-t3">自社予約率</p>
            <p className="text-lg font-black text-accent-2">{ownRates[ownRates.length - 1].rate}%</p>
            <p className="text-[8px] text-green">上昇中 ↑</p>
          </div>
        </div>

        {/* Revenue chart */}
        <div className="bg-s2 border border-white/[0.04] rounded-2xl p-4">
          <h3 className="text-xs font-bold mb-4">月間売上推移</h3>
          <div className="flex items-end gap-1.5 h-36">
            {monthlyRevenue.map((m, i) => {
              const h = (m.revenue / maxRev) * 100
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <p className="text-[8px] text-t3">{(m.revenue / 10000).toFixed(0)}万</p>
                  <div className="w-full relative" style={{ height: `${h}%` }}>
                    <div
                      className="absolute inset-0 rounded-md bg-gradient-to-t from-accent to-accent-2/50 transition-all duration-700"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  </div>
                  <p className="text-[9px] text-t3">{m.month.replace('月', '')}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Own rate trend */}
        <div className="bg-s2 border border-white/[0.04] rounded-2xl p-4">
          <h3 className="text-xs font-bold mb-4">HPB vs 自社の推移</h3>
          <div className="flex items-end gap-1.5 h-28">
            {ownRates.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-[8px] text-t3">{m.rate}%</p>
                <div className="w-full flex flex-col h-20 rounded-md overflow-hidden">
                  <div className="bg-red/40" style={{ height: `${100 - m.rate}%` }} />
                  <div className="bg-green/60" style={{ height: `${m.rate}%` }} />
                </div>
                <p className="text-[9px] text-t3">{m.month.replace('月', '')}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-3 text-[10px] text-t3">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green/60" />自社</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red/40" />HPB</span>
          </div>
        </div>

        {/* AI Insights */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-surface to-pink/10" />
          <div className="relative p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent-2">AI</div>
              <h3 className="text-xs font-bold">AIインサイト</h3>
            </div>
            <div className="space-y-2">
              {[
                { emoji: '📈', text: '自社予約率が3ヶ月連続上昇中。HPB→自社誘導LINEの効果が出ています。3ヶ月後に50%到達見込み。' },
                { emoji: '⚠️', text: '鈴木あおい様のキャンセル率が上昇。来店2日前リマインドLINEの自動送信を推奨します。' },
                { emoji: '💡', text: '12月が最高売上の傾向。11月にリピーター先行予約キャンペーンが効果的です。' },
              ].map((insight, i) => (
                <div key={i} className="bg-s2 border border-white/[0.04] rounded-xl p-3">
                  <p className="text-xs text-t1 leading-relaxed">
                    <span className="mr-1">{insight.emoji}</span>{insight.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stylist performance */}
        <div className="bg-s2 border border-white/[0.04] rounded-2xl p-4">
          <h3 className="text-xs font-bold mb-3">スタイリスト実績</h3>
          <div className="space-y-3">
            {[
              { name: 'Yuki', revenue: 420000, clients: 32, repeat: 81, rating: 4.9 },
              { name: 'Miki', revenue: 285000, clients: 22, repeat: 68, rating: 4.8 },
              { name: 'Rina', revenue: 187000, clients: 14, repeat: 71, rating: 4.7 },
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-pink flex items-center justify-center text-white text-xs font-bold">
                  {s.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{s.name}</span>
                    <span className="text-xs font-bold text-accent-2">¥{(s.revenue / 10000).toFixed(1)}万</span>
                  </div>
                  <div className="h-1 bg-s3 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${(s.revenue / 420000) * 100}%` }} />
                  </div>
                  <div className="flex gap-3 mt-1 text-[9px] text-t3">
                    <span>{s.clients}名</span>
                    <span>リピート{s.repeat}%</span>
                    <span>★{s.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
