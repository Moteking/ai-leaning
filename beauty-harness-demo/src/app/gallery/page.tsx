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
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const post = galleryPosts.find((p) => p.id === selectedPost)

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-40 border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-black text-primary">Style Gallery</h1>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-400'
              }`}
            >
              グリッド
            </button>
            <button
              onClick={() => setViewMode('reels')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                viewMode === 'reels'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-400'
              }`}
            >
              リール
            </button>
          </div>
        </div>

        {/* ストーリー風スタイリストアイコン */}
        <div className="flex gap-3 px-4 pb-3 overflow-x-auto">
          {['ALL', 'カラー', 'カット', 'パーマ', 'ネイル', 'トリートメント'].map(
            (tag) => (
              <button
                key={tag}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-200 text-gray-600 hover:bg-accent hover:text-white hover:border-accent transition-all"
              >
                {tag}
              </button>
            )
          )}
        </div>
      </div>

      {viewMode === 'grid' ? (
        /* Instagram風グリッド */
        <div className="grid grid-cols-2 gap-0.5 p-0.5">
          {galleryPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post.id)}
              className="relative aspect-square cursor-pointer group"
            >
              <div
                className={`w-full h-full bg-gradient-to-br ${post.imageGradient} flex items-end`}
              >
                {/* スタイル名オーバーレイ */}
                <div className="w-full p-3 bg-gradient-to-t from-black/50 to-transparent">
                  <p className="text-white text-sm font-bold drop-shadow-lg">
                    {post.styleName}
                  </p>
                  <p className="text-white/80 text-[10px]">by {post.stylist}</p>
                </div>
              </div>
              {/* ホバーオーバーレイ */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-4 text-white text-sm font-bold">
                  <span>♥ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TikTok/Reels風縦スクロール */
        <div className="snap-y snap-mandatory h-[calc(100vh-140px)] overflow-y-auto">
          {galleryPosts.map((p) => (
            <div
              key={p.id}
              className="snap-start h-[calc(100vh-140px)] relative"
            >
              <div
                className={`w-full h-full bg-gradient-to-br ${p.imageGradient} flex items-center justify-center`}
              >
                <p className="text-6xl font-black text-white/30 rotate-[-15deg]">
                  {p.styleName}
                </p>
              </div>

              {/* 右サイドアクション（TikTok風） */}
              <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5">
                <button
                  onClick={() => toggleLike(p.id)}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      likedPosts.has(p.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/20 backdrop-blur text-white'
                    } transition-all`}
                  >
                    <span className="text-lg">♥</span>
                  </div>
                  <span className="text-white text-[10px] font-bold mt-0.5 drop-shadow">
                    {p.likes + (likedPosts.has(p.id) ? 1 : 0)}
                  </span>
                </button>

                <button className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                    <span className="text-lg">💬</span>
                  </div>
                  <span className="text-white text-[10px] font-bold mt-0.5 drop-shadow">
                    {p.comments}
                  </span>
                </button>

                <button className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                    <span className="text-lg">↗</span>
                  </div>
                  <span className="text-white text-[10px] font-bold mt-0.5 drop-shadow">
                    共有
                  </span>
                </button>

                <button
                  onClick={() => setSelectedPost(p.id)}
                  className="flex flex-col items-center"
                >
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white">
                    <span className="text-lg">📅</span>
                  </div>
                  <span className="text-white text-[10px] font-bold mt-0.5 drop-shadow">
                    予約
                  </span>
                </button>
              </div>

              {/* 下部情報（TikTok風） */}
              <div className="absolute left-0 right-16 bottom-8 px-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-sm font-bold text-white">
                    {p.stylist[0]}
                  </div>
                  <span className="text-white font-bold text-sm drop-shadow">
                    {p.stylist}
                  </span>
                </div>
                <p className="text-white text-sm leading-relaxed drop-shadow mb-2">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-white/80 text-[10px] drop-shadow"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2 inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-3 py-1">
                  <span className="text-white text-xs font-bold">
                    ¥{p.price.toLocaleString()}
                  </span>
                  <span className="text-white/70 text-[10px]">/ {p.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 詳細モーダル */}
      {post && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
            {/* ヘッダー画像 */}
            <div
              className={`h-48 bg-gradient-to-br ${post.imageGradient} relative rounded-t-2xl`}
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/30 backdrop-blur rounded-full flex items-center justify-center text-white"
              >
                ×
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                <h2 className="text-white text-xl font-black">
                  {post.styleName}
                </h2>
                <p className="text-white/80 text-sm">by {post.stylist}</p>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* 説明 */}
              <p className="text-sm text-gray-700 leading-relaxed">
                {post.description}
              </p>

              {/* 施術情報 */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-400">施術</p>
                  <p className="text-xs font-bold text-primary">{post.treatment}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-400">料金</p>
                  <p className="text-xs font-bold text-primary">¥{post.price.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-400">所要時間</p>
                  <p className="text-xs font-bold text-primary">{post.duration}</p>
                </div>
              </div>

              {/* タグ */}
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-accent bg-blue-50 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 予約ボタン */}
              <a
                href="/booking"
                className="block w-full bg-accent text-white font-bold py-3.5 rounded-xl text-sm text-center shadow-lg shadow-blue-200"
              >
                このスタイルで予約する
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    toggleLike(post.id)
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    likedPosts.has(post.id)
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'border-gray-200 text-gray-500'
                  }`}
                >
                  ♥ いいね {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                </button>
                <button className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-500">
                  ↗ シェア
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
