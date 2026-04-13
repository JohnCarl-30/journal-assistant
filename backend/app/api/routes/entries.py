from typing import Annotated

from fastapi import APIRouter, Depends, Response, status

from app.api.deps import get_current_user_id
from app.models.dtos import JournalEntryDTO, JournalEntryUpdateRequest
from app.services.demo_store import demo_store

router = APIRouter(prefix="/entries", tags=["entries"])


@router.patch("/{entry_id}", response_model=JournalEntryDTO)
def update_entry(
    entry_id: str,
    payload: JournalEntryUpdateRequest,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> JournalEntryDTO:
    return demo_store.update_entry(current_user_id, entry_id, payload)


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(
    entry_id: str,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> Response:
    demo_store.delete_entry(current_user_id, entry_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
