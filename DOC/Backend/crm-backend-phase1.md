# Phase 1: Foundation & Auth

> **Dependency**: None (this is the first phase)
> **Agent**: `@backend-specialist` + `@database-architect` + `@security-auditor`
> **Skills**: `nodejs-best-practices`, `database-design`, `api-patterns`, `clean-code`

---

## Goal

Set up the NestJS server, connect to Supabase, implement admin-only auth, and build the multi-tenant brand isolation system (Amazon Seller Central model).

---

## Tasks

### Task 1.1: Supabase Project & Schema Setup
**Agent**: `@database-architect`

- [ ] Create all 17 tables in Supabase (see master plan schema)
- [ ] Create enums: `user_role`, `lead_status`, `order_status`, `quote_status`, `invoice_status`, `production_status`, `design_status`, `qa_status`, `shipment_status`, `integration_type`, `message_sender_type`, `conversation_channel`, `priority_level`
- [ ] Create `id_counters` table + function `generate_display_id(brand_code, entity_type)` that auto-increments per brand
- [ ] Set up foreign key relationships
- [ ] Create indexes on `brand_id` for all tenant-scoped tables
- [ ] Create composite indexes: `(brand_id, status)` on leads, orders, production_jobs

**INPUT**: Schema from master plan
**OUTPUT**: All tables created in Supabase with correct types and relationships
**VERIFY**: `list_tables` via Supabase MCP returns all 17 tables

---

### Task 1.2: Row-Level Security (RLS) Policies
**Agent**: `@database-architect` + `@security-auditor`

- [ ] Enable RLS on ALL tables
- [ ] Create RLS policy for each tenant-scoped table:
  ```sql
  -- SELECT: user can only read rows matching their active brand
  CREATE POLICY "brand_isolation_select" ON {table}
    FOR SELECT USING (
      brand_id = (SELECT active_brand_id FROM profiles WHERE id = auth.uid())
    );
  -- INSERT: auto-set brand_id to user's active brand
  CREATE POLICY "brand_isolation_insert" ON {table}
    FOR INSERT WITH CHECK (
      brand_id = (SELECT active_brand_id FROM profiles WHERE id = auth.uid())
    );
  -- UPDATE/DELETE: same brand isolation
  ```
- [ ] `profiles` table: users can read their own profile, admins can read all
- [ ] `brands` table: users can only read brands in their `brand_ids` array
- [ ] `messages` table: inherit access from parent `conversations` table
- [ ] `order_items` table: inherit access from parent `orders` table
- [ ] Disable public signup in Supabase Auth settings

**INPUT**: Tables from Task 1.1
**OUTPUT**: RLS policies on all tables
**VERIFY**: Test with two users on different brands — each sees only their brand's data

---

### Task 1.3: Supabase Storage Buckets
**Agent**: `@database-architect`

- [ ] Create bucket `artwork` — for design files, mockups, proofs
- [ ] Create bucket `qa-photos` — for QA inspection images
- [ ] Create bucket `attachments` — for conversation attachments
- [ ] Create bucket `avatars` — for user profile photos
- [ ] Set RLS policies: authenticated users can upload, read based on brand context

**INPUT**: Storage requirements from master plan
**OUTPUT**: 4 buckets with proper access policies
**VERIFY**: Authenticated user can upload a file; unauthenticated cannot

---

### Task 1.4: Seed Data — Brands
**Agent**: `@database-architect`

- [ ] Insert initial brands:
  ```
  - The American Patch (TAP) — USD — US — theamericanpatch.com
  - Patch Makers Canada (PMC) — CAD — CA — patchmakers.ca
  - The Eagle Patches (TEP) — USD — US — theeaglepatches.com
  - Eagle Patches UK (EAGLEUK) — GBP — UK — eaglepatches.uk
  - Embroidered Patches NZ (EPNZ) — NZD — NZ — embroideredpatches.co.nz
  ```
- [ ] Insert initial admin user (via Supabase Auth admin API):
  - Email: configured via env var
  - Role: Admin
  - brand_ids: [all brand IDs]
  - active_brand_id: first brand

**INPUT**: Brand list from Instructions.md
**OUTPUT**: 5 brands + 1 admin user in database
**VERIFY**: Brands appear in Supabase table viewer; admin can log in

---

### Task 1.5: NestJS Project Scaffold
**Agent**: `@backend-specialist`

- [ ] Initialize NestJS project in `/server` directory: `npx @nestjs/cli new server --strict --skip-git --package-manager npm`
- [ ] Install dependencies:
  ```
  @supabase/supabase-js @nestjs/config class-validator class-transformer
  ```
- [ ] Set up folder structure per master plan (common/, config/, supabase/, modules/)
- [ ] Create `.env` with:
  ```
  SUPABASE_URL=
  SUPABASE_SERVICE_ROLE_KEY=
  SUPABASE_ANON_KEY=
  SUPABASE_JWT_SECRET=
  PORT=3001
  CORS_ORIGIN=http://localhost:3000
  ```
- [ ] Create `SupabaseModule` + `SupabaseService` (singleton client using service-role key)
- [ ] Create `AppConfigModule` using `@nestjs/config`
- [ ] Set up global validation pipe, CORS, exception filter in `main.ts`

**INPUT**: Master plan folder structure
**OUTPUT**: NestJS project runs on port 3001, connects to Supabase
**VERIFY**: `npm run start:dev` boots without errors; `GET /health` returns `{ status: 'ok' }`

---

### Task 1.6: Auth Module (Admin-Only User Management)
**Agent**: `@backend-specialist` + `@security-auditor`

- [ ] Create `AuthModule` with:
  - `POST /auth/login` — email/password login via Supabase Auth, returns JWT + user profile
  - `POST /auth/logout` — invalidate session
  - `GET /auth/me` — return current user profile with active brand
- [ ] Create `UsersModule` with:
  - `POST /users` — **Admin only** — create new user (calls Supabase admin.createUser)
  - `GET /users` — **Admin/Manager** — list users (filtered by brand)
  - `PATCH /users/:id` — **Admin only** — update user role, brand_ids, is_active
  - `DELETE /users/:id` — **Admin only** — soft delete (set is_active = false)
- [ ] Create `SupabaseAuthGuard`:
  - Extract JWT from `Authorization: Bearer <token>` header
  - Verify JWT using Supabase JWT secret
  - Attach user to request object
- [ ] Create `RolesGuard` + `@Roles()` decorator:
  - Check user's role against allowed roles
  - Return 403 if unauthorized
- [ ] Create `@CurrentUser()` decorator to extract user from request

**INPUT**: Auth requirements (admin-only creation, email/password)
**OUTPUT**: Working auth endpoints, guards, decorators
**VERIFY**: 
  - Login with valid creds returns JWT
  - `GET /auth/me` returns user profile
  - Non-admin calling `POST /users` gets 403
  - Admin can create new user with specified role

---

### Task 1.7: Brand Context System (Amazon Seller Central Model)
**Agent**: `@backend-specialist`

- [ ] Create `BrandsModule` with:
  - `GET /brands` — list user's accessible brands (from their `brand_ids`)
  - `POST /brands/switch` — switch active brand (updates `active_brand_id` in profiles)
  - `GET /brands/active` — get current active brand details
- [ ] Create `BrandContextGuard`:
  - Runs after AuthGuard
  - Reads user's `active_brand_id` from profile
  - Attaches `brandId` to request object
  - Returns 400 if no active brand set
- [ ] Create `@CurrentBrand()` decorator to extract brand_id from request
- [ ] Create `BrandFilterInterceptor`:
  - Automatically injects `brand_id` filter into all Supabase queries
  - Ensures no query can bypass brand isolation at the application level

**INPUT**: Amazon Seller Central model requirement
**OUTPUT**: Brand switching endpoint, brand context middleware, auto-filtering
**VERIFY**:
  - User with access to TAP and EAGLEUK can switch between them
  - After switching to TAP, all data queries return only TAP data
  - User without access to a brand gets 403 on switch attempt

---

### Task 1.8: Shared TypeScript Types & Enums
**Agent**: `@backend-specialist`

- [ ] Create `src/types/index.ts` with all enums matching database:
  - UserRole, LeadStatus, OrderStatus, QuoteStatus, InvoiceStatus
  - ProductionStatus, DesignStatus, QAStatus, ShipmentStatus
  - IntegrationType, MessageSenderType, ConversationChannel, PriorityLevel
- [ ] Create base DTOs:
  - `PaginationDto` (page, limit, sort, order)
  - `ApiResponseDto<T>` (data, meta: {total, page, limit}, error)
  - `BrandScopedDto` (base class with brand_id)

**INPUT**: Schema enums from master plan
**OUTPUT**: Type-safe enums and base DTOs
**VERIFY**: `npm run lint` and `npx tsc --noEmit` pass

---

## Done When

- [ ] NestJS server runs on port 3001
- [ ] Supabase has all 17 tables with RLS policies
- [ ] Admin can log in, create users, assign roles and brands
- [ ] Brand switcher works — data is strictly isolated per brand
- [ ] All guards (Auth, Roles, BrandContext) work correctly
- [ ] Storage buckets exist with proper access control
- [ ] TypeScript compiles with no errors

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| RLS policies too restrictive | Test with multiple roles before locking down |
| JWT verification mismatch | Use Supabase's official JWT secret, not custom |
| Brand context not propagating | Interceptor auto-injects brand_id as safety net |
| Supabase service-role key exposure | Store in .env, never commit, add to .gitignore |
