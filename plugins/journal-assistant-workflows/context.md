# Journal Assistant Repo Context

## Repo Shape

- `frontend/`: Next.js frontend
- `backend/`: FastAPI backend

## Frontend

- Stack: Next.js 14 App Router, Tailwind CSS, shadcn/ui, TanStack Query
- Architecture:
  - `frontend/src/modules/*/{models,view-models,views}`
  - `frontend/src/shared/*`
  - `frontend/src/app/*` for routes and route handlers
- Preferred hosting direction: Vercel for frontend deployment workflows
- Canonical routes/surfaces:
  - dashboard
  - daily log
  - weekly summary
  - final report
- Current visual direction:
  - calm editorial workspace
  - `Manrope` for body and UI text
  - `Newsreader` for display headings
  - restrained mint palette centered on `#57C3AE`
  - paper-like surfaces, soft borders, subtle motion
  - avoid dashboard-card mosaics and noisy chrome
- Frontend commands:
  - `cd frontend && npm run dev`
  - `cd frontend && npm run lint`
  - `cd frontend && npm run build`

## Backend

- Stack: FastAPI via `fastapi[standard]`
- Entrypoint: `backend/main.py`
- FastAPI tool config: `backend/pyproject.toml` with `main:app`
- Architecture:
  - `backend/app/api/routes/*` for route modules
  - `backend/app/models/dtos.py` for request/response DTOs
  - `backend/app/services/*` for service-layer logic
  - `backend/tests/*` for backend tests
- Backend commands:
  - `cd backend && fastapi dev`
  - `cd backend && python -c "from main import app; print(app.title)"`
  - `cd backend && python3 -m unittest discover -s tests`

## Deployment Direction

- Prefer Vercel conventions and workflows for frontend deployment guidance.
- Prefer GCP for new backend deployment guidance and infrastructure choices.
- Treat `backend/.fastapicloud` as legacy linked-project residue, not the canonical deployment direction for new work.

## Working Rules

- Do not assume root-level frontend commands.
- Run frontend commands from `frontend/`.
- Run backend commands from `backend/`.
- Frontend verification should normally include `npm run lint` and `npm run build`.
- Backend verification should match the change: import check, health check, or local FastAPI startup.
