"""
backend/app/api/routes.py
All FastAPI route definitions, grouped by feature.
"""

from __future__ import annotations

import json
import logging
import os

from fastapi import APIRouter, HTTPException, Query

logger = logging.getLogger(__name__)

from app.models.schemas import (
    ChatRequest,
    ChatResponse,
    DashboardResponse,
    EmailRequest,
    EmailResponse,
    HealthResponse,
    RecommendationsRequest,
    RecommendationsResponse,
    SummaryRequest,
    SummaryResponse,
)
from app.services import (
    chat_service,
    dashboard_service,
    email_service,
    recommendations_service,
    summary_service,
)

router = APIRouter()


# ── Health ────────────────────────────────────────────────────────────────────

@router.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check() -> HealthResponse:
    """Returns API health and configured model."""
    return HealthResponse(model=os.getenv("MODEL", "gpt-4o-mini"))


# ── Dashboard ─────────────────────────────────────────────────────────────────

@router.get("/dashboard", response_model=DashboardResponse, tags=["Dashboard"])
async def get_dashboard(
    employee_id: str = Query(default="jayakumar", description="Employee key"),
) -> DashboardResponse:
    """Return the full dashboard data for a given employee."""
    try:
        data = dashboard_service.get_dashboard(employee_id)
        return DashboardResponse(**data)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


# ── Recommendations ───────────────────────────────────────────────────────────

@router.post("/recommendations", response_model=RecommendationsResponse, tags=["AI"])
async def get_recommendations(
    body: RecommendationsRequest,
) -> RecommendationsResponse:
    """Generate AI-powered personalized recommendations."""
    try:
        return await recommendations_service.generate_recommendations(body.employee_id)
    except json.JSONDecodeError as exc:
        logger.exception("recommendations: JSON parse failed")
        raise HTTPException(status_code=502, detail=f"LLM returned invalid JSON: {exc}") from exc
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("recommendations failed")
        raise HTTPException(status_code=502, detail=str(exc)) from exc


# ── Summary ───────────────────────────────────────────────────────────────────

@router.post("/summary", response_model=SummaryResponse, tags=["AI"])
async def get_summary(body: SummaryRequest) -> SummaryResponse:
    """Generate the AI daily productivity summary."""
    try:
        return await summary_service.generate_summary(body.employee_id)
    except json.JSONDecodeError as exc:
        logger.exception("summary: JSON parse failed")
        raise HTTPException(status_code=502, detail=f"LLM returned invalid JSON: {exc}") from exc
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("summary failed")
        raise HTTPException(status_code=502, detail=str(exc)) from exc


# ── Email Generator ───────────────────────────────────────────────────────────

@router.post("/email", response_model=EmailResponse, tags=["AI"])
async def generate_email(body: EmailRequest) -> EmailResponse:
    """Generate a professional enterprise email."""
    try:
        return await email_service.generate_email(
            body.employee_id,
            body.email_type,
            body.context,
        )
    except json.JSONDecodeError as exc:
        logger.exception("email: JSON parse failed")
        raise HTTPException(status_code=502, detail=f"LLM returned invalid JSON: {exc}") from exc
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("email failed")
        raise HTTPException(status_code=502, detail=str(exc)) from exc


# ── Chat ──────────────────────────────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse, tags=["AI"])
async def chat(body: ChatRequest) -> ChatResponse:
    """AI chat with full employee context injected."""
    try:
        return await chat_service.chat(body.employee_id, body.messages)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("chat failed")
        raise HTTPException(status_code=502, detail=str(exc)) from exc
