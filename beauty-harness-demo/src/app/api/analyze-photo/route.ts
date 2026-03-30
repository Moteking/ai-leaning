import { NextRequest, NextResponse } from 'next/server'
import { generateInstagramCaption } from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    // デモ用：写真解析はモックで即時返す
    // 実際にはCloud Vision等で解析する
    const formData = await req.formData()
    const file = formData.get('photo')

    if (!file) {
      return NextResponse.json({ error: 'No photo provided' }, { status: 400 })
    }

    // モック解析結果（デモ用に固定値）
    const analysis = {
      color: 'アッシュブラウン系',
      style: 'ミディアムボブ',
      technique: 'ハイライト＋バレイヤージュ',
    }

    // Claude APIでキャプション生成（実際のAPI呼び出し）
    const { caption, hashtags } = await generateInstagramCaption(analysis)

    return NextResponse.json({
      analysis,
      caption,
      hashtags,
    })
  } catch (error) {
    console.error('Photo analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze photo' },
      { status: 500 }
    )
  }
}
