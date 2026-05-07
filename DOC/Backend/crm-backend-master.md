# CRM Backend — Master Plan

> **Project**: Kamsoft-OS Revenue & Fulfillment Operations Platform
> **Type**: BACKEND (NestJS + Supabase)
> **Created**: 2026-05-07

---

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | **Supabase** (PostgreSQL) | Built-in Auth, RLS, Realtime, Edge Functions, MCP server |
| Backend Framework | **NestJS** (TypeScript) | Enterprise-grade, DI, modular, great for large CRM |
| Auth | **Email/Password only** | Admin-only account creation, no public signup |
| Multi-Tenant | **Amazon Seller Central model** | Brand switcher, strict data isolation per brand |
| API Style | **REST** | Broad compatibility, clear endpoints |
| Integrations | **Plug-and-play adapter pattern** | Pre-built slots for Stripe, FedEx, RingCentral, etc. |
| Vendor Portal | **Deferred** | Not in current scope |

---

## Success Criteria

- [ ] NestJS server runs and connects to Supabase
- [ ] Admin can create users with roles (CEO, GM, Manager, SDR, Designer, QA, Production, Admin)
- [ ] Brand switcher enforces strict data isolation (RLS)
- [ ] Full CRUD for Leads, Customers, Quotes, Orders, Invoices
- [ ] Shared Inbox with conversations/messages
- [ ] Production Jobs + QA Checklist modules
- [ ] Design/Artwork proofing with versioning
- [ ] Shipping module with tracking
- [ ] Integration adapter slots ready for plug-and-play
- [ ] Dashboard data endpoints for all role-based KPIs
- [ ] Activity log tracks all actions
- [ ] Frontend can connect and replace mock data

---

## Architecture

```
[React Frontend (existing)]
        |
        v  REST API (HTTPS)
[NestJS Backend Server]
   |-- AuthGuard (Supabase JWT verification)
   |-- BrandContext Middleware (injects active brand_id)
   |-- RolesGuard (RBAC enforcement)
   |-- Modules (leads, orders, quotes, shipments, production-jobs, design-tasks, qa-reports)
   |-- Integration Adapters (plug-and-play slots)
   |
   v  @supabase/supabase-js (service-role key)
[Supabase]
   |-- PostgreSQL (18 tables + RLS policies)
   |-- Auth (email/password, admin-only creation)
   |-- Storage (artwork files, QA photos)
   +-- Realtime (live updates for dashboards)
```

---

## Database Schema (18 Tables)

### Core Tables

#### `brands`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text | "The American Patch" |
| code | text UNIQUE | "TAP", "EAGLEUK" |
| currency | text | "USD", "GBP" |
| domain | text | "theamericanpatch.com" |
| country | text | "US", "UK" |
| settings | jsonb | brand-specific config |
| created_at | timestamptz | |

#### `profiles` (extends auth.users)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK FK->auth.users | |
| full_name | text | |
| role | enum | CEO, GM, Manager, SDR, Designer, QA, Production, Admin |
| brand_ids | uuid[] | brands this user can access |
| active_brand_id | uuid FK->brands | currently selected brand |
| avatar_url | text | |
| is_active | boolean | soft disable |
| created_at | timestamptz | |

### CRM Tables

#### `customers`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| brand_id | uuid FK->brands | **tenant key** |
| name | text | |
| email | text | |
| phone | text | |
| company | text | |
| country | text | |
| notes | text | |
| lifetime_value | numeric | calculated |
| created_at | timestamptz | |

#### `leads`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| brand_id | uuid FK->brands | **tenant key** |
| display_id | text | "TAP-LD-0001" (auto-generated) |
| customer_id | uuid FK->customers | |
| source | text | Web, Instagram, RingCentral, Email, Meta |
| channel | text | form, call, chat, email |
| assigned_sdr_id | uuid FK->profiles | |
| status | enum | New, Contacted, Qualified, Invoice_Sent, Won, Lost |
| priority | enum | Low, Medium, High, Urgent |
| sla_deadline | timestamptz | auto-set on creation |
| notes | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `conversations`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| brand_id | uuid FK->brands | **tenant key** |
| lead_id | uuid FK->leads | |
| customer_id | uuid FK->customers | |
| channel | enum | email, chat, phone, internal |
| subject | text | |
| is_resolved | boolean | |
| created_at | timestamptz | |

#### `messages`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| conversation_id | uuid FK->conversations | |
| sender_type | enum | staff, customer, system |
| sender_id | uuid | FK->profiles if staff |
| body | text | |
| attachments | jsonb[] | [{url, name, size, type}] |
| created_at | timestamptz | |

### Order and Finance Tables

#### `quotes`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| brand_id | uuid FK->brands | **tenant key** |
| display_id | text | "TAP-QT-0001" |
| lead_id | uuid FK->leads | |
| customer_id | uuid FK->customers | |
| items | jsonb[] | [{patch_type, size, backing, colors, effects, qty, unit_price}] |
| subtotal | numeric | |
| tax | numeric | |
| total | numeric | |
| currency | text | inherited from brand |
| status | enum | Draft, Sent, Accepted, Rejected, Expired |
| valid_until | timestamptz | |
| pdf_url | text | |
| notes | text | |
| created_at | timestamptz | |

#### `orders`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| brand_id | uuid FK->brands | **tenant key** |
| display_id | text | "TAP-ORD-0001" |
| quote_id | uuid FK->quotes | |
| customer_id | uuid FK->customers | |
| status | enum | Awaiting_Payment, Design, Production, QA, Shipping, Delivered, Cancelled |
| total | numeric | |
| currency | text | |
| specs | jsonb | full patch specifications |
| artwork_files | jsonb[] | [{url, name, version}] |
| assigned_designer_id | uuid FK->profiles | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `order_items`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| order_id | uuid FK->orders | |
| patch_type | text | embroidered, PVC, chenille, woven, leather |
| size | text | dimensions + shape |
| backing | text | iron-on, velcro, pin, sew-on |
| colors | integer | thread color count |
| effects | text[] | puff, metallic, 3D, glow |
| quantity | integer | |
| unit_price | numeric | |
| notes | text | |

#### `invoices`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| brand_id | uuid FK->brands | **tenant key** |
| display_id | text | "TAP-INV-0001" |
| order_id | uuid FK->orders | |
| amount | numeric | |
| currency | text | |
| status | enum | Draft, Sent, Paid, Overdue, Cancelled |
| stripe_invoice_id | text | nullable, for Stripe integration |
| paid_at | timestamptz | |
| due_date | timestamptz | |
| created_at | timestamptz | |

### Production Tables

#### `production_jobs`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| brand_id | uuid FK->brands | **tenant key** |
| display_id | text | "TAP-PJ-0001" |
| order_id | uuid FK->orders | |
| assigned_to_id | uuid FK->profiles | production manager |
| status | enum | Queued, In_Production, Finishing, Ready, Shipped_To_QA, Completed |
| design_file_url | text | |
| specs | jsonb | production-relevant specs only |
| quantity | integer | |
| due_date | timestamptz | |
| completed_at | timestamptz | |
| created_at | timestamptz | |

#### `design_tasks`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| brand_id | uuid FK->brands | **tenant key** |
| order_id | uuid FK->orders | |
| designer_id | uuid FK->profiles | |
| status | enum | Pending, In_Progress, Awaiting_Approval, Revision, Approved |
| versions | jsonb[] | [{version, file_url, thumbnail_url, created_at, notes}] |
| current_version | integer | |
| customer_feedback | text | |
| created_at | timestamptz | |

#### `qa_reports`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| brand_id | uuid FK->brands | **tenant key** |
| production_job_id | uuid FK->production_jobs | |
| inspector_id | uuid FK->profiles | |
| status | enum | Pending, In_Progress, Passed, Failed |
| checklist | jsonb | [{item, passed, notes}] |
| photos | jsonb[] | [{url, caption, type}] |
| overall_notes | text | |
| completed_at | timestamptz | |
| created_at | timestamptz | |

### Fulfillment Tables

#### `shipments`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| brand_id | uuid FK->brands | **tenant key** |
| order_id | uuid FK->orders | |
| carrier | text | FedEx, DHL, UPS |
| tracking_number | text | |
| status | enum | Label_Created, Picked_Up, In_Transit, Delivered, Exception |
| estimated_delivery | timestamptz | |
| status_history | jsonb[] | [{status, timestamp, location}] |
| created_at | timestamptz | |

### System Tables

#### `activity_log`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| brand_id | uuid FK->brands | **tenant key** |
| user_id | uuid FK->profiles | |
| action | text | "created_lead", "approved_design", etc. |
| entity_type | text | "lead", "order", "qa_report" |
| entity_id | uuid | |
| details | jsonb | action-specific data |
| created_at | timestamptz | |

#### `integrations`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| brand_id | uuid FK->brands | per-brand integration config |
| type | enum | stripe, fedex, dhl, ups, ringcentral, gmail, tawkto |
| display_name | text | |
| config | jsonb | encrypted API keys/settings |
| is_enabled | boolean | toggle on/off |
| last_synced_at | timestamptz | |
| created_at | timestamptz | |

#### `id_counters`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| brand_id | uuid FK->brands | |
| entity_type | text | "lead", "order", "quote", etc. |
| last_number | integer | auto-increment per brand per entity |

> **RLS Rule**: Every table with `brand_id` gets a policy: `brand_id = (SELECT active_brand_id FROM profiles WHERE id = auth.uid())`

#### `vendors`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| brand_id | uuid FK->brands | **tenant key** |
| name | text | |
| contact_name | text | |
| email | text | |
| phone | text | |
| location | text | |
| capabilities | text[] | e.g. chenille, PVC, woven |
| rating | numeric | overall rating |
| on_time_rate | numeric | % on-time delivery |
| defect_rate | numeric | % defects |
| total_jobs | integer | completed job count |
| notes | text | |
| is_active | boolean | soft disable |
| created_at | timestamptz | |

---

## NestJS Server Structure

```
server/
  src/
    main.ts                          # Bootstrap, CORS, validation pipe
    app.module.ts                    # Root module
    common/
      guards/
        supabase-auth.guard.ts       # Verify Supabase JWT
        roles.guard.ts               # RBAC enforcement
        brand-context.guard.ts       # Ensure brand_id is set
      decorators/
        roles.decorator.ts           # @Roles('Admin', 'CEO')
        current-user.decorator.ts
        current-brand.decorator.ts
      interceptors/
        brand-filter.interceptor.ts  # Auto-inject brand_id into queries
        activity-log.interceptor.ts  # Auto-log mutations
      filters/
        http-exception.filter.ts
      pipes/
        validation.pipe.ts
      dto/
        pagination.dto.ts
    config/
      supabase.config.ts
      app.config.ts
    supabase/
      supabase.module.ts
      supabase.service.ts            # Singleton Supabase client
    modules/
      auth/                          # Login, admin user creation
      users/                         # User/profile management
      brands/                        # Brand CRUD + switcher
      customers/                     # Customer CRUD
      leads/                         # Lead CRUD + assignment + SLA
      conversations/                 # Shared inbox threads
      quotes/                        # Quote builder + PDF
      orders/                        # Order lifecycle
      invoices/                      # Invoice CRUD
      production-jobs/               # Production jobs
      design-tasks/                  # Artwork proofing + versions
      qa-reports/                    # QA checklists + photos
      shipments/                     # Shipment tracking
      vendors/                       # Vendor management + rankings
      reports/                       # Dashboard data endpoints
      activity-log/                  # Audit trail
      integrations/                  # Plug-and-play adapter system
        integrations.module.ts
        integrations.controller.ts
        integrations.service.ts
        adapters/
          base.adapter.ts            # Abstract adapter interface
          stripe.adapter.ts          # Payment slot
          fedex.adapter.ts           # Shipping slot
          dhl.adapter.ts             # Shipping slot
          ups.adapter.ts             # Shipping slot
          ringcentral.adapter.ts     # Calls slot
          gmail.adapter.ts           # Email slot
          tawkto.adapter.ts          # Chat slot
    types/
      index.ts                       # Shared TypeScript types/enums
  test/
  .env
  nest-cli.json
  package.json
  tsconfig.json
  tsconfig.build.json
```

---

## Integration Adapter Pattern (Plug-and-Play)

Every integration implements a base interface. The `integrations` table stores per-brand config. Admin enables an integration, plugs in API keys, and the adapter is live. No code changes needed to swap carriers or payment providers.

```
IntegrationAdapter (abstract)
  |-- type: string        (e.g. 'stripe', 'fedex')
  |-- name: string        (display name)
  |-- connect(config)     (initialize with API keys)
  |-- disconnect()        (cleanup)
  |-- testConnection()    (verify API keys work)
  +-- [action methods]    (e.g. createInvoice, createShipment)
```

---

## Phase Index

| Phase | File | Focus | Tasks |
|-------|------|-------|-------|
| **1** | crm-backend-phase1.md | Foundation and Auth | ✅ Supabase setup, NestJS scaffold, auth, multi-tenant, brands |
| **2** | crm-backend-phase2.md | CRM Core | ✅ Leads, Customers, Shared Inbox, Quotes, Orders, Invoices |
| **3** | crm-backend-phase3.md | Production and Design and QA | ✅ Production Jobs, Design Proofing, QA Checklists |
| **4** | crm-backend-phase4.md | Fulfillment and Integrations | ✅ Shipping, Vendors, Integration Adapters, Reports, Activity Log |

---

## Agent Assignments

| Agent | Responsibility |
|-------|---------------|
| `@backend-specialist` | NestJS modules, controllers, services, guards, middleware |
| `@database-architect` | Supabase schema, RLS policies, migrations |
| `@security-auditor` | Auth flow, RBAC, input validation, secrets management |
| `@test-engineer` | API tests, integration tests |

---

## Phase X: Verification (After All Phases)

- [x] `npm run build` passes (NestJS)
- [x] `npm run lint` passes
- [x] All endpoints return correct data for correct brand
- [x] Brand switching returns isolated data (no cross-brand leaks)
- [x] Admin can create users; non-admins cannot
- [x] RLS policies tested (direct DB access blocked for wrong brand)
- [x] Integration adapters accept config and report connection status
- [x] Activity log captures all mutations
- [ ] Frontend can replace mock data with API calls — ⚠️ **IN PROGRESS** (hooks built, pages partially wired)
