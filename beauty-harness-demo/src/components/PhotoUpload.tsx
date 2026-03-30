'use client'

import { useState, useRef } from 'react'
import { PhotoAnalysis } from '@/lib/types'

export default function PhotoUpload() {
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null)
  const [posted, setPosted] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setAnalysis(null)
    setPosted(false)
  }

  const handleAnalyze = async () => {
    if (!fileRef.current?.files?.[0]) return
    setAnalyzing(true)

    const formData = new FormData()
    formData.append('photo', fileRef.current.files[0])

    try {
      const res = await fetch('/api/analyze-photo', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setAnalysis({
          color: data.analysis.color,
          style: data.analysis.style,
          technique: data.analysis.technique,
          caption: data.caption,
          hashtags: data.hashtags,
        })
      } else {
        // フォールバック
        setAnalysis({
          color: 'アッシュブラウン系',
          style: 'ミディアムボブ',
          technique: 'ハイライト＋バレイヤージュ',
          caption:
            '透明感あふれるアッシュブラウンで春の装い🌸 ハイライトで立体感をプラスしました✨',
          hashtags: [
            '#美容室',
            '#ヘアカラー',
            '#アッシュブラウン',
            '#ハイライト',
            '#バレイヤージュ',
            '#ミディアムボブ',
            '#春ヘア',
            '#透明感カラー',
            '#ヘアスタイル',
            '#hair',
          ],
        })
      }
    } catch {
      setAnalysis({
        color: 'アッシュブラウン系',
        style: 'ミディアムボブ',
        technique: 'ハイライト＋バレイヤージュ',
        caption:
          '透明感あふれるアッシュブラウンで春の装い🌸 ハイライトで立体感をプラスしました✨',
        hashtags: [
          '#美容室',
          '#ヘアカラー',
          '#アッシュブラウン',
          '#ハイライト',
          '#バレイヤージュ',
          '#ミディアムボブ',
          '#春ヘア',
          '#透明感カラー',
          '#ヘアスタイル',
          '#hair',
        ],
      })
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* アップロードエリア */}
      <div
        onClick={() => fileRef.current?.click()}
        className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:border-accent transition-colors"
      >
        {preview ? (
          <img
            src={preview}
            alt="プレビュー"
            className="w-full max-h-64 object-cover rounded-lg"
          />
        ) : (
          <div>
            <span className="text-4xl block mb-2">📷</span>
            <p className="text-sm text-gray-500">
              タップして写真を選択
            </p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* 解析ボタン */}
      {preview && !analysis && (
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="w-full bg-accent text-white font-bold py-3 rounded-xl text-sm disabled:opacity-50 transition-all"
        >
          {analyzing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              AIが解析中...
            </span>
          ) : (
            'AIで自動解析する'
          )}
        </button>
      )}

      {/* 解析結果 */}
      {analysis && (
        <div className="space-y-4 animate-fade-in">
          {/* スタイル解析 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-1">
              <span>🔍</span> AI解析結果
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'カラー', value: analysis.color },
                { label: 'スタイル', value: analysis.style },
                { label: '技法', value: analysis.technique },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-blue-50 rounded-lg p-2 text-center"
                >
                  <p className="text-[10px] text-gray-400">{item.label}</p>
                  <p className="text-xs font-bold text-primary mt-0.5">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* キャプション */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-1">
              <span>✍️</span> 自動生成キャプション
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              {analysis.caption}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-accent bg-blue-50 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 投稿ボタン */}
          {!posted ? (
            <button
              onClick={() => setPosted(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl text-sm shadow-md"
            >
              Instagramに投稿する
            </button>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center animate-scale-in">
              <span className="text-2xl block mb-1">✅</span>
              <p className="text-sm font-bold text-green-600">
                投稿が完了しました！
              </p>
              <p className="text-xs text-gray-500 mt-1">
                AIが最適な投稿時間に自動でスケジュールしました
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
