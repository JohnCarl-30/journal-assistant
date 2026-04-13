---
name: journal-assistant-backend-api
description: Use when implementing or refactoring the Journal Assistant backend in `backend/`, especially for FastAPI routes, DTOs, service-layer logic, request validation, tests, and API contracts that support the frontend.
---

# Journal Assistant Backend API

Read [../../context.md](../../context.md) before changing backend structure, route ownership, or verification flow.

Use this skill for FastAPI implementation work in this repo.

## What this skill handles

- FastAPI route work under `backend/app/api/routes/*`
- DTO and request model updates in `backend/app/models/dtos.py`
- service-layer work in `backend/app/services/*`
- backend tests in `backend/tests/*`
- API contracts that support the frontend route and view-model layer

## Placement rules

- `backend/main.py`: thin entrypoint only
- `backend/app/main.py`: app creation, middleware, and router inclusion
- `backend/app/api/router.py`: top-level router composition
- `backend/app/api/routes/*`: route-specific request handling
- `backend/app/api/deps.py`: shared request dependencies
- `backend/app/models/dtos.py`: request and response DTOs
- `backend/app/services/*`: domain logic, orchestration, and demo/store access
- `backend/tests/*`: API and behavior verification

## Implementation rules

- Keep route modules thin and move reusable logic into services.
- Prefer explicit DTOs for requests and responses instead of ad hoc dict shapes.
- Keep frontend-facing field names stable once a route contract exists.
- When adding a new backend capability, update the smallest set of DTOs, route handlers, and tests that make the contract clear.
- Treat the current in-memory/demo store as scaffolding that can later be replaced by Supabase, Redis, Celery, and provider adapters.

## Verification defaults

- `cd backend && python3 -m unittest discover -s tests`
- `cd backend && python3 -c "from main import app; print(app.title)"`
- Use `cd backend && fastapi dev` when runtime behavior or local manual checks matter

## Use another skill when

- The task is mainly frontend route, MVVM, or UI work: use `journal-assistant-frontend-implementation`
- The task is mainly visual refinement or editorial feel: use `journal-assistant-frontend-polish`
- The task is mainly GCP deployment, runtime hosting, or backend infra choices: use `journal-assistant-backend-gcp`
- The task crosses frontend and backend together: use `journal-assistant-fullstack`
