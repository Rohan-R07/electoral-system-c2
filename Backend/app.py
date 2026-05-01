import logging
import os
import time
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, constr
from ai_engine import generate_steps, explain_step, chat_reply

# 1. Logging Setup (Cloud Ready)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("election-assistant")

app = FastAPI(title="Election Assistant API")

# 2. CORS Configuration (More restrictive for production)
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Simple In-Memory Cache for Efficiency
cache: Dict[str, Any] = {}

# 4. Simple Rate Limiting (In-memory)
user_requests: Dict[str, List[float]] = {}
RATE_LIMIT = 20  # requests
TIME_WINDOW = 60 # seconds

@app.middleware("http")
async def rate_limiter(request: Request, call_next):
    client_ip = request.client.host
    now = time.time()
    
    if client_ip not in user_requests:
        user_requests[client_ip] = []
    
    # Filter out old requests
    user_requests[client_ip] = [t for t in user_requests[client_ip] if now - t < TIME_WINDOW]
    
    if len(user_requests[client_ip]) >= RATE_LIMIT:
        logger.warning(f"Rate limit exceeded for {client_ip}")
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
    
    user_requests[client_ip].append(now)
    return await call_next(request)

# 5. Secure Request Models
class AIRequest(BaseModel):
    # Sanitize: limit length and basic filtering
    text: constr(min_length=1, max_length=500)

def sanitize_input(text: str) -> str:
    # Basic protection against prompt injection / junk
    return text.replace("Ignore previous instructions", "").strip()

@app.post("/steps")
async def steps(req: AIRequest):
    sanitized = sanitize_input(req.text)
    cache_key = f"steps:{sanitized}"
    
    if cache_key in cache:
        return cache[cache_key]
    
    try:
        logger.info(f"Generating steps for: {sanitized}")
        result = {"steps": generate_steps(sanitized)}
        cache[cache_key] = result
        return result
    except Exception as e:
        logger.error(f"Error in /steps: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate steps")

@app.post("/explain")
async def explain(req: AIRequest):
    sanitized = sanitize_input(req.text)
    cache_key = f"explain:{sanitized}"
    
    if cache_key in cache:
        return cache[cache_key]

    try:
        logger.info(f"Explaining step: {sanitized}")
        result = {"explanation": explain_step(sanitized)}
        cache[cache_key] = result
        return result
    except Exception as e:
        logger.error(f"Error in /explain: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate explanation")

@app.post("/chat")
async def chat(req: AIRequest):
    sanitized = sanitize_input(req.text)
    # Chat responses usually not cached due to dynamic nature
    try:
        logger.info(f"Chat request: {sanitized}")
        return {"reply": chat_reply(sanitized)}
    except Exception as e:
        logger.error(f"Error in /chat: {e}")
        raise HTTPException(status_code=500, detail="AI Assistant is currently unavailable")

if __name__ == "__main__":
    import uvicorn
    # Use PORT from environment variable (Google Cloud Run standard)
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
