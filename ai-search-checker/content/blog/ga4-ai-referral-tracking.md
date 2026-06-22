---
title: "GA4でChatGPT・PerplexityからのAI流入を計測する方法"
description: "ChatGPTやPerplexityなどAI経由のサイト流入を、Google Analytics 4で可視化・計測する方法を、参照元の見分け方からセグメント作成まで解説します。"
date: "2026-06-19"
tags: ["AI流入", "GA4", "アクセス解析", "AIO"]
topic: "guide-ga4-ai-referral"
faq:
  - q: "AI経由の流入はどの参照元で見分けますか?"
    a: "chatgpt.com / chat.openai.com（ChatGPT）、perplexity.ai（Perplexity）、gemini.google.com、copilot.microsoft.com などの参照元ドメインが目印です。これらをまとめてセグメント化すると把握しやすくなります。"
  - q: "AI流入が少なくても対策する意味はありますか?"
    a: "あります。今はまだ数が少なくても、AI検索の利用は拡大中です。早く計測基盤を整え、対応の効果を追える状態にしておくことが重要です。"
  - q: "計測だけで流入は増えますか?"
    a: "計測自体は増やしません。増やすには、構造化データやAIクローラー許可などのAIO対策が必要です。計測は「効果を確認する」ための土台です。"
---

「AIから自社サイトへの流入は、今どれくらいあるのか?」——AIO対策の効果を測るには、まずAI経由の流入を==計測できる状態==にすることが第一歩です。この記事では、Google Analytics 4(GA4)でAI流入を可視化する方法を解説します。

## AI経由の流入を見分ける参照元

ChatGPTやPerplexityなどから訪問があると、GA4の「参照元(referrer)」に特定のドメインが記録されます。代表的なものは次のとおりです。

| AIサービス | 参照元ドメインの例 |
| --- | --- |
| ChatGPT | chatgpt.com / chat.openai.com |
| Perplexity | perplexity.ai |
| Google Gemini | gemini.google.com |
| Microsoft Copilot | copilot.microsoft.com |

これらを手がかりに、==AI経由の流入==を抽出します。

## GA4で確認する手順

### 1. 参照元レポートで確認する

「集客」→「トラフィック獲得」で、ディメンションを==参照元/メディア==に切り替えます。上記ドメインが含まれていれば、AI経由の流入がある証拠です。

### 2. 探索でセグメントを作る

「探索」機能で、参照元に chatgpt.com / perplexity.ai などを含む条件のセグメントを作成すると、AI流入だけを継続的に追えます。流入数・閲覧ページ・コンバージョンを定点観測しましょう。

### 3. UTMパラメータも活用する

llms.txtや各種プロフィールに自社URLを載せる際、`?utm_source=ai` のような==UTMパラメータ==を付けておくと、流入元をより正確に判別できます。

## 計測の次は「対策」

計測はあくまで土台です。AI流入を==増やす==には、AIに引用されるための対策が必要です。

- 構造化データ(Product/FAQ等)の実装
- AIクローラー(OAI-SearchBot等)の許可
- JavaScriptなしでも本文が読めるSSR化

これらが整っているかは、AI検索対応診断で項目別に確認できます。まず現状を把握し、計測で効果を追いながら改善していきましょう。

[AI検索対応診断](https://aio-diagnosis.com)なら、URLを入れるだけで30秒・無料で現状と改善点がわかります。
