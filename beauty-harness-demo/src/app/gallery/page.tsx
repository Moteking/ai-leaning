'use client'

import { useState, useRef, useCallback } from 'react'
import { galleryPosts, stylists } from '@/lib/mockData'

export default function GalleryPage() {
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<string | null>(null)
  const [view, setView] = useState<'explore' | 'reels'>('explore')
  const [heartAnim, setHeartAnim] = useState<string | null>(null)
  const lastTap = useRef<{ id: string; time: number } | null>(null)

  const toggleLike = useCallback((id: string) => {
    setLiked(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
  }, [])

  const toggleSave = useCallback((id: string) => {
    setSaved(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
  }, [])

  // Double tap to like (Instagram-style)
  const handleDoubleTap = useCallback((id: string) => {
    const now = Date.now()
    if (lastTap.current && lastTap.current.id === id && now - lastTap.current.time < 300) {
      if (!liked.has(id)) toggleLike(id)
      setHeartAnim(id)
      setTimeout(() => setHeartAnim(null), 600)
      lastTap.current = null
    } else {
      lastTap.current = { id, time: now }
    }
  }, [liked, toggleLike])

  const post = galleryPosts.find(p => p.id === selected)

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-heavy safe-bottom">
        <div className="px-4 pt-10 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-black tracking-tight">Discover</h1>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex bg-s3 rounded-full p-0.5">
                <button onClick={() => setView('explore')} className={`p-1.5 rounded-full transition-all ${view === 'explore' ? 'bg-white text-black' : 'text-t2'}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/></svg>
                </button>
                <button onClick={() => setView('reels')} className={`p-1.5 rounded-full transition-all ${view === 'reels' ? 'bg-white text-black' : 'text-t2'}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm3 2.5l6 3.5-6 3.5V8.5z"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Stories bar (Instagram-style) */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {stylists.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center flex-shrink-0">
                <div className={i === 0 ? 'story-ring' : 'story-ring-seen'}>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-pink flex items-center justify-center text-white font-bold text-lg border-2 border-black">
                    {s.name[0]}
                  </div>
                </div>
                <span className="text-[10px] text-t2 mt-1">{s.name}</span>
              </div>
            ))}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-t3 flex items-center justify-center bg-s2">
                <svg className="w-5 h-5 text-t3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <span className="text-[10px] text-t3 mt-1">追加</span>
            </div>
          </div>
        </div>
      </div>

      {view === 'explore' ? (
        /* ===== Instagram Explore Grid ===== */
        <div className="px-0.5 pt-0.5">
          {/* Mosaic layout: alternating large+small pattern */}
          <div className="grid grid-cols-3 gap-0.5">
            {galleryPosts.map((p, i) => {
              const isLarge = i % 5 === 0
              return (
                <div
                  key={p.id}
                  className={`relative overflow-hidden cursor-pointer ${isLarge ? 'col-span-2 row-span-2' : ''}`}
                  onClick={() => handleDoubleTap(p.id)}
                  onContextMenu={(e) => { e.preventDefault(); setSelected(p.id) }}
                >
                  <div className={`w-full ${isLarge ? 'aspect-square' : 'aspect-square'} bg-gradient-to-br ${p.imageGradient} relative`}>
                    {/* Overlay on large */}
                    {isLarge && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white text-base font-black drop-shadow-lg">{p.styleName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[8px] font-bold text-white">{p.stylist[0]}</div>
                            <span className="text-white/80 text-xs">{p.stylist}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reels icon for small cards */}
                    {!isLarge && (
                      <div className="absolute top-1.5 right-1.5">
                        <svg className="w-3.5 h-3.5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5.14v14l11-7-11-7z"/>
                        </svg>
                      </div>
                    )}

                    {/* Double tap heart animation */}
                    {heartAnim === p.id && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-5xl ani-heart drop-shadow-lg">♥</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* ===== TikTok Reels ===== */
        <div className="snap-y snap-mandatory h-[calc(100vh-80px)] overflow-y-auto">
          {galleryPosts.map((p) => (
            <div key={p.id} className="snap-start h-[calc(100vh-80px)] relative" onClick={() => handleDoubleTap(p.id)}>
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${p.imageGradient}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
              </div>

              {/* Center content placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-8xl font-black text-white/5 rotate-[-8deg] select-none">{p.styleName.slice(0, 4)}</p>
              </div>

              {/* Double tap heart */}
              {heartAnim === p.id && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                  <span className="text-7xl ani-heart drop-shadow-lg">♥</span>
                </div>
              )}

              {/* Right actions (TikTok-style) */}
              <div className="absolute right-3 bottom-36 flex flex-col items-center gap-5 z-20">
                {/* Like */}
                <button onClick={(e) => { e.stopPropagation(); toggleLike(p.id) }} className="flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                    liked.has(p.id) ? 'text-pink scale-110' : 'bg-black/20 backdrop-blur-sm text-white'
                  }`}>
                    <svg className="w-7 h-7" fill={liked.has(p.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                    </svg>
                  </div>
                  <span className="text-white text-[11px] font-bold mt-1 drop-shadow">{p.likes + (liked.has(p.id) ? 1 : 0)}</span>
                </button>

                {/* Comment */}
                <button className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"/>
                    </svg>
                  </div>
                  <span className="text-white text-[11px] font-bold mt-1 drop-shadow">{p.comments}</span>
                </button>

                {/* Save */}
                <button onClick={(e) => { e.stopPropagation(); toggleSave(p.id) }} className="flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                    saved.has(p.id) ? 'text-orange' : 'bg-black/20 backdrop-blur-sm text-white'
                  }`}>
                    <svg className="w-6 h-6" fill={saved.has(p.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/>
                    </svg>
                  </div>
                  <span className="text-white text-[11px] font-bold mt-1 drop-shadow">保存</span>
                </button>

                {/* Share */}
                <button className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                    </svg>
                  </div>
                  <span className="text-white text-[11px] font-bold mt-1 drop-shadow">共有</span>
                </button>

                {/* Stylist avatar */}
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-pink flex items-center justify-center text-white text-sm font-bold border-2 border-white">
                    {p.stylist[0]}
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-pink flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" d="M12 4v16m8-8H4"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom info */}
              <div className="absolute left-0 right-16 bottom-8 px-4 z-20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-bold text-sm drop-shadow-lg">{p.stylist}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold backdrop-blur-sm">フォロー</span>
                </div>
                <p className="text-white text-[13px] leading-relaxed drop-shadow-lg mb-2">{p.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.tags.slice(0, 4).map(tag => <span key={tag} className="text-white/70 text-[11px] drop-shadow">{tag}</span>)}
                </div>

                {/* Book CTA */}
                <a href="/booking" className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-4 py-2.5 rounded-full shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
                  </svg>
                  このスタイルで予約 ¥{p.price.toLocaleString()}
                </a>
              </div>

              {/* Music ticker (TikTok-style) */}
              <div className="absolute bottom-2 left-4 right-16 z-10">
                <div className="flex items-center gap-2 text-white/50 text-[10px]">
                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                  <div className="overflow-hidden">
                    <p className="whitespace-nowrap" style={{animation:'marquee 8s linear infinite'}}>{p.treatment} • {p.duration} • {p.stylist}のおすすめスタイル</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Bottom Sheet */}
      {post && (
        <div className="fixed inset-0 z-50 flex items-end justify-center ani-fade-fast">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg bg-s2 rounded-t-3xl max-h-[85vh] overflow-y-auto ani-slide-up">
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full bg-s4" />
            </div>

            {/* Image */}
            <div className={`mx-4 h-56 rounded-2xl bg-gradient-to-br ${post.imageGradient} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white text-xl font-black drop-shadow-lg">{post.styleName}</p>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Stylist row */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-pink flex items-center justify-center text-white font-bold">{post.stylist[0]}</div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{post.stylist}</p>
                  <p className="text-[10px] text-t2">{stylists.find(s => s.name === post.stylist)?.speciality}</p>
                </div>
                <button className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-bold">フォロー</button>
              </div>

              <p className="text-sm text-t1 leading-relaxed">{post.description}</p>

              {/* Info grid */}
              <div className="grid grid-cols-3 gap-2">
                {[{l:'施術',v:post.treatment},{l:'料金',v:`¥${post.price.toLocaleString()}`},{l:'時間',v:post.duration}].map(x=>(
                  <div key={x.l} className="bg-s3 rounded-xl p-3 text-center">
                    <p className="text-[9px] text-t3">{x.l}</p>
                    <p className="text-xs font-bold mt-0.5">{x.v}</p>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map(t => <span key={t} className="text-[10px] text-accent-2 bg-accent/10 px-2 py-0.5 rounded-full">{t}</span>)}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => toggleLike(post.id)} className={`flex items-center justify-center gap-1.5 flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                  liked.has(post.id) ? 'bg-pink/15 text-pink' : 'bg-s3 text-t2'
                }`}>
                  <svg className="w-4 h-4" fill={liked.has(post.id)?'currentColor':'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                  </svg>
                  {post.likes + (liked.has(post.id) ? 1 : 0)}
                </button>
                <button onClick={() => toggleSave(post.id)} className={`flex items-center justify-center gap-1.5 flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                  saved.has(post.id) ? 'bg-orange/15 text-orange' : 'bg-s3 text-t2'
                }`}>
                  <svg className="w-4 h-4" fill={saved.has(post.id)?'currentColor':'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/>
                  </svg>
                  保存
                </button>
                <button className="flex items-center justify-center gap-1.5 flex-1 py-3 rounded-xl text-xs font-bold bg-s3 text-t2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                  </svg>
                  共有
                </button>
              </div>

              {/* Book CTA */}
              <a href="/booking" className="block w-full bg-white text-black text-center font-bold py-4 rounded-2xl text-sm shadow-lg active:scale-[0.98] transition-transform">
                このスタイルで予約する
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
