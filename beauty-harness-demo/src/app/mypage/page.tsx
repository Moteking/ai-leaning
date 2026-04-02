'use client'

import { useState } from 'react'
import { userProfile, visitHistory, userCoupons } from '@/lib/mockData'

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<'history' | 'coupon' | 'point'>(
    'history'
  )

  const progressPercent =
    ((1500 - userProfile.pointsToNextReward) / 1500) * 100

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* プロフィールヘッダー */}
      <div className="bg-gradient-to-br from-primary to-accent text-white p-6 pb-12 relative">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-black">
            {userProfile.name[0]}
          </div>
          <div>
            <h1 className="text-lg font-black">{userProfile.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-200 font-bold">
                {userProfile.rank}会員
              </span>
              <span className="text-xs text-blue-200">
                {userProfile.memberSince}〜
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ポイントカード */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] text-gray-400">保有ポイント</p>
              <p className="text-2xl font-black text-accent">
                {userProfile.points.toLocaleString()}
                <span className="text-sm text-gray-400 ml-1">pt</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400">来店回数</p>
              <p className="text-2xl font-black text-primary">
                {userProfile.totalVisits}
                <span className="text-sm text-gray-400 ml-1">回</span>
              </p>
            </div>
          </div>

          {/* 次の特典までのプログレス */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] text-gray-500">
                次の特典：{userProfile.nextReward}
              </p>
              <p className="text-[10px] text-accent font-bold">
                あと{userProfile.pointsToNextReward}pt
              </p>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-blue-400 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* クイックアクション */}
      <div className="grid grid-cols-3 gap-2 px-4 mt-4">
        <a
          href="/booking"
          className="flex flex-col items-center bg-white rounded-xl p-3 border border-gray-100 shadow-sm"
        >
          <span className="text-2xl mb-1">📅</span>
          <span className="text-[10px] font-bold text-gray-600">予約する</span>
        </a>
        <a
          href="/gallery"
          className="flex flex-col items-center bg-white rounded-xl p-3 border border-gray-100 shadow-sm"
        >
          <span className="text-2xl mb-1">💇</span>
          <span className="text-[10px] font-bold text-gray-600">
            スタイル検索
          </span>
        </a>
        <button className="flex flex-col items-center bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
          <span className="text-2xl mb-1">💬</span>
          <span className="text-[10px] font-bold text-gray-600">
            チャット
          </span>
        </button>
      </div>

      {/* タブ */}
      <div className="flex border-b border-gray-200 mt-6 px-4">
        {[
          { key: 'history', label: '来店履歴' },
          { key: 'coupon', label: 'クーポン' },
          { key: 'point', label: 'ポイント' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              setActiveTab(tab.key as 'history' | 'coupon' | 'point')
            }
            className={`flex-1 py-3 text-xs font-bold transition-all ${
              activeTab === tab.key
                ? 'text-accent border-b-2 border-accent'
                : 'text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 来店履歴タブ */}
      {activeTab === 'history' && (
        <div className="p-4 space-y-3 animate-fade-in">
          {visitHistory.map((v, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-primary">
                    {v.treatment}
                  </p>
                  <p className="text-xs text-gray-400">
                    {v.date} / {v.stylist}
                  </p>
                </div>
                <span className="text-sm font-bold text-accent">
                  ¥{v.price.toLocaleString()}
                </span>
              </div>
              {!v.reviewed && (
                <button className="w-full mt-2 py-2 rounded-lg border border-accent text-accent text-xs font-bold hover:bg-blue-50 transition-all">
                  口コミを書く（+50pt）
                </button>
              )}
              {v.reviewed && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-500 text-xs">★★★★★</span>
                  <span className="text-[10px] text-gray-400">
                    レビュー済み
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* クーポンタブ */}
      {activeTab === 'coupon' && (
        <div className="p-4 space-y-3 animate-fade-in">
          {userCoupons.map((c) => (
            <div
              key={c.id}
              className={`rounded-xl overflow-hidden shadow-sm border ${
                c.used ? 'opacity-50' : 'border-gray-100'
              }`}
            >
              <div
                className={`p-4 ${
                  c.used
                    ? 'bg-gray-100'
                    : 'bg-gradient-to-r from-accent to-blue-400'
                }`}
              >
                <p
                  className={`text-base font-black ${
                    c.used ? 'text-gray-400' : 'text-white'
                  }`}
                >
                  {c.title}
                </p>
              </div>
              <div className="bg-white p-3 flex items-center justify-between">
                <p className="text-[10px] text-gray-400">
                  有効期限：{c.expires}
                </p>
                {c.used ? (
                  <span className="text-[10px] text-gray-400 font-bold">
                    使用済み
                  </span>
                ) : (
                  <a
                    href="/booking"
                    className="text-[10px] text-accent font-bold"
                  >
                    使って予約する →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ポイントタブ */}
      {activeTab === 'point' && (
        <div className="p-4 space-y-3 animate-fade-in">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-primary mb-3">
              ポイントの貯め方
            </h3>
            <div className="space-y-2.5">
              {[
                { action: '来店ごと', pt: '100pt', icon: '💇' },
                { action: '口コミ投稿', pt: '50pt', icon: '⭐' },
                { action: 'お友達紹介', pt: '300pt', icon: '👥' },
                { action: 'LINE予約', pt: '50pt', icon: '📱' },
                { action: 'SNSシェア', pt: '30pt', icon: '📸' },
              ].map((item) => (
                <div
                  key={item.action}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs text-gray-600">
                      {item.action}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-accent">
                    +{item.pt}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-primary mb-3">
              ポイント履歴
            </h3>
            <div className="space-y-2">
              {[
                { date: '3/30', action: '来店', pt: '+100', total: '1,200' },
                { date: '3/30', action: '口コミ投稿', pt: '+50', total: '1,100' },
                { date: '2/23', action: '来店', pt: '+100', total: '1,050' },
                { date: '2/23', action: 'LINE予約', pt: '+50', total: '950' },
                { date: '1/18', action: '来店', pt: '+100', total: '900' },
              ].map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-400 w-10">{h.date}</span>
                  <span className="text-gray-600 flex-1">{h.action}</span>
                  <span className="text-green-600 font-bold w-12 text-right">
                    {h.pt}
                  </span>
                  <span className="text-gray-400 w-14 text-right">
                    {h.total}pt
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
