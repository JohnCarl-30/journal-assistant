from fastapi import APIRouter


router = APIRouter(tags=["health"])


@router.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Journal Assistant backend is running"}


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
