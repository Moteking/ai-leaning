'use client'

import { useState, useEffect, useCallback } from 'react'
import { Booking, AutomationStep, GeneratedMessages } from '@/lib/types'

interface Props { booking: Booking; onClose: () => void }

const defs = [
  { label: 'お礼LINEを送信', icon: '💌', detail: 'パーソナライズメッセージを生成中' },
  { label: '来店履歴を分析', icon: '📊', detail: '過去の施術データをAIが照合中' },
  { label: 'リマインド日を計算', icon: '📅', detail: '来店間隔から最適日を算出中' },
  { label: 'HPB経由客を判定', icon: '🔍', detail: '予約経路を自動識別中' },
  { label: '自社誘導LINEを生成', icon: '🤖', detail: 'Claude AIがメッセージを作成中...' },
]

export default function AutomationFlow({ booking, onClose }: Props) {
  const [steps, setSteps] = useState<AutomationStep[]>(defs.map((_, i) => ({ id: i, label: '', status: 'pending' })))
  const [cur, setCur] = useState(-1)
  const [msgs, setMsgs] = useState<GeneratedMessages | null>(null)
  const [done, setDone] = useState(false)
  const [tab, setTab] = useState(0)

  const run = useCallback(async () => {
    for (let i = 0; i < 4; i++) {
      setCur(i)
      setSteps(p => p.map((s, idx) => idx === i ? { ...s, status: 'running' } : s))
      await new Promise(r => setTimeout(r, 700))
      setSteps(p => p.map((s, idx) => idx === i ? { ...s, status: 'done' } : s))
      await new Promise(r => setTimeout(r, 150))
    }
    setCur(4)
    setSteps(p => p.map((s, idx) => idx === 4 ? { ...s, status: 'running' } : s))

    let m: GeneratedMessages
    try {
      const res = await fetch('/api/generate-message', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: booking.customer.id, treatment: booking.treatment }),
      })
      m = res.ok ? await res.json() : (() => { throw 0 })()
    } catch {
      m = {
        thanks: `${booking.customer.name}様、本日は${booking.treatment}のご来店ありがとうございました！仕上がりはいかがですか？次回も楽しみにお待ちしております✨`,
        reviewRequest: `${booking.customer.name}様、先日はありがとうございました！Googleレビューでご感想いただけると嬉しいです🙏`,
        repeatPromotion: `${booking.customer.name}様、そろそろ次のお手入れの時期ですね✨ LINEから簡単にご予約できます🌸`,
        hpbRedirect: booking.customer.source === 'hpb' ? `${booking.customer.name}様、次回はLINE予約で500円OFF💰 ぜひご利用ください！` : undefined,
      }
    }
    setMsgs(m)
    setSteps(p => p.map((s, idx) => idx === 4 ? { ...s, status: 'done' } : s))
    await new Promise(r => setTimeout(r, 400))
    setDone(true)
  }, [booking])

  useEffect(() => { run() }, [run])

  const msgList = msgs ? [
    { type: 'お礼', text: msgs.thanks, emoji: '💌' },
    { type: 'レビュー依頼', text: msgs.reviewRequest, emoji: '⭐' },
    { type: 'リピート促進', text: msgs.repeatPromotion, emoji: '🔄' },
    ...(msgs.hpbRedirect ? [{ type: 'HPB→自社誘導', text: msgs.hpbRedirect, emoji: '📱' }] : []),
  ] : []

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center ani-fade-fast">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-s2 rounded-t-3xl max-h-[92vh] overflow-y-auto ani-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1"><div className="w-9 h-1 rounded-full bg-s4" /></div>

        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black">AI Processing</h2>
            <p className="text-[11px] text-t2">{booking.customer.name} / {booking.treatment}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-s3 flex items-center justify-center text-t3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Steps */}
        <div className="px-5 py-2 space-y-0.5">
          {defs.map((def, idx) => {
            const step = steps[idx]
            const visible = idx <= cur
            return (
              <div key={idx} className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 h-0 overflow-hidden'}`}>
                <div className={`flex items-center gap-3 p-3 rounded-xl ${idx === cur && step.status === 'running' ? 'bg-accent/8' : ''}`}>
                  <div className="flex-shrink-0 w-9 h-9 relative">
                    {step.status === 'done' ? (
                      <div className="w-9 h-9 rounded-full bg-green/12 flex items-center justify-center ani-scale">
                        <svg className="w-4 h-4 text-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      </div>
                    ) : step.status === 'running' ? (
                      <div className="w-9 h-9 rounded-full border-2 border-accent border-t-transparent ani-spin flex items-center justify-center">
                        <span className="text-sm">{def.icon}</span>
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-s3 flex items-center justify-center opacity-30"><span className="text-sm">{def.icon}</span></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-[13px] font-bold ${step.status === 'done' ? 'text-green' : step.status === 'running' ? 'text-accent-2' : 'text-t3'}`}>
                      {step.status === 'done' ? `${def.label}...完了` : `${def.label}...`}
                    </p>
                    {step.status === 'running' && <p className="text-[10px] text-t2 ani-fade">{def.detail}</p>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Messages */}
        {done && msgs && (
          <div className="px-5 pb-6 ani-fade">
            <div className="border-t border-white/[0.04] pt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full grad-card flex items-center justify-center text-[9px] font-bold text-accent-2">AI</div>
                <h3 className="text-xs font-bold">生成メッセージ</h3>
              </div>

              {/* Tabs */}
              <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
                {msgList.map((m, i) => (
                  <button key={i} onClick={() => setTab(i)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                      tab === i ? 'bg-white text-black' : 'bg-s3 text-t2'
                    }`}>
                    {m.emoji} {m.type}
                  </button>
                ))}
              </div>

              {/* Message bubble */}
              <div className="bg-s3 rounded-2xl p-4 ani-fade" key={tab}>
                <div className="bg-s4 rounded-2xl rounded-tl-sm p-4 text-[13px] text-t1 leading-relaxed">{msgList[tab]?.text}</div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2.5 rounded-xl bg-green/10 text-green text-xs font-bold active:scale-[0.97] transition-transform">送信する</button>
                  <button className="flex-1 py-2.5 rounded-xl bg-s4 text-t2 text-xs font-bold">編集する</button>
                </div>
              </div>

              <button onClick={onClose} className="w-full mt-4 bg-white text-black font-bold py-3.5 rounded-xl text-sm active:scale-[0.98] transition-transform shadow-lg shadow-white/10">
                完了
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
