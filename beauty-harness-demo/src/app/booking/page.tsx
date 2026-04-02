'use client'

import { useState } from 'react'
import { stylists, availableSlots, galleryPosts } from '@/lib/mockData'

const menus = [
  { id: 'm1', name: 'カット', price: 6500, duration: '60分', icon: '✂️' },
  { id: 'm2', name: 'カラー', price: 9800, duration: '90分', icon: '🎨' },
  { id: 'm3', name: 'カラー＋トリートメント', price: 14000, duration: '120分', icon: '✨' },
  { id: 'm4', name: 'ハイライト＋カット', price: 15000, duration: '150分', icon: '💫' },
  { id: 'm5', name: 'パーマ', price: 12000, duration: '120分', icon: '🌀' },
  { id: 'm6', name: 'ネイル（ジェル）', price: 8800, duration: '90分', icon: '💅' },
  { id: 'm7', name: 'トリートメント', price: 6500, duration: '60分', icon: '🧴' },
]

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null)
  const [selectedStylist, setSelectedStylist] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [booked, setBooked] = useState(false)

  const menu = menus.find((m) => m.id === selectedMenu)
  const stylist = stylists.find((s) => s.id === selectedStylist)

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i)
    return { value: d.toISOString().slice(0, 10), day: d.toLocaleDateString('ja-JP', { weekday: 'short' }), date: d.getDate(), month: d.getMonth() + 1 }
  })

  if (booked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center ani-scale w-full">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green/15 flex items-center justify-center glow-green">
            <svg className="w-10 h-10 text-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-black mb-1">予約完了！</h2>
          <p className="text-sm text-t2">{selectedDate} {selectedTime}</p>
          <p className="text-sm text-t2">{menu?.name} / {selectedStylist === 'any' ? '指名なし' : stylist?.name}</p>
          <p className="text-2xl font-black grad-text mt-2 mb-4">¥{menu?.price.toLocaleString()}</p>
          <div className="bg-s2 border border-white/[0.04] rounded-xl p-3 border border-green/15 text-left mb-6">
            <p className="text-xs font-bold text-green">LINE予約特典適用！</p>
            <p className="text-[10px] text-t2 mt-0.5">次回使える500円OFFクーポンをLINEに送信しました</p>
          </div>
          <a href="/mypage" className="block bg-accent text-white font-bold py-3 rounded-xl text-sm glow">マイページへ</a>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-32 min-h-screen">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-black tracking-tight">予約する</h1>
        <p className="text-xs text-t3 mt-1">LINE予約で500円OFF</p>
      </div>

      {/* Steps indicator */}
      <div className="px-8 mb-4">
        <div className="flex items-center">
          {['メニュー', 'スタイリスト', '日時', '確認'].map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  i + 1 <= step ? 'bg-accent text-white' : 'bg-s3 text-t3'
                }`}>{i + 1 < step ? '✓' : i + 1}</div>
                <span className={`text-[8px] mt-0.5 ${i + 1 <= step ? 'text-accent-2' : 'text-t3'}`}>{label}</span>
              </div>
              {i < 3 && <div className={`flex-1 h-px mx-1 ${i + 1 < step ? 'bg-accent' : 'bg-s3'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4">
        {/* Step 1: Menu */}
        {step === 1 && (
          <div className="space-y-2 ani-fade">
            {/* Popular styles */}
            <p className="text-[10px] text-t3 mb-1">人気スタイルから</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {galleryPosts.slice(0, 4).map((p) => (
                <button key={p.id} onClick={() => { const m = menus.find((x) => x.name === p.treatment); if (m) { setSelectedMenu(m.id); setStep(2) } }}
                  className="flex-shrink-0 w-24 rounded-xl overflow-hidden bg-s2 border border-white/[0.04]">
                  <div className={`h-16 bg-gradient-to-br ${p.imageGradient}`} />
                  <div className="p-2">
                    <p className="text-[9px] font-bold truncate">{p.styleName}</p>
                    <p className="text-[9px] text-t3">¥{p.price.toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-t3 mt-2 mb-1">メニュー一覧</p>
            {menus.map((m) => (
              <button key={m.id} onClick={() => { setSelectedMenu(m.id); setStep(2) }}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-s2 border border-white/[0.04] hover:bg-white/5 transition-all">
                <span className="text-xl">{m.icon}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold">{m.name}</p>
                  <p className="text-[10px] text-t3">{m.duration}</p>
                </div>
                <span className="text-sm font-bold text-accent-2">¥{m.price.toLocaleString()}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Stylist */}
        {step === 2 && (
          <div className="space-y-2 ani-fade">
            <button onClick={() => { setSelectedStylist('any'); setStep(3) }}
              className="w-full p-4 rounded-xl bg-s2 border border-white/[0.04] hover:bg-white/5 transition-all text-left">
              <p className="text-sm font-bold">指名なし</p>
              <p className="text-[10px] text-t3">空いているスタイリストが対応</p>
            </button>
            {stylists.map((s) => (
              <button key={s.id} onClick={() => { setSelectedStylist(s.id); setStep(3) }}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-s2 border border-white/[0.04] hover:bg-white/5 transition-all">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-pink flex items-center justify-center text-white font-bold">{s.name[0]}</div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{s.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-accent/15 text-accent-2 rounded-full">{s.title}</span>
                  </div>
                  <p className="text-[10px] text-t3">{s.speciality}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-yellow-400 text-[10px]">★</span>
                    <span className="text-[10px] font-bold">{s.rating}</span>
                    <span className="text-[10px] text-t3">({s.reviewCount})</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div className="ani-fade">
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
              {dates.map((d) => (
                <button key={d.value} onClick={() => setSelectedDate(d.value)}
                  className={`flex-shrink-0 w-14 py-2.5 rounded-xl text-center transition-all ${
                    selectedDate === d.value ? 'bg-accent text-white glow' : 'bg-s2 border border-white/[0.04] text-t2'
                  }`}>
                  <p className="text-[9px]">{d.month}月</p>
                  <p className="text-lg font-black">{d.date}</p>
                  <p className="text-[9px]">{d.day}</p>
                </button>
              ))}
            </div>
            {selectedDate && (
              <div className="ani-fade">
                <p className="text-[10px] text-t3 mb-2">時間を選択</p>
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button key={slot.time} disabled={!slot.available}
                      onClick={() => { setSelectedTime(slot.time); setStep(4) }}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                        selectedTime === slot.time ? 'bg-accent text-white glow' :
                        slot.available ? 'bg-s2 border border-white/[0.04] text-t2 hover:text-t1' :
                        'bg-s2 text-t3/30 cursor-not-allowed'
                      }`}>
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="space-y-4 ani-fade">
            <div className="bg-s2 border border-white/[0.04] rounded-2xl p-4 space-y-3">
              {[
                { l: 'メニュー', v: menu?.name },
                { l: 'スタイリスト', v: selectedStylist === 'any' ? '指名なし' : stylist?.name },
                { l: '日時', v: `${selectedDate} ${selectedTime}` },
                { l: '所要時間', v: menu?.duration },
              ].map((row) => (
                <div key={row.l} className="flex justify-between items-center">
                  <span className="text-xs text-t3">{row.l}</span>
                  <span className="text-sm font-bold">{row.v}</span>
                </div>
              ))}
              <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                <span className="text-xs text-t3">料金</span>
                <span className="text-xl font-black grad-text">¥{menu?.price.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-s2 border border-white/[0.04] rounded-xl p-3 border border-green/15">
              <p className="text-xs font-bold text-green">LINE予約特典</p>
              <p className="text-[10px] text-t2 mt-0.5">次回使える500円OFFクーポンプレゼント！</p>
            </div>
            <button onClick={() => setBooked(true)} className="w-full bg-accent text-white font-bold py-4 rounded-xl text-sm glow active:scale-[0.98] transition-transform">予約を確定する</button>
          </div>
        )}
      </div>

      {/* Back button */}
      {step > 1 && (
        <div className="fixed bottom-28 left-0 right-0 px-4 max-w-lg mx-auto">
          <button onClick={() => setStep(step - 1)} className="w-full py-3 rounded-xl text-xs font-bold glass text-t2">戻る</button>
        </div>
      )}
    </div>
  )
}
