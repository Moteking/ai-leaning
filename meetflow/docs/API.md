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

| Method | Route                                 | Who            | Purpose                                           |
| ------ | ------------------------------------- | -------------- | ------------------------------------------------- |
| POST   | `/api/onboarding`                     | Any signed-in  | Choose role + record consent                      |
| POST   | `/api/onboarding/candidate/parse`     | Candidate      | AI-structure a pasted resume (Claude)             |
| POST   | `/api/onboarding/candidate`           | Candidate      | Finalize candidate profile + culture answers      |
| POST   | `/api/onboarding/company`             | Company admin  | Create the company and link the first admin      |
| POST   | `/api/profile`                        | Candidate      | Update profile / resume                           |
| POST   | `/api/jobs`                           | Company admin  | Create a job posting                              |
| PATCH  | `/api/jobs/:id`                       | Company admin  | Update a job posting                              |
| DELETE | `/api/jobs/:id`                       | Company admin  | Delete a job posting                              |
| POST   | `/api/invites`                        | Company admin  | Issue a hiring-manager invite token               |
| POST   | `/api/invites/accept`                 | Hiring manager | Redeem an invite and attach to the company        |
| POST   | `/api/matches/:id/respond`            | Candidate      | Accept / decline an approved match                |
| POST   | `/api/admin/matches/:id/audit`        | Platform admin | Approve or invalidate (REJECTED_BY_AUDIT) a match  |
| POST   | `/api/cron/generate-matches`          | Cron / Admin   | Weekly matching batch (Bearer CRON_SECRET or Admin) |
| POST   | `/api/meetings/:id/feedback`          | Both           | Post-meeting feedback (Phase 6)                   |

## Conventions

- Body validation: `zod`. 400 responses have `{ error: string }`.
- Errors surface a Japanese-language `error` suitable for end users.
- Every write that touches candidate data writes to `AuditLog` in the same
  transaction.
