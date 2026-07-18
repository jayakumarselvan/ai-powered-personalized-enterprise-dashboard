"""
backend/app/prompts/recommendations.py
System and user prompt templates for AI recommendations.
"""

from typing import Any


SYSTEM_PROMPT = """You are an enterprise AI assistant. Analyze the employee data and return ONLY a JSON array of exactly 5 recommendations. No prose, no markdown.

Schema per item: {"id":"rec_N","category":"urgent|productivity|risk|learning|team","title":"<10 words","description":"<20 words","action_label":"<4 words","priority":N}"""


def build_user_prompt(employee: dict[str, Any]) -> str:
    """Construct a compact user message from employee data."""
    critical = [
        {"id": t["id"], "title": t["title"], "due": t["due"]}
        for t in employee.get("open_tickets", [])
        if t["priority"] in ("critical", "high")
    ]
    escalations = [
        {"id": e["id"], "customer": e["customer"], "sla_h": e["sla_hours_remaining"]}
        for e in employee.get("customer_escalations", [])
    ]
    prs = [
        {"id": p["id"], "status": p["status"], "age_h": p["age_hours"]}
        for p in employee.get("pending_prs", [])
    ]
    urgent_notifs = [
        n["message"] for n in employee.get("notifications", [])
        if n["type"] in ("urgent", "warning")
    ]
    sprint = employee.get("current_sprint", {})
    remaining_pts = sprint.get("committed_points", 0) - sprint.get("completed_points", 0)

    return (
        f"Employee: {employee['name']}, {employee['role']}, {employee['department']}\n"
        f"Sprint: {sprint.get('name','?')} | {sprint.get('remaining_days','?')} days | {remaining_pts} pts left\n"
        f"Critical tickets: {critical}\n"
        f"Escalations: {escalations}\n"
        f"PRs: {prs}\n"
        f"Urgent alerts: {urgent_notifs}\n"
        f"Deadlines: {[d['title']+' '+d['date'] for d in employee.get('upcoming_deadlines',[])]}\n"
        f"Return JSON array now."
    )
