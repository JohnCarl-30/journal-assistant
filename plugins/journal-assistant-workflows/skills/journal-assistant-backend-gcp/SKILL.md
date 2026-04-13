---
name: journal-assistant-backend-gcp
description: Use when the task is about deploying or operating the Journal Assistant backend on GCP, especially for FastAPI hosting, worker/runtime layout, env strategy, secrets, logging, and choosing GCP services without defaulting to FastAPI Cloud.
---

# Journal Assistant Backend GCP

Read [../../context.md](../../context.md) before making backend deployment or infrastructure decisions.

Use this skill when the task is about where and how the backend should run on GCP.

## What this skill handles

- GCP-oriented deployment guidance for the FastAPI backend
- deciding how to host the API and async worker on GCP
- environment variable and secret handling for backend services
- operational guidance for logs, health checks, and runtime layout
- replacing old FastAPI Cloud assumptions with GCP-first backend thinking

## Default deployment direction

- Prefer Cloud Run for the FastAPI API container
- Prefer Cloud Run Jobs or a separate Cloud Run service for background worker execution, depending on the task pattern
- Prefer Secret Manager for runtime secrets
- Prefer Artifact Registry for container images
- Prefer Cloud Logging and Cloud Monitoring for logs and health visibility

## Repo rules

- Do not treat `backend/.fastapicloud` as the active deployment source of truth
- Keep deploy guidance anchored to the actual backend app in `backend/`
- Assume the frontend can still use Vercel while the backend uses GCP
- Keep guidance compatible with existing external services like Supabase and Upstash when those remain part of the stack

## Deployment decision rules

- If the task is about API code or route contracts, use `journal-assistant-backend-api`
- If the task is about containerization, runtime shape, env wiring, secrets, or how to run background work on GCP, stay with this skill
- If the task spans frontend deployment and backend deployment together, coordinate with `journal-assistant-fullstack`

## Verification defaults

- Verify the backend app starts locally before giving deploy guidance:
  - `cd backend && python3 -c "from main import app; print(app.title)"`
- When runtime setup changes matter, prefer a local startup check:
  - `cd backend && fastapi dev`
- Keep deployment recommendations explicit about which service owns:
  - API traffic
  - background jobs
  - secrets
  - logs/monitoring

## Guidance constraints

- Prefer concrete GCP service mappings over vague "deploy to the cloud" advice
- Do not default back to FastAPI Cloud unless the user explicitly asks about the legacy linked setup
- Keep infrastructure advice consistent with the repo's split frontend/backend structure
