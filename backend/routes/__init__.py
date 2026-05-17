"""
Routes package for DevAssist API
Includes all API route modules
"""

from . import analyse, review, docs, analysis, postmortem, analytics, heatmap

__all__ = [
    "analyse",      # Legacy analysis routes
    "review",       # Code review routes
    "docs",         # Documentation routes
    "analysis",     # New analysis routes (frontend-compatible)
    "postmortem",   # PostMortem AI routes
    "analytics",    # Analytics routes
    "heatmap"       # Heatmap routes
]

# Made with Bob
