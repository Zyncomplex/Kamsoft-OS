# Operations Portal UI System Report

> **Last Updated**: 2026-05-07  
> **Status**: Hybrid (partial real data integration in progress)

This document provides a detailed breakdown of the Operations Portal's user interface, architecture, data layer, and functional logic.

---

## 1. Core Architecture

- **Framework**: React 19 with TypeScript for type-safe development.
- **Build Tool**: Vite 6 with HMR (dev server on port 3000).
- **Styling**: Tailwind CSS v4 (utility-first).
- **Animations**: Framer Motion (`motion/react`) for route transitions, modals, and interactive feedback.
- **Routing**: `react-router-dom` v7 for SPA navigation (16 routes).
- **Charts**: Recharts for data visualizations (Dashboard, Reports).
- **Icons**: Lucide React icon library.

---

## 2. Data Layer (Current State)

### Authentication — ✅ Real (Supabase)
- **Provider**: `src/contexts/AuthContext.tsx` wraps the entire app
- **Engine**: Supabase Auth (email/password) with JWT sessions
- **Flow**: `supabase.auth.getSession()` → `onAuthStateChange` listener → fetch profile from NestJS `GET /users/me`
- **State**: `user`, `session`, `profile`, `loading`
- **Methods**: `signOut()`, `refreshProfile()`

### Brand Context — ✅ Real (NestJS API)
- **Provider**: `src/contexts/BrandContext.tsx`
- **Flow**: On profile load → `GET /brands` → set active brand from profile's `active_brand_id`
- **Methods**: `switchBrand(brandId)` → calls `PATCH /users/active-brand`
- **State**: `activeBrand`, `brands[]`, `loading`

### API Client — ✅ Real
- **File**: `src/lib/api.ts`
- **Pattern**: Auto-injects Supabase JWT `Authorization: Bearer` header on every request
- **Base URL**: `VITE_API_URL` (default `http://localhost:3001/api`)
- **Methods**: `api.get<T>()`, `api.post<T>()`, `api.patch<T>()`, `api.delete<T>()`

### Supabase Client — ✅ Real
- **File**: `src/lib/supabase.ts`
- **Used for**: Auth (sessions/JWT), Realtime subscriptions
- **Not used for**: Direct data queries (all CRUD goes through NestJS API)

### Generic CRUD Hook — ✅ Real
- **File**: `src/hooks/useCrud.ts`
- **Pattern**: Brand-scoped generic hook that wraps `api.get/post/patch/delete`
- **Returns**: `{ data, loading, error, fetchAll, create, update, remove }`
- **Auto-fetches** on mount (unless `autoFetch: false`)
- **Handles** both paginated `{ data: T[] }` and simple `T[]` responses

### Realtime Hook — ✅ Real
- **File**: `src/hooks/useRealtime.ts`
- **Pattern**: Supabase Postgres Changes subscription filtered by `brand_id`
- **Usage**: Pass a table name and callback → auto-subscribes, auto-cleans up

### Data Hooks — ✅ Built (8 hooks)

| Hook | File | Backend Endpoint | Status |
|------|------|-----------------|--------|
| `useLeads` | `src/hooks/useLeads.ts` | `/leads` + `/leads/:id/convert` | ✅ Full CRUD + convert |
| `useConversations` | `src/hooks/useConversations.ts` | `/conversations` + messages | ✅ CRUD + messages |
| `useOrders` | `src/hooks/useOrders.ts` | `/orders` | ✅ Basic CRUD |
| `useVendors` | `src/hooks/useVendors.ts` | `/vendors` | ✅ Basic CRUD |
| `useActivityLogs` | `src/hooks/useActivityLogs.ts` | `/activity-log` | ✅ Read (limit 10) |
| `useReports` | `src/hooks/useReports.ts` | `/reports/sales`, `/reports/sales/leaderboard`, `/reports/overview` | ✅ Read |
| `useRealtime` | `src/hooks/useRealtime.ts` | Supabase Realtime | ✅ Generic |
| `useCrud` | `src/hooks/useCrud.ts` | Any endpoint | ✅ Generic CRUD |

### Frontend Types — ✅ Defined
- **File**: `src/types/index.ts`
- **Interfaces**: `Profile`, `Lead`, `Order`, `Brand`, `BrandSettings`
- **Types**: `UserRole`, `LeadStatus`, `OrderStatus`

---

## 3. App Shell & Auth Gate

### Login Page (`/src/pages/Login.tsx`)
- **Status**: ⚠️ Partially wired
- **Current**: Form UI exists with dark theme design, but `App.tsx` still uses `localStorage` for the auth gate (`app_authenticated`)
- **Needed**: Replace `localStorage` check with `useAuth().session` and wrap with `<AuthProvider>` + `<BrandProvider>`

### AppShell (`/src/components/AppShell.tsx`)
- **Sidebar**: Brand dropdown, 16 navigation links with active-state highlighting, collapsible
- **Top Navbar**: Current module name, currency selector, profile summary
- **Status**: ⚠️ Brand dropdown and user info still read from static values — needs wiring to `useBrand()` and `useAuth()`

### App.tsx Auth Gate
- **Status**: ⚠️ Uses `localStorage.getItem('app_authenticated')` instead of `useAuth().session`
- **Not yet wrapped** with `<AuthProvider>` or `<BrandProvider>` at the top level
- **Command Palette**: `CMD/CTRL + K` spotlight modal — functional with static suggestions

---

## 4. Page Wiring Status

| Page | File | Data Source | Wired? |
|------|------|------------|--------|
| Dashboard | `Dashboard.tsx` | Inline mock KPIs/charts | ❌ Mock |
| Leads | `Leads.tsx` | `useLeads()` available but page uses inline mock | ⚠️ Partial |
| Clients | `Clients.tsx` | Inline mock customers | ❌ Mock |
| Shared Inbox | `SharedInbox.tsx` | `useConversations()` available | ⚠️ Partial |
| Invoice Wizard | `InvoiceWizard.tsx` | Inline mock invoices | ❌ Mock |
| Orders | `Orders.tsx` | `useOrders()` available but page uses inline mock | ⚠️ Partial |
| Design Board | `DesignBoard.tsx` | Inline mock design tasks | ❌ Mock |
| Production Board | `ProductionBoard.tsx` | Inline mock batches | ❌ Mock |
| QA & Inspection | `QA.tsx` | Inline mock QA data | ❌ Mock |
| Shipping Dashboard | `ShippingDashboard.tsx` | Inline mock shipments | ❌ Mock |
| Vendors | `Vendors.tsx` | `useVendors()` available but page uses inline mock | ⚠️ Partial |
| Reports | `Reports.tsx` | `useReports()` available but page uses inline mock | ⚠️ Partial |
| Activity Log | `ActivityLog.tsx` | `useActivityLogs()` available | ⚠️ Partial |
| Settings | `Settings.tsx` | Inline mock integration toggles | ❌ Mock |
| Call Assistant | `CallAssistant.tsx` | Inline mock lead/script data | ❌ Mock |

**Summary**: Hooks exist for 6 modules (Leads, Conversations, Orders, Vendors, Reports, Activity Log). The remaining 9 pages need hooks created and all 16 pages need their inline mock data replaced.

---

## 5. Routing Structure

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Dashboard` | KPI overview, charts, activity stream |
| `/leads` | `Leads` | Lead management table with SLA tracking |
| `/inbox` | `SharedInbox` | Multi-channel conversation threads |
| `/invoices` | `InvoiceWizard` | Multi-step invoice creation |
| `/production` | `ProductionBoard` | Kanban-style batch tracking |
| `/design` | `DesignBoard` | Artwork approval + version control |
| `/orders` | `Orders` | Full order lifecycle view |
| `/qa` | `QA` | Inspection checklists + photo upload |
| `/reports` | `Reports` | Analytics, leaderboard, brand yield |
| `/shipping` | `ShippingDashboard` | Carrier tracking + delivery status |
| `/vendors` | `Vendors` | Vendor management + performance |
| `/clients` | `Clients` | Customer database + merge |
| `/settings` | `Settings` | Integration config toggles |
| `/activity` | `ActivityLog` | System-wide audit trail |
| `/call-assistant/:leadId?` | `CallAssistant` | AI-assisted outreach calls |
| `*` | → `/` (redirect) | Catch-all redirect |

---

## 6. Key Module Descriptions

### Dashboard (`Dashboard.tsx`)
- **KPI Summary**: Gross Volume, Lead Conversion, Active Design Batches
- **Charts**: Revenue trend line graphs, brand volume pie charts (Recharts)
- **Live Activity**: Stream view of recent SDR actions and system alerts

### Leads Management (`Leads.tsx`)
- **CRM Interface**: High-density table for incoming leads
- **Assignment**: Shows assigned SDRs (Hammad, Faiq, Sufyan, Wahid)
- **SLA Tracking**: Visual time-to-respond indicators (Critical, Warning, Normal)
- **Source Filtering**: Web Forms, Instagram, RingCentral, Email, Meta

### Shared Inbox (`SharedInbox.tsx`)
- **Unified Feed**: Email, Facebook, Instagram messages in one view
- **Thread View**: Chat with clients, metadata (Net Rev, Lifetime value), file attachments
- **Channel Tabs**: Filter by message source

### Invoice Wizard (`InvoiceWizard.tsx`)
- **Multi-step Flow**: Guided wizard for financial document creation
- **Line Items**: Dynamic patch pricing with tax calculation
- **Status Integration**: Hooks into billing cycle for order status updates

### Orders (`Orders.tsx`)
- **Lifecycle Tracking**: Full order journey from payment to delivery
- **Status Transitions**: Visual pipeline with stage indicators
- **Detail View**: Linked quote, items, design task, production job, shipment

### Design Board (`DesignBoard.tsx`)
- **Artwork Approval**: Mockup review against client requirements
- **Contextual Chat**: Designer-SDR sidebar for color/sizing discussions
- **Version Control**: Track v1, v2, v3 of design files

### Production Board (`ProductionBoard.tsx`)
- **Batch Management**: Manufacturing tracking by physical batch
- **Kanban Workflow**: In Queue → Embroidering → Finishing → Ready

### QA & Inspection (`QA.tsx`)
- **Checklist Interface**: Stitch density, backing type, color accuracy verification
- **Photo Upload**: Front/back/detail evidence capture
- **Pass/Fail**: Binary outcome with defect notes

### Shipping Dashboard (`ShippingDashboard.tsx`)
- **Carrier Integration**: FedEx/DHL/UPS tracking status
- **Timeline View**: Status history per shipment
- **Dashboard Stats**: In-transit, delivered, exceptions

### Reports & Analytics (`Reports.tsx`)
- **Leaderboard**: Revenue and closing rates for SDRs
- **Brand Yield**: Profitability comparison across brands
- **Period Selector**: 7d / 30d / 90d / 1y

### Vendors (`Vendors.tsx`)
- **Supply Chain**: Vendor capabilities, rating, on-time rate
- **Performance Stats**: Defect rate, total jobs completed

### Call Assistant (`CallAssistant.tsx`)
- **Script Engine**: Dynamic call scripts with lead context
- **Quick Actions**: Log results (No answer, Busy, Call Back)
- **Notes**: Real-time note capture during calls

### Activity Log (`ActivityLog.tsx`)
- **Audit Trail**: Every major system action with timestamps
- **Examples**: "Hammad approved Artwork v4", "Ikhlaque A. released Batch PJ-991"

### Settings (`Settings.tsx`)
- **Integration Toggles**: Enable/disable external service connections
- **API Key Fields**: Configuration for Stripe, FedEx, etc.

---

## 7. Global Utilities

### Command Palette (`App.tsx`)
- **Trigger**: `CMD/CTRL + K`
- **Function**: Spotlight-style search modal for quick navigation to pages, orders, or leads

### Utility Functions (`src/lib/utils.ts`)
- **Helpers**: Currency formatting, class name merging
