# Phase 3: Production, Design & QA

> **Dependency**: Phase 2 complete ✅
> **Agent**: `@backend-specialist`
> **Status**: ✅ COMPLETE

---

## Goal

Build the production pipeline: design proofing with versioning, production job management, and QA inspection with photo-based checklists.

---

## Tasks

### Task 3.1: Design Tasks Module (Artwork Proofing)

- [x] `POST /design-tasks` — create from order (when order status → Design)
- [x] `GET /design-tasks` — list with filters: status, designer, order
- [x] `GET /design-tasks/:id` — detail with all versions and feedback
- [x] `PATCH /design-tasks/:id` — assign designer, update status
- [x] Version management:
  - `POST /design-tasks/:id/versions` — upload new design version to `artwork` bucket
  - `GET /design-tasks/:id/versions` — list all versions
  - `GET /design-tasks/:id/versions/:version` — get specific version
- [x] Approval workflow:
  - `POST /design-tasks/:id/submit` — status → Awaiting_Approval
  - `POST /design-tasks/:id/approve` — status → Approved, lock design, order → Production
  - `POST /design-tasks/:id/request-revision` — status → Revision with feedback
- [x] On approve: update order's `artwork_files` with final version URL
- [x] Role access: Designers can edit, SDR/Manager can view and submit for approval

**VERIFY**: ✅ Module has controller, service, DTOs, and spec files

---

### Task 3.2: Production Jobs Module

- [x] `POST /production-jobs` — create from order (when order status → Production)
- [x] `GET /production-jobs` — list with filters: status, assigned_to, due_date, order
- [x] `GET /production-jobs/:id` — detail with order info, QA reports
- [x] `PATCH /production-jobs/:id` — update status, assigned_to, due_date
- [x] Status transitions enforced (Queued → In_Production → Finishing → Ready → Shipped_To_QA → Completed)
- [x] Board view endpoint: `GET /production-jobs/board` — grouped by status
- [x] On Shipped_To_QA: auto-create QA Report with status Pending
- [x] On rework (QA fail): reset to Queued, log rework count

**VERIFY**: ✅ Module has controller, service, DTOs, and spec files

---

### Task 3.3: QA Reports Module (Inspection Checklists)

- [x] `POST /qa-reports` — create (usually auto from production job)
- [x] `GET /qa-reports` — list with filters: status, inspector, production_job
- [x] `GET /qa-reports/:id` — detail with checklist, photos, production job info
- [x] `PATCH /qa-reports/:id` — update inspector assignment
- [x] Checklist management: `PATCH /qa-reports/:id/checklist`
- [x] Photo evidence: `POST /qa-reports/:id/photos` — upload to `qa-photos` bucket
- [x] Submission: `POST /qa-reports/:id/submit` — validates checklist + photos
- [x] Pass → Completed, Fail → rework with notifications
- [x] `GET /qa-reports/stats` — pass/fail rates, common defects

**VERIFY**: ✅ Module has controller, service, DTOs, and spec files

---

## Done When

- [x] Design proofing workflow with versioning works end-to-end
- [x] Production board with Kanban-style grouped data
- [x] QA checklist enforces all items + minimum photos before submission
- [x] QA pass auto-transitions order to Shipping
- [x] QA fail auto-reworks production job and notifies team
- [x] All modules brand-scoped and role-protected
- [x] TypeScript compiles clean
