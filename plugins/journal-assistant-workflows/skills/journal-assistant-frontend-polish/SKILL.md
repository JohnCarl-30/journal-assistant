---
name: journal-assistant-frontend-polish
description: Use when refining the Journal Assistant frontend's visual system, editorial hierarchy, motion, typography, screenshot/mock-shot usage, and calm product feel without drifting into generic card-heavy SaaS UI.
---

# Journal Assistant Frontend Polish

Read [../../context.md](../../context.md) before changing the visual system or screen composition.

Use this skill when the task is about how the frontend feels, not just how it functions.

## Visual system to preserve

- calm editorial workspace
- `Newsreader` for display headings
- `Manrope` for UI and body text
- restrained mint accent centered on `#57C3AE`
- paper-like surfaces, soft borders, and minimal chrome
- subtle motion over flashy animation

## What this skill handles

- typography hierarchy
- spacing and composition
- paper surfaces and border-first chrome
- subtle entrance and hover motion
- screenshot/mock-shot usage in demos and evidence panels
- reducing clutter, especially dashboard-card mosaics

## Polish rules

- Start with hierarchy, spacing, and contrast before adding more UI devices.
- Prefer layout and editorial rhythm over extra cards.
- Keep motion restrained and meaningful.
- Reuse the existing shell, paper surfaces, and shared data-display patterns.
- When imagery is needed, prefer real-looking screenshots or mock references already used by the product.
- When available, align with curated Build Web Apps frontend/design guidance and Vercel Next.js frontend conventions.

## Likely touch points

- `frontend/src/app/globals.css`
- `frontend/src/shared/components/layout/*`
- `frontend/src/shared/components/data-display/*`
- `frontend/src/modules/*/views/*`

## Verification defaults

- `cd frontend && npm run lint`
- `cd frontend && npm run build`
- Visually sanity-check the affected route after layout or motion changes when possible.

## Use another skill when

- The task is mostly structural frontend code placement or route wiring: use `journal-assistant-frontend-implementation`.
- The task crosses into backend/API ownership: use `journal-assistant-fullstack`.
