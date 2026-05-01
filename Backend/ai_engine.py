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

# HTTP Session Reuse
session = requests.Session()

def run_ai(prompt: str, system_prompt: str = "", model: str = PRIMARY_MODEL, retries: int = 1) -> Optional[str]:
    """
    Executes a prompt via OpenRouter with model fallback and strict timeout.
    
    Args:
        prompt: The user prompt.
        system_prompt: Optional instructions for the AI behavior.
        model: The model to use.
        retries: Number of fallback retries allowed.
        
    Returns:
        The cleaned AI response string or None if failed.
    """
    if not OPENROUTER_API_KEY:
        logger.error("AI Configuration Error: OPENROUTER_API_KEY is missing.")
        return None

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "X-Title": "Election Learning Assistant"
    }

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": 400,
        "response_format": {"type": "json_object"} if "JSON" in system_prompt else None
    }

    try:
        response = session.post(BASE_URL, headers=headers, json=payload, timeout=15)
        response.raise_for_status()
        content = response.json()['choices'][0]['message']['content'].strip()
        logger.info(f"AI Success: Model={model}")
        return content
    except Exception as e:
        logger.warning(f"AI Warning: Model {model} failed - {e}")
        if retries > 0:
            logger.info(f"AI Fallback: Switching to {FALLBACK_MODEL}")
            return run_ai(prompt, system_prompt, model=FALLBACK_MODEL, retries=0)
        logger.error(f"AI Error: All attempts failed.")
        return None

def generate_steps_logic(context: str) -> List[str]:
    """Orchestrates step generation with structured JSON instructions."""
    system = (
        "You are an election simulation engine. "
        "Output ONLY JSON: {\"steps\": [\"action1\", \"action2\", ...]} "
        "Each action must be short (max 10 words). Max 6 steps."
    )
    raw = run_ai(STEP_PROMPT.format(context=context), system_prompt=system)
    
    try:
        if raw:
            data = json.loads(raw)
            return format_steps(data.get("steps", []))
    except:
        pass
    
    # Fallback list if AI completely fails
    return ["Enter official portal", "Verify ID details", "Submit application", "Wait for confirmation"]

def explain_step_logic(step: str) -> List[str]:
    """Orchestrates step explanation with bullet point enforcement."""
    system = "You are an election mentor. Output ONLY short bullet points starting with '-'."
    raw = run_ai(EXPLAIN_PROMPT.format(step=step), system_prompt=system)
    
    if not raw:
        return ["Process verified by ECI.", "Ensures transparency."]
        
    lines = [line.replace("- ", "").strip() for line in raw.split('\n') if line.strip().startswith("-")]
    return lines[:5]

def chat_reply_logic(message: str) -> str:
    """Orchestrates mentor chat with confidence scoring."""
    system = "You are a helpful election mentor. Output JSON: {\"answer\": \"text\", \"confidence\": \"high|low\"}"
    raw = run_ai(CHAT_PROMPT.format(message=message), system_prompt=system)
    
    try:
        if raw:
            data = json.loads(raw)
            return data.get("answer", raw)
    except:
        pass
    return raw if raw else "I'm currently here to help with your election questions."
