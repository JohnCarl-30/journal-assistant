from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class SourceType(str, Enum):
    TEXT = "text"


class DocumentKind(str, Enum):
    WEEKLY_SUMMARY = "weekly_summary"
    DTR_NARRATIVE = "dtr_narrative"
    FINAL_REPORT = "final_report"
    EVALUATION_PREP = "evaluation_prep"


class ScopeType(str, Enum):
    WEEK = "week"
    WORK_DAY = "work_day"
    INTERNSHIP_TERM = "internship_term"


class DocumentStatus(str, Enum):
    DRAFT = "draft"
    READY = "ready"
    FAILED = "failed"


class GenerationJobStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class BaseDTO(BaseModel):
    model_config = ConfigDict(use_enum_values=True)


class ProfileDTO(BaseDTO):
    user_id: str
    name: str
    email: str
    avatar_url: str | None = None
    default_timezone: str = "Asia/Manila"
    school_name: str | None = None
    program: str | None = None


class ProfileUpdateRequest(BaseDTO):
    name: str | None = None
    email: str | None = None
    avatar_url: str | None = None
    default_timezone: str | None = None
    school_name: str | None = None
    program: str | None = None


class InternshipTermDTO(BaseDTO):
    id: str
    user_id: str
    company: str
    supervisor: str
    role_title: str
    start_date: str
    end_date: str
    target_hours: int
    report_title: str | None = None
    is_active: bool = True


class InternshipTermUpdateRequest(BaseDTO):
    company: str | None = None
    supervisor: str | None = None
    role_title: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    target_hours: int | None = None
    report_title: str | None = None
    is_active: bool | None = None


class WorkDayDTO(BaseDTO):
    id: str
    user_id: str
    work_date: str
    time_in_local: str | None = None
    time_out_local: str | None = None
    timezone: str
    total_minutes: int = 0
    entry_ids: list[str] = Field(default_factory=list)
    dtr_narrative_document_id: str | None = None


class WorkDayUpdateRequest(BaseDTO):
    time_in_local: str | None = None
    time_out_local: str | None = None
    timezone: str | None = None


class JournalEntryDTO(BaseDTO):
    id: str
    user_id: str
    work_date: str
    title: str
    content_md: str
    source_type: SourceType = SourceType.TEXT
    created_at: str
    updated_at: str


class JournalEntryCreateRequest(BaseDTO):
    title: str
    content_md: str
    source_type: SourceType = SourceType.TEXT


class JournalEntryUpdateRequest(BaseDTO):
    title: str | None = None
    content_md: str | None = None


class GeneratedDocumentDTO(BaseDTO):
    id: str
    user_id: str
    kind: DocumentKind
    scope_type: ScopeType
    scope_id: str
    content_md: str
    content_html: str
    status: DocumentStatus
    created_at: str
    updated_at: str


class DocumentUpdateRequest(BaseDTO):
    content_md: str | None = None
    content_html: str | None = None
    status: DocumentStatus | None = None


class GenerationJobDTO(BaseDTO):
    id: str
    user_id: str
    kind: DocumentKind
    status: GenerationJobStatus
    progress: int = 0
    error: str | None = None
    result_document_id: str
    stream_channel: str
    scope_type: ScopeType
    scope_id: str
    created_at: str
    updated_at: str


class GenerationRequest(BaseDTO):
    scope_type: ScopeType | None = None
    scope_id: str | None = None
