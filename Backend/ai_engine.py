import os
import json
import logging
import requests
from typing import List, Optional, Dict, Any
from prompts import STEP_PROMPT, EXPLAIN_PROMPT, CHAT_PROMPT
from utils import logger, format_steps

# --- Configuration ---
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

PRIMARY_MODEL = "mistralai/mixtral-8x7b-instruct"
FALLBACK_MODEL = "openai/gpt-3.5-turbo"

HEADERS = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "Content-Type": "application/json",
    "X-Title": "Election Learning Assistant",
}

def run_ai(prompt: str, system_prompt: str = "", model: str = PRIMARY_MODEL, retries: int = 1) -> Optional[str]:
    if not OPENROUTER_API_KEY:
        logger.error("API Key missing.")
        return None

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.1,
        "max_tokens": 500,
        "response_format": {"type": "json_object"} if "JSON" in system_prompt else None,
    }

    try:
        response = requests.post(BASE_URL, headers=HEADERS, json=payload, timeout=15)
        if response.status_code != 200:
            raise Exception(f"AI Provider error: {response.status_code}")
        return response.json()["choices"][0]["message"]["content"].strip()
    except Exception:
        if retries > 0:
            return run_ai(prompt, system_prompt, model=FALLBACK_MODEL, retries=0)
        return None

def generate_steps_logic(context: str) -> List[Dict[str, str]]:
    """
    Generates high-quality, context-aware simulation steps in the format:
    [{ "title": "...", "description": "...", "type": "..." }]
    """
    system_prompt = (
        "You are an Indian Election Simulation Engine. "
        "Output ONLY JSON in this format: "
        '{"steps": [{"title": "Action", "description": "Detail", "type": "info|error|success"}]} '
        "CONTEXT-AWARE RULES: "
        "1. If the input describes a WRONG action, return 3-5 steps: "
        "Action taken -> Result -> Problem caused -> System failure -> Correction suggestion. "
        "2. If the input is CORRECT, return 3-5 steps: "
        "Progression -> Verification -> Confirmation -> Success status. "
        "Each title must be max 8 words. Each description max 15 words."
    )

    raw = run_ai(f"Generate simulation steps for: {context}", system_prompt=system_prompt)
    
    try:
        if raw:
            data = json.loads(raw)
            steps = data.get("steps", [])
            if len(steps) >= 3:
                print("Generated Steps:", steps)
                return steps
    except Exception as e:
        logger.error(f"Logic error: {e}")

    # Fallback to ensure consistency (Minimum 3 steps)
    return [
        {"title": "Initialize Process", "description": "Connecting to the official election database.", "type": "info"},
        {"title": "Analyze Input", "description": "Processing your requested action against ECI guidelines.", "type": "info"},
        {"title": "Action Outcome", "description": "Follow official procedures for voter registration.", "type": "success"}
    ]

def explain_step_logic(step: str) -> List[str]:
    system = "Output ONLY bullet points starting with '-'."
    raw = run_ai(EXPLAIN_PROMPT.format(step=step), system_prompt=system)
    if not raw: return ["Standard ECI verification step."]
    return [line.replace("- ", "").strip() for line in raw.split("\n") if line.strip().startswith("-")]

def chat_reply_logic(message: str) -> str:
    system = 'Output JSON: {"answer": "text"}'
    raw = run_ai(CHAT_PROMPT.format(message=message), system_prompt=system)
    try:
        if raw: return json.loads(raw).get("answer", raw)
    except: pass
    return raw or "How can I assist you today?"
