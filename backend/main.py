"""
DevAssist - FastAPI Backend for Code Review Tool
Main application entry point
"""
import os
from dotenv import load_dotenv

# Load environment variables from .env file before importing anything else
load_dotenv()

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import logging

from config import settings
from routes import analyse, review, docs, analysis, postmortem, analytics, heatmap


# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.debug else logging.WARNING,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Custom exception classes
class DevAssistException(Exception):
    """Base exception for DevAssist"""
    pass


class AuthenticationError(DevAssistException):
    """Raised when API key is invalid"""
    pass


class ResourceNotFoundError(DevAssistException):
    """Raised when requested resource doesn't exist"""
    pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup
    logger.info(f"Starting {settings.app_name}...")
    logger.info(f"Debug mode: {settings.debug}")
    logger.info(f"API Keys configured: {len(settings.api_keys_list)}")
    logger.info("✅ Authentication: Supports both X-API-Key and Bearer token")
    logger.info("✅ Analysis endpoints: /api/analyze/*")
    logger.info("✅ PostMortem AI: /api/postmortem/*")
    logger.info("✅ Analytics: /api/analytics")
    logger.info("✅ Heatmap: /api/heatmap/*")
    yield
    # Shutdown
    logger.info(f"Shutting down {settings.app_name}...")


# Initialize FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="A powerful code review and analysis tool with AI-powered PostMortem analysis",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,  # Must be False when allow_origins is ["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception Handlers
@app.exception_handler(AuthenticationError)
async def auth_exception_handler(request: Request, exc: AuthenticationError):
    """Handle authentication errors"""
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={
            "error": "Authentication failed",
            "message": str(exc),
            "type": "AuthenticationError"
        }
    )


@app.exception_handler(ResourceNotFoundError)
async def not_found_exception_handler(request: Request, exc: ResourceNotFoundError):
    """Handle resource not found errors"""
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "error": "Resource not found",
            "message": str(exc),
            "type": "ResourceNotFoundError"
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle request validation errors"""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation error",
            "message": "Invalid request data",
            "type": "ValidationError",
            "details": exc.errors()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "type": "InternalServerError"
        }
    )


# Include routers
# New routes (matching frontend expectations)
app.include_router(analysis.router)      # /api/analyze/*
app.include_router(postmortem.router)    # /api/postmortem/*
app.include_router(analytics.router)     # /api/analytics
app.include_router(heatmap.router)       # /api/heatmap/*

# Legacy routes (backward compatibility)
app.include_router(analyse.router)       # /api/analyse/*
app.include_router(review.router)        # /api/review/*
app.include_router(docs.router)          # /api/docs/*


# Root endpoint
@app.get(
    "/",
    tags=["Root"],
    summary="API Root",
    description="Get API information and health status"
)
async def root():
    """
    Root endpoint providing API information
    """
    return {
        "name": settings.app_name,
        "version": "2.0.0",
        "status": "operational",
        "description": "DevAssist API - Code Review and Analysis Tool with AI-powered PostMortem",
        "features": {
            "analysis": "Repository, snippet, and file analysis",
            "postmortem": "6-layer AI-powered production error investigation",
            "review": "Code review with AI suggestions",
            "analytics": "Dashboard analytics and metrics",
            "heatmap": "Error distribution visualization"
        },
        "endpoints": {
            "docs": "/docs",
            "redoc": "/redoc",
            "health": "/health",
            "analyze": "/api/analyze",
            "postmortem": "/api/postmortem",
            "analytics": "/api/analytics",
            "heatmap": "/api/heatmap",
            "review": "/api/review",
            "documentation": "/api/docs"
        },
        "authentication": {
            "methods": ["X-API-Key header", "Authorization Bearer token"],
            "example": "X-API-Key: your-api-key or Authorization: Bearer your-api-key"
        }
    }


# Health check endpoint
@app.get(
    "/health",
    tags=["Health"],
    summary="Health Check",
    description="Check API health status"
)
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": "2.0.0",
        "timestamp": "2026-05-17T02:00:00Z",
        "features": {
            "analysis": "operational",
            "postmortem": "operational",
            "analytics": "operational",
            "heatmap": "operational",
            "review": "operational"
        }
    }


# API Info endpoint
@app.get(
    "/api/info",
    tags=["Info"],
    summary="API Information",
    description="Get detailed API information"
)
async def api_info():
    """
    Get API information
    """
    return {
        "name": settings.app_name,
        "version": "2.0.0",
        "description": "DevAssist provides code analysis, review, and AI-powered PostMortem investigation",
        "features": [
            "Code Analysis - Analyze repositories, snippets, and files",
            "PostMortem AI - 6-layer intelligence stack for production errors",
            "Code Review - Submit and manage code reviews with AI",
            "Analytics - Dashboard metrics and trends",
            "Heatmap - Error distribution visualization",
            "Documentation - Coding guidelines and best practices"
        ],
        "authentication": {
            "methods": ["X-API-Key", "Bearer Token"],
            "description": "Provide API key via X-API-Key header or Authorization Bearer token"
        },
        "supported_languages": [
            "Python", "JavaScript", "TypeScript", "Java", 
            "C#", "Go", "Rust", "C++", "PHP", "Ruby"
        ],
        "premium_features": {
            "postmortem_ai": {
                "description": "AI-powered production error investigation",
                "layers": [
                    "Layer 1: Error Parser - Extract structured data",
                    "Layer 2: Codebase Investigation - Analyze repository context",
                    "Layer 3: Root Cause Engine - Find actual root cause",
                    "Layer 4: Fix Suggester - Generate 3-tier fixes",
                    "Layer 5: Report Generator - Create incident reports",
                    "Layer 6: Institutional Memory - Learn from past incidents"
                ]
            }
        }
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info" if settings.debug else "warning"
    )

# Made with Bob
