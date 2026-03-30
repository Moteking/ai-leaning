'use client'

import PhotoUpload from '@/components/PhotoUpload'

export default function PostPage() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-black text-primary">写真投稿</h1>
        <p className="text-xs text-gray-400">
          AI自動解析 → Instagram自動投稿
        </p>
      </div>

      {/* フロー説明 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex flex-col items-center">
            <span className="text-lg">📷</span>
            <span>写真選択</span>
          </div>
          <span className="text-gray-300">→</span>
          <div className="flex flex-col items-center">
            <span className="text-lg">🤖</span>
            <span>AI解析</span>
          </div>
          <span className="text-gray-300">→</span>
          <div className="flex flex-col items-center">
            <span className="text-lg">✍️</span>
            <span>自動生成</span>
          </div>
          <span className="text-gray-300">→</span>
          <div className="flex flex-col items-center">
            <span className="text-lg">📱</span>
            <span>投稿</span>
          </div>
        </div>
      </div>

      <PhotoUpload />
    </div>
  )
}
