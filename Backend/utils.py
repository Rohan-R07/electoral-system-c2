import re
import logging

# --- Logging Setup ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("election-backend")

# --- Security Utilities ---

def is_prompt_injection(text: str) -> bool:
    """Detects basic prompt injection patterns."""
    patterns = [
        r"ignore previous instructions",
        r"system prompt",
        r"you are now",
        r"acting as",
        r"new instructions",
        r"forget everything"
    ]
    text_lower = text.lower()
    for pattern in patterns:
        if re.search(pattern, text_lower):
            return True
    return False

def clean_text(text: str) -> str:
    """Sanitizes input text and removes junk characters."""
    # Remove potentially dangerous characters but keep basic punctuation
    cleaned = re.sub(r'[<>/{}\[\]]', '', text)
    return cleaned.strip()

def format_steps(raw_steps: list[str]) -> list[str]:
    """Ensures steps are clean, non-numbered, and concise."""
    cleaned = []
    seen = set()
    for s in raw_steps:
        # Strip numbering and symbols
        s = re.sub(r'^(\d+[\.\)]|step \d+:|action:|[\-\*])\s*', '', s, flags=re.IGNORECASE).strip()
        # Trim to max 12 words
        words = s.split()
        if len(words) > 12:
            s = " ".join(words[:12]) + "..."
        
        if s and s.lower() not in seen:
            cleaned.append(s)
            seen.add(s.lower())
    return cleaned[:8]
