# API

All routes live under `/app/api/`. Every handler validates input with `zod`
and returns JSON. Authentication is enforced by Clerk middleware plus an
in-handler `auth()` call.

## Public

| Method | Route                 | Purpose                                    |
| ------ | --------------------- | ------------------------------------------ |
| POST   | `/api/webhooks/clerk` | Clerk user lifecycle (Phase 2)             |
| POST   | `/api/webhooks/stripe`| Stripe subscription events (Phase 5)       |

## Authenticated

| Method | Route              | Who            | Purpose                              |
| ------ | ------------------ | -------------- | ------------------------------------ |
| POST   | `/api/onboarding`  | Any signed-in  | Choose role + record consent         |
| POST   | `/api/profile`     | Candidate      | Update profile / resume (Phase 2)    |
| POST   | `/api/jobs`        | Company admin  | Create/update job posting (Phase 2)  |
| GET    | `/api/matches`     | Candidate/Co.  | List matches (Phase 3)               |
| POST   | `/api/matches/:id/accept` | Candidate | Accept match (Phase 3)            |
| POST   | `/api/meetings/:id/feedback` | Both | Post-meeting feedback (Phase 6)    |
| POST   | `/api/admin/matches/:id/audit` | Platform admin | Approve / reject match (Phase 3) |

## Conventions

- Body validation: `zod`. 400 responses have `{ error: string }`.
- Errors surface a Japanese-language `error` suitable for end users.
- Every write that touches candidate data writes to `AuditLog` in the same
  transaction.
