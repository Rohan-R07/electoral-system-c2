from pydantic import BaseModel, Field
from typing import List, Any, Optional

# --- Request Schemas ---

class AIRequest(BaseModel):
    """Base schema for AI-related requests. Robust against 422 errors."""
    text: Optional[str] = Field(default="", max_length=500, description="The input text for the AI.")

# --- Response Schemas ---

class StepItemFlat(BaseModel):
    """Individual simulation step structure for the frontend."""
    title: str = Field(..., description="Main action title")
    description: str = Field(..., description="Supporting sub-text or explanation")
    type: str = Field(default="info", description="Type of step (info, error, success)")

class StepResponseFlat(BaseModel):
    """Flat schema for simulation steps."""
    steps: List[StepItemFlat]

class BaseResponse(BaseModel):
    """Standard success response wrapper."""
    status: str = "success"

class SuccessResponse(BaseResponse):
    """Standard success response with data."""
    data: Any

class ErrorResponse(BaseModel):
    """Standard error response."""
    status: str = "error"
    message: str

# --- Specific Data Models ---

class ExplainData(BaseModel):
    explanation: List[str]

class ChatData(BaseModel):
    reply: str
