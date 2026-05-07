# Phase 2: CRM Core — Leads, Customers, Inbox, Quotes, Orders, Invoices

> **Dependency**: Phase 1 complete
> **Agent**: `@backend-specialist`

---

## Goal

Build the full CRM pipeline: lead intake → quoting → ordering → invoicing. Every endpoint is brand-scoped and role-protected.

---

## Tasks

### Task 2.1: Customers Module

- [ ] `POST /customers` — create customer (SDR, Manager, Admin)
- [ ] `GET /customers` — list with search, pagination, filters (brand-scoped)
- [ ] `GET /customers/:id` — detail with order history and lifetime value
- [ ] `PATCH /customers/:id` — update (SDR owns, Manager can override)
- [ ] `POST /customers/:id/merge` — merge duplicate customers (Manager/Admin only)
- [ ] DTOs: CreateCustomerDto (name required, email, phone, company, country, notes), UpdateCustomerDto, CustomerFilterDto
- [ ] Auto-calculate `lifetime_value` from paid invoices

**VERIFY**: Create customer on Brand A, switch to Brand B — customer not visible

---

### Task 2.2: Leads Module (with Assignment Engine)

- [ ] `POST /leads` — create lead (auto-generates display_id via `generate_display_id`)
- [ ] `GET /leads` — list with filters: status, source, assigned SDR, priority, date range
- [ ] `GET /leads/:id` — detail with customer info, conversations, related quotes
- [ ] `PATCH /leads/:id` — update status, priority, notes
- [ ] `POST /leads/:id/assign` — assign to SDR (Manager/Admin only)
- [ ] `POST /leads/:id/reassign` — reassign with reason (Manager/Admin only)
- [ ] `POST /leads/:id/convert` — convert lead to quote (status → Won)
- [ ] SLA Timer: set `sla_deadline` = created_at + 5min on creation
- [ ] `GET /leads/overdue` — leads past SLA deadline with status still New
- [ ] SLA computed field: `critical` (past deadline), `warning` (<2 min left), `normal`
- [ ] Round-robin helper: `GET /leads/next-available-sdr` — SDR with fewest active leads

**VERIFY**: Create lead, verify display_id (TAP-LD-0001). Lead > 5min old shows overdue.

---

### Task 2.3: Conversations & Messages Module (Shared Inbox)

- [ ] `POST /conversations` — create thread (linked to lead/customer)
- [ ] `GET /conversations` — list with filters: channel, is_resolved, lead_id
- [ ] `GET /conversations/:id` — detail with all messages
- [ ] `PATCH /conversations/:id` — mark resolved/unresolve
- [ ] `POST /conversations/:id/messages` — send message (staff/system)
- [ ] `GET /conversations/:id/messages` — paginated message list
- [ ] `POST /conversations/:id/messages/:msgId/attachments` — upload to Supabase Storage
- [ ] Message types: staff (logged-in user), system (auto-generated), customer (future: via integration)
- [ ] Attachments: upload to `attachments` bucket, store signed URL in jsonb

**VERIFY**: Create conversation, send messages, upload attachment, retrieve full thread

---

### Task 2.4: Quotes Module (with Edge-Case Warnings)

- [ ] `POST /quotes` — create from lead (auto-generates display_id)
- [ ] `GET /quotes` — list with filters: status, customer, date range
- [ ] `GET /quotes/:id` — detail with items and lead info
- [ ] `PATCH /quotes/:id` — update items/prices (only if Draft)
- [ ] `POST /quotes/:id/send` — status → Sent
- [ ] `POST /quotes/:id/accept` — status → Accepted, auto-create Order
- [ ] `POST /quotes/:id/reject` — status → Rejected with reason
- [ ] `POST /quotes/:id/clone` — duplicate for repeat orders
- [ ] Edge-case validation (warnings, not blockers):
  - PVC + iron-on → warn "Heat risk"
  - Leather + merrow → error "Invalid combo"
  - Dimension > 12in → warn "Oversized"
  - Colors > 15 → warn "High thread count"
- [ ] `POST /quotes/calculate` — compute subtotal/tax/total from items
- [ ] On Accept: auto-create Order with status `Awaiting_Payment`

**VERIFY**: Create quote, verify warnings for PVC+iron-on, accept quote → order auto-created

---

### Task 2.5: Orders Module (Full Lifecycle)

- [ ] `POST /orders` — create (usually auto from quote acceptance)
- [ ] `GET /orders` — list with filters: status, customer, date range
- [ ] `GET /orders/:id` — detail with items, quote, customer, design tasks, production, shipments
- [ ] `PATCH /orders/:id` — update status, specs
- [ ] `POST /orders/:id/clone` — clone for repeat business
- [ ] `GET /orders/stats` — aggregated stats by status and revenue
- [ ] Status transitions enforced:
  - Awaiting_Payment → Design (on payment)
  - Design → Production (on artwork approved)
  - Production → QA (on production done)
  - QA → Shipping (pass) or QA → Production (fail/rework)
  - Shipping → Delivered
  - Any → Cancelled (Manager/Admin with reason)
- [ ] On status change: auto-create system message in conversation
- [ ] Order items sub-resource: GET, POST, PATCH, DELETE

**VERIFY**: Transition order through all statuses. Invalid transitions rejected.

---

### Task 2.6: Invoices Module

- [ ] `POST /invoices` — create from order (auto-generates display_id)
- [ ] `GET /invoices` — list with filters: status, customer, overdue
- [ ] `GET /invoices/:id` — detail with order and customer
- [ ] `PATCH /invoices/:id` — update status, due_date
- [ ] `POST /invoices/:id/mark-paid` — mark paid, set paid_at, transition order
- [ ] `GET /invoices/overdue` — past due_date, status != Paid
- [ ] Stripe integration slot: `stripe_invoice_id` field ready, `POST /invoices/:id/sync-stripe` placeholder
- [ ] On mark-paid: order status → Design

**VERIFY**: Create invoice, mark paid, order auto-transitions

---

## Done When

- [ ] Full CRUD for all 6 modules, brand-scoped and role-protected
- [ ] Lead SLA timer and assignment work
- [ ] Quote edge-case warnings fire correctly
- [ ] Quote acceptance → Order auto-creation
- [ ] Order status transitions enforced
- [ ] Invoice payment → order status auto-transition
- [ ] Display IDs auto-generate per brand
- [ ] TypeScript compiles clean
