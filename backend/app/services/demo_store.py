from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass, field
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, status

from app.models.dtos import (
    DocumentKind,
    DocumentStatus,
    DocumentUpdateRequest,
    GeneratedDocumentDTO,
    GenerationJobDTO,
    GenerationJobStatus,
    InternshipTermDTO,
    InternshipTermUpdateRequest,
    JournalEntryCreateRequest,
    JournalEntryDTO,
    JournalEntryUpdateRequest,
    ProfileDTO,
    ProfileUpdateRequest,
    ScopeType,
    WorkDayDTO,
    WorkDayUpdateRequest,
)


def _timestamp() -> str:
    return datetime.now(timezone.utc).isoformat()


def _minutes_between(start_time: str | None, end_time: str | None) -> int:
    if not start_time or not end_time:
        return 0

    start_hour, start_minute = [int(value) for value in start_time.split(":")]
    end_hour, end_minute = [int(value) for value in end_time.split(":")]
    return max(0, (end_hour * 60 + end_minute) - (start_hour * 60 + start_minute))


def _markdown_to_html(content: str) -> str:
    blocks = [block.strip() for block in content.split("\n\n") if block.strip()]
    return "".join(f"<p>{block}</p>" for block in blocks)


@dataclass
class UserState:
    profile: ProfileDTO
    internship: InternshipTermDTO
    work_days: dict[str, WorkDayDTO] = field(default_factory=dict)
    entries: dict[str, JournalEntryDTO] = field(default_factory=dict)
    documents: dict[str, GeneratedDocumentDTO] = field(default_factory=dict)
    jobs: dict[str, GenerationJobDTO] = field(default_factory=dict)
    job_events: dict[str, list[str]] = field(default_factory=dict)


class DemoStore:
    def __init__(self) -> None:
        self._users: dict[str, UserState] = {}
        self.default_user_id = "student-alex"
        self.ensure_user(self.default_user_id)

    def ensure_user(self, user_id: str) -> UserState:
        if user_id in self._users:
            return self._users[user_id]

        profile = ProfileDTO(
            user_id=user_id,
            name="Alex Dela Cruz",
            email="alex@example.com",
            avatar_url="https://i.pravatar.cc/120?img=12",
            default_timezone="Asia/Manila",
            school_name="Polytechnic University",
            program="BS Computer Science",
        )
        internship = InternshipTermDTO(
            id="term-spring-2026",
            user_id=user_id,
            company="TechFlow Solutions Inc.",
            supervisor="Maria Santos, Lead Eng.",
            role_title="CS Intern",
            start_date="2026-03-09",
            end_date="2026-05-29",
            target_hours=300,
            report_title="Final Internship Report",
            is_active=True,
        )

        state = UserState(profile=profile, internship=internship)
        self._seed_user_state(state)
        self._users[user_id] = state
        return state

    def _seed_user_state(self, state: UserState) -> None:
        seeded_entries = [
            (
                "entry-march-30",
                "2026-03-30",
                "Set up the shared shell",
                "Built the persistent left rail and slim top bar so the dashboard, weekly summary, and report builder all feel like one product.",
            ),
            (
                "entry-march-31",
                "2026-03-31",
                "Reworked the daily log",
                "Turned the daily log into a writing desk with guided prompts, compact time controls, and a lighter evidence tray.",
            ),
            (
                "entry-april-01",
                "2026-04-01",
                "Improved the report builder",
                "Reshaped the report builder into a paper-first canvas and grouped reference data into internship, hours, people, and dates.",
            ),
            (
                "entry-april-02",
                "2026-04-02",
                "Refined the weekly summary",
                "Simplified the archive rail, strengthened the DTR narrative panel, and replaced floating recap cards with a cleaner vertical weekly story.",
            ),
        ]

        created_at = _timestamp()
        for entry_id, work_date, title, content in seeded_entries:
            state.entries[entry_id] = JournalEntryDTO(
                id=entry_id,
                user_id=state.profile.user_id,
                work_date=work_date,
                title=title,
                content_md=content,
                created_at=created_at,
                updated_at=created_at,
            )

        seeded_days = [
            ("2026-03-30", "08:30", "16:30", ["entry-march-30"], None),
            ("2026-03-31", "08:30", "16:00", ["entry-march-31"], None),
            ("2026-04-01", "08:30", "16:30", ["entry-april-01"], None),
            ("2026-04-02", "08:30", "16:30", ["entry-april-02"], "doc-dtr-2026-04-02"),
        ]
        for work_date, time_in, time_out, entry_ids, dtr_document_id in seeded_days:
            state.work_days[work_date] = WorkDayDTO(
                id=f"day-{work_date}",
                user_id=state.profile.user_id,
                work_date=work_date,
                time_in_local=time_in,
                time_out_local=time_out,
                timezone=state.profile.default_timezone,
                total_minutes=_minutes_between(time_in, time_out),
                entry_ids=list(entry_ids),
                dtr_narrative_document_id=dtr_document_id,
            )

        documents = [
            GeneratedDocumentDTO(
                id="doc-week-2026-03-30",
                user_id=state.profile.user_id,
                kind=DocumentKind.WEEKLY_SUMMARY,
                scope_type=ScopeType.WEEK,
                scope_id="2026-03-30",
                content_md=(
                    "## Accomplishments\n"
                    "- Unified the dashboard, journal, weekly summary, and report builder.\n\n"
                    "## Lessons learned\n"
                    "- Strong writing tools feel better when typography and spacing do most of the work."
                ),
                content_html="",
                status=DocumentStatus.READY,
                created_at=created_at,
                updated_at=created_at,
            ),
            GeneratedDocumentDTO(
                id="doc-dtr-2026-04-02",
                user_id=state.profile.user_id,
                kind=DocumentKind.DTR_NARRATIVE,
                scope_type=ScopeType.WORK_DAY,
                scope_id="2026-04-02",
                content_md=(
                    "Today I refined the weekly summary experience by simplifying the archive rail, "
                    "strengthening the narrative block, and replacing the older floating recap cards "
                    "with a cleaner vertical story of the week."
                ),
                content_html="",
                status=DocumentStatus.DRAFT,
                created_at=created_at,
                updated_at=created_at,
            ),
            GeneratedDocumentDTO(
                id="doc-report-main",
                user_id=state.profile.user_id,
                kind=DocumentKind.FINAL_REPORT,
                scope_type=ScopeType.INTERNSHIP_TERM,
                scope_id="term-spring-2026",
                content_md=(
                    "# Internship Narrative\n\n"
                    "During my internship, I helped shape Journal Assistant into a calmer editorial product "
                    "that supports daily logging, weekly reflection, and final report writing."
                ),
                content_html="",
                status=DocumentStatus.DRAFT,
                created_at=created_at,
                updated_at=created_at,
            ),
            GeneratedDocumentDTO(
                id="doc-evaluation-main",
                user_id=state.profile.user_id,
                kind=DocumentKind.EVALUATION_PREP,
                scope_type=ScopeType.INTERNSHIP_TERM,
                scope_id="term-spring-2026",
                content_md=(
                    "## Strengths\n"
                    "- Clear ownership of UI refinement and documentation flows.\n\n"
                    "## Growth areas\n"
                    "- Continue improving backend integration depth and testing breadth."
                ),
                content_html="",
                status=DocumentStatus.DRAFT,
                created_at=created_at,
                updated_at=created_at,
            ),
        ]
        for document in documents:
            document.content_html = _markdown_to_html(document.content_md)
            state.documents[document.id] = document

    def _get_user_state(self, user_id: str) -> UserState:
        return self.ensure_user(user_id)

    def _get_entry_or_404(self, state: UserState, entry_id: str) -> JournalEntryDTO:
        entry = state.entries.get(entry_id)
        if entry is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
        return entry

    def _get_document_or_404(self, state: UserState, document_id: str) -> GeneratedDocumentDTO:
        document = state.documents.get(document_id)
        if document is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
        return document

    def _get_job_or_404(self, state: UserState, job_id: str) -> GenerationJobDTO:
        job = state.jobs.get(job_id)
        if job is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
        return job

    def get_profile(self, user_id: str) -> ProfileDTO:
        return self._get_user_state(user_id).profile

    def update_profile(self, user_id: str, payload: ProfileUpdateRequest) -> ProfileDTO:
        state = self._get_user_state(user_id)
        state.profile = state.profile.model_copy(update=payload.model_dump(exclude_none=True))
        return state.profile

    def get_internship(self, user_id: str) -> InternshipTermDTO:
        return self._get_user_state(user_id).internship

    def update_internship(
        self,
        user_id: str,
        payload: InternshipTermUpdateRequest,
    ) -> InternshipTermDTO:
        state = self._get_user_state(user_id)
        state.internship = state.internship.model_copy(update=payload.model_dump(exclude_none=True))
        return state.internship

    def list_work_days(
        self,
        user_id: str,
        from_date: str | None = None,
        to_date: str | None = None,
    ) -> list[WorkDayDTO]:
        state = self._get_user_state(user_id)
        items = list(state.work_days.values())
        if from_date:
            items = [item for item in items if item.work_date >= from_date]
        if to_date:
            items = [item for item in items if item.work_date <= to_date]
        return sorted(items, key=lambda item: item.work_date)

    def get_work_day(self, user_id: str, work_date: str) -> WorkDayDTO:
        state = self._get_user_state(user_id)
        if work_date not in state.work_days:
            state.work_days[work_date] = WorkDayDTO(
                id=f"day-{work_date}",
                user_id=user_id,
                work_date=work_date,
                timezone=state.profile.default_timezone,
                total_minutes=0,
                entry_ids=[],
            )
        return state.work_days[work_date]

    def upsert_work_day(
        self,
        user_id: str,
        work_date: str,
        payload: WorkDayUpdateRequest,
    ) -> WorkDayDTO:
        current = self.get_work_day(user_id, work_date)
        updates = payload.model_dump(exclude_none=True)
        merged = current.model_copy(update=updates)
        merged.total_minutes = _minutes_between(merged.time_in_local, merged.time_out_local)
        self._get_user_state(user_id).work_days[work_date] = merged
        return merged

    def list_entries(self, user_id: str, work_date: str) -> list[JournalEntryDTO]:
        state = self._get_user_state(user_id)
        return sorted(
            [entry for entry in state.entries.values() if entry.work_date == work_date],
            key=lambda entry: entry.created_at,
        )

    def create_entry(
        self,
        user_id: str,
        work_date: str,
        payload: JournalEntryCreateRequest,
    ) -> JournalEntryDTO:
        state = self._get_user_state(user_id)
        current_time = _timestamp()
        entry = JournalEntryDTO(
            id=f"entry-{uuid4().hex[:10]}",
            user_id=user_id,
            work_date=work_date,
            title=payload.title,
            content_md=payload.content_md,
            source_type=payload.source_type,
            created_at=current_time,
            updated_at=current_time,
        )
        state.entries[entry.id] = entry
        work_day = self.get_work_day(user_id, work_date)
        work_day.entry_ids.append(entry.id)
        return entry

    def update_entry(
        self,
        user_id: str,
        entry_id: str,
        payload: JournalEntryUpdateRequest,
    ) -> JournalEntryDTO:
        state = self._get_user_state(user_id)
        entry = self._get_entry_or_404(state, entry_id)
        updates = payload.model_dump(exclude_none=True)
        updates["updated_at"] = _timestamp()
        updated = entry.model_copy(update=updates)
        state.entries[entry_id] = updated
        return updated

    def delete_entry(self, user_id: str, entry_id: str) -> None:
        state = self._get_user_state(user_id)
        entry = self._get_entry_or_404(state, entry_id)
        del state.entries[entry_id]
        work_day = self.get_work_day(user_id, entry.work_date)
        work_day.entry_ids = [current_entry_id for current_entry_id in work_day.entry_ids if current_entry_id != entry_id]

    def _build_document_content(
        self,
        state: UserState,
        kind: str,
        scope_type: ScopeType,
        scope_id: str,
    ) -> str:
        if kind == DocumentKind.WEEKLY_SUMMARY.value:
            related_days = [
                day for day in state.work_days.values() if day.work_date >= scope_id
            ]
            hours_total = sum(day.total_minutes for day in related_days) // 60
            return (
                "## Accomplishments\n"
                "- Unified the dashboard, daily log, weekly summary, and final report into one calmer editorial system.\n"
                "- Strengthened the DTR narrative hierarchy and the report writing flow.\n\n"
                "## Hours recap\n"
                f"- Logged approximately {hours_total} hours across the selected week.\n\n"
                "## Next-week focus\n"
                "- Keep daily evidence complete so the next summary and report section remain easy to draft."
            )

        if kind == DocumentKind.DTR_NARRATIVE.value:
            day_entries = self.list_entries(state.profile.user_id, scope_id)
            summary = " ".join(entry.content_md for entry in day_entries[:2])
            return summary or "Generated daily narrative draft."

        if kind == DocumentKind.FINAL_REPORT.value:
            return (
                "# Final Internship Report\n\n"
                "## Internship overview\n"
                "This internship focused on building Journal Assistant as a writing-oriented product for students.\n\n"
                "## Work highlights\n"
                "- Daily logging flow\n"
                "- Weekly summary generation\n"
                "- Final report drafting\n\n"
                "## Reflection\n"
                "The project strengthened both product thinking and implementation discipline."
            )

        return (
            "## Strengths with evidence\n"
            "- Strong ownership of the documentation flow.\n\n"
            "## Growth areas\n"
            "- Deepen backend integration work and automated testing coverage.\n\n"
            "## Likely questions\n"
            "- What part of the product did you own most directly?"
        )

    def create_generation_job(
        self,
        user_id: str,
        kind: str,
        scope_type: ScopeType,
        scope_id: str,
    ) -> GenerationJobDTO:
        state = self._get_user_state(user_id)
        current_time = _timestamp()
        document_content = self._build_document_content(state, kind, scope_type, scope_id)
        document = GeneratedDocumentDTO(
            id=f"doc-{uuid4().hex[:10]}",
            user_id=user_id,
            kind=DocumentKind(kind),
            scope_type=scope_type,
            scope_id=scope_id,
            content_md=document_content,
            content_html=_markdown_to_html(document_content),
            status=DocumentStatus.DRAFT,
            created_at=current_time,
            updated_at=current_time,
        )
        state.documents[document.id] = document

        job = GenerationJobDTO(
            id=f"job-{uuid4().hex[:10]}",
            user_id=user_id,
            kind=DocumentKind(kind),
            status=GenerationJobStatus.QUEUED,
            progress=0,
            error=None,
            result_document_id=document.id,
            stream_channel=f"jobs:{user_id}:{kind}:{scope_id}",
            scope_type=scope_type,
            scope_id=scope_id,
            created_at=current_time,
            updated_at=current_time,
        )
        state.jobs[job.id] = job
        state.job_events[job.id] = [
            chunk for chunk in document.content_md.split("\n\n") if chunk.strip()
        ]
        return job

    def get_job(self, user_id: str, job_id: str) -> GenerationJobDTO:
        return self._get_job_or_404(self._get_user_state(user_id), job_id)

    def get_job_events(self, user_id: str, job_id: str) -> list[str]:
        state = self._get_user_state(user_id)
        self._get_job_or_404(state, job_id)
        return deepcopy(state.job_events.get(job_id, []))

    def start_job(self, user_id: str, job_id: str) -> GenerationJobDTO:
        state = self._get_user_state(user_id)
        job = self._get_job_or_404(state, job_id)
        updated = job.model_copy(
            update={"status": GenerationJobStatus.RUNNING, "progress": max(job.progress, 10), "updated_at": _timestamp()}
        )
        state.jobs[job_id] = updated
        return updated

    def update_job_progress(self, user_id: str, job_id: str, progress: int) -> GenerationJobDTO:
        state = self._get_user_state(user_id)
        job = self._get_job_or_404(state, job_id)
        updated = job.model_copy(update={"progress": progress, "updated_at": _timestamp()})
        state.jobs[job_id] = updated
        return updated

    def complete_job(self, user_id: str, job_id: str) -> GenerationJobDTO:
        state = self._get_user_state(user_id)
        job = self._get_job_or_404(state, job_id)
        updated = job.model_copy(
            update={
                "status": GenerationJobStatus.COMPLETED,
                "progress": 100,
                "updated_at": _timestamp(),
            }
        )
        state.jobs[job_id] = updated

        document = self._get_document_or_404(state, updated.result_document_id)
        state.documents[document.id] = document.model_copy(
            update={"status": DocumentStatus.READY, "updated_at": _timestamp()}
        )
        return updated

    def get_document(self, user_id: str, document_id: str) -> GeneratedDocumentDTO:
        return self._get_document_or_404(self._get_user_state(user_id), document_id)

    def update_document(
        self,
        user_id: str,
        document_id: str,
        payload: DocumentUpdateRequest,
    ) -> GeneratedDocumentDTO:
        state = self._get_user_state(user_id)
        document = self._get_document_or_404(state, document_id)
        updates = payload.model_dump(exclude_none=True)
        if "content_md" in updates and "content_html" not in updates:
            updates["content_html"] = _markdown_to_html(updates["content_md"])
        updates["updated_at"] = _timestamp()
        updated = document.model_copy(update=updates)
        state.documents[document_id] = updated
        return updated


demo_store = DemoStore()
