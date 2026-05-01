import os
import json
import logging
import requests
from typing import List, Optional, Dict
from prompts import STEP_PROMPT, EXPLAIN_PROMPT, CHAT_PROMPT
from utils import logger, format_steps

# --- Configuration ---
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

PRIMARY_MODEL = "meta-llama/llama-3-8b-instruct:free"
FALLBACK_MODEL = "mistralai/mixtral-8x7b-instruct"


def run_ai(
    prompt: str, system_prompt: str = "", model: str = PRIMARY_MODEL, retries: int = 1
) -> Optional[str]:
    """
    Executes a fresh prompt via OpenRouter with model fallback.
    Ensures no global state affects the request or response.
    """
    print(f"DEBUG [run_ai]: Initializing request with model={model}")
    print(f"DEBUG [run_ai]: Prompt fragment: '{prompt[:50]}...'")

    if not OPENROUTER_API_KEY:
        logger.error("AI Configuration Error: OPENROUTER_API_KEY is missing.")
        return None

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "X-Title": "Election Learning Assistant",
    }

    # Always initialize fresh messages list
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.3,  # Slight temperature for variety
        "max_tokens": 400,
        "response_format": {"type": "json_object"}
        if "JSON" in (system_prompt or "")
        else None,
    }

    try:
        # Use direct requests.post to avoid any session/cookie caching issues
        response = requests.post(BASE_URL, headers=headers, json=payload, timeout=20)
        response.raise_for_status()

        result_json = response.json()
        content = result_json["choices"][0]["message"]["content"].strip()

        print(f"DEBUG [run_ai]: Successfully received content length: {len(content)}")
        return content

    except Exception as e:
        logger.warning(f"AI Warning: Model {model} failed - {e}")
        if retries > 0:
            print(f"DEBUG [run_ai]: Retrying with fallback model...")
            return run_ai(prompt, system_prompt, model=FALLBACK_MODEL, retries=0)

        logger.error(f"AI Error: All attempts failed.")
        return None


def generate_steps_logic(context: str) -> List[str]:
    """Orchestrates step generation with structured JSON instructions."""
    system = (
        "You are an AI assistant that generates step-by-step instructions for election-related processes in India. "
        "STRICT RULE: Only generate steps based on the given user input. "
        "If the input is unclear, vague (like 'hi', 'hello', 'test'), or unrelated to Indian elections, "
        "respond with guidance asking the user to provide a valid query. "
        "DO NOT assume context or default to a generic voting process if the input is not related. "
        'Output ONLY JSON in this format: {"steps": ["Step 1", "Step 2", ...]} '
        "Max 6 steps. Each step must be a short physical action (max 10 words)."
    )
    raw = run_ai(STEP_PROMPT.format(context=context), system_prompt=system)

    try:
        if raw:
            data = json.loads(raw)
            steps = data.get("steps", [])
            print(f"DEBUG [generate_steps_logic]: Parsed {len(steps)} steps from JSON")
            return format_steps(steps)
    except Exception as e:
        print(f"DEBUG [generate_steps_logic]: JSON Parse Error: {e}")

    # Fallback list if AI completely fails
    return [
        "Enter official portal",
        "Verify ID details",
        "Submit application",
        "Wait for confirmation",
    ]


def explain_step_logic(step: str) -> List[str]:
    """Orchestrates step explanation with bullet point enforcement."""
    system = (
        "You are an election mentor. Output ONLY short bullet points starting with '-'."
    )
    raw = run_ai(EXPLAIN_PROMPT.format(step=step), system_prompt=system)

    if not raw:
        return ["Process verified by ECI.", "Ensures transparency."]

    lines = [
        line.replace("- ", "").strip()
        for line in raw.split("\n")
        if line.strip().startswith("-")
    ]
    print(f"DEBUG [explain_step_logic]: Formatted {len(lines)} bullet points")
    return lines[:5]


def chat_reply_logic(message: str) -> str:
    """Orchestrates mentor chat with fresh responses."""
    system = 'You are a helpful election mentor. Output JSON: {"answer": "text", "confidence": "high|low"}'
    raw = run_ai(CHAT_PROMPT.format(message=message), system_prompt=system)

    try:
        if raw:
            data = json.loads(raw)
            answer = data.get("answer", raw)
            print(f"DEBUG [chat_reply_logic]: Extracted answer length: {len(answer)}")
            return answer
    except Exception as e:
        print(f"DEBUG [chat_reply_logic]: JSON Parse Error: {e}")

    return raw if raw else "I'm currently here to help with your election questions."
