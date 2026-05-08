# Data Model

Source of truth: `prisma/schema.prisma`. Updated for the post-pivot domain
(B2B applicant scoring SaaS).

## Entity overview

```
User ─┬─ HiringManager ── Company
      └─ CompanyAdmin ── Company ─┬─ JobOpening ─┬─ Applicant ── Application ── DiagnosticResponse
                                  │              └─ DiagnosticTemplate ── DiagnosticQuestion
                                  ├─ Invite (HiringManager invitation)
                                  └─ Templates / Applicants
```

## Tables

### `User`
Mirror of the Clerk user with a single `role`
(`COMPANY_ADMIN | HIRING_MANAGER | PLATFORM_ADMIN`).

### `Company`
Hiring company. Holds the `cultureProfile` free-text field which the AI
scorer uses to anchor culture-fit judgement.

### `CompanyAdmin`, `HiringManager`
Two ways a Clerk user can belong to a company. Admins configure jobs,
templates and billing. Managers review applicants.

### `Invite`
Token-based invitation used to onboard a hiring manager into a company.

### `JobOpening`
Title, required/nice-to-have skills, salary range, work style. Optionally
references a `DiagnosticTemplate` whose questions every applicant answers.

### `DiagnosticTemplate`
Per-company. `origin` is `STANDARD` (forked from a preset) or `CUSTOM`
(built from scratch). `rubric` JSON encodes the company's preferred
answer per question for scoring.

### `DiagnosticQuestion`
Belongs to a template. Type is `SINGLE_CHOICE | LIKERT | FREE_TEXT`.
`options` JSON holds choices for the first two types.

### `Applicant`
Person who applied. Not a Clerk user. Holds the uploaded résumé text,
contact info, and a single-use `diagnosticToken` used by the public
`/apply/:token` flow.

### `Application`
One per applicant. Tracks status through the funnel
(`AWAITING_DIAGNOSTIC → SUBMITTED → REVIEWED → HIRED|REJECTED`) and stores
the AI score (`fitScore` plus `fitReasonJson`).

### `DiagnosticResponse`
Applicant's answer to a single question, scoped to an application. Unique
per `(applicationId, questionId)`.

### `AuditLog`
Append-only operational log. Indexed by actor and target.
