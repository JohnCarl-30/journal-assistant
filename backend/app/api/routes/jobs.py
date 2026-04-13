import asyncio
import json
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.api.deps import get_current_user_id
from app.models.dtos import GenerationJobDTO, GenerationRequest, ScopeType
from app.services.demo_store import demo_store

router = APIRouter(prefix="/jobs", tags=["jobs"])


def _resolve_scope(
    requested_scope_type: ScopeType | None,
    requested_scope_id: str | None,
    fallback_scope_type: ScopeType,
    fallback_scope_id: str,
) -> tuple[ScopeType, str]:
    return (
        requested_scope_type or fallback_scope_type,
        requested_scope_id or fallback_scope_id,
    )


def _format_sse(event: str, payload: dict[str, object]) -> str:
    return f"event: {event}\ndata: {json.dumps(payload)}\n\n"


@router.post("/weekly-summary", response_model=GenerationJobDTO, status_code=201)
def create_weekly_summary_job(
    payload: GenerationRequest,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> GenerationJobDTO:
    scope_type, scope_id = _resolve_scope(
        payload.scope_type,
        payload.scope_id,
        ScopeType.WEEK,
        "2026-03-30",
    )
    return demo_store.create_generation_job(
        current_user_id,
        kind="weekly_summary",
        scope_type=scope_type,
        scope_id=scope_id,
    )


@router.post("/dtr-narrative", response_model=GenerationJobDTO, status_code=201)
def create_dtr_narrative_job(
    payload: GenerationRequest,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> GenerationJobDTO:
    scope_type, scope_id = _resolve_scope(
        payload.scope_type,
        payload.scope_id,
        ScopeType.WORK_DAY,
        "2026-04-02",
    )
    return demo_store.create_generation_job(
        current_user_id,
        kind="dtr_narrative",
        scope_type=scope_type,
        scope_id=scope_id,
    )


@router.post("/final-report", response_model=GenerationJobDTO, status_code=201)
def create_final_report_job(
    payload: GenerationRequest,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> GenerationJobDTO:
    scope_type, scope_id = _resolve_scope(
        payload.scope_type,
        payload.scope_id,
        ScopeType.INTERNSHIP_TERM,
        "term-spring-2026",
    )
    return demo_store.create_generation_job(
        current_user_id,
        kind="final_report",
        scope_type=scope_type,
        scope_id=scope_id,
    )


@router.post("/evaluation-prep", response_model=GenerationJobDTO, status_code=201)
def create_evaluation_prep_job(
    payload: GenerationRequest,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> GenerationJobDTO:
    scope_type, scope_id = _resolve_scope(
        payload.scope_type,
        payload.scope_id,
        ScopeType.INTERNSHIP_TERM,
        "term-spring-2026",
    )
    return demo_store.create_generation_job(
        current_user_id,
        kind="evaluation_prep",
        scope_type=scope_type,
        scope_id=scope_id,
    )


@router.get("/{job_id}", response_model=GenerationJobDTO)
def get_generation_job(
    job_id: str,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> GenerationJobDTO:
    return demo_store.get_job(current_user_id, job_id)


@router.get("/{job_id}/stream")
async def stream_generation_job(
    job_id: str,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
) -> StreamingResponse:
    initial_job = demo_store.start_job(current_user_id, job_id)
    chunks = demo_store.get_job_events(current_user_id, job_id)

    async def event_stream():
        yield _format_sse("job", initial_job.model_dump(mode="json"))

        for index, chunk in enumerate(chunks, start=1):
            progress = min(90, 20 + index * 20)
            updated_job = demo_store.update_job_progress(current_user_id, job_id, progress)
            yield _format_sse(
                "chunk",
                {
                    "job_id": updated_job.id,
                    "progress": updated_job.progress,
                    "chunk": chunk,
                },
            )
            await asyncio.sleep(0.04)

        completed_job = demo_store.complete_job(current_user_id, job_id)
        yield _format_sse("completed", completed_job.model_dump(mode="json"))

    return StreamingResponse(event_stream(), media_type="text/event-stream")
