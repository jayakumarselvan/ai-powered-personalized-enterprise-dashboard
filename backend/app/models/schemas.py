"""
backend/app/models/schemas.py
All Pydantic v2 request/response models for the API.
"""

from __future__ import annotations

from typing import Any, Literal
from pydantic import BaseModel, Field


# ── Common ────────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str = "ok"
    model: str


# ── Employee summary (user switcher) ─────────────────────────────────────────

class EmployeeSummary(BaseModel):
    id: str
    name: str
    role: str
    department: str
    avatar_initials: str
    avatar_color: str


# ── Dashboard ─────────────────────────────────────────────────────────────────

class SprintInfo(BaseModel):
    name: str
    end_date: str
    committed_points: int
    completed_points: int
    remaining_days: int


class Ticket(BaseModel):
    id: str
    title: str
    priority: Literal["critical", "high", "medium", "low"]
    status: str
    due: str


class PullRequest(BaseModel):
    id: str
    title: str
    reviewers: list[str]
    status: str
    age_hours: int


class Meeting(BaseModel):
    id: str
    title: str
    time: str
    duration_min: int
    attendees: int
    is_optional: bool
    platform: str


class Notification(BaseModel):
    id: str
    type: Literal["urgent", "warning", "info"]
    message: str
    time: str


class CustomerEscalation(BaseModel):
    id: str
    customer: str
    issue: str
    severity: Literal["critical", "high", "medium", "low"]
    sla_hours_remaining: int


class ActivityItem(BaseModel):
    action: str
    time: str


class Deadline(BaseModel):
    title: str
    date: str


class DashboardResponse(BaseModel):
    employee: dict[str, Any]
    employees: list[EmployeeSummary]


# ── Chat ──────────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    employee_id: str = Field(default="jayakumar")
    messages: list[ChatMessage]


class ChatResponse(BaseModel):
    reply: str


# ── Summary ───────────────────────────────────────────────────────────────────

class SummaryRequest(BaseModel):
    employee_id: str = Field(default="jayakumar")


class SummaryResponse(BaseModel):
    productivity_summary: str
    estimated_workload: str
    risk_level: Literal["low", "medium", "high", "critical"]
    priority_score: int  # 0-100
    suggestions: list[str]
    motivational_message: str


# ── Email Generator ───────────────────────────────────────────────────────────

class EmailRequest(BaseModel):
    employee_id: str = Field(default="jayakumar")
    email_type: Literal[
        "customer_email",
        "status_update",
        "meeting_summary",
        "sprint_update",
    ]
    context: str | None = Field(
        default=None,
        description="Optional extra context to include in the email.",
    )


class EmailResponse(BaseModel):
    subject: str
    body: str


# ── Recommendations ───────────────────────────────────────────────────────────

class RecommendationsRequest(BaseModel):
    employee_id: str = Field(default="jayakumar")


class Recommendation(BaseModel):
    id: str
    category: Literal["urgent", "productivity", "risk", "learning", "team"]
    title: str
    description: str
    action_label: str
    priority: int  # 1 = highest


class RecommendationsResponse(BaseModel):
    recommendations: list[Recommendation]
