# Data Model

Source of truth: `prisma/schema.prisma`. This document summarises each table
and lists the key relationships.

## Entity overview

```
User ─┬─ CandidateProfile ─┬─ AvailabilitySlot
      │                    └─ Match ── Meeting ── Feedback
      ├─ HiringManager ────── AvailabilitySlot
      └─ CompanyAdmin ── Company ─┬─ JobPosting ── Match
                                  ├─ HiringManager
                                  └─ Subscription
```

## Tables

### `User`
Thin shadow of the Clerk user; stores `role`, `clerkId`, `email`. Everything
else hangs off role-specific profile tables.

### `CandidateProfile`
Skills, desired roles, salary band, work style, culture diagnostic answers,
resume text, and the 1536-dim OpenAI embedding used for semantic retrieval.
`consentedAt` is written during onboarding and is required by the
Employment Security Act — see `COMPLIANCE.md`.

### `Company`, `CompanyAdmin`, `HiringManager`
A company has N admins and N hiring managers. Admins configure the company,
invite managers, and manage billing. Managers have their own availability.

### `JobPosting`
Required skills, salary range, work style, status, and an embedding.

### `AvailabilitySlot`
Discrete intervals owned by either a candidate or a hiring manager. Used by
the scheduling engine (Phase 4) to find intersections.

### `Match`
Unique per `(candidate, job)` pair. Stores `fitScore`, a structured
`fitReasonJson` from Claude (kept 5 years for audit), plus the audit decision.

### `Meeting` + `Feedback`
`Meeting` is created only when a match is approved and a time was selected.
`Feedback` is collected after the meeting (one row per participant).

### `Subscription`
Mirrors the Stripe subscription so quota checks do not require a Stripe
round-trip.

### `AuditLog`
Append-only record of every sensitive action. Indexed by actor and by target.
Retention: 5 years.

## pgvector notes

Prisma has no first-class vector type, so `embedding` is declared as
`Unsupported("vector(1536)")`. Indexes are created via the raw SQL in
`prisma/vector_indexes.sql` after the first migration:

```
CREATE INDEX ... USING hnsw (embedding vector_cosine_ops);
```
