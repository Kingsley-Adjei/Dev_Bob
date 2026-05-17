"""
Analytics endpoints for DevAssist API
Provides dashboard analytics and metrics
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random

from auth import verify_api_key


router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"],
    dependencies=[Depends(verify_api_key)]
)


@router.get("/", response_model=Dict[str, Any])
async def get_analytics(
    api_key: str = Depends(verify_api_key)
) -> Dict[str, Any]:
    """
    Get dashboard analytics data
    
    Returns:
        Analytics data including totals, trends, and distributions
    """
    # Generate mock analytics data
    # In production, this would query the database
    
    # Time series data for the last 30 days
    time_series_data = []
    for i in range(30):
        date = datetime.utcnow() - timedelta(days=29-i)
        time_series_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "analyses": random.randint(10, 50),
            "errors": random.randint(20, 100),
            "fixes": random.randint(15, 80)
        })
    
    # Common error types
    common_errors = [
        {
            "type": "TypeError",
            "count": 145,
            "percentage": 35.2
        },
        {
            "type": "ReferenceError",
            "count": 98,
            "percentage": 23.8
        },
        {
            "type": "SyntaxError",
            "count": 76,
            "percentage": 18.5
        },
        {
            "type": "ValidationError",
            "count": 54,
            "percentage": 13.1
        },
        {
            "type": "Other",
            "count": 39,
            "percentage": 9.4
        }
    ]
    
    # File type distribution
    file_type_distribution = [
        {
            "extension": ".js",
            "count": 234,
            "errorRate": 0.42
        },
        {
            "extension": ".ts",
            "count": 189,
            "errorRate": 0.28
        },
        {
            "extension": ".py",
            "count": 156,
            "errorRate": 0.35
        },
        {
            "extension": ".java",
            "count": 98,
            "errorRate": 0.31
        },
        {
            "extension": ".go",
            "count": 67,
            "errorRate": 0.22
        }
    ]
    
    return {
        "totalAnalyses": 1247,
        "successRate": 0.87,
        "averageFixTime": 18.5,  # minutes
        "commonErrors": common_errors,
        "fileTypeDistribution": file_type_distribution,
        "timeSeriesData": time_series_data,
        "summary": {
            "totalErrors": 412,
            "totalWarnings": 678,
            "totalFixes": 356,
            "fixSuccessRate": 0.86
        },
        "trends": {
            "analysesChange": 12.5,  # percentage change from last period
            "errorsChange": -8.3,
            "fixesChange": 15.7
        }
    }


@router.get("/trends", response_model=Dict[str, Any])
async def get_trends(
    api_key: str = Depends(verify_api_key),
    days: int = 30
) -> Dict[str, Any]:
    """
    Get time-series trends data
    
    Args:
        days: Number of days to include (default: 30)
        
    Returns:
        Trends data over time
    """
    if days < 1 or days > 365:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Days must be between 1 and 365"
        )
    
    # Generate trend data
    trends = []
    for i in range(days):
        date = datetime.utcnow() - timedelta(days=days-1-i)
        trends.append({
            "date": date.strftime("%Y-%m-%d"),
            "analyses": random.randint(10, 50),
            "errors": random.randint(20, 100),
            "fixes": random.randint(15, 80),
            "successRate": round(random.uniform(0.75, 0.95), 2)
        })
    
    return {
        "period": f"Last {days} days",
        "data": trends,
        "summary": {
            "totalAnalyses": sum(t["analyses"] for t in trends),
            "totalErrors": sum(t["errors"] for t in trends),
            "totalFixes": sum(t["fixes"] for t in trends),
            "averageSuccessRate": round(sum(t["successRate"] for t in trends) / len(trends), 2)
        }
    }


@router.get("/summary", response_model=Dict[str, Any])
async def get_summary(
    api_key: str = Depends(verify_api_key)
) -> Dict[str, Any]:
    """
    Get quick summary statistics
    
    Returns:
        Summary statistics
    """
    return {
        "today": {
            "analyses": 42,
            "errors": 87,
            "fixes": 65,
            "successRate": 0.89
        },
        "thisWeek": {
            "analyses": 287,
            "errors": 542,
            "fixes": 456,
            "successRate": 0.87
        },
        "thisMonth": {
            "analyses": 1247,
            "errors": 2341,
            "fixes": 1987,
            "successRate": 0.86
        },
        "allTime": {
            "analyses": 5432,
            "errors": 9876,
            "fixes": 8234,
            "successRate": 0.85
        }
    }


# Made with Bob