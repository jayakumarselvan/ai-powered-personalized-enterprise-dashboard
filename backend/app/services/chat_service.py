"""
backend/app/services/chat_service.py
Handles the conversational AI chat with full employee context injected.
"""

from __future__ import annotations

from app.llm.client import llm_client
from app.mock_data.employees import get_employee
from app.models.schemas import ChatMessage, ChatResponse
from app.prompts import chat as chat_prompts


async def chat(
    employee_id: str,
    messages: list[ChatMessage],
) -> ChatResponse:
    """
    Process a chat conversation with the employee's context injected
    as the system message.
    """
    employee = get_employee(employee_id)
    if employee is None:
        raise ValueError(f"Employee '{employee_id}' not found.")

    system_prompt = chat_prompts.build_system_prompt(employee)

    # Build the messages list: system first, then conversation history
    llm_messages: list[dict[str, str]] = [
        {"role": "system", "content": system_prompt}
    ]
    for msg in messages:
        llm_messages.append({"role": msg.role, "content": msg.content})

    reply = await llm_client.chat(
        messages=llm_messages,
        temperature=0.7,
        max_tokens=1024,
    )

    return ChatResponse(reply=reply)
