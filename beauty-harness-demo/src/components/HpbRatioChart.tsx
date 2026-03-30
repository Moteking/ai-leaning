'use client'

import { monthlyStats, HPB_FEE_PER_BOOKING } from '@/lib/mockData'

export default function HpbRatioChart() {
  const { hpbCount, ownCount, bookingCount } = monthlyStats
  const hpbPercent = Math.round((hpbCount / bookingCount) * 100)
  const ownPercent = 100 - hpbPercent

  // 全予約が自社経由になった場合の節約額
  const savingsIfAllOwn = hpbCount * HPB_FEE_PER_BOOKING

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-sm font-bold text-primary mb-3">
        予約経路の内訳
      </h3>

      {/* 横棒グラフ */}
      <div className="flex rounded-full overflow-hidden h-8 mb-3">
        <div
          className="bg-red-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-700"
          style={{ width: `${hpbPercent}%` }}
        >
          HPB {hpbPercent}%
        </div>
        <div
          className="bg-green-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-700"
          style={{ width: `${ownPercent}%` }}
        >
          自社 {ownPercent}%
        </div>
      </div>

      {/* 内訳 */}
      <div className="flex justify-between text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          HPB経由 {hpbCount}件
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          自社予約 {ownCount}件
        </span>
      </div>

      {/* 節約ウィジェット */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 border border-blue-100">
        <p className="text-xs text-gray-600 mb-1">
          もし全予約が自社経由になったら...
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-green-600">
            月 ¥{savingsIfAllOwn.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">節約できます</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">
          HPB手数料 ¥{HPB_FEE_PER_BOOKING.toLocaleString()}/件 × {hpbCount}件 = ¥{savingsIfAllOwn.toLocaleString()}
        </p>
        <div className="mt-2 bg-white rounded-md p-2 border border-green-200">
          <p className="text-[10px] text-green-700 font-bold">
            年間だと ¥{(savingsIfAllOwn * 12).toLocaleString()} の削減効果
          </p>
        </div>
      </div>
    </div>
  )
}
