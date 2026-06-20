---
title: 構造化データ（JSON-LD）でEC商品をAIに正しく理解させる方法
description: EC商品をAIや検索エンジンに正しく理解させるためのJSON-LD構造化データの基本と、ECで実装すべき主要スキーマを解説します。
date: '2026-06-11'
tags:
  - 構造化データ
  - JSON-LD
  - EC
  - AIO
topic: 構造化データ（JSON-LD）でEC商品をAIに正しく理解させる方法
faq:
  - q: JSON-LDとmicrodataどちらが良い?
    a: GoogleはJSON-LDを推奨しています。新規実装はJSON-LDを基本にしましょう。
  - q: 最低限どのスキーマを入れるべき?
    a: 商品ページならProductとOffer、可能ならAggregateRating。サイト全体ではOrganizationが基本です。
  - q: 実装後に確認する方法は?
    a: リッチリザルトテストや各種診断ツールで、必須プロパティが揃っているか確認できます。
---
構造化データ(JSON-LD)は、ページの内容を機械可読な形でAIや検索エンジンに伝える仕組みです。ECでは特に効果が大きく、AI検索対応の土台になります。

## ECで実装すべき主要スキーマ

- ==Product==：商品名・画像・説明・ブランド・識別子
- ==Offer==：価格・通貨・在庫・送料・返品
- AggregateRating / Review：評価・レビュー
- BreadcrumbList：パンくず
- Organization：運営事業者

## 必須プロパティを揃える

スキーマを入れるだけでなく、必須プロパティを充足させることが重要です。例えばProductなら name・image・description、Offerなら price・priceCurrency・availability を揃えます。

## まとめ

構造化データはAIが「何の商品か」「いくらか」「評判はどうか」を正確に引用するための鍵です。商品ページから優先的に実装しましょう。

自社サイトが本記事のポイントを満たしているかは、客観的にスコアで把握するのが近道です。[AI検索対応診断](https://aio-diagnosis.com)なら、URLを入れるだけで30秒・無料で項目別に現状と改善点を確認できます。
