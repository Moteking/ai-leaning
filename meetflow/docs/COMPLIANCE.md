# Compliance Checklist

MeetFlow is designed to operate under a Japanese paid job-placement license
(有料職業紹介事業). Every obligation from the spec's section 7 is mapped to an
implementation hook below. Search the codebase for `[COMPLIANCE]` to find all
touchpoints.

## 1. Consent for personal-data use

- UI: `/onboarding` shows an explicit checkbox.
- Server: `/api/onboarding` refuses to persist a role without `consented: true`
  and writes `consentedAt` on the `CandidateProfile`.
- Audit: same handler writes `ONBOARDING_COMPLETED` to `AuditLog`.

## 2. Prevention of discriminatory screening

- `lib/ai/match.ts` (Phase 3) will inject a prompt preamble forbidding
  age/gender/nationality-based scoring.
- Admin review in `/admin/matches` allows the placement officer to reject
  matches post-hoc.

## 3. Transparent pricing

- Public `/` landing page shows the three subscription tiers and the 10%
  success fee.
- `/compliance` repeats the pricing and references the service agreement.

## 4. Placement officer oversight

- Role `PLATFORM_ADMIN` has access to `/admin/*`.
- `Match.auditedBy` / `auditedAt` capture the decision.
- MVP mode: matches are auto-approved; officer performs post-hoc audit.

## 5. Audit log

- `AuditLog` is append-only and indexed by actor and target.
- Retention: 5 years.

## 6. Accurate job posting information

- `JobPosting` requires salary range, work style, and description (non-null).
- Admin review (Phase 2) lets the company admin flag problem postings.

## 7. Candidate information protection

- Candidate details are exposed to a company only after `Match.status` becomes
  `APPROVED`. Earlier stages show only an anonymised profile summary.
- Phase 2 will add a "hide from current employer" toggle that filters matches
  against the candidate's current company.

## Open items (to track before go-live)

- [ ] License number + placement officer name on `/compliance`.
- [ ] Data retention and deletion policy (formal doc).
- [ ] DPA with Clerk, Anthropic, OpenAI, Google, Stripe, Resend.
- [ ] Breach response runbook.
