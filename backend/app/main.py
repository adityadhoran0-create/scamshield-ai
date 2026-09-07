import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routes.analyze import router as analyze_router

app = FastAPI(
    title="ScamShield AI API",
    description="Explainable AI-Powered Message Risk Analyzer Backend",
    version="1.0.0"
)

# CORS Configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in allowed_origins else allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(analyze_router, prefix="/api", tags=["Scam Analysis"])

@app.get("/")
async def root():
    return {
        "app": "ScamShield AI API",
        "status": "online",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[!] Global Exception caught: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal security analysis error occurred. Please try again."}
    )
