"""
backend/app/mock_data/employees.py
Mock enterprise employee data for all personas.
"""

from typing import Any

EMPLOYEES: dict[str, dict[str, Any]] = {
    "jayakumar": {
        "id": "emp_001",
        "name": "Jayakumar Selvan",
        "role": "Senior Software Engineer",
        "department": "Engineering",
        "team": "Platform Services",
        "manager": "Priya Nair",
        "avatar_initials": "JS",
        "avatar_color": "#6366f1",
        "performance_score": 87,
        "productivity_score": 82,
        "current_sprint": {
            "name": "Sprint 24 — Platform Hardening",
            "end_date": "2025-06-14",
            "committed_points": 21,
            "completed_points": 14,
            "remaining_days": 3,
        },
        "open_tickets": [
            {
                "id": "PLAT-1042",
                "title": "API gateway latency spike on /auth endpoint",
                "priority": "critical",
                "status": "in_progress",
                "due": "today",
            },
            {
                "id": "PLAT-1055",
                "title": "Redis cache invalidation race condition",
                "priority": "high",
                "status": "in_review",
                "due": "tomorrow",
            },
            {
                "id": "PLAT-1061",
                "title": "Add pagination to /users list endpoint",
                "priority": "medium",
                "status": "todo",
                "due": "2025-06-13",
            },
            {
                "id": "PLAT-1067",
                "title": "Update OpenAPI spec for v2 routes",
                "priority": "low",
                "status": "todo",
                "due": "2025-06-14",
            },
        ],
        "pending_prs": [
            {
                "id": "PR-442",
                "title": "feat: async task queue integration",
                "reviewers": ["Arjun", "Meera"],
                "status": "changes_requested",
                "age_hours": 26,
            },
            {
                "id": "PR-449",
                "title": "fix: token refresh edge case",
                "reviewers": ["Ravi"],
                "status": "awaiting_review",
                "age_hours": 8,
            },
        ],
        "meetings": [
            {
                "id": "meet_01",
                "title": "Sprint Review & Retro",
                "time": "10:00 AM",
                "duration_min": 60,
                "attendees": 12,
                "is_optional": False,
                "platform": "Zoom",
            },
            {
                "id": "meet_02",
                "title": "1:1 with Priya Nair",
                "time": "2:00 PM",
                "duration_min": 30,
                "attendees": 2,
                "is_optional": False,
                "platform": "Teams",
            },
            {
                "id": "meet_03",
                "title": "Architecture Guild — Optional",
                "time": "4:30 PM",
                "duration_min": 45,
                "attendees": 20,
                "is_optional": True,
                "platform": "Zoom",
            },
        ],
        "notifications": [
            {
                "id": "notif_01",
                "type": "urgent",
                "message": "Production alert: P1 incident on auth service",
                "time": "08:12 AM",
            },
            {
                "id": "notif_02",
                "type": "warning",
                "message": "Security training expires in 1 day",
                "time": "09:00 AM",
            },
            {
                "id": "notif_03",
                "type": "info",
                "message": "PR-442 has 2 change requests from Arjun",
                "time": "09:45 AM",
            },
            {
                "id": "notif_04",
                "type": "info",
                "message": "Sprint ends in 3 days — 7 points remaining",
                "time": "10:00 AM",
            },
        ],
        "customer_escalations": [
            {
                "id": "ESC-881",
                "customer": "Acme Corp",
                "issue": "Data export API returns 500 intermittently",
                "severity": "high",
                "sla_hours_remaining": 4,
            }
        ],
        "learning_goals": [
            "Complete Kubernetes Advanced Patterns module",
            "Finish AWS Solutions Architect prep — 3 chapters remaining",
        ],
        "recent_activity": [
            {"action": "Merged PR-435: DB connection pooling fix", "time": "Yesterday 4:30 PM"},
            {"action": "Commented on PLAT-1042", "time": "Yesterday 3:00 PM"},
            {"action": "Closed PLAT-1039: Flaky test investigation", "time": "Yesterday 11:00 AM"},
        ],
        "upcoming_deadlines": [
            {"title": "Sprint 24 closes", "date": "2025-06-14"},
            {"title": "Security compliance training", "date": "2025-06-11"},
            {"title": "Q2 performance self-review", "date": "2025-06-20"},
        ],
    },

    "priya": {
        "id": "emp_002",
        "name": "Priya Nair",
        "role": "Engineering Manager",
        "department": "Engineering",
        "team": "Platform Services",
        "manager": "Vikram Shah",
        "avatar_initials": "PN",
        "avatar_color": "#8b5cf6",
        "performance_score": 91,
        "productivity_score": 88,
        "current_sprint": {
            "name": "Sprint 24 — Platform Hardening",
            "end_date": "2025-06-14",
            "committed_points": 42,
            "completed_points": 31,
            "remaining_days": 3,
        },
        "open_tickets": [
            {
                "id": "MGT-201",
                "title": "Q2 headcount request — 2 senior engineers",
                "priority": "high",
                "status": "in_progress",
                "due": "2025-06-15",
            },
            {
                "id": "MGT-204",
                "title": "Compile team performance reviews",
                "priority": "high",
                "status": "todo",
                "due": "2025-06-20",
            },
        ],
        "pending_prs": [],
        "meetings": [
            {
                "id": "meet_10",
                "title": "Team Standup",
                "time": "09:00 AM",
                "duration_min": 15,
                "attendees": 8,
                "is_optional": False,
                "platform": "Zoom",
            },
            {
                "id": "meet_11",
                "title": "Engineering Leadership Sync",
                "time": "11:00 AM",
                "duration_min": 60,
                "attendees": 10,
                "is_optional": False,
                "platform": "Teams",
            },
            {
                "id": "meet_12",
                "title": "1:1 with Jayakumar",
                "time": "2:00 PM",
                "duration_min": 30,
                "attendees": 2,
                "is_optional": False,
                "platform": "Teams",
            },
        ],
        "notifications": [
            {
                "id": "notif_10",
                "type": "urgent",
                "message": "P1 incident open — auth service — needs owner assigned",
                "time": "08:15 AM",
            },
            {
                "id": "notif_11",
                "type": "warning",
                "message": "3 team members have expiring compliance training",
                "time": "09:00 AM",
            },
        ],
        "customer_escalations": [
            {
                "id": "ESC-881",
                "customer": "Acme Corp",
                "issue": "Data export API returns 500 intermittently",
                "severity": "high",
                "sla_hours_remaining": 4,
            }
        ],
        "learning_goals": [
            "Executive communication workshop — 2 modules left",
            "Read 'An Elegant Puzzle' — Ch 7",
        ],
        "recent_activity": [
            {"action": "Approved budget for infra upgrade", "time": "Yesterday 5:00 PM"},
            {"action": "Reviewed Q2 OKR progress deck", "time": "Yesterday 2:00 PM"},
        ],
        "upcoming_deadlines": [
            {"title": "Performance review submissions", "date": "2025-06-20"},
            {"title": "Headcount approval deadline", "date": "2025-06-15"},
        ],
    },

    "sara": {
        "id": "emp_003",
        "name": "Sara Okonkwo",
        "role": "HR Business Partner",
        "department": "Human Resources",
        "team": "People & Culture",
        "manager": "Michael Tan",
        "avatar_initials": "SO",
        "avatar_color": "#ec4899",
        "performance_score": 93,
        "productivity_score": 85,
        "current_sprint": {
            "name": "H1 HR Initiatives",
            "end_date": "2025-06-30",
            "committed_points": 18,
            "completed_points": 11,
            "remaining_days": 21,
        },
        "open_tickets": [
            {
                "id": "HR-301",
                "title": "Process 14 pending offer letters",
                "priority": "high",
                "status": "in_progress",
                "due": "today",
            },
            {
                "id": "HR-308",
                "title": "Update employee handbook — remote policy section",
                "priority": "medium",
                "status": "todo",
                "due": "2025-06-20",
            },
        ],
        "pending_prs": [],
        "meetings": [
            {
                "id": "meet_20",
                "title": "New hire orientation — June cohort",
                "time": "09:30 AM",
                "duration_min": 90,
                "attendees": 15,
                "is_optional": False,
                "platform": "Zoom",
            },
            {
                "id": "meet_21",
                "title": "Compensation review committee",
                "time": "1:00 PM",
                "duration_min": 60,
                "attendees": 6,
                "is_optional": False,
                "platform": "Teams",
            },
        ],
        "notifications": [
            {
                "id": "notif_20",
                "type": "urgent",
                "message": "2 offer letters need signature by EOD",
                "time": "08:30 AM",
            },
            {
                "id": "notif_21",
                "type": "info",
                "message": "Employee satisfaction survey closes Friday",
                "time": "09:00 AM",
            },
        ],
        "customer_escalations": [],
        "learning_goals": [
            "Complete SHRM recertification — 4 credits remaining",
            "DEI facilitator training — Module 3",
        ],
        "recent_activity": [
            {"action": "Completed 5 performance review calibrations", "time": "Yesterday 4:00 PM"},
            {"action": "Sent offer to Candidate #4421", "time": "Yesterday 11:30 AM"},
        ],
        "upcoming_deadlines": [
            {"title": "June new hire orientation", "date": "2025-06-10"},
            {"title": "Comp review final submission", "date": "2025-06-18"},
        ],
    },

    "marcus": {
        "id": "emp_004",
        "name": "Marcus Webb",
        "role": "Sales Account Executive",
        "department": "Sales",
        "team": "Enterprise Accounts",
        "manager": "Linda Brooks",
        "avatar_initials": "MW",
        "avatar_color": "#f59e0b",
        "performance_score": 79,
        "productivity_score": 76,
        "current_sprint": {
            "name": "Q2 Pipeline Push",
            "end_date": "2025-06-30",
            "committed_points": 0,
            "completed_points": 0,
            "remaining_days": 21,
        },
        "open_tickets": [
            {
                "id": "SALES-501",
                "title": "Follow up with GlobalTech — $240k deal",
                "priority": "critical",
                "status": "in_progress",
                "due": "today",
            },
            {
                "id": "SALES-508",
                "title": "Prepare Q3 account plan for Innovate Inc",
                "priority": "high",
                "status": "todo",
                "due": "2025-06-16",
            },
        ],
        "pending_prs": [],
        "meetings": [
            {
                "id": "meet_30",
                "title": "GlobalTech demo call",
                "time": "11:00 AM",
                "duration_min": 60,
                "attendees": 5,
                "is_optional": False,
                "platform": "Zoom",
            },
            {
                "id": "meet_31",
                "title": "Weekly sales pipeline review",
                "time": "3:00 PM",
                "duration_min": 45,
                "attendees": 12,
                "is_optional": False,
                "platform": "Teams",
            },
        ],
        "notifications": [
            {
                "id": "notif_30",
                "type": "urgent",
                "message": "GlobalTech contract — legal review complete, awaiting your sign-off",
                "time": "08:00 AM",
            },
            {
                "id": "notif_31",
                "type": "warning",
                "message": "Q2 quota attainment at 71% — $68k gap remaining",
                "time": "09:00 AM",
            },
        ],
        "customer_escalations": [
            {
                "id": "ESC-902",
                "customer": "Pinnacle Systems",
                "issue": "Renewal blocked — pricing dispute",
                "severity": "critical",
                "sla_hours_remaining": 24,
            }
        ],
        "learning_goals": [
            "Complete Challenger Sale certification",
            "Watch 5 Gong call recordings for competitive analysis",
        ],
        "recent_activity": [
            {"action": "Closed Meridian Corp deal — $85k ARR", "time": "Yesterday 5:30 PM"},
            {"action": "Updated pipeline forecast in Salesforce", "time": "Yesterday 2:00 PM"},
        ],
        "upcoming_deadlines": [
            {"title": "Q2 quota deadline", "date": "2025-06-30"},
            {"title": "GlobalTech contract expiry", "date": "2025-06-20"},
        ],
    },
}


def get_employee(employee_id: str) -> dict[str, Any] | None:
    """Return employee data by key or None if not found."""
    return EMPLOYEES.get(employee_id)


def list_employees() -> list[dict[str, Any]]:
    """Return a summary list of all employees for the user switcher."""
    return [
        {
            "id": key,
            "name": emp["name"],
            "role": emp["role"],
            "department": emp["department"],
            "avatar_initials": emp["avatar_initials"],
            "avatar_color": emp["avatar_color"],
        }
        for key, emp in EMPLOYEES.items()
    ]
