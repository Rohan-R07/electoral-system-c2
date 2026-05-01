import re
import time
import logging
from typing import Dict, Any, List, Optional

# --- Logging Setup ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("election-backend")

# --- Simple In-Memory Cache ---
class SimpleCache:
    """A basic dictionary-based cache with optional TTL."""
    def __init__(self, ttl_seconds: int = 3600):
        self._store: Dict[str, Dict[str, Any]] = {}
        self._ttl = ttl_seconds

    def get(self, key: str) -> Optional[Any]:
        if key in self._store:
            item = self._store[key]
            if time.time() - item['timestamp'] < self._ttl:
                return item['value']
            del self._store[key]
        return None

    def set(self, key: str, value: Any):
        self._store[key] = {
            'value': value,
            'timestamp': time.time()
        }

response_cache = SimpleCache()

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

def format_steps(raw_steps: List[str]) -> List[str]:
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
