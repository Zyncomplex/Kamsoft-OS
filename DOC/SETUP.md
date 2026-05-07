# Kamsoft-OS — Environment Setup Guide

> **Project**: Kamsoft-OS Revenue & Fulfillment Operations Platform  
> **Stack**: React 19 (Vite) + NestJS (TypeScript) + Supabase (PostgreSQL)  
> **Last Updated**: 2026-05-07

---

## Prerequisites

| Tool | Minimum Version | Check Command |
|------|----------------|---------------|
| Node.js | v18+ (v20 recommended) | `node --version` |
| npm | v9+ | `npm --version` |
| Git | v2.30+ | `git --version` |

---

## 1. Clone & Install

```bash
# Clone the repository
git clone <repo-url> Kamsoft-OS
cd Kamsoft-OS

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

---

## 2. Environment Variables

This project requires **two** `.env` files — one for the frontend and one for the backend.

### Frontend `.env` (project root: `./`)

```env
# Supabase project credentials
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your_anon_key_here

# NestJS backend API URL
VITE_API_URL=http://localhost:3001/api
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | ✅ | Supabase project URL (from Project Settings → API) |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key (from Project Settings → API) |
| `VITE_API_URL` | ✅ | NestJS backend base URL with `/api` prefix |

### Backend `.env` (inside `./server/`)

```env
# Supabase connection
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...your_service_role_key_here
SUPABASE_ANON_KEY=eyJ...your_anon_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here

# Server config
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | ✅ | Same Supabase project URL as frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key — **never expose in frontend** (from Project Settings → API) |
| `SUPABASE_ANON_KEY` | ✅ | Same anon key as frontend |
| `SUPABASE_JWT_SECRET` | ✅ | JWT secret for token verification (from Project Settings → API → JWT Settings) |
| `PORT` | Optional | Backend port (default: 3001) |
| `CORS_ORIGIN` | Optional | Allowed frontend origin (default: `http://localhost:3000`) |

> ⚠️ **Security**: The `server/.env` file is gitignored. Never commit service role keys. The `SUPABASE_SERVICE_ROLE_KEY` has full database access — bypasses RLS.

---

## 3. Supabase Project Setup

The Supabase project should already be provisioned with:

### Database (18 tables)
| Table | Purpose |
|-------|---------|
| `brands` | Multi-tenant brand entities (TAP, EAGLEUK, etc.) |
| `profiles` | User profiles extending `auth.users` |
| `customers` | CRM customer records |
| `leads` | Lead pipeline with SLA tracking |
| `conversations` | Shared inbox threads |
| `messages` | Individual messages within conversations |
| `quotes` | Price quotes with line items |
| `orders` | Full order lifecycle tracking |
| `order_items` | Individual items within an order |
| `invoices` | Financial invoices linked to orders |
| `design_tasks` | Artwork proofing with version history |
| `production_jobs` | Manufacturing job tracking |
| `qa_reports` | Quality assurance inspection reports |
| `shipments` | Shipping/fulfillment tracking |
| `vendors` | Vendor management with performance metrics |
| `activity_log` | System-wide audit trail |
| `integrations` | Per-brand integration configs |
| `id_counters` | Auto-increment display IDs per brand |

### Storage Buckets (4)
| Bucket | Purpose | Access |
|--------|---------|--------|
| `artwork` | Design files, mockups, proofs | Private (authenticated) |
| `qa-photos` | QA inspection images | Private (authenticated) |
| `attachments` | Conversation file attachments | Private (authenticated) |
| `avatars` | User profile photos | Public |

### Seed Data
- **5 brands**: The American Patch (TAP), Patch Makers Canada (PMC), The Eagle Patches (TEP), Eagle Patches UK (EAGLEUK), Embroidered Patches NZ (EPNZ)
- **1 admin user**: Created via Supabase Auth admin API

---

## 4. Running Locally

### Start Backend (NestJS)

```bash
cd server
npm run start:dev
```

- Runs on: `http://localhost:3001`
- API prefix: `/api` (all endpoints at `http://localhost:3001/api/*`)
- Health check: `GET http://localhost:3001/api/health`

### Start Frontend (Vite)

```bash
# From project root
npm run dev
```

- Runs on: `http://localhost:3000`
- Hot module replacement enabled
- Proxied API calls go to `VITE_API_URL`

### Both Together

Open two terminal windows/tabs:

```bash
# Terminal 1 — Backend
cd server && npm run start:dev

# Terminal 2 — Frontend
npm run dev
```

---

## 5. Project Structure

```
Kamsoft-OS/
├── DOC/                          # Documentation
│   ├── Instructions.md           # Business requirements
│   ├── PLAN-full-integration.md  # Integration roadmap
│   ├── UI explain.md             # Frontend system report
│   ├── SETUP.md                  # ← This file
│   └── Backend/                  # Backend phase docs
│       ├── crm-backend-master.md
│       ├── crm-backend-phase1.md
│       ├── crm-backend-phase2.md
│       ├── crm-backend-phase3.md
│       └── crm-backend-phase4.md
├── src/                          # React frontend
│   ├── App.tsx                   # Root component + routing
│   ├── main.tsx                  # Entry point
│   ├── components/               # Shared components (AppShell)
│   ├── contexts/                 # AuthContext, BrandContext
│   ├── hooks/                    # Data hooks (useCrud, useLeads, etc.)
│   ├── lib/                      # API client, Supabase client, utils
│   ├── pages/                    # 16 page components
│   └── types/                    # TypeScript interfaces
├── server/                       # NestJS backend
│   └── src/
│       ├── main.ts               # Bootstrap
│       ├── app.module.ts         # Root module (18 modules registered)
│       ├── common/               # Guards, decorators, interceptors, pipes
│       ├── config/               # App + Supabase config
│       ├── supabase/             # Supabase service (singleton client)
│       ├── modules/              # 18 feature modules
│       │   ├── auth/
│       │   ├── users/
│       │   ├── brands/
│       │   ├── customers/
│       │   ├── leads/
│       │   ├── conversations/
│       │   ├── quotes/
│       │   ├── orders/
│       │   ├── invoices/
│       │   ├── design-tasks/
│       │   ├── production-jobs/
│       │   ├── qa-reports/
│       │   ├── shipments/
│       │   ├── vendors/
│       │   ├── integrations/     # + adapters/ (7 adapter stubs)
│       │   ├── reports/
│       │   ├── activity-log/
│       │   └── webhooks/
│       └── types/                # Shared enums (13 enums)
├── supabase/                     # Supabase migrations
├── .env                          # Frontend env vars
├── package.json                  # Frontend dependencies
├── vite.config.ts                # Vite configuration
└── tsconfig.json                 # TypeScript config
```

---

## 6. Available Scripts

### Frontend (project root)

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Start Vite dev server on port 3000 |
| Build | `npm run build` | Production build to `dist/` |
| Preview | `npm run preview` | Preview production build |
| Lint | `npm run lint` | TypeScript type check (`tsc --noEmit`) |
| Clean | `npm run clean` | Remove `dist/` directory |

### Backend (`server/`)

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run start:dev` | NestJS with hot reload |
| Build | `npm run build` | Compile TypeScript to `dist/` |
| Start | `npm run start:prod` | Run production build |
| Lint | `npm run lint` | ESLint check |
| Test | `npm run test` | Unit tests |
| Test E2E | `npm run test:e2e` | End-to-end tests |

---

## 7. Key URLs & Ports

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | `http://localhost:3000` | React app |
| Backend API | `http://localhost:3001/api` | NestJS REST API |
| Supabase Dashboard | `https://supabase.com/dashboard` | Database, Auth, Storage management |
| Supabase API | `https://<ref>.supabase.co` | Direct Supabase access (used for Auth + Realtime) |

---

## 8. Troubleshooting

### "Supabase credentials missing in .env"
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in the root `.env` file
- Restart the dev server after editing `.env`

### Backend won't connect to Supabase
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `server/.env`
- Check that the service role key is the **full key**, not truncated
- Ensure the Supabase project is active (not paused)

### CORS errors in browser
- Backend `CORS_ORIGIN` must match the frontend URL exactly (`http://localhost:3000`)
- Check that the backend is actually running before the frontend makes API calls

### "Cannot find module" on backend start
- Run `cd server && npm install` to ensure backend dependencies are installed
- The backend has its own `package.json` separate from the frontend

### Port already in use
- Frontend: Kill the process on port 3000, or change `vite.config.ts` `--port` flag
- Backend: Kill the process on port 3001, or change `PORT` in `server/.env`
