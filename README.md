# HireMind

AI-powered job board platform with three user roles: seeker, recruiter, and admin. Features include AI-generated cover letters, resume analysis, job recommendations, Stripe subscription plans, role-based dashboards, and blog management.

Two independent npm packages — `frontend/` (Next.js 16) and `backend/` (Express + MongoDB). No monorepo tooling, no CI, no tests.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, shadcn/ui (base-nova) |
| Backend | Express, TypeScript, MongoDB (native driver), JWT (EdDSA/Ed25519) |
| AI | Google Gemini (`gemini-3-flash-preview`) |
| Auth | better-auth (Google OAuth + email/password) |
| Payments | Stripe (Checkout, webhooks, subscriptions) |
| Fonts | Plus Jakarta Sans, Inter |
| Icons | Lucide React |

---

## Project Structure

```
hiremind-website/
├── frontend/                    # Next.js 16 (port 3000)
│   ├── src/
│   │   ├── app/                 # App router pages + API routes
│   │   ├── components/          # shadcn/ui components
│   │   ├── lib/                 # Auth, API clients, utilities
│   │   ├── hooks/               # Custom React hooks
│   │   └── proxy.ts             # Next.js middleware (auth guard)
│   ├── globals.css              # Tailwind v4 @theme config
│   └── package.json
│
├── backend/                     # Express API (port 5000)
│   ├── src/
│   │   ├── app.ts               # Express factory (middleware + route wiring)
│   │   ├── server.ts            # Entrypoint: MongoClient → createApp()
│   │   ├── modules/             # 13 feature modules
│   │   ├── middlewares/         # Auth, error handler, role guards
│   │   └── utils/               # sendSuccess, sendError, Stripe helpers
│   ├── api/index.ts             # Vercel serverless entrypoint
│   └── package.json
│
└── AGENTS.md
```

---

## Prerequisites

- **Node.js** 18+
- **MongoDB** instance (Atlas or local)
- **Gemini API key** (AI features)
- **Stripe account** (payments — secret key + price IDs)
- **Google OAuth credentials** (social login)

---

## Getting Started

```bash
# Install dependencies (both packages)
cd frontend && npm install
cd ../backend && npm install

# Set environment variables (each package has its own .env)
# Start backend
cd backend && npm run server    # → http://localhost:5000

# Start frontend (separate terminal)
cd frontend && npm run dev      # → http://localhost:3000
```

### Environment Variables

**`backend/.env`**
```
PORT
CLIENT_URL
MONGODB_URI
GEMINI_API_KEY
STRIPE_SECRET_KEY
STRIPE_PRO_SEEKER_PRICE_ID
STRIPE_PRO_RECRUITER_PRICE_ID
```

**`frontend/.env`**
```
BETTER_AUTH_SECRET
BETTER_AUTH_URL
MONGODB_URI
NEXT_PUBLIC_API_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
STRIPE_SECRET_KEY
NEXT_PUBLIC_IMGBB_KEY
```

---

## Available Scripts

| Package | Command | Action |
|---------|---------|--------|
| `frontend/` | `npm run dev` | Dev server (port 3000) |
| | `npm run build` | Production build |
| | `npm run lint` | ESLint (flat config `eslint.config.mjs`) |
| | `npm start` | Start production server |
| `backend/` | `npm run server` | Dev server with hot reload via `tsx` (port 5000) |
| | `npm run build` | Compile TypeScript → `dist/` |
| | `npm start` | Run compiled server |

Frontend has no typecheck (`tsconfig.json` `noEmit: true`). Backend has no lint or typecheck scripts.

---

## Features

### Recruiter
- Create, edit, delete job postings; track applicant flow
- Review applicants, update status (reviewed / accepted / rejected)
- AI-powered resume classification against job descriptions
- Analytics dashboard: job counts, application volume, recent activity
- Recruiter profile with company branding

### Seeker
- Browse and search jobs with filtering (category, type, location, salary range)
- AI-generated cover letters tailored to specific job listings
- Resume upload and AI analysis with feedback
- AI-driven job recommendations based on profile
- Save jobs, track applications

### Admin
- User management: block, role changes, deletion
- Job moderation: approve / reject listings
- Recruiter request workflow: approve or reject applications
- Blog CRUD
- Subscription plan management (create, edit, price, delete)
- Platform analytics: total users, jobs, applications, recruiters

### AI Tools
| Tool | Description |
|------|-------------|
| Cover letter generation | Personalized cover letter for a given job |
| Job recommendations | Match jobs to seeker profile and history |
| Resume analysis | Upload a resume, get structured feedback |
| Chat assistant | Conversational AI helper |
| Resume classification | Score/classify multiple resumes against a job |
| Job post generation | Draft a complete job description from prompts |

### Payments
- Stripe Checkout session creation and webhook confirmation
- Plan types: `free_seeker`, `pro_seeker`, `recruiter_free`, `pro_recruiter`
- Monthly subscription with per-user usage tracking
- Self-service cancellation via Stripe API

---

## API Reference

### Authentication — `/api/auth`
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | — |
| GET | `/api/auth/me` | Token |
| GET | `/api/auth/jwks` | — |

### Jobs — `/api/jobs`
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/jobs` | — |
| GET | `/api/jobs/filter-options` | — |
| GET | `/api/jobs/suggest` | — |
| GET | `/api/jobs/featured` | — |
| GET | `/api/jobs/:id` | — |

### Applications — `/api/applications`
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/applications` | Token |
| GET | `/api/applications/check/:jobId` | Token |
| GET | `/api/applications/my` | Token |
| GET | `/api/applications/my/:id` | Token |
| DELETE | `/api/applications/:id` | Token |

### Saved Jobs — `/api/saved-jobs`
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/saved-jobs/:jobId` | Token |
| DELETE | `/api/saved-jobs/:jobId` | Token |
| GET | `/api/saved-jobs` | Token |
| GET | `/api/saved-jobs/check/:jobId` | Token |

### Recruiter — `/api/recruiter`
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/recruiter/apply` | Token |
| GET | `/api/recruiter/apply/status` | Token |
| POST | `/api/recruiter/jobs` | Recruiter/Admin |
| GET | `/api/recruiter/jobs` | Recruiter/Admin |
| GET | `/api/recruiter/jobs/:id` | Recruiter/Admin |
| PATCH | `/api/recruiter/jobs/:id` | Recruiter/Admin |
| DELETE | `/api/recruiter/jobs/:id` | Recruiter/Admin |
| GET | `/api/recruiter/jobs/:jobId/applicants` | Recruiter/Admin |
| PATCH | `/api/recruiter/applications/:appId/status` | Recruiter/Admin |
| GET | `/api/recruiter/analytics/overview` | Recruiter/Admin |
| GET | `/api/recruiter/analytics/recent-applications` | Recruiter/Admin |

### Admin — `/api/admin`
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/users` | Admin |
| PATCH | `/api/admin/users/:id/block` | Admin |
| PATCH | `/api/admin/users/:id/role` | Admin |
| DELETE | `/api/admin/users/:id` | Admin |
| GET | `/api/admin/jobs` | Admin |
| PATCH | `/api/admin/jobs/:id/approve` | Admin |
| PATCH | `/api/admin/jobs/:id/reject` | Admin |
| DELETE | `/api/admin/jobs/:id` | Admin |
| GET | `/api/admin/recruiter-requests` | Admin |
| PATCH | `/api/admin/recruiter-requests/:id/approve` | Admin |
| PATCH | `/api/admin/recruiter-requests/:id/reject` | Admin |
| POST | `/api/admin/blog` | Admin |
| GET | `/api/admin/blog` | Admin |
| PATCH | `/api/admin/blog/:id` | Admin |
| DELETE | `/api/admin/blog/:id` | Admin |
| GET | `/api/admin/analytics/overview` | Admin |
| GET | `/api/admin/plans` | Admin |
| GET | `/api/admin/plans/:id` | Admin |
| POST | `/api/admin/plans` | Admin |
| PATCH | `/api/admin/plans/:id` | Admin |
| DELETE | `/api/admin/plans/:id` | Admin |
| POST | `/api/admin/plans/seed` | Admin |

### Blog — `/api/blog`
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/blog` | — |
| GET | `/api/blog/:id` | — |

### AI — `/api/ai`
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/ai/cover-letter` | Token |
| POST | `/api/ai/recommendations` | Token |
| POST | `/api/ai/resume-analyze` | Token |
| POST | `/api/ai/chat` | Token |
| GET | `/api/ai/chat/history` | Token |
| DELETE | `/api/ai/chat/history` | Token |
| POST | `/api/ai/classify-resumes` | Token |
| POST | `/api/ai/generate-job-post` | Token |

### Seeker Profile — `/api/seeker`
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/seeker/profile` | Token |
| PUT | `/api/seeker/profile` | Token |

### Recruiter Profile — `/api/recruiter-profile`
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/recruiter-profile/profile` | Recruiter/Admin |
| PUT | `/api/recruiter-profile/profile` | Recruiter/Admin |

### Payments — `/api/payments`
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/payments/plans` | — |
| GET | `/api/payments/subscription` | Token |
| GET | `/api/payments/my-subscription` | Token |
| POST | `/api/payments/create-checkout` | Token |
| POST | `/api/payments/confirm` | Token |
| POST | `/api/payments/cancel` | Token |

### Dashboard Search — `/api/dashboard/search`
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/dashboard/search` | Token |

---

## Auth Flow

| Layer | Mechanism |
|-------|-----------|
| Identity provider | better-auth singleton, dedicated MongoDB connection to `TalentAI` DB |
| Token format | EdDSA/Ed25519 JWT via `jose` — payload: `sub`, `id`, `email`, `name`, `role`, `plan` |
| Social auth | Google OAuth + email/password |
| Backend verification | `auth.middleware.ts`: fetches JWKS from `CLIENT_URL/api/auth/jwks`, checks `isBlocked`, enriches `req.user` |
| Authorization | `requireRole('recruiter', 'admin')` etc. — exported from `auth.middleware.ts` |
| Client-side | `fetchClient.ts`: caches JWT from `/api/auth/token`, retries on 401/403 |
| Server-side | `headersAuthorization.server.ts`: wraps `getTokenServer()`, imports `server-only` |

### Frontend Guard (`proxy.ts`)
- Authenticated users: blocked from `/login` and `/regester` → redirected to `/`
- Unauthenticated users: blocked from `/jobs/`, `/plans`, `/blog`, `/dashboard`, `/profile`, `/saved-jobs` → redirected to `/login`

---

## Backend Architecture

### Module Layout (13 modules)
```
auth/  jobs/  applications/  saved-jobs/  users/
recruiter/  admin/  blog/  ai/  seeker-profile/
recruiter-profile/  payments/  dashboard-search/
```

Each module exports `createXRoutes(...collections)`. Route-to-collection wiring in `src/app.ts:79-91`.

### Middleware Order
```
helmet → mongoSanitize → cookieParser
→ Stripe webhook raw body parser (before express.json)
→ express.json (limit: 10mb) → CORS (CLIENT_URL, comma-separated)
→ rate limit (100 req / 15 min)
→ AI rate limit (10 req / min on /api/ai)
→ routes → globalErrorHandler
```

### ESM
Backend `package.json` has `"type": "module"`. All source imports use explicit `.js` extensions (`'./app.js'`). New backend files must follow the same convention.

### Known Gaps
- No `uncaughtException` / `unhandledRejection` handlers
- No PM2, no clustering — single-process
- MongoDB connection failure: `process.exit(1)` with no retry
- No tests in either package

### API Response Contract
```ts
// Success
{ success: true, data: { ... } }

// Error
{ success: false, message: string }

// Paginated
{ success: true, data: [...], pagination: { total, page, limit, totalPages, hasMore } }
```

Frontend consumes these keys directly — no remapping.

---

## Styling

| Concern | Convention |
|---------|------------|
| Brand palette | Red (`PrimaryColor`) + green (`SrcPrimaryColor`) — defined in `globals.css` `@theme` |
| Typography | Plus Jakarta Sans (`--font-PrimaryFont`), Inter (`--font-SecondaryFont`) via `next/font/google` |
| Dark mode | Class-based (`.dark`); utility `cn()` from `tailwind-merge` + `clsx` |
| Tailwind | v4, configured entirely in `globals.css` `@theme` — no `tailwind.config.js` |
| Component library | shadcn `base-nova` style, RSC enabled; aliases: `@/components`, `@/lib`, `@/lib/utils`, `@/components/ui`, `@/hooks` |

---

## Deployment

| Platform | Entrypoint | Build | Notes |
|----------|-----------|-------|-------|
| Frontend (Vercel) | `vercel.json` rewrites `/api/:path` → backend | `next build` | Rewrite target: `https://hiremind-server.vercel.app/api/:path` |
| Backend (Render) | `node dist/server.js` | `npm run build` (tsc) | ESM (`"type": "module"`) |

Backend can also deploy to Vercel as a serverless function via `api/index.ts` (`@vercel/node`).

---

## Screenshots

<!-- TODO: Add screenshots -->
<!-- - Recruiter dashboard with analytics -->
<!-- - Job posting form -->
<!-- - Applicant review interface -->
<!-- - AI cover letter generator -->

---

## Notes for Contributors

- The route folder `regester/` is intentionally misspelled — do not rename
- `backend/src/config/db.ts` is dead code (never imported, targets `HireMind` instead of `TalentAI`)
- `backend/src/middlewares/role.middleware.ts` duplicates `auth.middleware.ts` — import `requireRole` from `auth.middleware.ts`
- `openai`, `groq-sdk`, and `esbuild` are listed in `package.json` dependencies but have zero imports in source
