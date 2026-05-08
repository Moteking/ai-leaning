# MeetFlow

> 採用企業が応募者の履歴書と性格診断を AI で評価する B2B SaaS。
> 自社カルチャーへの適合度をスコアで可視化します。

本リポジトリは MVP 開発指示書の方針転換版に基づく実装です。

## 技術スタック

- Next.js 15 (App Router) / TypeScript / Tailwind CSS v4
- Prisma 6 + PostgreSQL (Neon)
- Clerk(企業側ユーザーの認証)
- Anthropic Claude (Sonnet 4.6) で履歴書・診断回答を評価
- Stripe / Resend は後続フェーズ

## ドメイン概要

- **企業管理者** が会社、求人、性格診断テンプレートを設定
- **応募者** はアカウント不要。企業から発行された専用リンクで履歴書 (現状はテキスト) を確認・診断に回答
- **AI** が履歴書 × 求人 × 自社カルチャー × 診断回答を照合し、適合度スコア + 評価コメントを返す
- **面接官** は AI 評価を確認して面接判断に利用

## ディレクトリ

```
src/
  app/
    (public)           # landing, compliance, privacy, terms, contact
    sign-in, sign-up   # Clerk
    onboarding         # Role picker (COMPANY_ADMIN / HIRING_MANAGER)
    company/…          # Company admin
    manager/…          # Hiring manager
    admin/…            # Platform admin
    apply/[token]/…    # Public applicant flow (Phase D)
    api/               # Route handlers
prisma/schema.prisma   # Applicant, JobOpening, DiagnosticTemplate, Application, …
docs/
  ARCHITECTURE.md, DATA_MODEL.md, API.md, COMPLIANCE.md, DEPLOYMENT.md
```

## はじめ方

1. `cp .env.example .env.local` し Clerk と Neon の値を埋める
2. `npm install`
3. `npx prisma migrate dev --name init` で DB スキーマを適用
4. `npm run dev` → http://localhost:3000

## フェーズ

- ✅ **A**: スキーマ刷新 + 旧マッチング機能の撤去 + 新ランディング/法令ページ
- **B**: 性格診断テンプレート(プリセット + カスタム編集)
- **C**: 応募者作成(履歴書テキスト)+ 招待リンク発行
- **D**: 公開フロー `/apply/[token]`(診断回答 UI + 提出 API)
- **E**: AI スコアリング(履歴書 × 求人 × カルチャー × 回答)
- **F**: 企業向け応募者ダッシュボード(スコア順表示・詳細)
