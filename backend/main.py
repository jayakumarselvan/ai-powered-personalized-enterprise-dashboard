"""
backend/main.py
FastAPI application entry point.
"""

from __future__ import annotations

import os

from dotenv import load_dotenv

# Load .env file — override=False so shell env vars always win.
# This means if OPENAI_API_KEY is already in your shell, it is used.
# If only in .env, it is loaded from there.
load_dotenv(override=False)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router

# ── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Enterprise AI Dashboard API",
    description="Personalized AI-powered enterprise dashboard backend.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────

_raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
origins = [o.strip() for o in _raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────────────

app.include_router(router, prefix="/api/v1")


@app.get("/", tags=["System"])
async def root() -> dict:
    return {
        "message": "Enterprise AI Dashboard API",
        "docs": "/docs",
        "model": os.getenv("MODEL", "gpt-4o-mini"),
    }
