import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List

from schemas import AIRequest, SuccessResponse, StepResponseFlat, ExplainData, ChatData
from utils import clean_text
from ai_engine import generate_steps_logic, explain_step_logic, chat_reply_logic

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("election-assistant")

app = FastAPI(title="Election Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health"])
async def root():
    return {"status": "success", "message": "API is online"}

@app.post("/steps", response_model=StepResponseFlat)
async def steps(req: AIRequest):
    """
    Returns exactly the flat structure the frontend expects.
    Fixes 422 errors and contract mismatch.
    """
    text = clean_text(req.text)
    if not text:
        return {
            "steps": [
                {"title": "Invalid Input", "description": "Please provide a valid scenario.", "type": "error"}
            ]
        }

    try:
        generated_steps = generate_steps_logic(text)
        return {"steps": generated_steps}
    except Exception as e:
        logger.error(f"Error in /steps: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate steps")

@app.post("/explain", response_model=SuccessResponse)
async def explain(req: AIRequest):
    text = clean_text(req.text)
    try:
        explanation = explain_step_logic(text)
        return {"status": "success", "data": {"explanation": explanation}}
    except Exception as e:
        logger.error(f"Error in /explain: {e}")
        raise HTTPException(status_code=500, detail="Failed to explain")

@app.post("/chat", response_model=SuccessResponse)
async def chat(req: AIRequest):
    text = clean_text(req.text)
    if not text:
        return {"status": "success", "data": {"reply": "Please provide a valid question."}}

    try:
        reply = chat_reply_logic(text)
        return {"status": "success", "data": {"reply": reply}}
    except Exception as e:
        logger.error(f"Error in /chat: {e}")
        raise HTTPException(status_code=500, detail="Assistant unavailable")

# Global error handler for 422 validation errors (to provide cleaner response)
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"status": "error", "message": exc.detail}
    )
