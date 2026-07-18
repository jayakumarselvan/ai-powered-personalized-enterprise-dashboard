"""
backend/app/services/email_service.py
Calls the LLM to generate professional enterprise emails.
"""

from __future__ import annotations

from app.llm.client import llm_client
from app.mock_data.employees import get_employee
from app.models.schemas import EmailResponse
from app.prompts import email as email_prompts
from app.utils.json_parser import extract_json


async def generate_email(
    employee_id: str,
    email_type: str,
    context: str | None = None,
) -> EmailResponse:
    """Generate an email for the given employee and type."""
    employee = get_employee(employee_id)
    if employee is None:
        raise ValueError(f"Employee '{employee_id}' not found.")

    user_prompt = email_prompts.build_user_prompt(employee, email_type, context)

    raw = await llm_client.chat(
        messages=[
            {"role": "system", "content": email_prompts.SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.6,
        max_tokens=500,
    )

    data: dict = extract_json(raw)  # type: ignore[assignment]

    return EmailResponse(
        subject=data["subject"],
        body=data["body"],
    )
