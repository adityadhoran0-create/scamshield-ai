from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

class AnalyzeRequest(BaseModel):
    message: str = Field(..., description="The suspicious SMS, WhatsApp, Email or social media message to analyze.", min_length=1, max_length=5000)

class AnalyzeResponse(BaseModel):
    risk_score: int = Field(..., description="Risk score from 0 to 100")
    risk_level: str = Field(..., description="LOW, MEDIUM, HIGH, or CRITICAL")
    category: str = Field(..., description="Detected Scam Category")
    confidence: float = Field(..., description="Confidence score from 0.0 to 1.0")
    signals: List[str] = Field(default=[], description="Detected suspicious indicators")
    explanation: str = Field(..., description="Explainable AI reasoning summary")
    recommendations: List[str] = Field(default=[], description="Recommended safe user actions")
    ml_probability: float = Field(..., description="ML classification probability (0 to 100)")
    rule_score: float = Field(..., description="Rule-based signal score (0 to 100)")
    url_score: float = Field(..., description="URL risk assessment score (0 to 100)")
    extracted_urls: List[str] = Field(default=[], description="URLs extracted from the message")
    url_threats: List[str] = Field(default=[], description="Specific threat details found in extracted URLs")
    timestamp: str = Field(..., description="ISO Timestamp of analysis")

class HealthResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    status: str
    model_loaded: bool
    version: str
    model_metrics: Optional[dict] = None

class DemoMessage(BaseModel):
    id: str
    title: str
    category: str
    message: str
    description: str
