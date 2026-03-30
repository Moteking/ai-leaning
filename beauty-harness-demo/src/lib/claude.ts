import { Customer } from './types'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

async function callClaude(prompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error: ${res.status} ${err}`)
  }

  const data = await res.json()
  return data.content[0].text
}

export async function generateThanksMessage(customer: Customer, treatment: string): Promise<string> {
  return callClaude(
    `あなたは美容サロンのAIアシスタントです。以下の顧客に送るLINEのお礼メッセージを作成してください。

顧客名: ${customer.name}さん
施術内容: ${treatment}
来店回数: ${Math.floor(365 / customer.visitIntervalDays)}回目（推定）

条件:
- 絵文字を適度に使う
- 150文字以内
- 自然で温かい文章
- 次回の来店を楽しみにしている旨を入れる

メッセージ本文のみ出力してください。`
  )
}

export async function generateReviewRequest(customer: Customer): Promise<string> {
  return callClaude(
    `あなたは美容サロンのAIアシスタントです。施術3日後に送るレビュー依頼LINEメッセージを作成してください。

顧客名: ${customer.name}さん
施術内容: ${customer.treatment}

条件:
- 押し付けがましくない自然な文章
- 100文字以内
- Googleレビューへの誘導

メッセージ本文のみ出力してください。`
  )
}

export async function generateRepeatPromotion(customer: Customer): Promise<string> {
  return callClaude(
    `あなたは美容サロンのAIアシスタントです。リピート促進LINEメッセージを作成してください。

顧客名: ${customer.name}さん
施術内容: ${customer.treatment}
平均来店間隔: ${customer.visitIntervalDays}日
次回おすすめ来店日: ${customer.nextPredicted}

条件:
- 来店間隔に基づいた自然な提案
- 120文字以内
- 予約リンクへの誘導を含める

メッセージ本文のみ出力してください。`
  )
}

export async function generateHpbRedirect(customer: Customer): Promise<string> {
  return callClaude(
    `あなたは美容サロンのAIアシスタントです。HPB（ホットペッパービューティー）経由で来店した顧客を、次回から自社予約（LINE予約）に誘導するLINEメッセージを作成してください。

顧客名: ${customer.name}さん
施術内容: ${customer.treatment}

条件:
- 「LINE予約なら次回500円OFF」という特典を含める
- 押し付けがましくない自然な文章
- 120文字以内
- HPBを否定しない

メッセージ本文のみ出力してください。`
  )
}

export async function generateInstagramCaption(analysis: {
  color: string
  style: string
  technique: string
}): Promise<{ caption: string; hashtags: string[] }> {
  const result = await callClaude(
    `あなたは美容サロンのSNSマーケティングAIです。以下のヘアスタイル写真の解析結果をもとに、Instagramの投稿キャプションとハッシュタグを生成してください。

カラー: ${analysis.color}
スタイル: ${analysis.style}
技法: ${analysis.technique}

以下のJSON形式で出力してください（JSONのみ、他のテキスト不要）:
{"caption": "キャプション本文", "hashtags": ["#タグ1", "#タグ2", ...]}

条件:
- キャプションは100〜150文字
- ハッシュタグは10〜15個
- トレンドを意識した内容`
  )

  try {
    return JSON.parse(result)
  } catch {
    return {
      caption: result,
      hashtags: ['#美容室', '#ヘアスタイル', '#hair'],
    }
  }
}
