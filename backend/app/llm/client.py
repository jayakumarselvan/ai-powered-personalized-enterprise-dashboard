"""
backend/app/llm/client.py
Reusable LiteLLM wrapper — provider-agnostic, streaming-capable.
All provider selection is driven purely from environment variables.
"""

from __future__ import annotations

import os
from typing import Any, AsyncIterator

import litellm
from litellm import acompletion


# Enable LiteLLM debug logging via env var (set_verbose is deprecated)
if os.getenv("APP_ENV", "production") == "development":
    os.environ.setdefault("LITELLM_LOG", "WARNING")


class LLMClient:
    """
    Thin async wrapper around LiteLLM.

    Usage
    -----
    client = LLMClient()
    response = await client.chat(messages=[{"role": "user", "content": "Hello"}])
    """

    def __init__(
        self,
        model: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 512,
    ) -> None:
        self.model = model or os.getenv("MODEL", "gpt-4o-mini")
        self.temperature = temperature
        self.max_tokens = max_tokens

    async def chat(
        self,
        messages: list[dict[str, str]],
        temperature: float | None = None,
        max_tokens: int | None = None,
    ) -> str:
        """
        Send a list of messages and return the assistant reply as a string.
        Raises RuntimeError on any LiteLLM / provider error.
        """
        try:
            response = await acompletion(
                model=self.model,
                messages=messages,
                temperature=temperature if temperature is not None else self.temperature,
                max_tokens=max_tokens if max_tokens is not None else self.max_tokens,
            )
            return response.choices[0].message.content or ""
        except Exception as exc:
            raise RuntimeError(f"LLM call failed [{self.model}]: {exc}") from exc

    async def stream_chat(
        self,
        messages: list[dict[str, str]],
        temperature: float | None = None,
        max_tokens: int | None = None,
    ) -> AsyncIterator[str]:
        """
        Stream assistant reply tokens as an async iterator of strings.
        """
        try:
            response = await acompletion(
                model=self.model,
                messages=messages,
                temperature=temperature if temperature is not None else self.temperature,
                max_tokens=max_tokens if max_tokens is not None else self.max_tokens,
                stream=True,
            )
            async for chunk in response:
                delta = chunk.choices[0].delta
                if delta and delta.content:
                    yield delta.content
        except Exception as exc:
            raise RuntimeError(f"LLM stream failed [{self.model}]: {exc}") from exc


# Module-level singleton — importable across services
llm_client = LLMClient()
