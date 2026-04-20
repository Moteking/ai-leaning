# MeetFlow

> スカウト・メッセージ・日程調整を全廃した、中途採用マッチングサービス。
> AIが候補者と企業をマッチし、面談日時まで自動確定します。

本リポジトリは MVP 開発指示書(リポジトリルート直下を参照)に基づく実装です。
Phase 1 では基盤(認証・スキーマ・LP・Role別ダッシュボード雛形)を構築します。

## 技術スタック

- Next.js 15 (App Router) / TypeScript / Tailwind CSS v4
- Prisma 6 + PostgreSQL (Neon, pgvector)
- Clerk (authn / session claims で role 判定)
- Anthropic Claude (Phase 2+) / OpenAI Embeddings (Phase 3+)
- Google Calendar (Phase 4) / Stripe (Phase 5) / Resend (Phase 4) / PostHog

## ディレクトリ

```
src/
  app/
    (public)           # landing, compliance, privacy, terms, contact
    sign-in, sign-up   # Clerk
    onboarding         # Role picker + consent
    dashboard          # Candidate home
    company/…          # Company admin
    manager/…          # Hiring manager
    admin/…            # Platform admin (job-placement officer)
    api/onboarding     # First write of role + consent
  components/
    ui/                # Button, Card (shadcn-style primitives)
    site/              # Landing header/footer
    app/               # Authenticated AppShell
  lib/
    prisma.ts, roles.ts, cn.ts
  middleware.ts        # Clerk + role gating
prisma/
  schema.prisma        # All MVP tables
  vector_indexes.sql   # HNSW indexes for pgvector
docs/
  ARCHITECTURE.md, DATA_MODEL.md, API.md, COMPLIANCE.md, DEPLOYMENT.md
```

## はじめ方

1. `cp .env.example .env.local` し、Clerk と Neon の値を埋める。
2. `npm install`
3. `npx prisma migrate dev --name init` で DB スキーマを適用。
4. `psql "$DATABASE_URL" -f prisma/vector_indexes.sql` で HNSW インデックス作成。
5. `npm run dev` → http://localhost:3000

## 重要な方針

- 法令遵守に関わるコード/ドキュメントには `[COMPLIANCE]` コメントを付けています。
  `docs/COMPLIANCE.md` を参照してください。
- `any` は使わず、境界では `unknown` → zod でバリデーションします。
- コミットメッセージは「なぜ」を端的に。

## Phase 1 完了判定

- Candidate / Company admin / Hiring manager / Platform admin の 4 ロールを
  Clerk でサインアップし、`/onboarding` で立場を選ぶと対応するダッシュボードに
  遷移する(PLATFORM_ADMIN は Clerk の publicMetadata で手動昇格)。
- 未認証ユーザーは `/sign-in` に、Role 外アクセスは自ロールのホームに戻される。
