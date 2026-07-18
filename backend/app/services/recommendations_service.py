"""
backend/app/services/recommendations_service.py
Calls the LLM to produce personalized recommendations.
"""

from __future__ import annotations

from app.llm.client import llm_client
from app.mock_data.employees import get_employee
from app.models.schemas import Recommendation, RecommendationsResponse
from app.prompts import recommendations as rec_prompts
from app.utils.json_parser import extract_json


async def generate_recommendations(employee_id: str) -> RecommendationsResponse:
    """Generate AI-powered recommendations for the given employee."""
    employee = get_employee(employee_id)
    if employee is None:
        raise ValueError(f"Employee '{employee_id}' not found.")

    user_prompt = rec_prompts.build_user_prompt(employee)

    raw = await llm_client.chat(
        messages=[
            {"role": "system", "content": rec_prompts.SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.4,
        max_tokens=1200,
    )

    data: list[dict] = extract_json(raw)  # type: ignore[assignment]

    recommendations = [
        Recommendation(
            id=item.get("id", f"rec_{i + 1}"),
            category=item.get("category", "productivity"),
            title=item["title"],
            description=item["description"],
            action_label=item.get("action_label", "View"),
            priority=i + 1,  # enforce sequential priority regardless of LLM output
        )
        for i, item in enumerate(data)
    ]

    return RecommendationsResponse(recommendations=recommendations)
