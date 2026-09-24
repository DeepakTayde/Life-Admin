# Life Admin — Document & Renewal Tracker

A modern, production-grade web application to manage important personal documents and track upcoming renewal and expiry dates in one place. Built with Next.js 16, React 19, TypeScript, Tailwind CSS, PostgreSQL, Prisma, and Zod.

---

## 📌 Project Overview

People frequently misplace or lose track of critical personal documents — passports, driving licences, vehicle registrations, car insurance, health policies, certifications, and warranties — leading to missed deadlines, lapsed policies, and late penalties.

**Life Admin** solves this problem by providing:
- **Centralized Document Vault**: Store document numbers, issue dates, expiry dates, categories, and renewal notes.
- **Automated Expiry Status**: Real-time classification into `Active`, `Expiring Soon` (&le; 30 days), `Expired`, and `No Expiry`.
- **Actionable Dashboard**: High-level metrics showing total, expiring-soon, and expired documents with an upcoming renewal timeline.
- **Fast Search & Multi-Filters**: Filter instantly by category or status, search by title or policy number, and sort by expiry date or recency.
- **Strict User Security & Ownership**: Fully isolated multi-tenant architecture where User A can never view, edit, or delete User B's records.
- **"Add with AI" Extraction**: Intelligent text parser extracting structured details from emails or renewal notices with human review before saving.

---

## 🛠 Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication**: JWT session tokens via [jose](https://github.com/panva/jose) with HTTP-only cookies and [bcryptjs](https://github.com/dcodeIO/bcrypt.js) password hashing
- **Testing**: [Vitest](https://vitest.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📐 Architecture

```text
Browser / Client
       │
       ▼
Next.js 16 App Router
  ├── Server Components (Dashboard, Documents View, Detail Pages)
  │       │
  │       ▼
  │   Service Layer (documentService, dashboardService)
  │       │
  │       ▼
  │   Prisma ORM
  │       │
  │       ▼
  │   PostgreSQL Database
  │
  ├── Client Components (Search/Filter Toolbar, Forms, Modals)
  │       │
  │       ▼
  └── Route Handlers (/api/documents, /api/auth, /api/ai/extract)
          ├── Authentication Check (Session Cookie)
          ├── Zod Schema Validation (Boundary Sanitization)
          ├── Ownership Verification (userId constraint)
          └── Service Layer ──► Prisma ORM ──► PostgreSQL
```

### Folder Structure

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx         # Login page
│   │   └── register/page.tsx      # Registration page
│   ├── api/
│   │   ├── ai/extract/route.ts    # AI text extractor endpoint
│   │   ├── auth/                  # login, register, logout, me endpoints
│   │   ├── dashboard/route.ts     # Dashboard summary API
│   │   └── documents/             # Document CRUD route handlers
│   ├── dashboard/page.tsx         # Dashboard overview (Server Component)
│   ├── documents/
│   │   ├── page.tsx               # Documents list (Server Component)
│   │   ├── new/page.tsx           # Add document page
│   │   └── [id]/
│   │       ├── page.tsx           # Document detail view
│   │       └── edit/page.tsx      # Edit document page
│   ├── layout.tsx                 # Root layout with session Navbar & Footer
│   ├── loading.tsx                # Skeleton loading UI
│   ├── error.tsx                  # Global error boundary
│   └── not-found.tsx              # Custom 404 page
│
├── components/
│   ├── dashboard/                 # StatCard, UpcomingRenewals
│   ├── documents/                 # DocumentTable, DocumentCard, DocumentForm, AiExtractModal
│   ├── layout/                    # Navbar, Footer
│   └── ui/                        # StatusBadge, CategoryBadge
│
├── lib/
│   ├── auth.ts                    # bcrypt + jose JWT session cookie helpers
│   ├── prisma.ts                  # Singleton Prisma Client
│   ├── utils.ts                   # Expiry calculation, date formatting, badge styles
│   └── validations/               # Zod validation schemas for Document & Auth
│
├── services/
│   ├── dashboard.service.ts       # Dashboard statistics & renewal timeline
│   └── document.service.ts        # Scoped document CRUD and filtering
│
└── types/
    ├── api.ts                     # Standardized API response contracts
    └── document.ts                # Categories, statuses, and DocumentItem interfaces
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js `v20+` or `v22+`
- PostgreSQL database (local or cloud like Neon, Supabase, Railway)
- npm or pnpm

### 2. Installation

```bash
git clone https://github.com/DeepakTayde/Life-Admin.git
cd Life-Admin
npm install
```

### 3. Environment Variables Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure your `.env` values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/life_admin?schema=public"
AUTH_SECRET="your-secure-random-secret-key-at-least-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GEMINI_API_KEY="" # Optional: for Gemini AI extraction
```

### 4. Database Migration & Prisma Generation

```bash
# Push schema to database
npx prisma db push

# Or run standard migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 5. Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

The test suite validates expiry business logic, Zod validation boundaries, and cross-user authorization security.

```bash
npm run test
```

### Test Coverage Highlights:
- **Expiry Calculations**: Unit tests validating `NO_EXPIRY`, `EXPIRED`, `EXPIRING_SOON` (&le; 30 days), and `ACTIVE` thresholds.
- **Validation Schemas**: Ensures field lengths, category enums, and chronological consistency (`issueDate <= expiryDate`).
- **Security & Multi-Tenant Isolation**: Verifies that User A cannot read, update, or delete User B's documents.

---

## 🔒 Security & Privacy Highlights

1. **Authorization at Query Level**: Every read, update, and delete query requires `where: { id, userId }`. No client-supplied user ID is ever trusted.
2. **HTTP-only Session Cookies**: JWT session tokens signed using HS256 via Web Crypto (`jose`) and transmitted over secure HTTP-only cookies.
3. **Zod Boundary Sanitization**: All external inputs are validated and stripped of unrequested fields before touching business logic or the database.
4. **Safe Error Handling**: Internal database exceptions and stack traces are logged server-side and never leaked to client responses.

---

## 🚢 Production Deployment (Vercel)

1. Connect your GitHub repository to Vercel.
2. Set Environment Variables in the Vercel dashboard:
   - `DATABASE_URL`: Production PostgreSQL connection string (e.g. Neon, Supabase)
   - `AUTH_SECRET`: Random 32+ character secret
   - `NEXT_PUBLIC_APP_URL`: Your live domain (e.g., `https://life-admin.vercel.app`)
   - `GEMINI_API_KEY`: (Optional) Google Gemini API key
3. Run Prisma deployment migration:
   ```bash
   npx prisma migrate deploy
   ```
4. Deploy the application (`npm run build`).

---

## 👨‍💻 Author & Credits

Built by **Anu**

- [GitHub Profile](https://github.com)
- [LinkedIn Profile](https://linkedin.com)
