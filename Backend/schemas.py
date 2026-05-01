from pydantic import BaseModel, Field, constr
from typing import List, Any, Optional, Union

# --- Request Schemas ---

class AIRequest(BaseModel):
    """Base schema for AI-related requests."""
    text: constr(min_length=1, max_length=500) = Field(..., description="The input text for the AI.")

# --- Response Schemas ---

class BaseResponse(BaseModel):
    """Base schema for consistent JSON responses."""
    status: str = Field("success", pattern="^(success|error)$")

class SuccessResponse(BaseResponse):
    """Standard success response wrapper."""
    data: Any

class ErrorResponse(BaseResponse):
    """Standard error response wrapper."""
    status: str = "error"
    message: str

# --- Specific Data Models ---

class StepData(BaseModel):
    """Schema for simulation steps."""
    steps: List[str]

class ExplainData(BaseModel):
    """Schema for step explanations."""
    explanation: List[str]

class ChatData(BaseModel):
    """Schema for chat replies."""
    reply: str
