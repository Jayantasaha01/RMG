# ComplyRMG — RMG Factory Compliance Platform

A production-ready SaaS frontend for managing BSCI, WRAP, and RSC compliance in Bangladesh's RMG sector.

## Tech Stack

| Layer       | Tool                          | Why                                               |
|-------------|-------------------------------|---------------------------------------------------|
| UI          | React 18 + React Router v6    | Component model, SPA routing                     |
| Build       | Vite 5                        | Sub-second HMR, fast production builds           |
| Styling     | Tailwind CSS + CSS variables  | Utility classes + design token system            |
| State       | useReducer + Context          | No extra deps; swap to Zustand if state grows    |
| Database    | Supabase (PostgreSQL)         | Free tier handles 50+ customers; auth included   |
| File Storage| Cloudflare R2                 | Zero egress fees for document uploads            |
| Notifications| WhatsApp Business API (Twilio)| 90%+ open rate vs email for BD compliance teams |
| Payments    | bKash Business API            | Primary payment method for RMG factories         |
| Hosting     | Railway.app or Render.com     | ~$5–20/mo, zero DevOps needed at launch          |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env and fill in Supabase keys
cp .env.example .env

# 3. Start dev server (opens at http://localhost:3000)
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build locally
npm run preview
```

## Project Structure

```
src/
├── main.jsx                    # React entry — providers mounted here
├── App.jsx                     # Route tree
├── index.css                   # Design system (tokens + component CSS)
│
├── data/
│   ├── seedData.js             # Demo workers, certs, incidents
│   └── checklists.js           # BSCI + WRAP full checklist definitions
│
├── store/
│   └── AppContext.jsx          # Global state (useReducer) + all action types
│
├── hooks/
│   ├── useToast.jsx            # Toast notification context
│   └── useAttachments.js       # File store (blob URLs → swap to R2 in prod)
│
├── utils/
│   └── helpers.js              # daysUntil, certStatus, nextWorkerId, stableOT
│
├── components/
│   ├── layout/
│   │   ├── Layout.jsx          # Sidebar + Topbar + <Outlet>
│   │   ├── Sidebar.jsx         # Nav, live badge counts, BSCI score
│   │   └── Topbar.jsx          # Page title + factory name
│   │
│   └── ui/
│       ├── Modal.jsx           # Backdrop + keyboard close + animation
│       ├── UploadZone.jsx      # Drag-and-drop file input with chip preview
│       ├── FileViewer.jsx      # Lightbox (images) / embed (PDFs) — context provider
│       ├── FileChip.jsx        # Clickable file pill → opens FileViewer
│       ├── WorkerDrawer.jsx    # Slide-in panel with worker docs by category
│       ├── Badge.jsx           # Color-coded status pill
│       ├── StatCard.jsx        # Metric card with colored corner glow
│       └── Toast.jsx           # Notification stack (reads useToast context)
│
└── pages/
    ├── Dashboard.jsx           # BSCI ring, cert status, activity, deadlines
    ├── Workers.jsx             # Worker table, search/filter, add modal, drawer
    ├── Certifications.jsx      # Expiry tracker, file attachment, WhatsApp remind
    ├── AuditChecklists.jsx     # BSCI/WRAP toggle, per-item evidence upload
    ├── WageRegister.jsx        # Wage table, violation flagging, PDF export
    └── Incidents.jsx           # Incident log, photo attachments, resolve action
```

## Connecting Supabase (Backend)

1. Create a project at https://supabase.com
2. Run the SQL schema below in the Supabase SQL editor
3. Copy your project URL and anon key into `.env`

```sql
-- Workers
create table workers (
  id text primary key,
  name text not null,
  dept text,
  grade text,
  wage integer,
  status text,
  joined date,
  nid text default 'pending',
  created_at timestamptz default now()
);

-- Certifications
create table certs (
  id text primary key,
  name text,
  type text,
  issuer text,
  certno text,
  issued date,
  expiry date,
  created_at timestamptz default now()
);

-- Document attachments
create table attachments (
  id text primary key,
  entity_type text,   -- 'worker' | 'cert' | 'incident' | 'checklist_item'
  entity_id text,
  category text,
  name text,
  storage_path text,  -- Cloudflare R2 key
  size text,
  mime_type text,
  created_at timestamptz default now()
);

-- Incidents
create table incidents (
  id text primary key,
  type text,
  date date,
  location text,
  description text,
  action text,
  resolved boolean default false,
  created_at timestamptz default now()
);
```

4. Replace the seed data imports in `AppContext.jsx` with Supabase queries using the JS client:

```js
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
const { data: workers } = await supabase.from('workers').select('*')
```

## File Upload → Cloudflare R2

Currently `useAttachments.js` creates local `blob:` URLs (in-memory). To persist files:

1. Set up a Cloudflare R2 bucket
2. Create a small backend route (Node/Express or Supabase Edge Function):
   ```js
   // POST /api/upload — receives multipart form, uploads to R2, returns URL
   ```
3. In `useAttachments.js`, replace `URL.createObjectURL(file)` with:
   ```js
   const formData = new FormData()
   formData.append('file', file)
   const res = await fetch(import.meta.env.VITE_FILE_UPLOAD_URL, { method: 'POST', body: formData })
   const { url } = await res.json()
   ```

## Deploying to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and init
railway login
railway init

# Set env vars
railway variables set VITE_SUPABASE_URL=...
railway variables set VITE_SUPABASE_ANON_KEY=...

# Deploy
railway up
```

## Pricing Tiers (reference)

| Plan         | Price/mo  | Workers | Audit templates |
|--------------|-----------|---------|-----------------|
| Starter      | ৳4,999    | ≤200    | BSCI + WRAP     |
| Professional | ৳12,999   | ≤800    | All 6+          |
| Enterprise   | ৳29,999   | Unlimited | Custom        |

---
Built for Dhaka's RMG sector. Bootstrapped, capital-efficient, BSCI-ready.
