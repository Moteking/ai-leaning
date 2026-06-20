---
title: 送料・返品情報の構造化（shippingDetails・merchantReturnPolicy）の重要性
description: >-
  Offerに送料(shippingDetails)・返品(merchantReturnPolicy)を構造化することが、Googleの無料リスティングやAI購買で評価される理由を解説します。
date: '2026-05-21'
tags:
  - 送料
  - 返品
  - 構造化データ
topic: 送料・返品情報の構造化（shippingDetails・merchantReturnPolicy）の重要性
faq:
  - q: 送料・返品の構造化は必須ですか?
    a: 必須ではありませんが、商品リスティングやAI購買での評価に効くため推奨されます。
  - q: どこに入れますか?
    a: Offerスキーマのプロパティ(shippingDetails・hasMerchantReturnPolicy)として実装します。
  - q: 記載と実態がずれてもよい?
    a: いいえ。必ず実際のポリシーと一致させてください。
---
購入判断で大きいのが「送料」と「返品」です。これらを構造化しておくと、AI購買やGoogleの商品リスティングで評価されやすくなります。

## 構造化すべき情報

- ==shippingDetails==：送料・配送条件
- ==merchantReturnPolicy==：返品ポリシー

これらは Offer スキーマのプロパティとして実装します。

## なぜ効くのか

Googleの無料リスティングやAIショッピングでは、価格だけでなく送料・返品の条件も比較対象になります。構造化しておくと、好条件のショップとして表示されやすくなります。

## 注意

==実際のポリシーと一致==させることが大前提です。表記と運用がずれると信頼を損ねます。

自社サイトが本記事のポイントを満たしているかは、客観的にスコアで把握するのが近道です。[AI検索対応診断](https://aio-diagnosis.com)なら、URLを入れるだけで30秒・無料で項目別に現状と改善点を確認できます。
