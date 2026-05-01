# Lead CRM

A lightweight Lead Management System for tracking sales leads from first contact through to conversion. Built with React on the frontend, Node.js/Express on the backend, and PostgreSQL for persistence.

**Live Demo**: https://lead-crm-frontend-cyan.vercel.app

---

## Overview

The app lets a sales team quickly log incoming leads, track where they came from, and update their status as the conversation progresses. The dashboard gives an at-a-glance view of the pipeline how many leads are active, how many have converted, and how many have dropped off.

It was built to be simple and fast to use, with no unnecessary complexity. The entire interface fits on one screen.

---

## Screenshot

![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React + Vite | Fast dev server, simple component model |
| Backend | Node.js + Express | Lightweight, easy to structure REST APIs |
| Database | PostgreSQL | Relational structure suits lead/status data well |
| DB Hosting | Supabase | Managed Postgres, free tier, no cold starts |
| Deployment | Vercel | Simple GitHub integration, serverless-friendly |

---

## Features

**Core**
- Add leads with name, phone number, and source channel
- View all leads in a table sorted by most recently added
- Change lead status inline without leaving the page
- Delete leads with a confirmation prompt

**Bonus**
- Search leads by name or phone number (debounced)
- Filter leads by status using a dropdown
- Live dashboard counters: Total, Interested, Converted, Not Interested
- Full form validation with error feedback

---

## Project Structure

```
lead-crm/
├── backend/
│   ├── routes/
│   │   └── leads.js        # Route handlers for all 4 API endpoints
│   ├── db.js               # PostgreSQL pool configuration
│   ├── index.js            # Express app setup and entry point
│   ├── vercel.json         # Serverless deployment config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LeadForm.jsx    # Add lead form with validation
│   │   │   └── LeadTable.jsx   # Lead list with inline status update
│   │   ├── api.js              # Centralized fetch calls
│   │   └── App.jsx             # Root component, state management
│   ├── index.html
│   └── package.json
```

---

## API Reference

Base URL: `https://lead-crm-beige-two.vercel.app`

### Get all leads
```
GET /api/leads
```
Optional query params:
- `search` — filters by name or phone (case-insensitive)
- `status` — filters by exact status value

### Add a lead
```
POST /api/leads
Content-Type: application/json

{
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "source": "Call"
}
```

### Update lead status
```
PATCH /api/leads/:id
Content-Type: application/json

{
  "status": "Converted"
}
```

### Delete a lead
```
DELETE /api/leads/:id
```

---

## Database Schema

```sql
CREATE TABLE leads (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  phone      VARCHAR(20)  NOT NULL,
  source     VARCHAR(20)  NOT NULL CHECK (source IN ('Call', 'WhatsApp', 'Field')),
  status     VARCHAR(20)  NOT NULL DEFAULT 'Interested'
                          CHECK (status IN ('Interested', 'Not Interested', 'Converted')),
  created_at TIMESTAMP    DEFAULT NOW()
);
```

The `CHECK` constraints on `source` and `status` enforce valid values at the database level, not just in application code. This prevents bad data from entering the system even if requests bypass the API.

---

## Local Setup

### Prerequisites
- Node.js v18+
- A PostgreSQL database (local or Supabase)

### Steps

1. Clone the repo

```bash
git clone https://github.com/varshiniui/lead-crm.git
cd lead-crm
```

2. Install backend dependencies and configure environment

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=5000
```

3. Install frontend dependencies and configure environment

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

4. Run both servers

```bash
# Terminal 1 — backend
cd backend
node index.js

# Terminal 2 — frontend
cd frontend
npm run dev
```

App runs at `http://localhost:5173`.

---

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `DATABASE_URL` | Full PostgreSQL connection string |
| `PORT` | Port for the Express server (default: 5000) |
| `CLIENT_URL` | Frontend origin for CORS (e.g. https://yourapp.vercel.app) |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

---

## Design Decisions

**Why a single `DATABASE_URL` instead of separate host/user/password vars?**  
Supabase and most managed Postgres providers give a connection string by default. Using it directly is simpler and works cleanly with connection poolers.

**Why Supabase over a local Postgres on a cloud VM?**  
For a project at this scale, a managed database removes the overhead of backups, updates, and uptime monitoring. Supabase's free tier is always on, no cold starts unlike some backend hosting options.

**Why keep the frontend and backend as separate Vercel projects?**  
It keeps the deployment boundary clear. The backend can be updated or scaled independently without triggering a frontend rebuild, and it more closely mirrors how a real production setup would be structured.

---

## Known Limitations

- No authentication, anyone with the URL can add or delete leads
- No pagination, the leads table loads all records at once, which would become slow at scale
- Status history is not tracked, there's no audit trail of when a lead moved between stages

## Possible Improvements

- Add user authentication with role-based access (sales rep vs manager)
- Paginate the leads table on the backend
- Add a notes field per lead for free-text comments
- Track status change history with timestamps
- Export leads to CSV