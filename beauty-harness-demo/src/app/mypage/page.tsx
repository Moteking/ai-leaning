'use client'

import { useState } from 'react'
import { userProfile, visitHistory, userCoupons } from '@/lib/mockData'

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<'history' | 'coupon' | 'point'>('history')
  const progress = ((1500 - userProfile.pointsToNextReward) / 1500) * 100

  return (
    <div className="pb-32 min-h-screen">
      {/* Profile header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink/20 via-transparent to-accent/10" />
        <div className="absolute top-0 left-0 w-40 h-40 bg-pink/10 rounded-full blur-3xl" />
        <div className="relative px-5 pt-12 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink to-accent flex items-center justify-center text-2xl font-black text-white shadow-lg">
              {userProfile.name[0]}
            </div>
            <div>
              <h1 className="text-xl font-black">{userProfile.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange/15 text-orange font-bold">{userProfile.rank}会員</span>
                <span className="text-[10px] text-t3">{userProfile.memberSince}〜</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Points card */}
        <div className="bg-s2 border border-white/[0.04] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] text-t3">保有ポイント</p>
              <p className="text-2xl font-black grad-text">{userProfile.points.toLocaleString()}<span className="text-xs text-t2 ml-1">pt</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-t3">来店回数</p>
              <p className="text-2xl font-black">{userProfile.totalVisits}<span className="text-xs text-t2 ml-1">回</span></p>
            </div>
          </div>
          <div className="bg-s3 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] text-t2">次の特典：{userProfile.nextReward}</p>
              <p className="text-[10px] text-accent-2 font-bold">あと{userProfile.pointsToNextReward}pt</p>
            </div>
            <div className="h-2 bg-s2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent to-pink rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { href: '/booking', icon: '📅', label: '予約する' },
            { href: '/gallery', icon: '💇', label: 'スタイル', },
            { href: '#', icon: '💬', label: 'チャット' },
          ].map((a) => (
            <a key={a.label} href={a.href} className="bg-s2 border border-white/[0.04] rounded-xl p-3 text-center hover:bg-white/5 transition-all">
              <span className="text-xl block mb-1">{a.icon}</span>
              <span className="text-[10px] font-bold text-t2">{a.label}</span>
            </a>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {([['history', '来店履歴'], ['coupon', 'クーポン'], ['point', 'ポイント']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex-1 py-3 text-xs font-bold transition-all ${activeTab === key ? 'text-accent-2 border-b-2 border-accent' : 'text-t3'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* History tab */}
        {activeTab === 'history' && (
          <div className="space-y-2 stagger">
            {visitHistory.map((v, i) => (
              <div key={i} className="bg-s2 border border-white/[0.04] rounded-xl p-4 ani-fade">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold">{v.treatment}</p>
                    <p className="text-[10px] text-t3">{v.date} / {v.stylist}</p>
                  </div>
                  <span className="text-sm font-bold text-accent-2">¥{v.price.toLocaleString()}</span>
                </div>
                {!v.reviewed ? (
                  <button className="w-full mt-1 py-2 rounded-lg border border-accent/30 text-accent-2 text-[10px] font-bold hover:bg-accent/10 transition-all">
                    口コミを書く（+50pt）
                  </button>
                ) : (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-[10px]">★★★★★</span>
                    <span className="text-[9px] text-t3">レビュー済み</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Coupon tab */}
        {activeTab === 'coupon' && (
          <div className="space-y-2 stagger">
            {userCoupons.map((c) => (
              <div key={c.id} className={`rounded-xl overflow-hidden ani-fade ${c.used ? 'opacity-40' : ''}`}>
                <div className={`p-4 ${c.used ? 'bg-s3' : 'bg-gradient-to-r from-accent to-pink'}`}>
                  <p className={`text-sm font-black ${c.used ? 'text-t3' : 'text-white'}`}>{c.title}</p>
                </div>
                <div className="bg-s2 border border-white/[0.04] p-3 flex items-center justify-between">
                  <p className="text-[10px] text-t3">〜{c.expires}</p>
                  {c.used ? <span className="text-[10px] text-t3">使用済み</span> : <a href="/booking" className="text-[10px] text-accent-2 font-bold">使って予約 →</a>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Point tab */}
        {activeTab === 'point' && (
          <div className="space-y-3 ani-fade">
            <div className="bg-s2 border border-white/[0.04] rounded-xl p-4">
              <h3 className="text-xs font-bold mb-3">ポイントの貯め方</h3>
              <div className="space-y-2.5">
                {[
                  { action: '来店ごと', pt: '+100pt', icon: '💇' },
                  { action: '口コミ投稿', pt: '+50pt', icon: '⭐' },
                  { action: 'お友達紹介', pt: '+300pt', icon: '👥' },
                  { action: 'LINE予約', pt: '+50pt', icon: '📱' },
                  { action: 'SNSシェア', pt: '+30pt', icon: '📸' },
                ].map((item) => (
                  <div key={item.action} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span className="text-xs text-t2">{item.action}</span>
                    </div>
                    <span className="text-xs font-bold text-green">{item.pt}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-s2 border border-white/[0.04] rounded-xl p-4">
              <h3 className="text-xs font-bold mb-3">ポイント履歴</h3>
              <div className="space-y-2">
                {[
                  { date: '3/30', action: '来店', pt: '+100', total: '1,200' },
                  { date: '3/30', action: '口コミ', pt: '+50', total: '1,100' },
                  { date: '2/23', action: '来店', pt: '+100', total: '1,050' },
                  { date: '2/23', action: 'LINE予約', pt: '+50', total: '950' },
                  { date: '1/18', action: '来店', pt: '+100', total: '900' },
                ].map((h, i) => (
                  <div key={i} className="flex items-center text-[10px]">
                    <span className="text-t3 w-10">{h.date}</span>
                    <span className="text-t2 flex-1">{h.action}</span>
                    <span className="text-green font-bold w-12 text-right">{h.pt}</span>
                    <span className="text-t3 w-14 text-right">{h.total}pt</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
