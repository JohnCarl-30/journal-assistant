from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Journal Assistant Backend",
        version="0.1.0",
        summary="FastAPI API for daily logs, weekly summaries, and report drafting.",
        description=(
            "Journal Assistant v1 backend with Supabase-authenticated daily log CRUD, "
            "database-backed profile and internship data, plus scaffolded generation endpoints."
        ),
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)
    return app


app = create_app()
