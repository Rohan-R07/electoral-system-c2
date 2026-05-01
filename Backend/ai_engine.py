import subprocess
from prompts import STEP_PROMPT, EXPLAIN_PROMPT, CHAT_PROMPT
import re


import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "gemma:2b"


def run_gemma(prompt: str):
    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.2},
        },
    )

    if response.status_code != 200:
        raise Exception("Ollama API error")

    return response.json()["response"].strip()


# def generate_steps(context):


def generate_steps(context):
    raw = run_gemma(STEP_PROMPT.format(context=context))

    print("RAW:", raw)

    lines = raw.split("\n")
    cleaned = []

    for line in lines:
        line = line.strip()

        if not line:
            continue

        # remove intro
        if "sure" in line.lower():
            continue

        # extract step content
        if "step" in line.lower():
            line = line.replace("*", "")

            if ":" in line:
                line = line.split(":", 1)[1].strip()

        # remove quotes issues
        line = line.replace('""', '"')
        line = line.replace('"', "")

        # remove bullet lines
        if line.startswith("-"):
            continue

        # normalize spacing
        line = re.sub(r"\s+", " ", line)

        # avoid duplicates
        if line not in cleaned:
            cleaned.append(line)

    # remove redundant "submit again" type step
    final = []
    for step in cleaned:
        if "submit" in step.lower():
            if any("submit" in s.lower() for s in final):
                continue
        final.append(step)

    # fallback safety
    if not final:
        return [
            "Open voters.eci.gov.in",
            "Click Register",
            "Enter details",
            "Upload documents",
            "Submit form",
        ]

    return final[:6]


import random


def explain_step(step):
    try:
        # ✅ Handle empty input
        if not step or step.strip() == "":
            step = "general voter registration process in India"

        # ✅ Add variation
        variation = random.randint(1, 1000)

        prompt = EXPLAIN_PROMPT.format(step=step) + f"\nVariation ID: {variation}"

        raw = run_gemma(prompt)

        print("RAW EXPLAIN:", raw)

        # ❌ If model fails
        if not raw:
            return [
                "Confirms voter identity",
                "Prevents duplicate registrations",
                "Ensures eligibility",
                "Supports verification process",
            ]

        lines = raw.split("\n")
        cleaned = []

        for line in lines:
            line = line.strip()

            if not line:
                continue

            # remove intro
            if "sure" in line.lower():
                continue

            # keep only bullet points
            if line.startswith("-"):
                line = line.replace("- ", "").strip()
                cleaned.append(line)

        # ✅ If cleaning removed everything
        if not cleaned:
            return [
                "Confirms voter identity",
                "Prevents duplicate registrations",
                "Ensures eligibility",
                "Supports verification process",
            ]

        return cleaned[:5]

    except Exception as e:
        print("ERROR in explain_step:", e)

        # ✅ Hard fallback (never return null)
        return [
            "Confirms voter identity",
            "Prevents duplicate registrations",
            "Ensures eligibility",
            "Supports verification process",
        ]


import random

import json


def chat_reply(message):
    raw = run_gemma(CHAT_PROMPT.format(message=message))

    print("RAW CHAT:", raw)

    try:
        # extract JSON
        start = raw.find("{")
        end = raw.rfind("}") + 1
        data = json.loads(raw[start:end])

        answer = data.get("answer", "")
        confidence = data.get("confidence", "low")

        # 🔥 validation layer
        if confidence == "low":
            return "I'm not fully sure. Please check official ECI sources."

        # basic sanity check
        if "form 8" in message.lower():
            if "correction" not in answer.lower():
                return "Form 8 is used to correct voter details like name or address."

        return answer

    except Exception as e:
        print("CHAT PARSE ERROR:", e)
        return "Sorry, I couldn't process that. Try asking again."
