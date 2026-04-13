## Journal Assistant

This repo now contains:

- `frontend/`: the Next.js frontend
- `backend/`: a separate FastAPI backend

Current milestone:

- real Google-authenticated daily-log slice
- Next.js frontend on the Vercel-style App Router stack
- FastAPI backend prepared for GCP-oriented deployment later
- weekly summary, final report, and evaluation-prep generation still scaffolded

## Frontend

The frontend now lives in `frontend/` and follows an MVVM-style structure:

- `frontend/src/modules/*/models`: feature data types and mock/domain data
- `frontend/src/modules/*/view-models`: React Query hooks and screen state
- `frontend/src/modules/*/views`: screen rendering
- `frontend/src/shared/*`: shell, shared UI, providers, and utilities

Run the Next.js app:

```bash
cd frontend
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

Add frontend env values before testing auth:

```bash
cp frontend/.env.example frontend/.env.local
```

## Backend

The backend lives in `backend/` and uses `fastapi[standard]` plus SQLAlchemy and JWT verification for the authenticated daily-log slice.

Install backend dependencies and run it locally:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
fastapi dev
```

Add backend env values before testing the live slice:

```bash
cp backend/.env.example backend/.env
```

Apply the SQL migration in `backend/supabase/migrations/` to your Supabase Postgres database before using the real dashboard and daily-log routes.

## Deployment Direction

- Frontend is intended for Vercel-style deployment.
- Backend now targets GCP-oriented deployment later in the roadmap.
- `backend/.fastapicloud` should be treated as legacy residue, not the default deployment path for new work.
