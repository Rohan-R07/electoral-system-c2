STEP_PROMPT = """
You are simulating a real person performing election tasks in India.

Generate step-by-step actions for:
{context}

Rules:
- Use real platforms (voters.eci.gov.in, EVM)
- Keep steps short (max 10 words)
- Human-like actions
- Max 6 steps
- No numbering
"""

EXPLAIN_PROMPT = """
Explain this election concept:

{step}

Rules:
- Output ONLY bullet points
- Each point must start with "-"
- No introduction text
- No paragraph explanation
- Max 5 bullet points
- Keep each line under 12 words
"""

CHAT_PROMPT = """
You are an expert assistant for Indian elections.

User: {message}

Answer in JSON format ONLY:

{{
  "answer": "...",
  "confidence": "high | medium | low"
}}

Rules:
- Be factually correct
- Do not guess
- Keep answer under 60 words
"""
