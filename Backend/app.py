import time
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List

from schemas import AIRequest, SuccessResponse, ErrorResponse, StepData, ExplainData, ChatData
from utils import logger, is_prompt_injection, clean_text, response_cache
from ai_engine import generate_steps_logic, explain_step_logic, chat_reply_logic

app = FastAPI(
    title="Election Assistant API",
    description="Production-ready backend for election education simulation.",
    version="2.0.0"
)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Basic IP Rate Limiting ---
request_history: Dict[str, List[float]] = {}
LIMIT = 25 # requests
WINDOW = 60 # seconds

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    ip = request.client.host
    now = time.time()
    
    if ip not in request_history:
        request_history[ip] = []
    
    # Filter old requests
    request_history[ip] = [t for t in request_history[ip] if now - t < WINDOW]
    
    if len(request_history[ip]) >= LIMIT:
        return ErrorResponse(status="error", message="Too many requests. Please slow down.").dict(), 429
        
    request_history[ip].append(now)
    return await call_next(request)

# --- Routes ---

@app.get("/", tags=["Health"])
async def root():
    return {"status": "success", "message": "API is online"}

@app.post("/steps", response_model=SuccessResponse, tags=["AI"])
async def get_steps(req: AIRequest):
    """Generates structured simulation steps for a choice."""
    text = clean_text(req.text)
    
    if is_prompt_injection(text):
        logger.warning(f"Security: Blocked prompt injection attempt: {text}")
        raise HTTPException(status_code=400, detail="Invalid input content detected.")

    # Cache Lookup
    cache_key = f"steps:{text}"
    cached = response_cache.get(cache_key)
    if cached:
        logger.info(f"Efficiency: Returning cached steps for: {text}")
        return SuccessResponse(data=StepData(steps=cached))

    try:
        steps = generate_steps_logic(text)
        response_cache.set(cache_key, steps)
        return SuccessResponse(data=StepData(steps=steps))
    except Exception as e:
        logger.error(f"Logic Error in /steps: {e}")
        return ErrorResponse(message="Failed to generate simulation steps.")

@app.post("/explain", response_model=SuccessResponse, tags=["AI"])
async def get_explain(req: AIRequest):
    """Provides bullet-point explanations for a concept."""
    text = clean_text(req.text)
    
    cache_key = f"explain:{text}"
    cached = response_cache.get(cache_key)
    if cached:
        return SuccessResponse(data=ExplainData(explanation=cached))

    try:
        explanation = explain_step_logic(text)
        response_cache.set(cache_key, explanation)
        return SuccessResponse(data=ExplainData(explanation=explanation))
    except Exception as e:
        logger.error(f"Logic Error in /explain: {e}")
        return ErrorResponse(message="Failed to generate explanation.")

@app.post("/chat", response_model=SuccessResponse, tags=["AI"])
async def get_chat(req: AIRequest):
    """Interactive mentor chat endpoint."""
    text = clean_text(req.text)
    
    if is_prompt_injection(text):
        raise HTTPException(status_code=400, detail="Invalid input content.")

    try:
        reply = chat_reply_logic(text)
        return SuccessResponse(data=ChatData(reply=reply))
    except Exception as e:
        logger.error(f"Logic Error in /chat: {e}")
        return ErrorResponse(message="AI Assistant is currently unavailable.")

# --- Global Error Handler ---
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return ErrorResponse(status="error", message=exc.detail).dict(), exc.status_code
