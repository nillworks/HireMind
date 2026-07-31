<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/brain-circuit.svg" alt="HireMind Logo" width="120" height="120" />
  <h1>🚀 HireMind</h1>
  <p><strong>Next-Generation AI-Powered Job Board Platform</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge&logo=express" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-Native%20Driver-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
    <img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google" alt="Gemini" />
    <img src="https://img.shields.io/badge/Payments-Stripe-635BFF?style=for-the-badge&logo=stripe" alt="Stripe" />
  </p>
</div>

---

## 📖 Overview

**HireMind** is an enterprise-grade, multi-role job board platform designed to bridge the gap between talent and opportunity using advanced Artificial Intelligence. Built with a decoupled architecture featuring a modern Next.js 16 frontend and a robust Express/TypeScript backend, HireMind offers tailored experiences for **Seekers**, **Recruiters**, and **Admins**.

---

## ✨ Core Features

### 👨‍💼 For Recruiters
- **Smart Applicant Tracking (ATS):** Create, edit, and delete job postings. Track the complete applicant lifecycle.
- **AI Resume Classification:** Automatically score and classify uploaded resumes against job descriptions.
- **Advanced Analytics Dashboard:** Visualize job views, application volume, and recruitment pipeline health.
- **Company Branding:** Dedicated recruiter profiles to showcase company culture and benefits.

### 👩‍💻 For Job Seekers
- **Intelligent Search:** Advanced filtering by category, type, location, and salary.
- **AI Cover Letter Generator:** Instantly draft personalized cover letters tailored to specific job listings.
- **AI Resume Analyzer:** Upload resumes for deep AI analysis and actionable feedback.
- **Smart Job Recommendations:** Machine learning-driven suggestions based on profile and history.

### 🛡️ For Administrators
- **Total Platform Control:** Comprehensive user management (block, role assignment, deletion).
- **Content Moderation:** Approve/reject job listings and manage the platform's blog.
- **Subscription Management:** Configure Stripe plans (create, edit pricing, seed).
- **System Analytics:** High-level metrics on platform health and user growth.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|-------|------------|---------|
| **Frontend** | Next.js 16, React 19 | App Router, Server Components |
| **Styling** | Tailwind CSS v4, shadcn/ui | Custom base-nova styling, Lucide Icons |
| **Backend** | Express, TypeScript | Modular architecture, 13 feature modules |
| **Database** | MongoDB | Native driver for optimized performance |
| **Authentication** | better-auth | Google OAuth + Email/Password, EdDSA JWT |
| **AI Engine** | Google Gemini | `gemini-3-flash-preview` |
| **Payments** | Stripe | Checkout sessions, webhooks, subscriptions |

---

## 🏗️ Architecture & Project Structure

The project is structured into two independent npm packages with no monorepo tooling to ensure strict boundary separation.

```text
hiremind-website/
├── frontend/                    # Next.js Application (Port 3000)
│   ├── src/app/                 # App Router & API proxies
│   ├── src/components/          # shadcn/ui component library
│   ├── src/lib/                 # Auth clients, API utils (fetchClient)
│   └── globals.css              # Tailwind v4 @theme config
│
└── backend/                     # Express API (Port 5000)
    ├── src/app.ts               # Express factory & middleware pipeline
    ├── src/server.ts            # Entrypoint & DB Connection
    └── src/modules/             # Domain-driven feature modules (13 total)
```

### 🔒 Authentication Flow
- **Identity Provider:** `better-auth` singleton with a dedicated connection to the `TalentAI` database.
- **Token Format:** EdDSA/Ed25519 JWT via `jose`.
- **Client-Side:** JWT cached via `/api/auth/token` with automatic retry logic on `401`/`403`.
- **Middleware Guard:** `src/proxy.ts` handles strict route protection and redirects.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **MongoDB** instance (Atlas or local)
- **API Keys:** Google Gemini, Stripe (Secret + Webhook + Price IDs), Google OAuth credentials.

### Installation & Setup

1. **Clone the repository and install dependencies:**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

2. **Configure Environment Variables:**

   <details>
   <summary><b>Backend <code>.env</code></b></summary>
   
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:3000
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_key
   STRIPE_SECRET_KEY=your_stripe_secret
   STRIPE_PRO_SEEKER_PRICE_ID=price_xxx
   STRIPE_PRO_RECRUITER_PRICE_ID=price_yyy
   ```
   </details>

   <details>
   <summary><b>Frontend <code>.env</code></b></summary>
   
   ```env
   BETTER_AUTH_SECRET=your_auth_secret
   BETTER_AUTH_URL=http://localhost:3000
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   GOOGLE_CLIENT_ID=your_google_id
   GOOGLE_CLIENT_SECRET=your_google_secret
   STRIPE_SECRET_KEY=your_stripe_secret
   NEXT_PUBLIC_IMGBB_KEY=your_imgbb_key
   ```
   </details>

3. **Start the Development Servers:**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run server # Runs on http://localhost:5000
   
   # Terminal 2: Frontend
   cd frontend
   npm run dev    # Runs on http://localhost:3000
   ```

---

## 📡 API Reference Overview

The backend uses a standard response contract:
```typescript
{ success: true, data: { ... } } // Success
{ success: false, message: "Error description" } // Error
{ success: true, data: [...], pagination: { total, page, limit, totalPages, hasMore } } // Paginated
```

**Key Endpoints:**
- `/api/auth/*` - Authentication & Registration
- `/api/jobs/*` - Public job board endpoints
- `/api/ai/*` - AI integrations (Cover Letters, Recommendations, Resume parsing)
- `/api/payments/*` - Stripe checkout and subscription hooks
- `/api/admin/*` & `/api/recruiter/*` - Role-protected management routes

> *For full API documentation, refer to the route handlers within `backend/src/modules/`.*

---

## 🛠️ Notes for Contributors

Please adhere to the following project-specific conventions:

> [!WARNING]  
> **Legacy Code & Quirks**
> - The route folder `regester/` is intentionally misspelled — **DO NOT** rename it.
> - `backend/src/config/db.ts` is dead code (targets the wrong DB name).
> - `backend/src/middlewares/role.middleware.ts` is a duplicate. Always use `requireRole` from `auth.middleware.ts`.
> - The backend uses strict **ESM** (`"type": "module"`). All local imports must include explicit `.js` extensions.

> [!NOTE]  
> **Styling Conventions**
> - Brand colors are defined in `globals.css` via `@theme` (`PrimaryColor` for Red, `SrcPrimaryColor` for Green).
> - Tailwind v4 is used entirely without a `tailwind.config.js` file.

---

<div align="center">
  <p>Built with ❤️ by the HireMind Team.</p>
</div>
