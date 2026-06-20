---
title: EC担当者のためのAIクローラー一覧と対応早見表
description: ECのAI検索対応で押さえるべき主要AIクローラー（OAI-SearchBot等）の一覧と、許可・ブロックの考え方を早見表で解説します。
date: '2026-05-31'
tags:
  - AIクローラー
  - robots.txt
  - EC
topic: EC担当者のためのAIクローラー一覧と対応早見表
faq:
  - q: 全部許可すべきですか?
    a: AI検索に出したいなら主要な検索系botは許可が基本です。学習を拒否したい場合はbotごとに方針を分けます。
  - q: CCBotとは?
    a: Common Crawlのクローラーで、多くのLLMの学習データの元になります。
  - q: Bingbotも関係しますか?
    a: はい。BingはMicrosoft Copilotの基盤でもあるため、許可しておくと露出機会が広がります。
---
AI検索対応では、どのクローラーを許可すべきかを把握することが第一歩です。主要なAIクローラーを整理します。

## 主要AIクローラー一覧

| クローラー | 役割 |
| --- | --- |
| OAI-SearchBot | ChatGPT検索の表示用 |
| GPTBot | OpenAIの学習用 |
| PerplexityBot | Perplexityの検索インデックス |
| Google-Extended | GoogleのAI(Gemini/AI Overview) |
| ClaudeBot | Anthropic Claude |
| Bingbot | Bing/Copilotの基盤 |
| CCBot | Common Crawl(多くのLLMの学習元) |

## 対応の考え方

- AI検索に出したい：==検索系botは許可==(OAI-SearchBot/PerplexityBot/Google-Extended等)
- 学習を拒否したい：GPTBotやCCBotをbotごとに判断

## まとめ

「とりあえず全ブロック」は機会損失につながります。==botの役割を区別==して方針を決めましょう。

自社サイトが本記事のポイントを満たしているかは、客観的にスコアで把握するのが近道です。[AI検索対応診断](https://aio-diagnosis.com)なら、URLを入れるだけで30秒・無料で項目別に現状と改善点を確認できます。
