from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.api.deps import get_current_user_id
from app.models.dtos import (
    JournalEntryCreateRequest,
    JournalEntryDTO,
    WorkDayDTO,
    WorkDayUpdateRequest,
)
from app.services.demo_store import demo_store

router = APIRouter(prefix="/work-days", tags=["work-days"])


@router.get("", response_model=list[WorkDayDTO])
def list_work_days(
    current_user_id: Annotated[str, Depends(get_current_user_id)],
    from_: str | None = Query(default=None, alias="from"),
    to: str | None = Query(default=None),
) -> list[WorkDayDTO]:
    return demo_store.list_work_days(current_user_id, from_date=from_, to_date=to)


@router.get("/{work_date}", response_model=WorkDayDTO)
def get_work_day(
    work_date: str,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> WorkDayDTO:
    return demo_store.get_work_day(current_user_id, work_date)


@router.put("/{work_date}", response_model=WorkDayDTO)
def upsert_work_day(
    work_date: str,
    payload: WorkDayUpdateRequest,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> WorkDayDTO:
    return demo_store.upsert_work_day(current_user_id, work_date, payload)


@router.get("/{work_date}/entries", response_model=list[JournalEntryDTO])
def list_entries_for_day(
    work_date: str,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> list[JournalEntryDTO]:
    return demo_store.list_entries(current_user_id, work_date)


@router.post("/{work_date}/entries", response_model=JournalEntryDTO, status_code=201)
def create_entry_for_day(
    work_date: str,
    payload: JournalEntryCreateRequest,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> JournalEntryDTO:
    return demo_store.create_entry(current_user_id, work_date, payload)
