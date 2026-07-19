<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Today's Work Summary (20 July 2026)

## Backend Vercel Deployment Fix
- Express.js backend Vercel-এ deploy করা হয়েছে, কিন্তু `FUNCTION_INVOCATION_FAILED` error আসছিল
- সমস্যা: esbuild bundle MongoDB driver native modules properly bundle করত পারে না
- **Solution**: `api/index.mjs` file create করা হয়েছে — esbuild দিয়ে ESM bundle, MongoDB/Stripe/jose native modules external রাখা হয়েছে
- `vercel.json` updated: `builds` config `api/index.mjs` point করে
- `api/index.mjs` git commit + push করা হয়েছে

## Frontend Backend Connection
- `NEXT_PUBLIC_API_URL` env var Vercel-এ `https://talentai-server.vercel.app` set করা হয়েছে
- Frontend Vercel-এ redeploy করা হয়েছে
- CORS verification: `Access-Control-Allow-Origin: https://talentai1-sable.vercel.app` ✅

## Live URLs
| Service | URL | Status |
|---------|-----|--------|
| Frontend | https://talentai1-sable.vercel.app | ✅ Running |
| Backend | https://talentai-server.vercel.app | ✅ Running |

## Verification Results
- All frontend pages (/, /plans, /login, /jobs) returning HTTP 200 ✅
- Backend API (`/api/payments/plans`) returning MongoDB data ✅
- CORS preflight (OPTIONS) returning 204 with correct origin ✅

## Pending Work
- Stripe payment flow testing (need STRIPE_SECRET_KEY on backend Vercel + webhook setup)
- Full end-to-end payment test: login → plans → upgrade → Stripe checkout → success
