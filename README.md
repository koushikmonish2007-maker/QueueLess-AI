# QueueLess AI 2.0 — Phase 2: Real-time Backend & Supabase Architecture

> **One Platform. Every Queue. Less Waiting.**  
> *Skip the Queue. Own Your Time.*

**Team:** GEN4X  
**Event:** INTELLATHON 2K26  
**Phase:** 2 — Secure Real-time Queue Management Backend & Cloud Architecture

---

## 🌟 Overview & What’s New in Phase 2

QueueLess AI 2.0 upgrades the universal virtual queue platform into a fully functional, real-time backend-driven system. It connects citizen queue booking, dynamic wait predictions, smart departure planning, and facility counter dispatching through **Supabase PostgreSQL**, **Row Level Security (RLS)**, and **Supabase Realtime WebSockets**.

### Key Additions in Phase 2:
1. **Supabase Client & Auth:** `@supabase/supabase-js` integrated with session persistence, role-based profiles (`citizen`, `facility_admin`, `super_admin`), and safe `.env` configuration.
2. **PostgreSQL Relational Schema:** Complete SQL migrations in `supabase/migrations/` covering `profiles`, `facilities`, `services`, `counters`, `queue_tokens`, `queue_events`, and `notifications`.
3. **Atomic Concurrency:** PostgreSQL stored procedures (`call_next_token` with `FOR UPDATE SKIP LOCKED`) to eliminate race conditions between multiple desk operators.
4. **Duplicate Booking Prevention:** Database partial unique constraint preventing a citizen from booking duplicate active tickets for the same service.
5. **Real-time Queue Synchronization:** Supabase Realtime channel listeners automatically propagating desk calls, cancellations, and status changes across citizen and admin screens.
6. **Dynamic Prediction Engine:** Queueing theory range calculations (`15 - 25 mins`) with statistical variance accounting for service speed deviations.
7. **Smart Departure Recommendations:** Citizen-customizable travel time and safety buffer inputs with real-time urgency alerts (`stay_put`, `leave_soon`, `leave_now`).
8. **Interactive Local Fallback:** When Supabase credentials are not yet entered in `.env`, the system automatically runs in a local reactive store mode, allowing evaluators to immediately test all citizen and admin flows without being blocked.

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite 8
- **Backend / Database:** Supabase (PostgreSQL 15+, Supabase Auth, Supabase Realtime)
- **Styling:** Tailwind CSS v3.4 + custom modern SaaS design tokens
- **Routing:** React Router v7 (`react-router-dom`)
- **Icons & Charts:** Lucide React (`lucide-react`) & Recharts (`recharts`)
- **Security:** PostgreSQL Row Level Security (RLS) policies & database functions

---

## 🗄️ Database Architecture & Migrations

The database migration file is located at:  
👉 [`supabase/migrations/20261014000000_init_schema.sql`](./supabase/migrations/20261014000000_init_schema.sql)  
Sample seed dataset is located at:  
👉 [`supabase/seed.sql`](./supabase/seed.sql)

### Tables Implemented:

| Table | Primary Key | Purpose | RLS Access Summary |
|---|---|---|---|
| `public.profiles` | `id` (UUID references `auth.users`) | Stores user identity, role, and assigned facility. | Users can read profiles and update their own metadata. Role tampering is blocked via trigger. |
| `public.facilities` | `id` (UUID) | Registered institutions (hospitals, banks, etc.). | Public read for active facilities; Admin update restricted to assigned facility. |
| `public.services` | `id` (UUID) | Departmental service categories & average durations. | Public read; Admin write restricted to assigned facility. |
| `public.counters` | `id` (UUID) | Operational service desks and staff members. | Public read for queue load calculation; Admin write. |
| `public.queue_tokens` | `id` (UUID) | Virtual queue tickets with statuses (`waiting`, `called`, `in_service`, `completed`, `cancelled`). | Citizens read/manage their own tickets; Facility admins manage their facility's tickets. |
| `public.queue_events` | `id` (UUID) | Immutable audit log of state changes. | Admin read; Generated via secure procedures. |
| `public.notifications` | `id` (UUID) | In-app alerts for token calls and status changes. | User-isolated read/update (`user_id = auth.uid()`). |

### Atomic Database Functions:
- `book_queue_token(p_facility_id, p_service_id, p_visitor_name, p_phone, p_priority)`: Checks duplicate active tokens, increments today's ticket sequence atomically, inserts token, logs audit event, and returns row.
- `call_next_token(p_counter_id)`: Verifies caller's facility authorization, selects next waiting token using `FOR UPDATE SKIP LOCKED` (concurrency safe), sets counter to `busy`, and generates citizen notification.
- `start_token_service(p_token_id)`: Marks ticket `in_service`.
- `complete_token_service(p_token_id)`: Marks ticket `completed` and frees counter back to `active`.
- `cancel_queue_token(p_token_id, p_reason)`: Allows citizen or admin to cancel pending tickets and releases counter if called.
- `update_counter_status(p_counter_id, p_status)`: Toggles desk between `active`, `busy`, `break`, and `offline`.

---

## ⚡ Supabase Setup Instructions

Follow these exact steps to connect your own Supabase project:

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project (or use [database.new](https://database.new)).
2. Choose your preferred region and database password.

### Step 2: Run SQL Migrations
1. In the Supabase Dashboard, open the **SQL Editor** from the left navigation bar.
2. Click **New Query**, open the file [`supabase/migrations/20261014000000_init_schema.sql`](./supabase/migrations/20261014000000_init_schema.sql), paste its entire contents, and click **Run**.
3. Create a second query, open [`supabase/seed.sql`](./supabase/seed.sql), paste its contents, and click **Run** to load initial facilities and desks.

### Step 3: Enable Realtime for Tables
The migration automatically executes:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.queue_tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE public.counters;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
```
Verify under **Database** -> **Replication** that `queue_tokens` and `counters` are enabled.

### Step 4: Configure Local Environment Variables
1. In your Supabase Dashboard, navigate to **Project Settings** -> **API**.
2. Copy the **Project URL** and the **anon / public** key.
3. In the root of this project, create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
4. Paste your credentials into `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. Restart your Vite development server:
   ```bash
   npm run dev
   ```

> **Security Note:** Never put the `service_role` key into client-side code or `.env`. Only the public `anon` key is used by the frontend.

---

## 🧪 Testing Phase 2 Functionality

The application includes an integrated **Evaluation Persona Switcher** in the top navigation bar, allowing evaluators to seamlessly test both Citizen and Facility Administrator capabilities:

### Test 1: Virtual Token Booking & Duplicate Prevention
1. Navigate to [`/facilities`](http://localhost:5173/facilities).
2. Click **"View Services & Queue"** on *Apex Super Specialty Hospital*.
3. Choose **General OPD Consultation** and click **Book Token**.
4. Confirm booking. Notice the unique token number (e.g., `H-104`) and estimated wait range.
5. Try booking the same service again immediately with the same citizen: The system blocks duplicate creation with a clear warning: *"Duplicate booking detected: You already hold token #... for this service."*

### Test 2: Real-time Queue Telemetry & Departure Planning
1. Navigate to [`/citizen`](http://localhost:5173/citizen).
2. Review the live queue position, people ahead, and progress bar.
3. Click **"Adjust Buffer"** in the Departure Recommendation card:
   - Adjust transit time (e.g., `25 min`) and safety buffer (e.g., `10 min`).
   - Notice the recommended departure time dynamically recalibrates.
   - Urgency pill updates automatically (`stay_put` -> `leave_soon` -> `leave_now`).

### Test 3: Token Cancellation
1. On the Citizen Dashboard, click **"Cancel Token"** on an active ticket.
2. Select a cancellation reason and confirm.
3. The ticket transitions to `cancelled`, freeing queue capacity in real time.

### Test 4: Facility Administrator Queue Dispatching
1. Click the User Persona in the top-right navigation and switch to **"Admin (Dr. Mehta)"** (or navigate to [`/admin`](http://localhost:5173/admin)).
2. Under Operational Counter Stations, click **"Call Next"**:
   - The next waiting ticket is atomically assigned to the desk.
   - Counter status transitions to `busy`.
   - Citizen dashboard receives a real-time turn notification banner.
3. In the Queue Roster Table:
   - Click **"Serve"** to transition from called to `in_service`.
   - Click **"Complete"** to finish the appointment and free the counter back to `active`.
4. Click **"Status Toggle"** on Counter 101 to rotate its operational state (`active` -> `break` -> `offline`).

---

## 📈 Prediction Engine Disclosure

The wait time calculation engine uses transparent operations research heuristics:
- **Baseline Wait:** $\text{Wait} = \frac{\text{People Ahead} \times \text{Average Service Minutes}}{\max(1, \text{Active Counters})}$
- **Variance Range:** Displays an expected range $(-20\% \text{ to } +30\%)$ accounting for consultation complexity variances.
- **Disclosure:** This is a deterministic queueing-theory model prototype, not a black-box machine-learning model.

---

## 📁 Project Directory Map

```
QueueLess AI/
├── index.html                  # HTML entry with Plus Jakarta Sans & SEO tags
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Custom theme tokens & brand colors
├── postcss.config.js           # PostCSS configuration
├── package.json                # Project dependencies
├── .env.example                # Template for Supabase credentials
├── .gitignore                  # Git ignore with .env protections
├── supabase/
│   ├── migrations/
│   │   └── 20261014000000_init_schema.sql # 7 tables, RLS policies, atomic stored procedures
│   └── seed.sql                # Seed facilities, services, and counters
└── src/
    ├── context/
    │   └── AuthContext.jsx     # Supabase Auth session & role provider
    ├── components/
    │   ├── AuthModal.jsx       # Sign in / Sign up & 1-click persona switcher
    │   ├── Navbar.jsx          # Header with user persona trigger & Phase 2 badge
    │   ├── Sidebar.jsx         # Dashboard navigation sidebar
    │   ├── Footer.jsx          # Footer with Team GEN4X branding
    │   ├── FacilityCard.jsx    # Facility discovery card with live wait estimate
    │   ├── FacilityModal.jsx   # Interactive service inspection & token booking modal
    │   ├── StatCard.jsx        # Reusable metric card with glow accents
    │   ├── StatusBadge.jsx     # Visual pill badges for token & counter statuses
    │   ├── PageHeader.jsx      # Standardized header banner
    │   ├── EmptyState.jsx      # Clean empty state view
    │   └── LoadingState.jsx    # Skeleton loader
    ├── pages/
    │   ├── LandingPage.jsx     # Landing page with interactive preview
    │   ├── FacilitiesPage.jsx  # Facility discovery with multi-filter search
    │   ├── CitizenDashboard.jsx# Citizen queue tracking, departure buffer inputs, cancellation
    │   ├── AdminDashboard.jsx  # Admin desk operations: Call Next, Start, Complete, Counter toggle
    │   └── HowItWorksPage.jsx  # 6-step citizen workflow & Little's Law formula breakdown
    ├── layouts/
    │   └── MainLayout.jsx      # Root layout shell
    ├── data/
    │   └── mockData.js         # Initial relational schema & fallback mock models
    └── lib/
        ├── queuePrediction.js  # Heuristic wait range & dynamic departure calculations
        ├── queueService.js     # Unified backend data service (Supabase RPCs + local reactive store)
        └── supabaseClient.js   # Supabase client instantiation with safety fallbacks
```

---

*Engineered with precision by **Team GEN4X** for **INTELLATHON 2K26**.*
