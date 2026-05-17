"""
Heatmap endpoints for DevAssist API
Provides error heatmap visualization data
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random

from auth import verify_api_key


router = APIRouter(
    prefix="/api/heatmap",
    tags=["Heatmap"],
    dependencies=[Depends(verify_api_key)]
)


@router.get("/{analysis_id}", response_model=List[Dict[str, Any]])
async def get_heatmap(
    analysis_id: str,
    api_key: str = Depends(verify_api_key)
) -> List[Dict[str, Any]]:
    """
    Get heatmap visualization data for an analysis
    
    Args:
        analysis_id: Analysis identifier
        
    Returns:
        Heatmap data showing error distribution across files
    """
    # Generate mock heatmap data
    # In production, this would aggregate data from the analysis
    
    files = [
        "src/main.py",
        "src/utils.py",
        "src/models.py",
        "src/api/routes.py",
        "src/api/handlers.py",
        "src/services/auth.py",
        "src/services/database.py",
        "src/config.py",
        "tests/test_main.py",
        "tests/test_utils.py"
    ]
    
    heatmap_data = []
    for file in files:
        error_count = random.randint(0, 10)
        warning_count = random.randint(0, 15)
        
        heatmap_data.append({
            "file": file.split("/")[-1],
            "path": file,
            "errorCount": error_count,
            "warningCount": warning_count,
            "lastModified": (datetime.utcnow() - timedelta(days=random.randint(1, 30))).isoformat(),
            "relatedChanges": [
                f"commit-{random.randint(100000, 999999)}" 
                for _ in range(random.randint(1, 3))
            ],
            "severity": "high" if error_count > 5 else "medium" if error_count > 2 else "low",
            "complexity": random.randint(1, 10)
        })
    
    # Sort by error count (descending)
    heatmap_data.sort(key=lambda x: x["errorCount"], reverse=True)
    
    return heatmap_data


@router.get("/{analysis_id}/file/{file_path:path}", response_model=Dict[str, Any])
async def get_file_heatmap(
    analysis_id: str,
    file_path: str,
    api_key: str = Depends(verify_api_key)
) -> Dict[str, Any]:
    """
    Get detailed heatmap data for a specific file
    
    Args:
        analysis_id: Analysis identifier
        file_path: File path
        
    Returns:
        Detailed heatmap data for the file
    """
    # Generate mock detailed heatmap
    line_data = []
    for line_num in range(1, 101):  # Mock 100 lines
        has_error = random.random() < 0.1  # 10% chance of error
        has_warning = random.random() < 0.15  # 15% chance of warning
        
        if has_error or has_warning:
            line_data.append({
                "line": line_num,
                "errorCount": 1 if has_error else 0,
                "warningCount": 1 if has_warning else 0,
                "severity": "error" if has_error else "warning",
                "message": "Sample error message" if has_error else "Sample warning message"
            })
    
    return {
        "file": file_path,
        "analysisId": analysis_id,
        "totalLines": 100,
        "errorLines": len([l for l in line_data if l["errorCount"] > 0]),
        "warningLines": len([l for l in line_data if l["warningCount"] > 0]),
        "lineData": line_data,
        "summary": {
            "totalErrors": sum(l["errorCount"] for l in line_data),
            "totalWarnings": sum(l["warningCount"] for l in line_data),
            "errorDensity": len([l for l in line_data if l["errorCount"] > 0]) / 100
        }
    }


# Made with Bob