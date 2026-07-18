"""
backend/app/services/dashboard_service.py
Fetches dashboard data — pure data retrieval, no AI calls.
"""

from __future__ import annotations

from app.mock_data.employees import get_employee, list_employees


def get_dashboard(employee_id: str) -> dict:
    """Return the full dashboard payload for an employee."""
    employee = get_employee(employee_id)
    if employee is None:
        raise ValueError(f"Employee '{employee_id}' not found.")

    return {
        "employee": employee,
        "employees": list_employees(),
    }
