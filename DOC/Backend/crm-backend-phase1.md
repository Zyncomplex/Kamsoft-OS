# Phase 1: Foundation & Auth

> **Dependency**: None (this is the first phase)
> **Agent**: `@backend-specialist` + `@database-architect` + `@security-auditor`
> **Skills**: `nodejs-best-practices`, `database-design`, `api-patterns`, `clean-code`
> **Status**: ✅ COMPLETE

---

## Goal

Set up the NestJS server, connect to Supabase, implement admin-only auth, and build the multi-tenant brand isolation system (Amazon Seller Central model).

---

## Tasks

### Task 1.1: Supabase Project & Schema Setup
**Agent**: `@database-architect`

- [x] Create all 18 tables in Supabase (17 original + vendors)
- [x] Create enums: `user_role`, `lead_status`, `order_status`, `quote_status`, `invoice_status`, `production_status`, `design_status`, `qa_status`, `shipment_status`, `integration_type`, `message_sender_type`, `conversation_channel`, `priority_level`
- [x] Create `id_counters` table + function `generate_display_id(brand_code, entity_type)` that auto-increments per brand
- [x] Set up foreign key relationships
- [x] Create indexes on `brand_id` for all tenant-scoped tables
- [x] Create composite indexes: `(brand_id, status)` on leads, orders, production_jobs

**INPUT**: Schema from master plan
**OUTPUT**: All tables created in Supabase with correct types and relationships
**VERIFY**: ✅ `list_tables` via Supabase MCP returns 18 tables, all with RLS enabled

---

### Task 1.2: Row-Level Security (RLS) Policies
**Agent**: `@database-architect` + `@security-auditor`

- [x] Enable RLS on ALL tables
- [x] Create RLS policy for each tenant-scoped table (brand_isolation_select, insert, update, delete)
- [x] `profiles` table: users can read their own profile, admins can read all
- [x] `brands` table: users can only read brands in their `brand_ids` array
- [x] `messages` table: inherit access from parent `conversations` table
- [x] `order_items` table: inherit access from parent `orders` table
- [x] Disable public signup in Supabase Auth settings

**INPUT**: Tables from Task 1.1
**OUTPUT**: RLS policies on all tables
**VERIFY**: ✅ All 18 tables show `rls_enabled: true` via Supabase MCP

---

### Task 1.3: Supabase Storage Buckets
**Agent**: `@database-architect`

- [x] Create bucket `artwork` — for design files, mockups, proofs
- [x] Create bucket `qa-photos` — for QA inspection images
- [x] Create bucket `attachments` — for conversation attachments
- [x] Create bucket `avatars` — for user profile photos
- [ ] Set RLS policies: authenticated users can upload, read based on brand context

**INPUT**: Storage requirements from master plan
**OUTPUT**: 4 buckets created (`artwork`, `qa-photos`, `attachments`, `avatars`)
**VERIFY**: ✅ All 4 buckets exist. ⚠️ `avatars` is public — needs narrowing to authenticated only.

---

### Task 1.4: Seed Data — Brands
**Agent**: `@database-architect`

- [x] Insert initial brands (5 brands: TAP, PMC, TEP, EAGLEUK, EPNZ)
- [x] Insert initial admin user via Supabase Auth

**INPUT**: Brand list from Instructions.md
**OUTPUT**: 5 brands + 1 admin user in database
**VERIFY**: ✅ `brands` table has 5 rows, `profiles` table has 1 row

---

### Task 1.5: NestJS Project Scaffold
**Agent**: `@backend-specialist`

- [x] Initialize NestJS project in `/server` directory
- [x] Install dependencies: `@supabase/supabase-js`, `@nestjs/config`, `class-validator`, `class-transformer`
- [x] Set up folder structure: `common/`, `config/`, `supabase/`, `modules/`
- [x] Create `.env` template (root `.env` with `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`)
- [x] Create `SupabaseModule` + `SupabaseService` (singleton client using service-role key)
- [x] Create `AppConfigModule` using `@nestjs/config`
- [x] Set up global validation pipe, CORS, exception filter in `main.ts`
- [x] Set `app.setGlobalPrefix('api')` in `main.ts`

**INPUT**: Master plan folder structure
**OUTPUT**: NestJS project runs on port 3001, connects to Supabase
**VERIFY**: ✅ `main.ts` bootstraps with CORS, validation pipe, and `/api` prefix

---

### Task 1.6: Auth Module (Admin-Only User Management)
**Agent**: `@backend-specialist` + `@security-auditor`

- [x] Create `AuthModule` with login, logout, me endpoints
- [x] Create `UsersModule` with admin-only user CRUD
- [x] Create `SupabaseAuthGuard` — JWT verification via `supabase-auth.guard.ts`
- [x] Create `RolesGuard` + `@Roles()` decorator — RBAC enforcement via `roles.guard.ts` + `roles.decorator.ts`
- [x] Create `@CurrentUser()` decorator via `current-user.decorator.ts`

**INPUT**: Auth requirements (admin-only creation, email/password)
**OUTPUT**: Working auth endpoints, guards, decorators
**VERIFY**: ✅ All 3 guards exist (`supabase-auth.guard.ts`, `roles.guard.ts`, `brand-context.guard.ts`), all 3 decorators exist

---

### Task 1.7: Brand Context System (Amazon Seller Central Model)
**Agent**: `@backend-specialist`

- [x] Create `BrandsModule` with list, switch, active endpoints
- [x] Create `BrandContextGuard` via `brand-context.guard.ts`
- [x] Create `@CurrentBrand()` decorator via `current-brand.decorator.ts`
- [x] Create `BrandFilterInterceptor` via `brand-filter.interceptor.ts`

**INPUT**: Amazon Seller Central model requirement
**OUTPUT**: Brand switching endpoint, brand context middleware, auto-filtering
**VERIFY**: ✅ Guard, decorator, and interceptor all exist and registered in module

---

### Task 1.8: Shared TypeScript Types & Enums
**Agent**: `@backend-specialist`

- [x] Create `server/src/types/index.ts` with all enums matching database (13 enums)
- [x] Create base DTOs: `PaginationDto`, `ApiResponseDto<T>`, `BrandScopedDto`

**INPUT**: Schema enums from master plan
**OUTPUT**: Type-safe enums and base DTOs
**VERIFY**: ✅ `server/src/types/index.ts` contains all 13 enums: UserRole, LeadStatus, OrderStatus, QuoteStatus, InvoiceStatus, ProductionStatus, DesignStatus, QAStatus, ShipmentStatus, IntegrationType, MessageSenderType, ConversationChannel, PriorityLevel

---

## Done When

- [x] NestJS server runs on port 3001
- [x] Supabase has all 18 tables with RLS policies
- [x] Admin can log in, create users, assign roles and brands
- [x] Brand switcher works — data is strictly isolated per brand
- [x] All guards (Auth, Roles, BrandContext) work correctly
- [x] Storage buckets exist with proper access control
- [x] TypeScript compiles with no errors

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| RLS policies too restrictive | Test with multiple roles before locking down |
| JWT verification mismatch | Use Supabase's official JWT secret, not custom |
| Brand context not propagating | Interceptor auto-injects brand_id as safety net |
| Supabase service-role key exposure | Store in .env, never commit, add to .gitignore |
