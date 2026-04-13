---
name: journal-assistant-fullstack
description: Use when a task spans the Journal Assistant frontend and backend, needs routing between `frontend/` and `backend/`, connects UI to APIs, or needs backend deployment-aware guidance with GCP as the preferred cloud direction.
---

# Journal Assistant Full-Stack

Read [../../context.md](../../context.md) before making decisions that depend on repo structure, stack, or deployment direction.

Use this skill when the task touches both app layers or when it is unclear which side owns the work.

## What this skill handles

- frontend and backend changes in one task
- API and UI coordination
- deciding whether work belongs in `frontend/` or `backend/`
- backend deployment-aware work, with GCP as the default cloud direction
- repo-specific verification across both halves

## Routing rules

- Use `frontend/` for:
  - App Router routes and screens
  - MVVM module work under `src/modules/*`
  - shared UI, layout, motion, and client data flows
- Use `backend/` for:
  - FastAPI routes and services
  - backend runtime or deployment configuration
  - health checks, app entrypoint, and Python package config
- If the task spans both, inspect both sides before editing either one.

## Repo rules

- Never run frontend commands from repo root.
- Run frontend work from `frontend/`.
- Run backend work from `backend/`.
- Treat `backend/.fastapicloud` as legacy, not as the source of truth for new deployment guidance.
- Prefer GCP for backend hosting/infrastructure discussions unless the user explicitly asks about the old FastAPI Cloud linkage.

## Verification defaults

- Frontend: `cd frontend && npm run lint && npm run build`
- Backend: use the smallest valid check for the change, usually:
  - `cd backend && python -c "from main import app; print(app.title)"`
  - or `cd backend && fastapi dev` when runtime behavior matters

## Handoff decisions

- If the task is purely frontend implementation, prefer `journal-assistant-frontend-implementation`.
- If the task is purely UI refinement or art direction, prefer `journal-assistant-frontend-polish`.
- If the task is purely backend API, DTO, router, or service work, prefer `journal-assistant-backend-api`.
- If the task is mainly about backend hosting, deployment flow, env strategy, or runtime operations on GCP, prefer `journal-assistant-backend-gcp`.
- Stay with this skill when the task crosses boundaries or the correct ownership is unclear.
