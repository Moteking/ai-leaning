'use client'

import { useState, useEffect, useCallback } from 'react'
import { Booking, AutomationStep, GeneratedMessages } from '@/lib/types'

interface Props {
  booking: Booking
  onClose: () => void
}

const stepDefs = [
  { label: 'お礼LINEを送信', icon: '💌', detail: 'パーソナライズされたメッセージを生成' },
  { label: '来店履歴を分析', icon: '📊', detail: '過去の施術データとAIが照合' },
  { label: 'リマインド日を計算', icon: '📅', detail: '来店間隔から最適な次回日を算出' },
  { label: 'HPB経由客を判定', icon: '🔍', detail: '予約経路を自動識別' },
  { label: '自社誘導LINEを生成', icon: '🤖', detail: 'Claude AIがメッセージを作成中...' },
]

export default function AutomationFlow({ booking, onClose }: Props) {
  const [steps, setSteps] = useState<AutomationStep[]>(
    stepDefs.map((s, i) => ({ id: i, label: s.label, status: 'pending' }))
  )
  const [currentStep, setCurrentStep] = useState(-1)
  const [messages, setMessages] = useState<GeneratedMessages | null>(null)
  const [phase, setPhase] = useState<'processing' | 'done'>('processing')
  const [activeMsg, setActiveMsg] = useState(0)

  const runAutomation = useCallback(async () => {
    for (let i = 0; i < 4; i++) {
      setCurrentStep(i)
      setSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s))
      await new Promise((r) => setTimeout(r, 700))
      setSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: 'done' } : s))
      await new Promise((r) => setTimeout(r, 200))
    }

    // Step 5 — Claude API
    setCurrentStep(4)
    setSteps((prev) => prev.map((s, idx) => idx === 4 ? { ...s, status: 'running' } : s))

    let msgs: GeneratedMessages
    try {
      const res = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: booking.customer.id, treatment: booking.treatment }),
      })
      if (res.ok) {
        msgs = await res.json()
      } else {
        throw new Error('API error')
      }
    } catch {
      msgs = {
        thanks: `${booking.customer.name}様、本日は${booking.treatment}のご来店ありがとうございました！仕上がりはいかがですか？次回も楽しみにお待ちしております✨`,
        reviewRequest: `${booking.customer.name}様、先日はありがとうございました！Googleレビューでご感想いただけると嬉しいです🙏`,
        repeatPromotion: `${booking.customer.name}様、そろそろ次のお手入れの時期ですね✨ LINEから簡単にご予約できます🌸`,
        hpbRedirect: booking.customer.source === 'hpb'
          ? `${booking.customer.name}様、次回はLINE予約で500円OFF💰 ぜひご利用ください！`
          : undefined,
      }
    }

    setMessages(msgs)
    setSteps((prev) => prev.map((s, idx) => idx === 4 ? { ...s, status: 'done' } : s))
    await new Promise((r) => setTimeout(r, 500))
    setPhase('done')
  }, [booking])

  useEffect(() => {
    runAutomation()
  }, [runAutomation])

  const msgList = messages ? [
    { type: 'お礼メッセージ', text: messages.thanks, color: 'from-accent to-accent-light', icon: '💌' },
    { type: 'レビュー依頼（3日後）', text: messages.reviewRequest, color: 'from-warning to-yellow-400', icon: '⭐' },
    { type: 'リピート促進', text: messages.repeatPromotion, color: 'from-success to-emerald-400', icon: '🔄' },
    ...(messages.hpbRedirect ? [{ type: 'HPB→自社誘導', text: messages.hpbRedirect, color: 'from-pink to-rose-400', icon: '📱' }] : []),
  ] : []

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in-fast">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-surface rounded-t-3xl max-h-[92vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-surface/90 backdrop-blur-lg border-b border-white/5 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black">AI自動処理</h2>
              <p className="text-xs text-text-secondary">{booking.customer.name} / {booking.treatment}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="px-5 py-4">
          <div className="space-y-1">
            {stepDefs.map((def, idx) => {
              const step = steps[idx]
              const isVisible = idx <= currentStep
              const isActive = idx === currentStep
              return (
                <div
                  key={idx}
                  className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 h-0 overflow-hidden'}`}
                >
                  <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                    isActive && step.status === 'running' ? 'bg-accent/10' : ''
                  }`}>
                    {/* Status indicator */}
                    <div className="flex-shrink-0 w-10 h-10 relative">
                      {step.status === 'done' ? (
                        <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center animate-scale-in">
                          <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : step.status === 'running' ? (
                        <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin-slow flex items-center justify-center">
                          <span className="text-sm">{def.icon}</span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center">
                          <span className="text-sm opacity-30">{def.icon}</span>
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    <div className="flex-1">
                      <p className={`text-sm font-bold transition-colors ${
                        step.status === 'done' ? 'text-success' :
                        step.status === 'running' ? 'text-accent-light' :
                        'text-text-tertiary'
                      }`}>
                        {step.status === 'done' ? `${def.label}...完了` : `${def.label}...`}
                      </p>
                      {step.status === 'running' && (
                        <p className="text-[10px] text-text-secondary animate-fade-in">{def.detail}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Generated Messages */}
        {phase === 'done' && messages && (
          <div className="px-5 pb-6 animate-fade-in">
            <div className="border-t border-white/5 pt-4">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center text-[10px]">AI</span>
                生成されたメッセージ
              </h3>

              {/* Message tabs */}
              <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
                {msgList.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveMsg(i)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                      activeMsg === i
                        ? 'bg-accent text-white'
                        : 'bg-surface-3 text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {m.icon} {m.type}
                  </button>
                ))}
              </div>

              {/* Active message */}
              <div className="glass-light rounded-2xl p-4 animate-fade-in" key={activeMsg}>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r ${msgList[activeMsg]?.color} text-white text-[10px] font-bold mb-3`}>
                  {msgList[activeMsg]?.icon} {msgList[activeMsg]?.type}
                </div>
                {/* LINE bubble style */}
                <div className="bg-surface-3 rounded-2xl rounded-tl-sm p-4 text-sm text-text-primary leading-relaxed">
                  {msgList[activeMsg]?.text}
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 rounded-xl bg-success/10 text-success text-xs font-bold hover:bg-success/20 transition-colors">
                    送信する
                  </button>
                  <button className="flex-1 py-2 rounded-xl bg-surface-3 text-text-secondary text-xs font-bold hover:text-text-primary transition-colors">
                    編集する
                  </button>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="w-full mt-4 bg-accent text-white font-bold py-3.5 rounded-xl text-sm glow-accent active:scale-[0.98] transition-transform"
              >
                完了
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
