from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class ExploreQueryRequest(BaseModel):
    """Request schema for explore query endpoint."""
    query: str


class EvidenceSource(BaseModel):
    """Schema for evidence sources in AI responses."""
    type: str
    source: str
    content: Optional[str] = None


class AIResponse(BaseModel):
    """Response schema for AI agent responses."""
    answer_text: str
    confidence_score: int
    confidence_justification: str
    evidence_sources: List[EvidenceSource]


class PipelineRequest(BaseModel):
    """Request schema for pipeline operations."""
    action: str
    parameters: Dict[str, Any] = {}


class PipelineResponse(BaseModel):
    """Response schema for pipeline operations."""
    status: str
    message: str
    data: Optional[Dict[str, Any]] = None 