'use client'

import { monthlyRevenue, monthlyStats, HPB_FEE_PER_BOOKING } from '@/lib/mockData'

export default function AnalyticsPage() {
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue))
  const totalHpbFee = monthlyRevenue.reduce(
    (sum, m) => sum + m.hpbCount * HPB_FEE_PER_BOOKING,
    0
  )
  const avgRepeatRate = monthlyStats.repeatRate
  const ownRateTrend = monthlyRevenue.map((m) => ({
    month: m.month,
    rate: Math.round((m.ownCount / (m.hpbCount + m.ownCount)) * 100),
  }))

  return (
    <div className="p-4 space-y-4 pb-24">
      <div>
        <h1 className="text-xl font-black text-primary">売上分析</h1>
        <p className="text-xs text-gray-400">AIインサイト付きダッシュボード</p>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-400">6ヶ月売上合計</p>
          <p className="text-lg font-black text-primary">
            ¥{monthlyRevenue
              .reduce((s, m) => s + m.revenue, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-400">HPB手数料合計</p>
          <p className="text-lg font-black text-red-500">
            -¥{totalHpbFee.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-400">リピート率</p>
          <p className="text-lg font-black text-accent">{avgRepeatRate}%</p>
          <p className="text-[10px] text-green-500">+3% 前月比</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-400">自社予約率</p>
          <p className="text-lg font-black text-green-600">
            {ownRateTrend[ownRateTrend.length - 1].rate}%
          </p>
          <p className="text-[10px] text-green-500">上昇トレンド ↑</p>
        </div>
      </div>

      {/* 月間売上推移グラフ */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-primary mb-4">月間売上推移</h3>
        <div className="flex items-end gap-2 h-40">
          {monthlyRevenue.map((m) => {
            const height = (m.revenue / maxRevenue) * 100
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center">
                <p className="text-[8px] text-gray-500 mb-1">
                  ¥{(m.revenue / 10000).toFixed(0)}万
                </p>
                <div
                  className="w-full bg-gradient-to-t from-accent to-blue-300 rounded-t-md transition-all duration-700"
                  style={{ height: `${height}%` }}
                />
                <p className="text-[10px] text-gray-400 mt-1">{m.month}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* HPB vs 自社推移 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-primary mb-4">
          自社予約率の推移
        </h3>
        <div className="flex items-end gap-2 h-32">
          {ownRateTrend.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center">
              <p className="text-[8px] text-gray-500 mb-1">{m.rate}%</p>
              <div className="w-full flex flex-col-reverse h-24">
                <div
                  className="w-full bg-green-400 rounded-t-sm transition-all duration-700"
                  style={{ height: `${m.rate}%` }}
                />
                <div
                  className="w-full bg-red-400 rounded-t-sm"
                  style={{ height: `${100 - m.rate}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{m.month}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-2 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            自社予約
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-400 rounded-full" />
            HPB経由
          </span>
        </div>
      </div>

      {/* AIインサイト */}
      <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🤖</span>
          <h3 className="text-sm font-bold">AIインサイト</h3>
        </div>
        <div className="space-y-3">
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <p className="text-xs leading-relaxed">
              📈 <strong>自社予約率が3ヶ月連続で上昇中</strong>です。
              HPB→自社誘導LINEの効果が出ています。
              このペースなら3ヶ月後に自社予約率50%達成が見込めます。
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <p className="text-xs leading-relaxed">
              ⚠️ <strong>鈴木あおい様</strong>のキャンセル率が高くなっています。
              来店2日前のリマインドLINEの送信を推奨します。
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <p className="text-xs leading-relaxed">
              💡 <strong>12月の売上が最も高い</strong>傾向があります。
              11月中にリピーター向けの先行予約キャンペーンを打つと効果的です。
            </p>
          </div>
        </div>
      </div>

      {/* スタイリスト別パフォーマンス */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-primary mb-3">
          スタイリスト別パフォーマンス
        </h3>
        <div className="space-y-3">
          {[
            {
              name: 'Yuki',
              revenue: 420000,
              clients: 32,
              repeat: 81,
              satisfaction: 4.9,
            },
            {
              name: 'Miki',
              revenue: 285000,
              clients: 22,
              repeat: 68,
              satisfaction: 4.8,
            },
            {
              name: 'Rina',
              revenue: 187000,
              clients: 14,
              repeat: 71,
              satisfaction: 4.7,
            },
          ].map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-sm">
                {s.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-primary">
                    {s.name}
                  </span>
                  <span className="text-xs font-bold text-accent">
                    ¥{s.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-3 text-[10px] text-gray-400">
                  <span>{s.clients}人担当</span>
                  <span>リピート{s.repeat}%</span>
                  <span>★{s.satisfaction}</span>
                </div>
                {/* 売上バー */}
                <div className="h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-700"
                    style={{
                      width: `${(s.revenue / 420000) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
