"""
backend/app/utils/json_parser.py
Robust JSON extraction from raw LLM output.

LLMs frequently return JSON with:
  - Markdown code fences  (```json ... ```)
  - Literal \\n sequences inside string values
  - Trailing commas (not standard JSON)
  - Extra prose before/after the JSON block
"""

from __future__ import annotations

import json
import re


def extract_json(text: str) -> dict | list:
    """
    Parse JSON from raw LLM output, tolerating common formatting issues.
    Raises RuntimeError if no valid JSON can be extracted.
    """
    # 1. Strip markdown code fences
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    candidate = fence_match.group(1).strip() if fence_match else text.strip()

    # 2. Try parsing as-is first
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        pass

    # 3. Find the outermost JSON object or array in the text
    for pattern in (r"(\{[\s\S]*\})", r"(\[[\s\S]*\])"):
        m = re.search(pattern, candidate)
        if m:
            fragment = m.group(1)
            # Replace literal control characters inside strings
            fragment = _sanitise_control_chars(fragment)
            try:
                return json.loads(fragment)
            except json.JSONDecodeError:
                pass

    # 4. Last resort: sanitise the full candidate and retry
    sanitised = _sanitise_control_chars(candidate)
    try:
        return json.loads(sanitised)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            f"Could not parse JSON from LLM response. "
            f"Parse error: {exc}. "
            f"Raw (first 300 chars): {text[:300]!r}"
        ) from exc


def _sanitise_control_chars(text: str) -> str:
    """
    Walk the JSON character-by-character.  Inside string values, replace
    all raw control characters (U+0000–U+001F) with their JSON escape
    sequences so that json.loads() can parse them.  Outside strings,
    control characters are left as-is (newlines are structural there).
    """
    result = []
    in_string = False
    escape_next = False

    ESCAPE_MAP = {
        '\n': '\\n',
        '\r': '\\r',
        '\t': '\\t',
        '\b': '\\b',
        '\f': '\\f',
    }

    for ch in text:
        if escape_next:
            result.append(ch)
            escape_next = False
            continue
        if ch == '\\' and in_string:
            result.append(ch)
            escape_next = True
            continue
        if ch == '"':
            in_string = not in_string
            result.append(ch)
            continue
        if in_string and ord(ch) < 0x20:
            # Replace every control character inside a string value
            result.append(ESCAPE_MAP.get(ch, f'\\u{ord(ch):04x}'))
            continue
        result.append(ch)

    return ''.join(result)
