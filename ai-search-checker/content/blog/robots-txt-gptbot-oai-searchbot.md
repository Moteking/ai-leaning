---
title: robots.txtの落とし穴：GPTBotとOAI-SearchBotの違い
description: GPTBotとOAI-SearchBotの違いを理解せずにrobots.txtを設定すると、ChatGPT検索に表示されなくなる落とし穴を解説します。
date: '2026-06-10'
tags:
  - robots.txt
  - GPTBot
  - OAI-SearchBot
  - AI検索
topic: robots.txtの落とし穴：GPTBotとOAI-SearchBotの違い
faq:
  - q: GPTBotをブロックしたら検索にも出なくなりますか?
    a: >-
      GPTBotは主に学習用です。ChatGPT検索の表示用は OAI-SearchBot なので、検索表示を狙うなら OAI-SearchBot
      を許可しておく必要があります。
  - q: 学習はさせたくないが検索には出したい場合は?
    a: GPTBot を Disallow、OAI-SearchBot を Allow にする運用が考えられます。
  - q: 他に注意すべきbotは?
    a: PerplexityBot、Google-Extended、ClaudeBot、Bingbot、CCBot などです。
---
「AIに学習されたくないからGPTBotをブロックした」——その結果、ChatGPT検索にも出なくなってしまうケースがあります。これは GPTBot と OAI-SearchBot の違いを理解していないことが原因です。

## 2つのbotの役割の違い

- ==GPTBot==：主にモデルの学習用クローラー
- ==OAI-SearchBot==：ChatGPTの検索結果に表示するための実クローラー

つまり、検索表示を狙うなら OAI-SearchBot の許可が必須です。

## 推奨する考え方

学習は拒否しつつ検索には出したい場合、GPTBot を Disallow、OAI-SearchBot を Allow にする方法があります。自社の方針に合わせて設計しましょう。

## まとめ

robots.txt の一行が、AI検索での露出を大きく左右します。bot名を正しく区別して設定することが重要です。

自社サイトが本記事のポイントを満たしているかは、客観的にスコアで把握するのが近道です。[AI検索対応診断](https://aio-diagnosis.com)なら、URLを入れるだけで30秒・無料で項目別に現状と改善点を確認できます。
