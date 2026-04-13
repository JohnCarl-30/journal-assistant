from fastapi import APIRouter

from app.api.routes import documents, entries, health, jobs, me, work_days

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(me.router)
api_router.include_router(work_days.router)
api_router.include_router(entries.router)
api_router.include_router(jobs.router)
api_router.include_router(documents.router)
