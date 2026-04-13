from __future__ import annotations

from datetime import date, datetime

from fastapi import HTTPException, status
from sqlalchemy import Select, select
from sqlalchemy.orm import Session, selectinload

from app.core.security import AuthenticatedUser
from app.db.models import InternshipTermRecord, JournalEntryRecord, ProfileRecord, WorkDayRecord, utc_now
from app.models.dtos import (
    InternshipTermDTO,
    InternshipTermUpdateRequest,
    JournalEntryCreateRequest,
    JournalEntryDTO,
    JournalEntryUpdateRequest,
    ProfileDTO,
    ProfileUpdateRequest,
    WorkDayDTO,
    WorkDayUpdateRequest,
)


def _parse_date(value: str) -> date:
    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid ISO date: {value}",
        ) from exc


def _parse_datetime_to_iso(value: datetime) -> str:
    return value.isoformat()


def _minutes_between(start_time: str | None, end_time: str | None) -> int:
    if not start_time or not end_time:
        return 0
    start_hour, start_minute = [int(part) for part in start_time.split(":")]
    end_hour, end_minute = [int(part) for part in end_time.split(":")]
    return max(0, (end_hour * 60 + end_minute) - (start_hour * 60 + start_minute))


def _profile_to_dto(record: ProfileRecord) -> ProfileDTO:
    return ProfileDTO(
        user_id=record.user_id,
        name=record.name,
        email=record.email,
        avatar_url=record.avatar_url,
        default_timezone=record.default_timezone,
        school_name=record.school_name,
        program=record.program,
    )


def _internship_to_dto(record: InternshipTermRecord) -> InternshipTermDTO:
    return InternshipTermDTO(
        id=record.id,
        user_id=record.user_id,
        company=record.company,
        supervisor=record.supervisor,
        role_title=record.role_title,
        start_date=record.start_date.isoformat(),
        end_date=record.end_date.isoformat(),
        target_hours=record.target_hours,
        report_title=record.report_title,
        is_active=record.is_active,
    )


def _work_day_to_dto(record: WorkDayRecord) -> WorkDayDTO:
    return WorkDayDTO(
        id=record.id,
        user_id=record.user_id,
        work_date=record.work_date.isoformat(),
        time_in_local=record.time_in_local,
        time_out_local=record.time_out_local,
        timezone=record.timezone,
        total_minutes=record.total_minutes,
        entry_ids=[entry.id for entry in record.entries],
        dtr_narrative_document_id=record.dtr_narrative_document_id,
    )


def _entry_to_dto(record: JournalEntryRecord) -> JournalEntryDTO:
    return JournalEntryDTO(
        id=record.id,
        user_id=record.user_id,
        work_date=record.work_day.work_date.isoformat(),
        title=record.title,
        content_md=record.content_md,
        source_type=record.source_type,
        created_at=_parse_datetime_to_iso(record.created_at),
        updated_at=_parse_datetime_to_iso(record.updated_at),
    )


class JournalRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def _active_internship_query(self, user_id: str) -> Select[tuple[InternshipTermRecord]]:
        return (
            select(InternshipTermRecord)
            .where(InternshipTermRecord.user_id == user_id, InternshipTermRecord.is_active.is_(True))
            .order_by(InternshipTermRecord.created_at.desc())
        )

    def _work_day_query(self, user_id: str, work_date_value: str) -> Select[tuple[WorkDayRecord]]:
        return (
            select(WorkDayRecord)
            .options(selectinload(WorkDayRecord.entries))
            .where(
                WorkDayRecord.user_id == user_id,
                WorkDayRecord.work_date == _parse_date(work_date_value),
            )
        )

    def sync_authenticated_user(self, user: AuthenticatedUser) -> ProfileDTO:
        profile = self.session.get(ProfileRecord, user.user_id)
        if profile is None:
            profile = ProfileRecord(
                user_id=user.user_id,
                name=user.name or "Student",
                email=user.email or f"{user.user_id}@example.com",
                avatar_url=user.avatar_url,
                default_timezone=user.default_timezone,
            )
            self.session.add(profile)
            self.session.flush()
        else:
            profile.name = user.name or profile.name
            profile.email = user.email or profile.email
            profile.avatar_url = user.avatar_url or profile.avatar_url
            profile.default_timezone = user.default_timezone or profile.default_timezone
            profile.updated_at = utc_now()

        active_internship = self.session.scalar(self._active_internship_query(user.user_id))
        if active_internship is None:
            start_date, end_date = InternshipTermRecord.default_dates()
            self.session.add(
                InternshipTermRecord(
                    user_id=user.user_id,
                    company="Add your company",
                    supervisor="Add your supervisor",
                    role_title="Student Intern",
                    start_date=start_date,
                    end_date=end_date,
                    target_hours=300,
                    report_title="Final Internship Report",
                    is_active=True,
                )
            )

        self.session.commit()
        self.session.refresh(profile)
        return _profile_to_dto(profile)

    def get_profile(self, user_id: str) -> ProfileDTO:
        profile = self.session.get(ProfileRecord, user_id)
        if profile is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
        return _profile_to_dto(profile)

    def update_profile(self, user_id: str, payload: ProfileUpdateRequest) -> ProfileDTO:
        profile = self.session.get(ProfileRecord, user_id)
        if profile is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

        updates = payload.model_dump(exclude_none=True)
        for field_name, field_value in updates.items():
            setattr(profile, field_name, field_value)
        profile.updated_at = utc_now()

        self.session.commit()
        self.session.refresh(profile)
        return _profile_to_dto(profile)

    def get_internship(self, user_id: str) -> InternshipTermDTO:
        internship = self.session.scalar(self._active_internship_query(user_id))
        if internship is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship term not found")
        return _internship_to_dto(internship)

    def update_internship(self, user_id: str, payload: InternshipTermUpdateRequest) -> InternshipTermDTO:
        internship = self.session.scalar(self._active_internship_query(user_id))
        if internship is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship term not found")

        updates = payload.model_dump(exclude_none=True)
        for field_name, field_value in updates.items():
            if field_name in {"start_date", "end_date"} and isinstance(field_value, str):
                setattr(internship, field_name, _parse_date(field_value))
            else:
                setattr(internship, field_name, field_value)
        internship.updated_at = utc_now()

        self.session.commit()
        self.session.refresh(internship)
        return _internship_to_dto(internship)

    def list_work_days(
        self,
        user_id: str,
        from_date: str | None = None,
        to_date: str | None = None,
    ) -> list[WorkDayDTO]:
        query = (
            select(WorkDayRecord)
            .options(selectinload(WorkDayRecord.entries))
            .where(WorkDayRecord.user_id == user_id)
            .order_by(WorkDayRecord.work_date.asc())
        )
        if from_date:
            query = query.where(WorkDayRecord.work_date >= _parse_date(from_date))
        if to_date:
            query = query.where(WorkDayRecord.work_date <= _parse_date(to_date))

        return [_work_day_to_dto(record) for record in self.session.scalars(query).all()]

    def get_or_create_work_day(self, user_id: str, work_date_value: str) -> WorkDayDTO:
        work_day = self.session.scalar(self._work_day_query(user_id, work_date_value))
        if work_day is None:
            profile = self.session.get(ProfileRecord, user_id)
            if profile is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
            work_day = WorkDayRecord(
                user_id=user_id,
                work_date=_parse_date(work_date_value),
                timezone=profile.default_timezone,
                total_minutes=0,
            )
            self.session.add(work_day)
            self.session.commit()
            work_day = self.session.scalar(self._work_day_query(user_id, work_date_value))
        assert work_day is not None
        return _work_day_to_dto(work_day)

    def upsert_work_day(self, user_id: str, work_date_value: str, payload: WorkDayUpdateRequest) -> WorkDayDTO:
        work_day = self.session.scalar(self._work_day_query(user_id, work_date_value))
        if work_day is None:
            profile = self.session.get(ProfileRecord, user_id)
            if profile is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
            work_day = WorkDayRecord(
                user_id=user_id,
                work_date=_parse_date(work_date_value),
                timezone=profile.default_timezone,
            )
            self.session.add(work_day)
            self.session.flush()

        updates = payload.model_dump(exclude_none=True)
        for field_name, field_value in updates.items():
            setattr(work_day, field_name, field_value)
        work_day.total_minutes = _minutes_between(work_day.time_in_local, work_day.time_out_local)
        work_day.updated_at = utc_now()

        self.session.commit()
        refreshed = self.session.scalar(self._work_day_query(user_id, work_date_value))
        assert refreshed is not None
        return _work_day_to_dto(refreshed)

    def list_entries(self, user_id: str, work_date_value: str) -> list[JournalEntryDTO]:
        work_day = self.session.scalar(self._work_day_query(user_id, work_date_value))
        if work_day is None:
            return []
        return [_entry_to_dto(entry) for entry in work_day.entries]

    def create_entry(self, user_id: str, work_date_value: str, payload: JournalEntryCreateRequest) -> JournalEntryDTO:
        work_day_record = self.session.scalar(self._work_day_query(user_id, work_date_value))
        if work_day_record is None:
            self.get_or_create_work_day(user_id, work_date_value)
            work_day_record = self.session.scalar(self._work_day_query(user_id, work_date_value))
        assert work_day_record is not None

        entry = JournalEntryRecord(
            user_id=user_id,
            work_day_id=work_day_record.id,
            title=payload.title,
            content_md=payload.content_md,
            source_type=payload.source_type.value if hasattr(payload.source_type, "value") else str(payload.source_type),
        )
        self.session.add(entry)
        self.session.commit()
        refreshed = self.session.scalar(
            select(JournalEntryRecord)
            .options(selectinload(JournalEntryRecord.work_day))
            .where(JournalEntryRecord.id == entry.id, JournalEntryRecord.user_id == user_id)
        )
        assert refreshed is not None
        return _entry_to_dto(refreshed)

    def update_entry(self, user_id: str, entry_id: str, payload: JournalEntryUpdateRequest) -> JournalEntryDTO:
        entry = self.session.scalar(
            select(JournalEntryRecord)
            .options(selectinload(JournalEntryRecord.work_day))
            .where(JournalEntryRecord.id == entry_id, JournalEntryRecord.user_id == user_id)
        )
        if entry is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")

        updates = payload.model_dump(exclude_none=True)
        for field_name, field_value in updates.items():
            setattr(entry, field_name, field_value)
        entry.updated_at = utc_now()

        self.session.commit()
        self.session.refresh(entry)
        self.session.refresh(entry.work_day)
        return _entry_to_dto(entry)

    def delete_entry(self, user_id: str, entry_id: str) -> None:
        entry = self.session.scalar(
            select(JournalEntryRecord)
            .where(JournalEntryRecord.id == entry_id, JournalEntryRecord.user_id == user_id)
        )
        if entry is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
        self.session.delete(entry)
        self.session.commit()
