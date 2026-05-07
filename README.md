# Kamsoft-OS — Revenue & Fulfillment Operations Platform

> Multi-brand CRM for custom patch manufacturing. Manages leads, quoting, production, QA, shipping, and analytics across 5 international brands.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript + Vite + Tailwind CSS v4 |
| **Backend** | NestJS + TypeScript |
| **Database** | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| **Charts** | Recharts |
| **Animations** | Framer Motion |

## Quick Start

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install
cd server && npm install && cd ..

# 2. Set up environment variables (see DOC/SETUP.md for details)
# Frontend: .env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL)
# Backend: server/.env (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET, PORT)

# 3. Start backend
cd server && npm run start:dev

# 4. Start frontend (separate terminal)
npm run dev
```

Frontend: `http://localhost:3000` | Backend API: `http://localhost:3001/api`

## Documentation

| Document | Description |
|----------|-------------|
| [DOC/SETUP.md](DOC/SETUP.md) | Full environment setup guide |
| [DOC/Instructions.md](DOC/Instructions.md) | Business requirements & vision |
| [DOC/PLAN-full-integration.md](DOC/PLAN-full-integration.md) | Integration roadmap (4 phases) |
| [DOC/UI explain.md](DOC/UI%20explain.md) | Frontend architecture & wiring status |
| [DOC/Backend/](DOC/Backend/) | Backend master plan + 4 phase docs |

## Architecture

```
React Frontend (Vite, port 3000)
   ├── Supabase JS (Auth + Realtime)
   └── API Client (NestJS REST, port 3001)
              │
              ▼
       NestJS Backend (18 modules)
              │
              ▼
       Supabase (PostgreSQL + Auth + Storage)
```

## Brands

| Code | Brand | Currency | Country |
|------|-------|----------|---------|
| TAP | The American Patch | USD | US |
| PMC | Patch Makers Canada | CAD | CA |
| TEP | The Eagle Patches | USD | US |
| EAGLEUK | Eagle Patches UK | GBP | UK |
| EPNZ | Embroidered Patches NZ | NZD | NZ |
