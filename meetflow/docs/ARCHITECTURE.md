# Architecture

MeetFlow is a Next.js 15 (App Router) application deployed on Vercel, with
PostgreSQL (Neon + pgvector) as the system of record and Clerk as the identity
provider. This document describes the runtime topology and the major
processing paths.

## Runtime topology

```
┌────────┐     ┌──────────────────────────┐     ┌─────────────────┐
│Browser │ ──► │ Next.js on Vercel        │ ──► │ Neon PostgreSQL │
└────────┘     │   Edge middleware        │     │  + pgvector     │
               │   RSC + Route handlers   │     └─────────────────┘
               │   Vercel Cron            │
               └──────────┬───────────────┘
                          │
          ┌───────────────┼──────────────────────────┐
          ▼               ▼                          ▼
    ┌───────────┐   ┌─────────────┐          ┌────────────────┐
    │  Clerk    │   │ Anthropic   │          │ Google / Stripe│
    │  (authn)  │   │ Claude API  │          │ Resend / PostHog│
    └───────────┘   └─────────────┘          └────────────────┘
```

## Request flow for a protected page

1. Browser requests `/company/jobs`.
2. Edge middleware (`src/middleware.ts`) runs `clerkMiddleware`, which reads
   the session cookie.
3. Unauthenticated users are redirected to `/sign-in`.
4. Authenticated users with no `publicMetadata.role` are redirected to
   `/onboarding`.
5. If the role does not match the route's required role, the middleware
   redirects to the user's role-specific home.
6. The RSC fetches data via `lib/prisma.ts`, renders, and streams HTML.

## Data ownership

| Concern                           | System of record |
| --------------------------------- | ---------------- |
| Identity, email, password          | Clerk            |
| Role, consent timestamp, profile   | Neon (Prisma)    |
| Embeddings for semantic match      | Neon (pgvector)  |
| Matches, meetings, feedback, audit | Neon (Prisma)    |
| Subscriptions, invoices            | Stripe           |
| Calendar availability, events      | Google Calendar  |

## Background jobs

- **Weekly matching batch**: Vercel Cron (`0 14 * * 0` UTC → Sun 23:00 JST;
  configured in `vercel.json`) calls `POST /api/cron/generate-matches` with
  `Authorization: Bearer $CRON_SECRET`.
  - Backfills missing embeddings for candidates and active jobs via
    OpenAI `text-embedding-3-small`.
  - For each candidate, pulls the top-20 jobs by cosine similarity
    (`pgvector` HNSW), evaluates each pair with Claude (`claude-sonnet-4-6`)
    using a structured output schema.
  - Persists matches with `fitScore >= 70` and `recommendation = "APPROVE"`;
    existing rows are upserted so re-scoring never duplicates a match.
  - Writes a `MATCH_BATCH_COMPLETED` (or `…_FAILED`) row to `AuditLog`.
- **Nightly reminders**: Cron triggers `/api/cron/remind-meetings` to send
  next-day reminders via Resend (Phase 4).

## Compliance layer

`AuditLog` is written from every action that touches candidate data. The
`/admin` section exposes these records to the job-placement officer. See
`COMPLIANCE.md` for the checklist.
