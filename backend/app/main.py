from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="Journal Assistant Backend",
        version="0.1.0",
        summary="FastAPI API for daily logs, weekly summaries, and report drafting.",
        description=(
            "Journal Assistant v1 backend with demo data for profiles, internship terms, "
            "work days, journal entries, generated documents, and async-style job streams."
        ),
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)
    return app


app = create_app()
