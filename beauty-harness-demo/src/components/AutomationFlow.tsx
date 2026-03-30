'use client'

import { useState, useEffect, useCallback } from 'react'
import { Booking, AutomationStep, GeneratedMessages } from '@/lib/types'
import MessagePreview from './MessagePreview'

interface Props {
  booking: Booking
  onClose: () => void
}

const initialSteps: AutomationStep[] = [
  { id: 1, label: 'お礼LINE送信中...', status: 'pending' },
  { id: 2, label: '来店履歴を学習中...', status: 'pending' },
  { id: 3, label: '次回リマインド日を計算中...', status: 'pending' },
  { id: 4, label: 'HPB経由客を判定中...', status: 'pending' },
  { id: 5, label: '自社誘導LINEを生成中...', status: 'pending' },
]

export default function AutomationFlow({ booking, onClose }: Props) {
  const [steps, setSteps] = useState<AutomationStep[]>(initialSteps)
  const [currentStep, setCurrentStep] = useState(0)
  const [messages, setMessages] = useState<GeneratedMessages | null>(null)
  const [showMessages, setShowMessages] = useState(false)

  const runAutomation = useCallback(async () => {
    // ステップ1〜4をアニメーション（各0.5秒）
    for (let i = 0; i < 4; i++) {
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: 'running' } : s
        )
      )
      setCurrentStep(i + 1)
      await new Promise((r) => setTimeout(r, 500))
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: 'done' } : s
        )
      )
    }

    // ステップ5：Claude APIで実際に生成
    setSteps((prev) =>
      prev.map((s, idx) =>
        idx === 4 ? { ...s, status: 'running' } : s
      )
    )
    setCurrentStep(5)

    try {
      const res = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: booking.customer.id,
          treatment: booking.treatment,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      } else {
        // APIエラー時はモックメッセージ
        setMessages({
          thanks: `${booking.customer.name}様、本日は${booking.treatment}のご来店ありがとうございました！仕上がりはいかがですか？何かお気づきの点がございましたらお気軽にご連絡くださいね✨ 次回のご来店も楽しみにお待ちしております🌸`,
          reviewRequest: `${booking.customer.name}様、先日はありがとうございました！もしよろしければ、Googleレビューでご感想をいただけると嬉しいです🙏 ▶ [レビューリンク]`,
          repeatPromotion: `${booking.customer.name}様、そろそろ次のお手入れ時期ですね✨ ${booking.customer.nextPredicted}頃がおすすめです。LINEから簡単にご予約いただけます🌸`,
          hpbRedirect:
            booking.customer.source === 'hpb'
              ? `${booking.customer.name}様、次回はLINEからのご予約で500円OFFになります💰 ぜひご活用ください！ ▶ [LINE予約リンク]`
              : undefined,
        })
      }
    } catch {
      setMessages({
        thanks: `${booking.customer.name}様、本日は${booking.treatment}のご来店ありがとうございました！仕上がりはいかがですか？次回のご来店も楽しみにお待ちしております🌸`,
        reviewRequest: `${booking.customer.name}様、先日はありがとうございました！Googleレビューでご感想をいただけると嬉しいです🙏`,
        repeatPromotion: `${booking.customer.name}様、そろそろ次のお手入れ時期ですね✨ LINEから簡単にご予約いただけます🌸`,
        hpbRedirect:
          booking.customer.source === 'hpb'
            ? `${booking.customer.name}様、次回はLINEからのご予約で500円OFFになります💰`
            : undefined,
      })
    }

    setSteps((prev) =>
      prev.map((s, idx) =>
        idx === 4 ? { ...s, status: 'done' } : s
      )
    )

    await new Promise((r) => setTimeout(r, 300))
    setShowMessages(true)
  }, [booking])

  useEffect(() => {
    runAutomation()
  }, [runAutomation])

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-lg rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-primary text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">AI自動処理</h2>
              <p className="text-xs text-blue-200">
                {booking.customer.name}様 / {booking.treatment}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* ステップ表示 */}
        <div className="p-4 space-y-3">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 transition-all duration-500 ${
                idx <= currentStep - 1
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-4'
              }`}
            >
              {/* アイコン */}
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                {step.status === 'done' ? (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : step.status === 'running' ? (
                  <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                )}
              </div>

              {/* ラベル */}
              <span
                className={`text-sm font-medium ${
                  step.status === 'done'
                    ? 'text-green-600'
                    : step.status === 'running'
                    ? 'text-accent'
                    : 'text-gray-300'
                }`}
              >
                {step.status === 'done'
                  ? step.label.replace('中...', '完了 ✅')
                  : step.label}
              </span>
            </div>
          ))}
        </div>

        {/* AI生成メッセージプレビュー */}
        {showMessages && messages && (
          <div className="animate-fade-in">
            <MessagePreview
              messages={messages}
              isHpb={booking.customer.source === 'hpb'}
            />
          </div>
        )}

        {/* 閉じるボタン */}
        {showMessages && (
          <div className="p-4 pt-0 animate-fade-in">
            <button
              onClick={onClose}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl text-sm"
            >
              閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
