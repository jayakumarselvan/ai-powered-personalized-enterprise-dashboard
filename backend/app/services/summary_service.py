"""
backend/app/services/summary_service.py
Calls the LLM to generate a personalized daily AI summary.
"""

from __future__ import annotations

from app.llm.client import llm_client
from app.mock_data.employees import get_employee
from app.models.schemas import SummaryResponse
from app.prompts import summary as summary_prompts
from app.utils.json_parser import extract_json


async def generate_summary(employee_id: str) -> SummaryResponse:
    """Generate the AI productivity summary for the employee."""
    employee = get_employee(employee_id)
    if employee is None:
        raise ValueError(f"Employee '{employee_id}' not found.")

    user_prompt = summary_prompts.build_user_prompt(employee)

    raw = await llm_client.chat(
        messages=[
            {"role": "system", "content": summary_prompts.SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.5,
        max_tokens=600,
    )

    data: dict = extract_json(raw)  # type: ignore[assignment]

    return SummaryResponse(
        productivity_summary=data["productivity_summary"],
        estimated_workload=data["estimated_workload"],
        risk_level=data["risk_level"],
        priority_score=int(data["priority_score"]),
        suggestions=data["suggestions"],
        motivational_message=data["motivational_message"],
    )
