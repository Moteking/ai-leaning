# Architecture

MeetFlow (post-pivot) is a B2B SaaS that helps hiring companies score
applicants on culture and skill fit. Stack: Next.js 15 App Router on
Vercel, Postgres on Neon, Clerk for auth, Claude for evaluation.

## Runtime topology

```
┌────────┐     ┌──────────────────────────┐     ┌─────────────────┐
│Browser │ ──► │ Next.js on Vercel        │ ──► │ Neon PostgreSQL │
└────────┘     │   Edge middleware        │     └─────────────────┘
               │   RSC + Route handlers   │
               └──────────┬───────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐    ┌────────────┐  ┌────────────────┐
    │  Clerk   │    │ Anthropic  │  │ Stripe / Resend │
    │ (authn)  │    │ Claude API │  │  (later phases) │
    └──────────┘    └────────────┘  └────────────────┘
```

## Request flow for a protected page

1. Browser requests `/company/applicants`.
2. Edge middleware (`src/middleware.ts`) runs `clerkMiddleware`, reads the
   session cookie, and looks at `publicMetadata.role`.
3. Unauthenticated → `/sign-in`. Missing role → `/onboarding`. Wrong role
   → role-specific home.
4. The page resolves `companyId` via `requireCompanyForAdmin`, queries
   Prisma scoped to that company, and renders.

## Public applicant flow (Phase D)

`/apply/:token` is the only publicly accessible app route. The token is
matched against `Applicant.diagnosticToken` and verified against
`diagnosticTokenExpiresAt`. No Clerk session is ever attached.

## Background jobs

None for the MVP. Scoring is triggered by `POST /api/apply/:token` at
submission time. We can later add a fallback Cron to retry failed scoring
runs.

## Data ownership

| Concern                                  | System of record |
| ---------------------------------------- | ---------------- |
| Identity, password (company-side users)  | Clerk            |
| Role / consent timestamps                | Neon (Prisma)    |
| Applicants, applications, responses      | Neon (Prisma)    |
| AI evaluation outputs                    | Neon (Prisma)    |
| Subscriptions                            | Stripe (later)   |

## Compliance layer

`AuditLog` is written from every privileged action. See `COMPLIANCE.md`.
