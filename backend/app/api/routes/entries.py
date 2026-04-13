from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import AuthenticatedUser
from app.db.repository import JournalRepository
from app.db.session import get_db_session
from app.models.dtos import JournalEntryDTO, JournalEntryUpdateRequest

router = APIRouter(prefix="/entries", tags=["entries"])


@router.patch("/{entry_id}", response_model=JournalEntryDTO)
def update_entry(
    entry_id: str,
    payload: JournalEntryUpdateRequest,
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> JournalEntryDTO:
    return JournalRepository(session).update_entry(current_user.user_id, entry_id, payload)


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(
    entry_id: str,
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> Response:
    JournalRepository(session).delete_entry(current_user.user_id, entry_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
