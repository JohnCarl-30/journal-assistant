from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import AuthenticatedUser
from app.db.repository import JournalRepository
from app.db.session import get_db_session
from app.models.dtos import (
    JournalEntryCreateRequest,
    JournalEntryDTO,
    WorkDayDTO,
    WorkDayUpdateRequest,
)

router = APIRouter(prefix="/work-days", tags=["work-days"])


@router.get("", response_model=list[WorkDayDTO])
def list_work_days(
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
    from_: str | None = Query(default=None, alias="from"),
    to: str | None = Query(default=None),
) -> list[WorkDayDTO]:
    return JournalRepository(session).list_work_days(
        current_user.user_id,
        from_date=from_,
        to_date=to,
    )


@router.get("/{work_date}", response_model=WorkDayDTO)
def get_work_day(
    work_date: str,
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> WorkDayDTO:
    return JournalRepository(session).get_or_create_work_day(current_user.user_id, work_date)


@router.put("/{work_date}", response_model=WorkDayDTO)
def upsert_work_day(
    work_date: str,
    payload: WorkDayUpdateRequest,
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> WorkDayDTO:
    return JournalRepository(session).upsert_work_day(current_user.user_id, work_date, payload)


@router.get("/{work_date}/entries", response_model=list[JournalEntryDTO])
def list_entries_for_day(
    work_date: str,
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> list[JournalEntryDTO]:
    return JournalRepository(session).list_entries(current_user.user_id, work_date)


@router.post("/{work_date}/entries", response_model=JournalEntryDTO, status_code=201)
def create_entry_for_day(
    work_date: str,
    payload: JournalEntryCreateRequest,
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_db_session)],
) -> JournalEntryDTO:
    return JournalRepository(session).create_entry(current_user.user_id, work_date, payload)
