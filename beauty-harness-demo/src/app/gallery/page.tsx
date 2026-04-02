'use client'

import { useState } from 'react'
import { galleryPosts } from '@/lib/mockData'

export default function GalleryPage() {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'reels'>('grid')

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const post = galleryPosts.find((p) => p.id === selectedPost)

  return (
    <div className="pb-32 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 glass">
        <div className="px-5 pt-10 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-black tracking-tight">Style Gallery</h1>
            <div className="flex bg-surface-3 rounded-lg p-0.5">
              <button onClick={() => setViewMode('grid')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${viewMode === 'grid' ? 'bg-accent text-white' : 'text-text-secondary'}`}>
                グリッド
              </button>
              <button onClick={() => setViewMode('reels')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${viewMode === 'reels' ? 'bg-accent text-white' : 'text-text-secondary'}`}>
                リール
              </button>
            </div>
          </div>
          {/* Filter chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {['ALL', 'カラー', 'カット', 'パーマ', 'ネイル', 'ハイライト'].map((tag, i) => (
              <button key={tag} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                i === 0 ? 'bg-accent text-white' : 'bg-surface-3 text-text-secondary hover:text-text-primary'
              }`}>{tag}</button>
            ))}
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-1 p-1">
          {galleryPosts.map((p) => (
            <div key={p.id} onClick={() => setSelectedPost(p.id)} className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group">
              <div className={`w-full h-full bg-gradient-to-br ${p.imageGradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-bold drop-shadow-lg">{p.styleName}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-white/70 text-[10px]">{p.stylist}</p>
                  <div className="flex items-center gap-2 text-white/70 text-[10px]">
                    <span>♥ {p.likes}</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <span className="bg-black/30 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                  ¥{p.price.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Reels view */
        <div className="snap-y snap-mandatory h-[calc(100vh-160px)] overflow-y-auto">
          {galleryPosts.map((p) => (
            <div key={p.id} className="snap-start h-[calc(100vh-160px)] relative">
              <div className={`w-full h-full bg-gradient-to-br ${p.imageGradient} flex items-center justify-center`}>
                <p className="text-7xl font-black text-white/10 rotate-[-12deg]">{p.styleName}</p>
              </div>

              {/* Right side actions (TikTok-style) */}
              <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5">
                <button onClick={() => toggleLike(p.id)} className="flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                    likedPosts.has(p.id) ? 'bg-danger text-white scale-110' : 'bg-white/10 backdrop-blur text-white'
                  }`}>
                    <span className="text-lg">♥</span>
                  </div>
                  <span className="text-white text-[10px] font-bold mt-1 drop-shadow">{p.likes + (likedPosts.has(p.id) ? 1 : 0)}</span>
                </button>
                <button className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white"><span className="text-lg">💬</span></div>
                  <span className="text-white text-[10px] font-bold mt-1 drop-shadow">{p.comments}</span>
                </button>
                <button className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white"><span className="text-lg">↗</span></div>
                  <span className="text-white text-[10px] font-bold mt-1 drop-shadow">共有</span>
                </button>
                <a href="/booking" className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-accent glow-accent flex items-center justify-center text-white"><span className="text-lg">📅</span></div>
                  <span className="text-white text-[10px] font-bold mt-1 drop-shadow">予約</span>
                </a>
              </div>

              {/* Bottom info */}
              <div className="absolute left-0 right-16 bottom-6 px-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-xs font-bold text-white">{p.stylist[0]}</div>
                  <span className="text-white font-bold text-sm drop-shadow">{p.stylist}</span>
                </div>
                <p className="text-white text-sm leading-relaxed drop-shadow mb-2">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((tag) => <span key={tag} className="text-white/60 text-[10px] drop-shadow">{tag}</span>)}
                </div>
                <div className="mt-2 inline-flex bg-white/10 backdrop-blur rounded-full px-3 py-1">
                  <span className="text-white text-xs font-bold">¥{p.price.toLocaleString()}</span>
                  <span className="text-white/50 text-[10px] ml-1.5">/ {p.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {post && (
        <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in-fast">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedPost(null)} />
          <div className="relative w-full max-w-lg bg-surface rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className={`h-52 bg-gradient-to-br ${post.imageGradient} relative rounded-t-3xl`}>
              <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/30 backdrop-blur rounded-full flex items-center justify-center text-white">×</button>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
                <h2 className="text-white text-xl font-black">{post.styleName}</h2>
                <p className="text-white/70 text-sm">by {post.stylist}</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-text-primary leading-relaxed">{post.description}</p>
              <div className="grid grid-cols-3 gap-2">
                {[{ l: '施術', v: post.treatment }, { l: '料金', v: `¥${post.price.toLocaleString()}` }, { l: '時間', v: post.duration }].map((x) => (
                  <div key={x.l} className="bg-surface-3 rounded-xl p-2.5 text-center">
                    <p className="text-[9px] text-text-tertiary">{x.l}</p>
                    <p className="text-xs font-bold mt-0.5">{x.v}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => <span key={tag} className="text-[10px] text-accent-light bg-accent/10 px-2 py-0.5 rounded-full">{tag}</span>)}
              </div>
              <a href="/booking" className="block w-full bg-accent text-white text-center font-bold py-3.5 rounded-xl text-sm glow-accent">このスタイルで予約する</a>
              <div className="flex gap-2">
                <button onClick={() => toggleLike(post.id)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${likedPosts.has(post.id) ? 'bg-danger/15 text-danger' : 'bg-surface-3 text-text-secondary'}`}>
                  ♥ {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                </button>
                <button className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-surface-3 text-text-secondary">↗ シェア</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
