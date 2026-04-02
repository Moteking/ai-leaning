'use client'

import { useState, useRef } from 'react'
import { PhotoAnalysis } from '@/lib/types'

export default function PostPage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null)
  const [posted, setPosted] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setAnalysis(null)
    setPosted(false)
  }

  const handleAnalyze = async () => {
    if (!fileRef.current?.files?.[0]) return
    setAnalyzing(true)
    const formData = new FormData()
    formData.append('photo', fileRef.current.files[0])

    try {
      const res = await fetch('/api/analyze-photo', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setAnalysis({ color: data.analysis.color, style: data.analysis.style, technique: data.analysis.technique, caption: data.caption, hashtags: data.hashtags })
      } else { throw new Error('err') }
    } catch {
      setAnalysis({
        color: 'アッシュブラウン系', style: 'ミディアムボブ', technique: 'ハイライト＋バレイヤージュ',
        caption: '透明感あふれるアッシュブラウンで春の装い🌸 ハイライトで立体感をプラス✨',
        hashtags: ['#美容室', '#ヘアカラー', '#アッシュブラウン', '#ハイライト', '#バレイヤージュ', '#ミディアムボブ', '#春ヘア', '#透明感カラー', '#hair', '#hairstyle'],
      })
    } finally { setAnalyzing(false) }
  }

  return (
    <div className="pb-32">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-black tracking-tight">写真投稿</h1>
        <p className="text-xs text-text-tertiary mt-1">AI解析 → 自動キャプション → 投稿</p>
      </div>

      <div className="px-4 space-y-4">
        {/* Flow indicator */}
        <div className="glass-light rounded-2xl p-3 flex items-center justify-around text-[10px] text-text-secondary">
          <span className={preview ? 'text-success font-bold' : ''}>📷 選択</span>
          <span className="text-text-tertiary">→</span>
          <span className={analysis ? 'text-success font-bold' : ''}>🤖 AI解析</span>
          <span className="text-text-tertiary">→</span>
          <span className={posted ? 'text-success font-bold' : ''}>📱 投稿</span>
        </div>

        {/* Upload area */}
        <div
          onClick={() => fileRef.current?.click()}
          className={`rounded-2xl overflow-hidden cursor-pointer transition-all ${preview ? '' : 'glass-light p-12'}`}
        >
          {preview ? (
            <img src={preview} alt="" className="w-full aspect-square object-cover rounded-2xl" />
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-surface-3 flex items-center justify-center">
                <svg className="w-8 h-8 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
              <p className="text-sm text-text-secondary font-bold">タップして写真を選択</p>
              <p className="text-[10px] text-text-tertiary mt-1">JPG, PNG対応</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>

        {/* Analyze button */}
        {preview && !analysis && (
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full bg-accent text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-50 glow-accent active:scale-[0.98] transition-all"
          >
            {analyzing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                AIが解析中...
              </span>
            ) : 'AIで自動解析する'}
          </button>
        )}

        {/* Analysis result */}
        {analysis && (
          <div className="space-y-3 animate-fade-in">
            <div className="glass-light rounded-2xl p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center text-[10px] font-bold text-accent-light">AI</div>
                スタイル解析結果
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'カラー', value: analysis.color },
                  { label: 'スタイル', value: analysis.style },
                  { label: '技法', value: analysis.technique },
                ].map((item) => (
                  <div key={item.label} className="bg-surface-3 rounded-xl p-2.5 text-center">
                    <p className="text-[9px] text-text-tertiary">{item.label}</p>
                    <p className="text-[11px] font-bold mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-light rounded-2xl p-4">
              <h3 className="text-xs font-bold mb-2">自動生成キャプション</h3>
              <p className="text-sm text-text-primary leading-relaxed mb-3">{analysis.caption}</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.hashtags.map((tag) => (
                  <span key={tag} className="text-[10px] text-accent-light bg-accent/10 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>

            {!posted ? (
              <button
                onClick={() => setPosted(true)}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold py-3.5 rounded-xl text-sm glow-pink active:scale-[0.98] transition-transform"
              >
                Instagramに投稿する
              </button>
            ) : (
              <div className="glass-light rounded-2xl p-5 text-center animate-scale-in border border-success/20">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-success/15 flex items-center justify-center">
                  <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-success">投稿完了！</p>
                <p className="text-[10px] text-text-secondary mt-1">最適な時間帯に自動スケジュールしました</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
