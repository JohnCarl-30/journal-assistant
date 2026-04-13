from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user_id
from app.models.dtos import DocumentUpdateRequest, GeneratedDocumentDTO
from app.services.demo_store import demo_store

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("/{document_id}", response_model=GeneratedDocumentDTO)
def get_document(
    document_id: str,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> GeneratedDocumentDTO:
    return demo_store.get_document(current_user_id, document_id)


@router.patch("/{document_id}", response_model=GeneratedDocumentDTO)
def update_document(
    document_id: str,
    payload: DocumentUpdateRequest,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> GeneratedDocumentDTO:
    return demo_store.update_document(current_user_id, document_id, payload)
