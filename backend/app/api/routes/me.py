from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import AuthenticatedUser
from app.db.repository import JournalRepository
from app.db.session import get_db_session
from app.models.dtos import (
    InternshipTermDTO,
    InternshipTermUpdateRequest,
    ProfileDTO,
    ProfileUpdateRequest,
)

router = APIRouter(prefix="/me", tags=["me"])


@router.get("/profile", response_model=ProfileDTO)
def get_profile(
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> ProfileDTO:
    return JournalRepository(session).get_profile(current_user.user_id)


@router.put("/profile", response_model=ProfileDTO)
def update_profile(
    payload: ProfileUpdateRequest,
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> ProfileDTO:
    return JournalRepository(session).update_profile(current_user.user_id, payload)


@router.get("/internship", response_model=InternshipTermDTO)
def get_internship(
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> InternshipTermDTO:
    return JournalRepository(session).get_internship(current_user.user_id)


@router.put("/internship", response_model=InternshipTermDTO)
def update_internship(
    payload: InternshipTermUpdateRequest,
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> InternshipTermDTO:
    return JournalRepository(session).update_internship(current_user.user_id, payload)
