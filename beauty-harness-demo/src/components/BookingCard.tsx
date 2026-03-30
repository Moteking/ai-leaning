'use client'

import { Booking } from '@/lib/types'

interface Props {
  booking: Booking
  onComplete: (booking: Booking) => void
  isCompleted: boolean
}

export default function BookingCard({ booking, onComplete, isCompleted }: Props) {
  const { customer, time, treatment, price } = booking
  const isHpb = customer.source === 'hpb'

  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-300 ${
        isCompleted ? 'border-green-300 bg-green-50/30' : 'border-gray-100'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">{customer.name}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                isHpb
                  ? 'bg-red-100 text-red-600'
                  : 'bg-green-100 text-green-600'
              }`}
            >
              {isHpb ? 'HPB経由' : '自社予約'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {time} / {treatment}
          </p>
        </div>
        <span className="text-sm font-bold text-primary">
          ¥{price.toLocaleString()}
        </span>
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          施術完了・AI自動処理済み
        </div>
      ) : (
        <button
          onClick={() => onComplete(booking)}
          className="w-full mt-1 bg-accent hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all duration-150 shadow-md shadow-blue-200"
        >
          施術完了
        </button>
      )}
    </div>
  )
}
