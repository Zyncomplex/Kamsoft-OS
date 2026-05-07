# Phase 2: CRM Core — Leads, Customers, Inbox, Quotes, Orders, Invoices

> **Dependency**: Phase 1 complete ✅
> **Agent**: `@backend-specialist`
> **Status**: ✅ COMPLETE

---

## Goal

Build the full CRM pipeline: lead intake → quoting → ordering → invoicing. Every endpoint is brand-scoped and role-protected.

---

## Tasks

### Task 2.1: Customers Module

- [x] `POST /customers` — create customer (SDR, Manager, Admin)
- [x] `GET /customers` — list with search, pagination, filters (brand-scoped)
- [x] `GET /customers/:id` — detail with order history and lifetime value
- [x] `PATCH /customers/:id` — update (SDR owns, Manager can override)
- [x] `POST /customers/:id/merge` — merge duplicate customers (Manager/Admin only)
- [x] DTOs: CreateCustomerDto, UpdateCustomerDto, CustomerFilterDto
- [x] Auto-calculate `lifetime_value` from paid invoices

**VERIFY**: ✅ Module has controller, service, DTOs, and spec files

---

### Task 2.2: Leads Module (with Assignment Engine)

- [x] `POST /leads` — create lead (auto-generates display_id via `generate_display_id`)
- [x] `GET /leads` — list with filters: status, source, assigned SDR, priority, date range
- [x] `GET /leads/:id` — detail with customer info, conversations, related quotes
- [x] `PATCH /leads/:id` — update status, priority, notes
- [x] `POST /leads/:id/assign` — assign to SDR (Manager/Admin only)
- [x] `POST /leads/:id/reassign` — reassign with reason (Manager/Admin only)
- [x] `POST /leads/:id/convert` — convert lead to quote (status → Won)
- [x] SLA Timer: set `sla_deadline` = created_at + 5min on creation
- [x] `GET /leads/overdue` — leads past SLA deadline with status still New
- [x] SLA computed field: `critical`, `warning`, `normal`
- [x] Round-robin helper: `GET /leads/next-available-sdr`

**VERIFY**: ✅ Module has controller, service, DTOs, and spec files

---

### Task 2.3: Conversations & Messages Module (Shared Inbox)

- [x] `POST /conversations` — create thread (linked to lead/customer)
- [x] `GET /conversations` — list with filters: channel, is_resolved, lead_id
- [x] `GET /conversations/:id` — detail with all messages
- [x] `PATCH /conversations/:id` — mark resolved/unresolve
- [x] `POST /conversations/:id/messages` — send message (staff/system)
- [x] `GET /conversations/:id/messages` — paginated message list
- [x] `POST /conversations/:id/messages/:msgId/attachments` — upload to Supabase Storage
- [x] Message types: staff, system, customer
- [x] Attachments: upload to `attachments` bucket, store signed URL in jsonb

**VERIFY**: ✅ Module has controller, service, DTOs, and spec files

---

### Task 2.4: Quotes Module (with Edge-Case Warnings)

- [x] `POST /quotes` — create from lead (auto-generates display_id)
- [x] `GET /quotes` — list with filters: status, customer, date range
- [x] `GET /quotes/:id` — detail with items and lead info
- [x] `PATCH /quotes/:id` — update items/prices (only if Draft)
- [x] `POST /quotes/:id/send` — status → Sent
- [x] `POST /quotes/:id/accept` — status → Accepted, auto-create Order
- [x] `POST /quotes/:id/reject` — status → Rejected with reason
- [x] `POST /quotes/:id/clone` — duplicate for repeat orders
- [x] Edge-case validation (warnings, not blockers)
- [x] `POST /quotes/calculate` — compute subtotal/tax/total from items
- [x] On Accept: auto-create Order with status `Awaiting_Payment`

**VERIFY**: ✅ Module has controller, service, DTOs, and spec files

---

### Task 2.5: Orders Module (Full Lifecycle)

- [x] `POST /orders` — create (usually auto from quote acceptance)
- [x] `GET /orders` — list with filters: status, customer, date range
- [x] `GET /orders/:id` — detail with items, quote, customer, design tasks, production, shipments
- [x] `PATCH /orders/:id` — update status, specs
- [x] `POST /orders/:id/clone` — clone for repeat business
- [x] `GET /orders/stats` — aggregated stats by status and revenue
- [x] Status transitions enforced
- [x] On status change: auto-create system message in conversation
- [x] Order items sub-resource: GET, POST, PATCH, DELETE

**VERIFY**: ✅ Module has controller, service, DTOs, and spec files

---

### Task 2.6: Invoices Module

- [x] `POST /invoices` — create from order (auto-generates display_id)
- [x] `GET /invoices` — list with filters: status, customer, overdue
- [x] `GET /invoices/:id` — detail with order and customer
- [x] `PATCH /invoices/:id` — update status, due_date
- [x] `POST /invoices/:id/mark-paid` — mark paid, set paid_at, transition order
- [x] `GET /invoices/overdue` — past due_date, status != Paid
- [x] Stripe integration slot: `stripe_invoice_id` field ready
- [x] On mark-paid: order status → Design

**VERIFY**: ✅ Module has controller, service, DTOs, and spec files

---

## Done When

- [x] Full CRUD for all 6 modules, brand-scoped and role-protected
- [x] Lead SLA timer and assignment work
- [x] Quote edge-case warnings fire correctly
- [x] Quote acceptance → Order auto-creation
- [x] Order status transitions enforced
- [x] Invoice payment → order status auto-transition
- [x] Display IDs auto-generate per brand
- [x] TypeScript compiles clean
