from __future__ import annotations

from datetime import date, datetime, timezone, timedelta
from uuid import uuid4

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def uuid_str() -> str:
    return str(uuid4())


class ProfileRecord(Base):
    __tablename__ = "profiles"

    user_id: Mapped[str] = mapped_column(String(255), primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    avatar_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    default_timezone: Mapped[str] = mapped_column(String(100), default="Asia/Manila")
    school_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    program: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
    )

    internship_terms: Mapped[list["InternshipTermRecord"]] = relationship(
        back_populates="profile",
        cascade="all, delete-orphan",
    )
    work_days: Mapped[list["WorkDayRecord"]] = relationship(
        back_populates="profile",
        cascade="all, delete-orphan",
    )
    journal_entries: Mapped[list["JournalEntryRecord"]] = relationship(
        back_populates="profile",
        cascade="all, delete-orphan",
    )


class InternshipTermRecord(Base):
    __tablename__ = "internship_terms"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("profiles.user_id"), index=True)
    company: Mapped[str] = mapped_column(String(255))
    supervisor: Mapped[str] = mapped_column(String(255))
    role_title: Mapped[str] = mapped_column(String(255))
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    target_hours: Mapped[int] = mapped_column(Integer, default=300)
    report_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
    )

    profile: Mapped["ProfileRecord"] = relationship(back_populates="internship_terms")

    @staticmethod
    def default_dates() -> tuple[date, date]:
        start = utc_now().date()
        return start, start + timedelta(days=90)


class WorkDayRecord(Base):
    __tablename__ = "work_days"
    __table_args__ = (UniqueConstraint("user_id", "work_date", name="uq_work_days_user_date"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("profiles.user_id"), index=True)
    work_date: Mapped[date] = mapped_column(Date, index=True)
    time_in_local: Mapped[str | None] = mapped_column(String(10), nullable=True)
    time_out_local: Mapped[str | None] = mapped_column(String(10), nullable=True)
    timezone: Mapped[str] = mapped_column(String(100), default="Asia/Manila")
    total_minutes: Mapped[int] = mapped_column(Integer, default=0)
    dtr_narrative_document_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
    )

    profile: Mapped["ProfileRecord"] = relationship(back_populates="work_days")
    entries: Mapped[list["JournalEntryRecord"]] = relationship(
        back_populates="work_day",
        cascade="all, delete-orphan",
        order_by="JournalEntryRecord.created_at.asc()",
    )


class JournalEntryRecord(Base):
    __tablename__ = "journal_entries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("profiles.user_id"), index=True)
    work_day_id: Mapped[str] = mapped_column(ForeignKey("work_days.id"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    content_md: Mapped[str] = mapped_column(Text)
    source_type: Mapped[str] = mapped_column(String(50), default="text")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
    )

    profile: Mapped["ProfileRecord"] = relationship(back_populates="journal_entries")
    work_day: Mapped["WorkDayRecord"] = relationship(back_populates="entries")
