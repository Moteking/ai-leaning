# API

All routes live under `/app/api/`. Every handler validates input with `zod`
and returns JSON. Authentication is enforced by Clerk middleware plus an
in-handler `auth()` call (or a token check for public applicant routes).

## Public

| Method | Route                  | Purpose                                 |
| ------ | ---------------------- | --------------------------------------- |
| POST   | `/api/webhooks/clerk`  | Clerk user lifecycle (later phase)      |
| POST   | `/api/apply/:token`    | Applicant submits diagnostic (Phase D)  |

## Authenticated

| Method | Route                                | Who            | Purpose                                           |
| ------ | ------------------------------------ | -------------- | ------------------------------------------------- |
| POST   | `/api/onboarding`                    | Any signed-in  | Choose role (COMPANY_ADMIN / HIRING_MANAGER)      |
| POST   | `/api/onboarding/company`            | Company admin  | Create the company and link the first admin      |
| POST   | `/api/jobs`                          | Company admin  | Create a job opening                              |
| PATCH  | `/api/jobs/:id`                      | Company admin  | Update a job opening                              |
| DELETE | `/api/jobs/:id`                      | Company admin  | Delete a job opening                              |
| POST   | `/api/invites`                       | Company admin  | Issue a hiring-manager invite token               |
| POST   | `/api/invites/accept`                | Hiring manager | Redeem an invite and attach to the company        |
| POST   | `/api/templates`                     | Company admin  | Create a diagnostic template (Phase B)            |
| POST   | `/api/applicants`                    | Company admin  | Upload an applicant + résumé, mint link (Phase C) |
| POST   | `/api/applications/:id/score`        | Internal       | Trigger AI scoring on submission (Phase E)        |

## Conventions

- Body validation: `zod`. 400 responses have `{ error: string }`.
- Errors surface a Japanese-language `error` suitable for end users.
- Every privileged write also writes to `AuditLog`.
