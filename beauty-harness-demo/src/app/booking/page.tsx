'use client'

import { useState } from 'react'
import { stylists, availableSlots, galleryPosts } from '@/lib/mockData'

const menus = [
  { id: 'm1', name: 'カット', price: 6500, duration: '60分' },
  { id: 'm2', name: 'カラー', price: 9800, duration: '90分' },
  { id: 'm3', name: 'カラー＋トリートメント', price: 14000, duration: '120分' },
  { id: 'm4', name: 'ハイライト＋カット', price: 15000, duration: '150分' },
  { id: 'm5', name: 'パーマ', price: 12000, duration: '120分' },
  { id: 'm6', name: 'ネイル（ジェル）', price: 8800, duration: '90分' },
  { id: 'm7', name: 'トリートメント', price: 6500, duration: '60分' },
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

  // 今日から7日間の日付を生成
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      value: d.toISOString().slice(0, 10),
      day: d.toLocaleDateString('ja-JP', { weekday: 'short' }),
      date: d.getDate(),
      month: d.getMonth() + 1,
    }
  })

  const handleBook = () => {
    setBooked(true)
  }

  if (booked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center animate-scale-in">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-primary mb-2">予約完了！</h2>
          <p className="text-sm text-gray-500 mb-1">
            {selectedDate} {selectedTime}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            {menu?.name} / {stylist?.name}
          </p>
          <p className="text-lg font-bold text-accent mb-6">
            ¥{menu?.price.toLocaleString()}
          </p>
          <div className="bg-green-50 rounded-xl p-3 border border-green-200 mb-4 text-left">
            <p className="text-xs font-bold text-green-700 mb-1">
              LINE予約特典適用！
            </p>
            <p className="text-xs text-green-600">
              次回使える500円OFFクーポンをLINEに送信しました
            </p>
          </div>
          <p className="text-xs text-gray-400 mb-6">
            確認メッセージをLINEに送信しました
          </p>
          <a
            href="/mypage"
            className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-xl text-sm"
          >
            マイページへ
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ヘッダー */}
      <div className="bg-primary text-white p-4">
        <h1 className="text-lg font-black">予約する</h1>
        <p className="text-xs text-blue-200">LINE予約で500円OFF</p>
      </div>

      {/* ステップインジケーター */}
      <div className="flex items-center justify-center gap-1 p-4">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s <= step
                  ? 'bg-accent text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
            {s < 4 && (
              <div
                className={`w-8 h-0.5 ${
                  s < step ? 'bg-accent' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ステップ1: メニュー選択 */}
      {step === 1 && (
        <div className="p-4 space-y-2 animate-fade-in">
          <h2 className="text-sm font-bold text-primary mb-3">
            メニューを選択
          </h2>

          {/* おすすめスタイルから予約 */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">人気スタイルから選ぶ</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {galleryPosts.slice(0, 4).map((post) => (
                <button
                  key={post.id}
                  onClick={() => {
                    const matchMenu = menus.find((m) => m.name === post.treatment)
                    if (matchMenu) {
                      setSelectedMenu(matchMenu.id)
                      setStep(2)
                    }
                  }}
                  className="flex-shrink-0 w-28 rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                >
                  <div
                    className={`h-20 bg-gradient-to-br ${post.imageGradient}`}
                  />
                  <div className="p-2">
                    <p className="text-[10px] font-bold text-primary truncate">
                      {post.styleName}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      ¥{post.price.toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-2">メニュー一覧</p>
          {menus.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMenu(m.id)
                setStep(2)
              }}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                selectedMenu === m.id
                  ? 'border-accent bg-blue-50'
                  : 'border-gray-100 bg-white'
              }`}
            >
              <div className="text-left">
                <p className="text-sm font-bold text-primary">{m.name}</p>
                <p className="text-xs text-gray-400">{m.duration}</p>
              </div>
              <span className="text-sm font-bold text-accent">
                ¥{m.price.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ステップ2: スタイリスト選択 */}
      {step === 2 && (
        <div className="p-4 space-y-3 animate-fade-in">
          <h2 className="text-sm font-bold text-primary mb-3">
            スタイリストを選択
          </h2>
          <button
            onClick={() => {
              setSelectedStylist('any')
              setStep(3)
            }}
            className={`w-full p-4 rounded-xl border transition-all text-left ${
              selectedStylist === 'any'
                ? 'border-accent bg-blue-50'
                : 'border-gray-100 bg-white'
            }`}
          >
            <p className="text-sm font-bold text-primary">指名なし</p>
            <p className="text-xs text-gray-400">空いているスタイリストが対応</p>
          </button>
          {stylists.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedStylist(s.id)
                setStep(3)
              }}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                selectedStylist === s.id
                  ? 'border-accent bg-blue-50'
                  : 'border-gray-100 bg-white'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-lg">
                {s.name[0]}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-primary">{s.name}</p>
                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-accent rounded-full">
                    {s.title}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{s.speciality}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-yellow-500 text-xs">★</span>
                  <span className="text-xs font-bold text-gray-600">
                    {s.rating}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    ({s.reviewCount}件)
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ステップ3: 日時選択 */}
      {step === 3 && (
        <div className="p-4 animate-fade-in">
          <h2 className="text-sm font-bold text-primary mb-3">
            日時を選択
          </h2>

          {/* 日付選択 */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
            {dates.map((d) => (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
                className={`flex-shrink-0 w-14 py-2 rounded-xl text-center transition-all ${
                  selectedDate === d.value
                    ? 'bg-accent text-white'
                    : 'bg-white border border-gray-100 text-gray-600'
                }`}
              >
                <p className="text-[10px]">{d.month}月</p>
                <p className="text-lg font-black">{d.date}</p>
                <p className="text-[10px]">{d.day}</p>
              </button>
            ))}
          </div>

          {/* 時間選択 */}
          {selectedDate && (
            <div className="animate-fade-in">
              <p className="text-xs text-gray-400 mb-2">時間を選択</p>
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => {
                      setSelectedTime(slot.time)
                      setStep(4)
                    }}
                    className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
                      selectedTime === slot.time
                        ? 'bg-accent text-white'
                        : slot.available
                        ? 'bg-white border border-gray-100 text-gray-600 hover:border-accent'
                        : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                    {!slot.available && (
                      <span className="block text-[8px] text-gray-300">×</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ステップ4: 確認 */}
      {step === 4 && (
        <div className="p-4 space-y-4 animate-fade-in">
          <h2 className="text-sm font-bold text-primary mb-3">
            予約内容の確認
          </h2>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">メニュー</span>
              <span className="text-sm font-bold text-primary">
                {menu?.name}
              </span>
            </div>
            <div className="border-t border-gray-50" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">スタイリスト</span>
              <span className="text-sm font-bold text-primary">
                {selectedStylist === 'any' ? '指名なし' : stylist?.name}
              </span>
            </div>
            <div className="border-t border-gray-50" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">日時</span>
              <span className="text-sm font-bold text-primary">
                {selectedDate} {selectedTime}
              </span>
            </div>
            <div className="border-t border-gray-50" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">所要時間</span>
              <span className="text-sm font-bold text-primary">
                {menu?.duration}
              </span>
            </div>
            <div className="border-t border-gray-50" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">料金</span>
              <div className="text-right">
                <span className="text-lg font-black text-accent">
                  ¥{menu?.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* LINE予約特典 */}
          <div className="bg-green-50 rounded-xl p-3 border border-green-200">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎉</span>
              <div>
                <p className="text-xs font-bold text-green-700">
                  LINE予約特典
                </p>
                <p className="text-[10px] text-green-600">
                  次回使える500円OFFクーポンをプレゼント！
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleBook}
            className="w-full bg-accent text-white font-bold py-4 rounded-xl text-base shadow-lg shadow-blue-200"
          >
            予約を確定する
          </button>
        </div>
      )}

      {/* 戻るボタン */}
      {step > 1 && !booked && (
        <div className="fixed bottom-20 left-0 right-0 p-4 max-w-lg mx-auto">
          <button
            onClick={() => setStep(step - 1)}
            className="w-full py-3 rounded-xl text-sm font-bold text-gray-500 bg-white border border-gray-200"
          >
            戻る
          </button>
        </div>
      )}
    </div>
  )
}
