'use client'

import { GeneratedMessages } from '@/lib/types'

interface Props {
  messages: GeneratedMessages
  isHpb: boolean
}

const messageTypes = [
  { key: 'thanks', label: 'お礼メッセージ', icon: '💌', color: 'border-pink-200 bg-pink-50' },
  { key: 'reviewRequest', label: '3日後レビュー依頼', icon: '⭐', color: 'border-yellow-200 bg-yellow-50' },
  { key: 'repeatPromotion', label: 'リピート促進', icon: '🔄', color: 'border-blue-200 bg-blue-50' },
  { key: 'hpbRedirect', label: 'HPB→自社誘導', icon: '📱', color: 'border-green-200 bg-green-50' },
] as const

export default function MessagePreview({ messages, isHpb }: Props) {
  const visibleTypes = messageTypes.filter(
    (t) => t.key !== 'hpbRedirect' || isHpb
  )

  return (
    <div className="px-4 pb-4">
      <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-1">
        <span>🤖</span> AI生成メッセージプレビュー
      </h3>
      <div className="space-y-3">
        {visibleTypes.map((type) => {
          const text = messages[type.key as keyof GeneratedMessages]
          if (!text) return null
          return (
            <div
              key={type.key}
              className={`rounded-xl p-3 border ${type.color}`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-sm">{type.icon}</span>
                <span className="text-xs font-bold text-gray-600">
                  {type.label}
                </span>
              </div>
              {/* LINEバブル風 */}
              <div className="bg-white rounded-xl rounded-tl-sm p-3 shadow-sm text-sm text-gray-700 leading-relaxed">
                {text}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
