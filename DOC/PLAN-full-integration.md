# PLAN: Full Integration — Backend Fixes → API Layer → Frontend Wiring → Deploy

> **Project**: Kamsoft-OS CRM  
> **Created**: 2026-05-07  
> **Architecture**: Hybrid (Supabase Auth/Realtime + NestJS Business Logic)  
> **Deploy**: Frontend → Netlify/Vercel | Backend → Render/Railway  
> **Total Estimate**: 5-8 weeks

---

## Architecture Decision

```
┌─────────────────────────────────────────────────────────┐
│  React Frontend (Vite + Tailwind)                       │
│                                                         │
│  ┌──────────────┐        ┌──────────────────────┐       │
│  │ Supabase JS  │        │    API Client         │      │
│  │ (Direct)     │        │    (NestJS REST)      │      │
│  └──────┬───────┘        └──────────┬───────────┘       │
│         │                           │                    │
│    Auth + Realtime           Business Logic              │
│    (login, sessions,         (CRUD, workflows,           │
│     live subscriptions)       reports, adapters)         │
└─────────┼───────────────────────────┼────────────────────┘
          │                           │
          ▼                           ▼
  ┌───────────────┐         ┌─────────────────┐
  │   Supabase    │◄────────│   NestJS API    │
  │   (Postgres   │         │   (Port 3001)   │
  │    + Auth     │         │   Uses service  │
  │    + Storage  │         │   role key      │
  │    + Realtime)│         └─────────────────┘
  └───────────────┘
```

**Why Hybrid?**
- Supabase handles auth natively (JWT, sessions, password reset)
- Supabase Realtime gives live dashboard updates for free
- NestJS handles business logic (quote calculations, status transitions, SLA enforcement)
- NestJS uses the `service_role` key to bypass RLS when needed

---

## Phase A: Backend Fixes & Hardening (1-2 days)

> **Goal**: Fix all 12 audit issues + add Vendors module before wiring frontend.

---

### A1: Delete Empty Duplicate Directories
**Priority**: 🔴 Critical | **Agent**: backend-specialist

Delete these empty scaffolding leftovers:
- `server/src/modules/design/` (real code → `design-tasks/`)
- `server/src/modules/production/` (real code → `production-jobs/`)
- `server/src/modules/qa/` (real code → `qa-reports/`)
- `server/src/modules/shipping/` (real code → `shipments/`)

**Verify**: `ls server/src/modules/` — no empty directories

---

### A2: Fix BrandContextGuard — Fetch Profile from DB
**Priority**: 🔴 Critical | **File**: `server/src/common/guards/brand-context.guard.ts`

**Current Problem**: Reads `active_brand_id` from JWT metadata which may not be present.

**Fix**:
- Inject `SupabaseService` into the guard
- After JWT decode, fetch `profiles` row using `sub` claim (user ID)
- Read `active_brand_id` from DB profile row
- Cache full profile on `request.user` (role, brand_ids, active_brand_id)
- Return 400 if no active brand set
- Return 403 if `is_active === false`

**Verify**: Login → switch brand → subsequent requests use correct brand

---

### A3: Fix RolesGuard — Return Descriptive 403
**Priority**: 🟡 Medium | **File**: `server/src/common/guards/roles.guard.ts`

**Current**: Returns `false` silently (generic 403).  
**Fix**: Throw `ForbiddenException('Insufficient role. Required: [Admin]. Your role: [SDR]')`

**Verify**: SDR accessing admin endpoint → gets descriptive 403 message

---

### A4: Implement getSalesLeaderboard
**Priority**: 🔴 Critical | **File**: `server/src/modules/reports/reports.service.ts`

**Current**: Returns `{ leaderboard: [] }` (hardcoded empty array).

**Implementation**:
```sql
SELECT p.full_name, p.id,
  COUNT(DISTINCT l.id) as leads_count,
  COUNT(DISTINCT CASE WHEN l.status = 'Won' THEN l.id END) as won_count,
  COALESCE(SUM(o.total), 0) as revenue
FROM profiles p
LEFT JOIN leads l ON l.assigned_sdr_id = p.id AND l.brand_id = $brandId
LEFT JOIN orders o ON o.customer_id = l.customer_id AND o.brand_id = $brandId
WHERE p.role = 'SDR' AND $brandId = ANY(p.brand_ids)
GROUP BY p.id, p.full_name
ORDER BY revenue DESC
```

**Verify**: Returns ranked SDR data matching DB records

---

### A5: Complete convertToQuote in LeadsService
**Priority**: 🟡 Medium | **File**: `server/src/modules/leads/leads.service.ts`

**Current**: Only sets status to Won but doesn't create a Quote.

**Fix**:
- Create a Draft quote linked to lead_id and customer_id
- Set lead status to Won
- Return both updated lead and new quote

**Verify**: Convert lead → quote auto-created with correct linkage

---

### A6: Fix Hardcoded Tax & Currency in Quotes
**Priority**: 🟡 Medium | **File**: `server/src/modules/quotes/quotes.service.ts`

- In `calculateTotals()`: accept `brandId` parameter
- Fetch brand row from DB, read `settings.tax_rate` (default 0.1) and `currency`
- Use brand currency instead of hardcoded `'USD'`

**Verify**: Create quote on UK brand → shows GBP currency

---

### A7: Add Global API Prefix
**Priority**: 🟡 Medium | **File**: `server/src/main.ts`

- Add `app.setGlobalPrefix('api')` after bootstrap
- Update ActivityLogInterceptor URL parsing to handle `/api/` prefix

**Verify**: All endpoints now under `/api/*`

---

### A8: Fix Supabase Security Issues (SQL Migration)
**Priority**: 🔴 Critical | **Agent**: security-auditor

**Migration tasks**:
1. Set `search_path = ''` on all 7 public functions
2. Revoke `SELECT` from `anon` on all public tables (this is an admin-only app)
3. Enable leaked password protection in Supabase Auth settings
4. Narrow `avatars` bucket SELECT policy to authenticated users only

```sql
-- Fix function search paths
ALTER FUNCTION current_user_brand_id() SET search_path = '';
ALTER FUNCTION generate_display_id(text, uuid) SET search_path = '';
ALTER FUNCTION trigger_set_display_id() SET search_path = '';
ALTER FUNCTION get_next_available_sdr(uuid) SET search_path = '';
ALTER FUNCTION merge_customers(uuid, uuid) SET search_path = '';
ALTER FUNCTION update_updated_at() SET search_path = '';
ALTER FUNCTION mark_overdue_tasks() SET search_path = '';

-- Revoke anon access
REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM anon;
```

**Verify**: Run `get_advisors` → no critical issues

---

### A9: Add Vendors Module + DB Table
**Priority**: 🟡 Medium | **Agent**: backend-specialist + database-architect

**Database Migration**:
```sql
CREATE TABLE public.vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES brands(id),
  name text NOT NULL,
  contact_name text,
  email text,
  phone text,
  location text,
  capabilities text[] DEFAULT '{}',
  rating numeric DEFAULT 0,
  on_time_rate numeric DEFAULT 100,
  defect_rate numeric DEFAULT 0,
  total_jobs integer DEFAULT 0,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
-- Add standard brand_isolation policies (SELECT/INSERT/UPDATE/DELETE)

-- Optional: link production_jobs to vendors
ALTER TABLE production_jobs ADD COLUMN vendor_id uuid REFERENCES vendors(id);
```

**NestJS Module** (`server/src/modules/vendors/`):
- Controller: CRUD + `GET /vendors/rankings`
- Service: brand-scoped queries
- DTOs: create, update, filter
- Register in `app.module.ts`

**Verify**: CRUD works, brand-scoped, RLS enforced

---

### A10: Fix ReportsService.getOverviewMetrics Brand Scoping
**Priority**: 🟡 Medium | **File**: `server/src/modules/reports/reports.service.ts`

- Accept `brandId` and `isSuperAdmin` from controller
- If not super admin: scope queries to requesting brand
- Add invoice stats (outstanding amount, overdue count)

**Verify**: CEO sees all brands, Manager sees only their brand

---

### Phase A Completion Criteria

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] No empty module directories remain
- [ ] Guards return proper error messages
- [ ] Leaderboard returns real SDR data
- [ ] Lead conversion auto-creates quote
- [ ] Tax/currency pulled from brand settings
- [ ] All endpoints under `/api/` prefix
- [ ] Security advisors clean (no critical issues)
- [ ] Vendors module fully operational
- [ ] 18 tables in Supabase (17 original + vendors)

---

## Phase B: API Client Layer (1 week)

> **Goal**: Build shared frontend infrastructure before wiring pages.

---

### B1: Install Supabase Client + Environment Config
**Priority**: 🔴 Critical

**Install**: `npm install @supabase/supabase-js`

**Create** `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Create** `.env` (frontend root):
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=http://localhost:3001/api
```

**Verify**: `supabase.auth.getSession()` works in browser console

---

### B2: Create Auth Context & Provider
**Priority**: 🔴 Critical

**Create** `src/contexts/AuthContext.tsx`:
- `AuthProvider` wraps the entire app
- State: `user | null`, `session | null`, `profile | null`, `loading: boolean`
- On mount: call `supabase.auth.getSession()` + subscribe to `onAuthStateChange`
- After successful auth: fetch profile from NestJS `GET /api/auth/me`
- Expose methods: `login(email, pass)`, `logout()`, `switchBrand(brandId)`

**Create** `src/hooks/useAuth.ts`:
```typescript
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return context;
}
```

**Refactor**:
- `App.tsx`: Replace `localStorage` auth check with `useAuth().session`
- `Login.tsx`: Replace `onLogin()` callback with real `supabase.auth.signInWithPassword()`

**Verify**: Real login → session persists on refresh → logout clears everything

---

### B3: Create API Client (NestJS Wrapper)
**Priority**: 🔴 Critical

**Create** `src/lib/api.ts`:
```typescript
class ApiClient {
  private baseUrl = import.meta.env.VITE_API_URL;

  private async getHeaders(): Promise<HeadersInit> {
    const { data } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.session?.access_token}`,
    };
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<T> { ... }
  async post<T>(path: string, body?: any): Promise<T> { ... }
  async patch<T>(path: string, body?: any): Promise<T> { ... }
  async delete<T>(path: string): Promise<T> { ... }
}

export const api = new ApiClient();
```

**Create** `src/lib/api-types.ts`:
- TypeScript interfaces matching all NestJS DTOs
- Paginated response type: `{ data: T[], meta: { total, page, limit, totalPages } }`

**Verify**: `api.get('/leads')` returns real data with proper auth

---

### B4: Create Brand Context
**Priority**: 🔴 Critical

**Create** `src/contexts/BrandContext.tsx`:
- State: `brands[]`, `activeBrand`, `loading`
- On auth ready: fetch brands via `api.get('/brands')`
- Method: `switchBrand(id)` → calls NestJS endpoint + updates state
- Persist last brand ID in localStorage for faster initial load

**Refactor**:
- `AppShell.tsx`: brand dropdown uses real data from `useBrand()`
- Currency displays use `activeBrand.currency`

**Verify**: Brand dropdown shows 5 real brands from DB

---

### B5: Create Data Hooks (13 modules)
**Priority**: 🟡 Medium

Create one hook per module in `src/hooks/`:

| Hook | Backend Endpoints Used |
|------|----------------------|
| `useLeads.ts` | GET/POST/PATCH `/leads`, `/leads/overdue` |
| `useCustomers.ts` | GET/POST/PATCH `/customers`, `/customers/merge` |
| `useConversations.ts` | GET `/conversations`, POST `/conversations/:id/messages` |
| `useQuotes.ts` | GET/POST/PATCH `/quotes`, `/quotes/:id/accept`, `/quotes/:id/clone` |
| `useOrders.ts` | GET/POST/PATCH `/orders`, `/orders/:id/clone`, `/orders/stats` |
| `useInvoices.ts` | GET/POST/PATCH `/invoices`, `/invoices/:id/mark-paid` |
| `useDesignTasks.ts` | GET/POST/PATCH `/design-tasks`, `/design-tasks/:id/versions` |
| `useProductionJobs.ts` | GET/PATCH `/production-jobs`, board view |
| `useQaReports.ts` | GET/PATCH `/qa-reports`, checklist, photo upload |
| `useShipments.ts` | GET/POST/PATCH `/shipments`, dashboard stats |
| `useVendors.ts` | GET/POST/PATCH `/vendors`, rankings |
| `useReports.ts` | GET `/reports/sales`, `/reports/revenue`, `/reports/leaderboard`, `/reports/overview` |
| `useActivityLog.ts` | GET `/activity-log` with pagination |

**Common pattern**:
```typescript
export function useLeads(filters?: LeadFilters) {
  const [data, setData] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const fetch = useCallback(async () => { ... }, [filters]);
  const create = async (dto: CreateLeadDto) => { ... };
  const update = async (id: string, dto: UpdateLeadDto) => { ... };

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, meta, create, update, refresh: fetch };
}
```

**Verify**: Each hook returns real data from NestJS API

---

### B6: Realtime Subscriptions
**Priority**: 🟡 Medium

**Create** `src/hooks/useRealtime.ts`:
```typescript
export function useRealtimeTable(table: string, brandId: string, onEvent: (payload) => void) {
  useEffect(() => {
    const channel = supabase
      .channel(`${table}-${brandId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table,
        filter: `brand_id=eq.${brandId}`,
      }, onEvent)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [table, brandId]);
}
```

**Wire into**:
- Dashboard → live activity feed (auto-append new items)
- Leads → new lead notifications (toast + auto-refresh)
- SharedInbox → new message indicators (badge count + auto-scroll)

**Verify**: Create lead in one tab → appears in other tab's dashboard instantly

---

### Phase B Completion Criteria

- [ ] Supabase client initialized and working
- [ ] Real auth replaces localStorage mock
- [ ] Brand switcher uses real DB brands
- [ ] API client auto-injects auth + handles errors
- [ ] All 13 data hooks fetch real data
- [ ] Realtime subscriptions working for Dashboard, Leads, Inbox
- [ ] No mock data remains in the hooks/lib layer

---

## Phase C: Frontend Page Wiring (2-4 weeks)

> **Goal**: Replace every page's inline mock data with real API calls.

---

### Tier 1: Auth & Shell (Days 1-2)

#### C1: Login Page (`src/pages/Login.tsx`)
- [ ] Wire form submit to `useAuth().login(email, password)`
- [ ] Show loading spinner during auth
- [ ] Show error toast on failed login
- [ ] Remove `defaultValue` from inputs (security)
- [ ] Wire "Persistent Session" checkbox
- [ ] Wire "Reset Access?" to password reset flow

#### C2: AppShell (`src/components/AppShell.tsx`)
- [ ] Wire brand dropdown to `useBrand().brands`
- [ ] Wire user name/role from `useAuth().profile`
- [ ] Wire logout button
- [ ] Wire notification badge to unread message count

#### C3: App.tsx Auth Gate
- [ ] Wrap with `<AuthProvider>` + `<BrandProvider>`
- [ ] Replace localStorage check with `useAuth().session`
- [ ] Add loading screen during auth initialization
- [ ] Add role-based route protection (optional)

**Verify**: Full login → brand select → dashboard → logout → redirect to login

---

### Tier 2: Core CRM (Days 3-7)

#### C4: Dashboard (`src/pages/Dashboard.tsx`)
- [ ] Replace `kpis[]` with `useReports('sales')` data
- [ ] Replace `revenueData[]` with real revenue data
- [ ] Replace `brandData[]` with per-brand breakdown
- [ ] Replace `activity[]` with `useActivityLog()` recent items
- [ ] Wire "Needs Attention" to overdue leads
- [ ] Wire period selectors (7d/30d) to API params
- [ ] Add realtime subscription for live activity

#### C5: Leads (`src/pages/Leads.tsx`)
- [ ] Replace inline mock leads with `useLeads(filters)`
- [ ] Wire filter dropdowns (status, source, priority)
- [ ] Wire "Assign" action
- [ ] Wire SLA countdown indicators
- [ ] Wire "Convert to Quote" button
- [ ] Add pagination
- [ ] Add realtime (new leads auto-appear)

#### C6: Clients (`src/pages/Clients.tsx`)
- [ ] Replace mock clients with `useCustomers()`
- [ ] Wire create/edit modals
- [ ] Wire "Merge Customers" action
- [ ] Wire search input to filter
- [ ] Show real `lifetime_value`

#### C7: Shared Inbox (`src/pages/SharedInbox.tsx`)
- [ ] Replace mock conversations with `useConversations()`
- [ ] Wire message thread rendering
- [ ] Wire send message
- [ ] Wire file attachment upload (Supabase Storage `attachments` bucket)
- [ ] Wire channel filter (email/chat/phone)
- [ ] Wire resolve/unresolve toggle
- [ ] Add realtime (new messages appear live)

**Verify**: CRUD on all 4 pages works with real data + pagination + filters

---

### Tier 3: Financial (Days 8-10)

#### C8: Invoice Wizard (`src/pages/InvoiceWizard.tsx`)
- [ ] Replace mock invoices with `useInvoices()`
- [ ] Wire multi-step form to `invoices.create()`
- [ ] Wire "Mark Paid" action
- [ ] Show overdue invoices
- [ ] Currency from active brand

#### C9: Orders (`src/pages/Orders.tsx`)
- [ ] Replace mock orders with `useOrders(filters)`
- [ ] Wire status transition buttons (enforce valid transitions)
- [ ] Wire "Clone Order"
- [ ] Wire detail view (linked quote, items, design task, production job, shipment)
- [ ] Show order stats

**Verify**: Create invoice → mark paid → order transitions correctly

---

### Tier 4: Production Pipeline (Days 11-15)

#### C10: Design Board (`src/pages/DesignBoard.tsx`)
- [ ] Replace mock tasks with `useDesignTasks()`
- [ ] Wire version upload to Supabase Storage `artwork` bucket
- [ ] Wire approve/revision workflow
- [ ] Show version history thumbnails

#### C11: Production Board (`src/pages/ProductionBoard.tsx`)
- [ ] Replace mock batches with `useProductionJobs()`
- [ ] Wire Kanban column grouping by status
- [ ] Wire status transitions
- [ ] Wire vendor assignment dropdown

#### C12: QA & Inspection (`src/pages/QA.tsx`)
- [ ] Replace mock QA data with `useQaReports()`
- [ ] Wire checklist update
- [ ] Wire photo upload to `qa-photos` bucket
- [ ] Enforce min 2 photos before submit
- [ ] Wire pass/fail submission

#### C13: Vendors (`src/pages/Vendors.tsx`)
- [ ] Replace mock vendors with `useVendors()`
- [ ] Wire create/edit forms
- [ ] Show performance stats
- [ ] Wire rankings view

**Verify**: Design approve → Production → QA pass → complete pipeline

---

### Tier 5: Fulfillment & Analytics (Days 16-19)

#### C14: Shipping Dashboard (`src/pages/ShippingDashboard.tsx`)
- [ ] Replace mock shipments with `useShipments()`
- [ ] Wire tracking number + carrier input
- [ ] Show status history timeline
- [ ] Wire dashboard stats
- [ ] Wire "Delivered" confirmation

#### C15: Reports (`src/pages/Reports.tsx`)
- [ ] Replace mock charts with `useReports()` for each section
- [ ] Wire leaderboard (Hammad, Faiq, Sufyan, Wahid ranking)
- [ ] Wire period selector (7d/30d/90d/1y)
- [ ] Wire brand filter for CEO/GM cross-brand view

#### C16: Activity Log (`src/pages/ActivityLog.tsx`)
- [ ] Replace mock log with `useActivityLog()`
- [ ] Wire filters: user, entity_type, action, date range
- [ ] Add pagination

#### C17: Settings & Call Assistant
- [ ] `Settings.tsx`: Wire integration config — enable/disable toggles, API key fields
- [ ] `CallAssistant.tsx`: Wire lead data for call context, log results to conversations

**Verify**: All 16 pages show real data, zero mock data remains

---

### Phase C Completion Criteria

- [ ] Every page fetches from real API or Supabase
- [ ] All inline mock data arrays deleted from page files
- [ ] Loading skeletons on every page
- [ ] Error states with retry on every page
- [ ] Brand switching refreshes all data on all pages
- [ ] Realtime on Dashboard, Leads, Inbox
- [ ] File uploads working (artwork, QA photos, attachments)
- [ ] All status transitions work end-to-end

---

## Phase D: Testing, Polish & Deploy (1-2 weeks)

> **Goal**: Verify everything works, then ship it.

---

### D1: Create Test Users (Seed Script)

Create via Supabase admin API:

| User | Role | Brands |
|------|------|--------|
| Ikhlaque A. | CEO | All 5 |
| Manager 1 | Manager | TAP, TEP |
| Manager 2 | Manager | EAGLEUK, PMC, EPNZ |
| Hammad | SDR | TAP |
| Faiq | SDR | TAP |
| Sufyan | SDR | EAGLEUK |
| Wahid | SDR | EAGLEUK |
| Designer 1 | Designer | All 5 |
| QA Inspector 1 | QA | All 5 |
| Prod Manager | Production | All 5 |

**Verify**: Each user logs in and sees only their brands' data

---

### D2: End-to-End Order Lifecycle Test

Full pipeline test:
1. SDR creates lead → assigns to self
2. SDR converts lead → quote auto-created
3. Quote items filled → sent to customer
4. Quote accepted → order auto-created → invoice generated
5. Invoice marked paid → order → Design
6. Designer uploads artwork → customer approves
7. Order → Production → job created → assigned to vendor
8. Job → Shipped_To_QA → QA report auto-created
9. QA inspector fills checklist + photos → submits (pass)
10. Order → Shipping → shipment with tracking
11. Shipment delivered → order complete

**Verify**: Full lifecycle completes without errors

---

### D3: Brand Isolation Test

- [ ] Login as TAP SDR → create customer, lead, order
- [ ] Switch to EAGLEUK → verify NONE of TAP data visible
- [ ] Login as CEO → verify ALL brands visible in reports
- [ ] Direct API call without brand → returns 400

---

### D4: RBAC Test

- [ ] SDR cannot create/delete users (403)
- [ ] SDR cannot reassign other SDR's leads (403)
- [ ] Manager can reassign leads within brand
- [ ] Admin can create/disable users
- [ ] CEO can see cross-brand reports

---

### D5: Performance & Polish

- [ ] Loading skeletons on all 16 pages
- [ ] Error boundaries with retry buttons
- [ ] Toast notifications on all mutations
- [ ] Optimize Supabase selects (only needed columns)
- [ ] Seed 100+ leads, 50+ orders for realistic testing
- [ ] Lazy load heavy pages (Reports, InvoiceWizard)

---

### D6: Deploy Backend (Render or Railway)

- [ ] Create `Dockerfile` for NestJS
- [ ] Set env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `CORS_ORIGIN`
- [ ] Deploy as Web Service
- [ ] Configure CORS to production frontend URL
- [ ] Add health check endpoint: `GET /api/health`

---

### D7: Deploy Frontend (Netlify or Vercel)

- [ ] Update `.env.production` with production URLs
- [ ] Build: `npm run build`
- [ ] Deploy `dist/` directory
- [ ] Configure SPA redirect: `/* → /index.html`
- [ ] Set env vars in dashboard

---

### D8: Post-Deploy Verification

- [ ] Login on production URL
- [ ] Create test order end-to-end
- [ ] Verify HTTPS, CORS, no console errors
- [ ] Verify no secrets in client bundle
- [ ] Monitor Supabase logs for errors

---

### Phase D Completion Criteria

- [ ] 10 test users across all roles
- [ ] Full order lifecycle verified
- [ ] Brand isolation proven
- [ ] RBAC enforced on all endpoints
- [ ] Frontend and backend deployed
- [ ] Production health check passing
- [ ] Zero console errors

---

## Summary

| Phase | Focus | Duration | Tasks |
|-------|-------|----------|-------|
| **A** | Backend fixes + Vendors + Security | 1-2 days | A1-A10 |
| **B** | API client + Auth + Hooks + Realtime | 1 week | B1-B6 |
| **C** | Wire all 16 frontend pages | 2-4 weeks | C1-C17 |
| **D** | Testing + Polish + Deploy | 1-2 weeks | D1-D8 |
| **Total** | | **5-8 weeks** | **41 tasks** |

---

## Agent Assignments

| Agent | Responsible For |
|-------|----------------|
| backend-specialist | A1-A7, A9, A10, D1 |
| database-architect | A8, A9 (DB) |
| security-auditor | A2, A3, A8, D3, D4 |
| frontend-specialist | B1-B6, C1-C17, D5, D7 |
| orchestrator | D2, D6, D8 |

---

## Dependency Graph

```
A1-A10 (backend fixes)
    │
    ▼
B1 (supabase client) ──► B2 (auth context) ──► B3 (api client)
                                                     │
                                              B4 (brand context)
                                                     │
                                              B5 (data hooks)
                                                     │
                                              B6 (realtime)
                                                     │
    ┌────────────────────────────────────────────────┘
    ▼
C1-C3 (auth + shell)
    │
    ▼
C4-C7 (core CRM pages)
    │
    ▼
C8-C9 (financial pages)
    │
    ▼
C10-C13 (production pipeline)
    │
    ▼
C14-C17 (fulfillment + analytics)
    │
    ▼
D1-D8 (test + deploy)
```
