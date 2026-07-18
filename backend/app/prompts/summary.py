"""
backend/app/prompts/summary.py
Prompts for the AI daily summary endpoint.
"""

import json
from typing import Any


SYSTEM_PROMPT = """You are an enterprise AI productivity coach.
Analyze an employee's current workload and generate a concise daily summary.

Return ONLY a valid JSON object with exactly these keys:
{
  "productivity_summary": "2-3 sentence narrative of today's workload",
  "estimated_workload": "light|moderate|heavy|overloaded",
  "risk_level": "low|medium|high|critical",
  "priority_score": <integer 0-100 reflecting today's urgency>,
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "motivational_message": "One personalized encouraging sentence."
}

No markdown. No prose. Only JSON.
"""


def build_user_prompt(employee: dict[str, Any]) -> str:
    """Construct the user message for the summary prompt — token-efficient."""
    tickets = employee.get('open_tickets', [])
    sprint = employee.get('current_sprint', {})
    escalations = employee.get('customer_escalations', [])
    
    return f"""Generate daily summary for {employee['name']} ({employee['role']}).

Data:
- {len(tickets)} tickets ({len([t for t in tickets if t['priority'] in ('critical','high')])} critical/high)
- {len(employee.get('pending_prs', []))} pending PRs
- {len(employee.get('meetings', []))} meetings today
- {len(escalations)} escalations
- Sprint: {sprint.get('remaining_days', '?')}d left, {sprint.get('committed_points', 0) - sprint.get('completed_points', 0)} pts remaining

Return JSON only."""
