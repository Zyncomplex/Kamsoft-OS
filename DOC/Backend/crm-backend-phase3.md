# Phase 3: Production, Design & QA

> **Dependency**: Phase 2 complete (Orders module working)
> **Agent**: `@backend-specialist`

---

## Goal

Build the production pipeline: design proofing with versioning, production job management, and QA inspection with photo-based checklists.

---

## Tasks

### Task 3.1: Design Tasks Module (Artwork Proofing)

- [ ] `POST /design-tasks` — create from order (when order status → Design)
- [ ] `GET /design-tasks` — list with filters: status, designer, order
- [ ] `GET /design-tasks/:id` — detail with all versions and feedback
- [ ] `PATCH /design-tasks/:id` — assign designer, update status
- [ ] Version management:
  - `POST /design-tasks/:id/versions` — upload new design version to `artwork` bucket
    - Stores: version number, file_url, thumbnail_url, notes, created_at
    - Auto-increments `current_version`
  - `GET /design-tasks/:id/versions` — list all versions
  - `GET /design-tasks/:id/versions/:version` — get specific version
- [ ] Approval workflow:
  - `POST /design-tasks/:id/submit` — status → Awaiting_Approval (sends to customer review)
  - `POST /design-tasks/:id/approve` — status → Approved, lock design, order status → Production
  - `POST /design-tasks/:id/request-revision` — status → Revision with customer_feedback text
    - Auto-creates system message in order's conversation
    - Increments revision counter
- [ ] On approve: update order's `artwork_files` with final version URL
- [ ] Role access: Designers can edit, SDR/Manager can view and submit for approval

**VERIFY**: Upload 3 versions, request revision on v2, approve v3. Order auto-transitions to Production.

---

### Task 3.2: Production Jobs Module

- [ ] `POST /production-jobs` — create from order (when order status → Production)
  - Auto-copies specs from order, attaches final design file
  - Auto-generates display_id (e.g. TAP-PJ-0001)
- [ ] `GET /production-jobs` — list with filters: status, assigned_to, due_date, order
- [ ] `GET /production-jobs/:id` — detail with order info, QA reports
- [ ] `PATCH /production-jobs/:id` — update status, assigned_to, due_date
- [ ] Status transitions:
  - Queued → In_Production (production started)
  - In_Production → Finishing (main work done, finishing touches)
  - Finishing → Ready (ready for QA shipment)
  - Ready → Shipped_To_QA (shipped to Karachi office)
  - Shipped_To_QA → Completed (QA passed)
  - Any → Queued (on QA failure — rework cycle)
- [ ] Board view endpoint:
  - `GET /production-jobs/board` — returns jobs grouped by status (for Kanban view)
- [ ] On Shipped_To_QA: auto-create QA Report with status Pending
- [ ] On rework (QA fail): reset to Queued, log rework count

**VERIFY**: Create production job, transition through statuses. On Shipped_To_QA, QA report auto-created.

---

### Task 3.3: QA Reports Module (Inspection Checklists)

- [ ] `POST /qa-reports` — create (usually auto from production job)
- [ ] `GET /qa-reports` — list with filters: status, inspector, production_job
- [ ] `GET /qa-reports/:id` — detail with checklist, photos, production job info
- [ ] `PATCH /qa-reports/:id` — update inspector assignment
- [ ] Checklist management:
  - `PATCH /qa-reports/:id/checklist` — update checklist items
  - Default checklist template per patch type:
    ```json
    [
      { "item": "Dimensions match spec", "passed": null, "notes": "" },
      { "item": "Color accuracy", "passed": null, "notes": "" },
      { "item": "Stitch density", "passed": null, "notes": "" },
      { "item": "Backing type correct", "passed": null, "notes": "" },
      { "item": "Border/edge quality", "passed": null, "notes": "" },
      { "item": "No loose threads", "passed": null, "notes": "" },
      { "item": "Overall finish quality", "passed": null, "notes": "" }
    ]
    ```
  - All items must be marked pass/fail before submission
- [ ] Photo evidence:
  - `POST /qa-reports/:id/photos` — upload QA photos to `qa-photos` bucket
  - Minimum 2 photos required (front + back) before submission
  - Store: [{url, caption, type: "front"|"back"|"detail"|"defect"}]
- [ ] Submission:
  - `POST /qa-reports/:id/submit` — validates all checklist items filled + min photos
  - If all pass → status = Passed, production job → Completed, order status → Shipping
  - If any fail → status = Failed:
    - Production job → Queued (rework)
    - Auto-notify assigned SDR and Manager via system message
    - Log defect type for vendor stats (future)
- [ ] `GET /qa-reports/stats` — pass/fail rates, common defects, inspector throughput

**VERIFY**: Complete checklist, upload photos, submit. Pass → order goes to Shipping. Fail → production rework.

---

## Done When

- [ ] Design proofing workflow with versioning works end-to-end
- [ ] Production board with Kanban-style grouped data
- [ ] QA checklist enforces all items + minimum photos before submission
- [ ] QA pass auto-transitions order to Shipping
- [ ] QA fail auto-reworks production job and notifies team
- [ ] All modules brand-scoped and role-protected
- [ ] TypeScript compiles clean
