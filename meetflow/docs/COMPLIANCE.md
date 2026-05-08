# Privacy & Fairness Checklist

Post-pivot MeetFlow is a B2B SaaS for hiring companies, not a placement
service. The hiring company is the data controller for applicant
information; we are the processor. The list below tracks the obligations
we still want to honor.

## 1. Applicant transparency

- The diagnostic page (`/apply/:token`) tells the applicant what data is
  collected, what it is used for, and which company is the controller —
  before they answer any question. (Phase D)
- The AI evaluation system prompt is published in
  `lib/ai/score-applicant.ts` (Phase E) so a curious applicant can be told
  on request what was considered.

## 2. No protected-attribute screening

- The scorer's system prompt forbids reasoning over age, gender,
  nationality, race, religion, marital status, health, disability.
- Resume parsing strips fields that exist purely to convey those
  attributes (date of birth, gender pronouns when listed as a header
  field).

## 3. Tenant isolation

- Every `Applicant`, `JobOpening`, `DiagnosticTemplate` and `Application`
  carries a `companyId`. Server queries always include it as a filter.
- The audit log records the actor who ran each query so a misbehaving
  admin can be traced.

## 4. Audit trail

- `AuditLog` is append-only.
- Every privileged mutation (job CRUD, applicant create, scoring,
  status change) writes a row.

## 5. Retention and deletion

- Deletion of an `Applicant` cascades to `Application`, `DiagnosticResponse`.
- Companies should be able to bulk-delete applicants past their retention
  policy from `/company/applicants` (Phase C+).

## Open items

- [ ] Per-tenant data export (right of access support).
- [ ] DPA template with Anthropic / OpenAI.
- [ ] Breach response runbook.
