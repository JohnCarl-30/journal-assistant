from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user_id
from app.models.dtos import (
    InternshipTermDTO,
    InternshipTermUpdateRequest,
    ProfileDTO,
    ProfileUpdateRequest,
)
from app.services.demo_store import demo_store

router = APIRouter(prefix="/me", tags=["me"])


@router.get("/profile", response_model=ProfileDTO)
def get_profile(current_user_id: Annotated[str, Depends(get_current_user_id)]) -> ProfileDTO:
    return demo_store.get_profile(current_user_id)


@router.put("/profile", response_model=ProfileDTO)
def update_profile(
    payload: ProfileUpdateRequest,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> ProfileDTO:
    return demo_store.update_profile(current_user_id, payload)


@router.get("/internship", response_model=InternshipTermDTO)
def get_internship(
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> InternshipTermDTO:
    return demo_store.get_internship(current_user_id)


@router.put("/internship", response_model=InternshipTermDTO)
def update_internship(
    payload: InternshipTermUpdateRequest,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> InternshipTermDTO:
    return demo_store.update_internship(current_user_id, payload)
