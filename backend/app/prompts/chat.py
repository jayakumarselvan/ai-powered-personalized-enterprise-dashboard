"""
backend/app/prompts/chat.py
System prompt for the AI chat assistant.
"""

import json
from typing import Any


def build_system_prompt(employee: dict[str, Any]) -> str:
    """Build a concise system prompt with the employee's key context."""
    sprint = employee.get("current_sprint", {})
    tickets = employee.get("open_tickets", [])
    prs = employee.get("pending_prs", [])
    meetings = [{"title": m["title"], "time": m["time"]} for m in employee.get("meetings", [])]
    escalations = [
        {"customer": e["customer"], "sla_h": e["sla_hours_remaining"]}
        for e in employee.get("customer_escalations", [])
    ]
    urgent_notifs = [n["message"] for n in employee.get("notifications", []) if n["type"] in ("urgent", "warning")]
    ticket_summaries = [{"id": t["id"], "title": t["title"], "priority": t["priority"], "due": t["due"]} for t in tickets]
    pr_summaries = [{"id": p["id"], "title": p["title"], "status": p["status"]} for p in prs]

    return f"""You are {employee['name']}'s AI work assistant. Be direct, helpful, personalized.

Profile: {employee['role']}, {employee['department']}, manager: {employee.get('manager','?')}
Sprint: {sprint.get('name','?')} | {sprint.get('remaining_days','?')}d left | {sprint.get('completed_points',0)}/{sprint.get('committed_points',0)} pts
Tickets: {ticket_summaries}
PRs: {pr_summaries}
Meetings today: {meetings}
Escalations: {escalations}
Urgent alerts: {urgent_notifs}
Deadlines: {[d['title']+' '+d['date'] for d in employee.get('upcoming_deadlines',[])]}

Rules: Reference IDs/names. Draft content when asked. Be concise. Don't invent data."""
