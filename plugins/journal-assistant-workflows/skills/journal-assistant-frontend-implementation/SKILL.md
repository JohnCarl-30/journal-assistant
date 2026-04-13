---
name: journal-assistant-frontend-implementation
description: Use when implementing or refactoring the Journal Assistant frontend in `frontend/`, especially for Next.js App Router routes, MVVM placement, shared components, React Query view-models, and mock API route wiring.
---

# Journal Assistant Frontend Implementation

Read [../../context.md](../../context.md) before changing structure, routing, or shared UI patterns.

Use this skill for frontend build work in this repo's Next.js app.

## What this skill handles

- new screens and route work in `frontend/src/app/*`
- MVVM placement under `frontend/src/modules/*/{models,view-models,views}`
- shared layout, UI, and data-display components under `frontend/src/shared/*`
- route handler and mock data wiring in `frontend/src/app/api/*`
- React Query view-model patterns and screen data flow

## Placement rules

- `src/app/*`: route entrypoints and route handlers
- `src/modules/*/models`: data shapes and mock/domain state
- `src/modules/*/view-models`: React Query hooks and screen state
- `src/modules/*/views`: route-facing screen rendering
- `src/shared/components/*`: reusable UI, layout, and data-display primitives
- `src/shared/lib/*`: utilities, routes, and fetch helpers
- `src/shared/providers/*`: app-wide providers

## Implementation rules

- Keep App Router patterns current.
- Follow the existing split between route files and screen/view modules.
- Reuse shared primitives before adding one-off route-local UI.
- Keep mock API routes aligned with the frontend view-model data needs.
- When available, align with curated Build Web Apps frontend guidance and Vercel Next.js/shadcn guidance for framework-specific best practices.

## Verification defaults

- `cd frontend && npm run lint`
- `cd frontend && npm run build`

## Use another skill when

- The task is mainly visual hierarchy, art direction, motion feel, or editorial polish: use `journal-assistant-frontend-polish`.
- The task spans frontend and backend ownership: use `journal-assistant-fullstack`.
