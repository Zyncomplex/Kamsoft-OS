# Phase 4: Fulfillment, Integrations, Reports & Activity Log

> **Dependency**: Phase 3 complete (QA module working)
> **Agent**: `@backend-specialist`

---

## Goal

Build shipping/fulfillment, the plug-and-play integration adapter system, role-based dashboard endpoints, and the system-wide activity log.

---

## Tasks

### Task 4.1: Shipments Module

- [ ] `POST /shipments` — create shipment for order (when order status → Shipping)
  - Fields: carrier, tracking_number (manual or from integration)
- [ ] `GET /shipments` — list with filters: status, carrier, order, date range
- [ ] `GET /shipments/:id` — detail with status history and order info
- [ ] `PATCH /shipments/:id` — update status, tracking_number
- [ ] Status history tracking:
  - Every status change appends to `status_history` jsonb array
  - `{ status, timestamp, location (optional) }`
- [ ] Integration slot for carriers:
  - `POST /shipments/:id/create-label` — calls carrier adapter if enabled, otherwise returns "adapter not configured"
  - `POST /shipments/:id/refresh-tracking` — pulls latest status from carrier API
  - When no adapter: manual entry of tracking number and status updates
- [ ] On Delivered: order status → Delivered, auto-log activity
- [ ] `GET /shipments/dashboard` — summary stats: in-transit count, delivered this week, exceptions

**VERIFY**: Create shipment, update status manually, verify status_history accumulates. Order transitions on delivery.

---

### Task 4.2: Integration Adapter System (Plug-and-Play)

- [ ] Create `IntegrationsModule`:
  - `GET /integrations` — list all integration types with enabled/disabled status for active brand
  - `GET /integrations/:type` — get config for specific integration (e.g. stripe, fedex)
  - `POST /integrations/:type/configure` — Admin only — save API keys/config (encrypted in jsonb)
  - `POST /integrations/:type/test` — test connection with saved config
  - `POST /integrations/:type/enable` — enable integration for active brand
  - `POST /integrations/:type/disable` — disable integration
- [ ] Create `BaseAdapter` abstract class:
  ```
  abstract class BaseAdapter {
    abstract type: string
    abstract name: string
    abstract connect(config: Record<string, any>): Promise<void>
    abstract disconnect(): Promise<void>
    abstract testConnection(): Promise<{ ok: boolean; message: string }>
  }
  ```
- [ ] Create adapter stubs (each extends BaseAdapter):
  - **StripeAdapter**: `createInvoice()`, `capturePayment()`, `getPaymentStatus()`, `createQuote()`
  - **FedExAdapter**: `createLabel()`, `getTracking()`, `getRates()`
  - **DHLAdapter**: `createLabel()`, `getTracking()`, `getRates()`
  - **UPSAdapter**: `createLabel()`, `getTracking()`, `getRates()`
  - **RingCentralAdapter**: `getCallLog()`, `makeCall()`, `getRecording()`
  - **GmailAdapter**: `fetchInbox()`, `sendEmail()`, `watchInbox()`
  - **TawkToAdapter**: `getChatTranscripts()`, `sendMessage()`
- [ ] Each stub method returns: `{ success: false, message: "Not implemented. Plug in [AdapterName] API key to enable." }`
- [ ] `IntegrationAdapterFactory` service:
  - Given a type string, returns the correct adapter instance
  - Loads config from `integrations` table for the active brand
  - Injects config into adapter on connect
- [ ] Per-brand isolation: each brand has its own integration configs (separate Stripe accounts, etc.)

**VERIFY**: 
  - Configure a mock integration → test returns success
  - Call stub method → returns "not implemented" message
  - Switch brands → integration config is different

---

### Task 4.3: Reports & Dashboard Data Endpoints

- [ ] `GET /reports/sales` — Sales KPIs (Manager, GM, CEO):
  - New leads count (by source, date range)
  - Average lead response time
  - Lead-to-quote conversion rate
  - Quote-to-order conversion rate
  - Revenue (total, by period, by SDR)
  - Pending approvals count
- [ ] `GET /reports/sales/leaderboard` — SDR rankings:
  - Revenue closed, leads converted, avg response time
  - Per SDR: Hammad, Faiq, Sufyan, Wahid
- [ ] `GET /reports/production` — Production KPIs:
  - Jobs by status (for board view)
  - On-time completion rate
  - Average production cycle time
  - Rework count and rate
- [ ] `GET /reports/qa` — QA KPIs:
  - Inspections count, pass/fail rates
  - Common defect types
  - Inspector throughput
  - Return rate
- [ ] `GET /reports/shipping` — Shipping KPIs:
  - In-transit count
  - Delivered this period
  - Average delivery time
  - Exception count
- [ ] `GET /reports/revenue` — Financial KPIs (GM, CEO):
  - Revenue by brand, by period
  - Outstanding invoices
  - Refund count and amount
  - MoM growth percentage
- [ ] All report endpoints accept: `?period=7d|30d|90d|1y` and `?brand_id=` (CEO/GM can view cross-brand)
- [ ] CEO/GM special: `GET /reports/overview` — top-line metrics across ALL brands

**VERIFY**: Call each report endpoint, verify data matches actual records. CEO sees all brands, SDR sees only own.

---

### Task 4.4: Activity Log Module

- [ ] `GET /activity-log` — paginated list of all actions for active brand
  - Filters: user, entity_type, action, date range
  - Sorted by created_at DESC
- [ ] `ActivityLogInterceptor` (global):
  - Auto-logs all POST, PATCH, DELETE requests
  - Captures: user_id, brand_id, action, entity_type, entity_id, details
  - Runs AFTER the request succeeds (not on failures)
  - Action naming: `{method}_{entity}` → "created_lead", "updated_order", "approved_design"
- [ ] System events auto-logged:
  - User login/logout
  - Brand switch
  - Status transitions (order, production, QA)
  - Integration enable/disable
- [ ] `GET /activity-log/user/:userId` — actions by specific user
- [ ] `GET /activity-log/entity/:type/:id` — all actions on a specific entity

**VERIFY**: Perform various CRUD operations, check activity log captures them all with correct metadata.

---

### Task 4.5: Webhook Endpoints (Future Integration Receivers)

- [ ] `POST /webhooks/stripe` — receive Stripe payment events (placeholder)
- [ ] `POST /webhooks/shipping` — receive carrier tracking updates (placeholder)
- [ ] `POST /webhooks/email` — receive inbound email notifications (placeholder)
- [ ] `POST /webhooks/chat` — receive chat transcript events (placeholder)
- [ ] Each webhook:
  - Verifies signature/authenticity (when adapter is configured)
  - Routes event to appropriate service
  - Returns 200 immediately, processes async
  - Currently returns `{ received: true, processed: false, reason: "adapter not configured" }`

**VERIFY**: POST to webhook endpoint → returns 200 with placeholder response

---

## Done When

- [ ] Shipping module with manual + integration-ready tracking
- [ ] All 7 integration adapters stubbed with plug-and-play architecture
- [ ] Admin can configure, test, enable/disable integrations per brand
- [ ] Dashboard endpoints return correct KPIs for all roles
- [ ] CEO/GM can view cross-brand reports
- [ ] Activity log captures all mutations automatically
- [ ] Webhook endpoints ready for future integration
- [ ] TypeScript compiles clean
- [ ] All Phase X verification checks pass

---

## Phase X: Final Verification

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] All endpoints brand-scoped (tested with 2 brands)
- [ ] RBAC enforced (tested with SDR, Manager, Admin, CEO roles)
- [ ] No hardcoded secrets
- [ ] Activity log captures all mutations
- [ ] Integration stubs return correct placeholder messages
- [ ] Frontend can be connected (CORS configured, API contract documented)
