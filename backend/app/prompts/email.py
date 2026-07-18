"""
backend/app/prompts/email.py
Prompts for the email generator endpoint.
"""

from typing import Any

EMAIL_TYPE_DESCRIPTIONS = {
    "customer_email": "a professional customer-facing email addressing their current issues or providing an update",
    "status_update": "an internal status update email summarizing current progress, blockers, and next steps",
    "meeting_summary": "a meeting summary email with key decisions, action items, and owners",
    "sprint_update": "a sprint update email for stakeholders summarizing completed work, remaining work, and risks",
}

SYSTEM_PROMPT = """You are a professional business communication assistant.
Generate concise, professional emails for enterprise employees.

Return ONLY a valid JSON object:
{
  "subject": "Email subject line",
  "body": "Full email body with proper salutation, paragraphs, and sign-off"
}

Guidelines:
- Professional but warm tone
- Concise — no fluff
- Include relevant specifics from the employee's context
- No markdown in the email body (no **, ##, etc.)
- Sign off with the employee's name and role
"""


def build_user_prompt(
    employee: dict[str, Any],
    email_type: str,
    extra_context: str | None = None,
) -> str:
    """Build the user message for email generation — token-efficient."""
    description = EMAIL_TYPE_DESCRIPTIONS.get(email_type, email_type)
    sprint = employee.get("current_sprint", {})
    escalations = [
        {"customer": e["customer"], "issue": e["issue"]}
        for e in employee.get("customer_escalations", [])
    ]
    critical = [
        {"id": t["id"], "title": t["title"]}
        for t in employee.get("open_tickets", [])
        if t["priority"] in ("critical", "high")
    ]

    lines = [
        f"Write {description} for {employee['name']} ({employee['role']}).",
        f"Sprint: {sprint.get('name','?')}, {sprint.get('remaining_days','?')}d left",
        f"Critical tickets: {critical}",
        f"Escalations: {escalations}",
    ]
    if extra_context:
        lines.append(f"Extra context: {extra_context}")
    lines.append("Return JSON only.")
    return "\n".join(lines)
