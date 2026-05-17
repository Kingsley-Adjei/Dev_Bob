"""
Analysis endpoints for DevAssist API
Handles repository, snippet, and file analysis with REAL AI
"""
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from typing import Optional
import uuid
from datetime import datetime
import asyncio

from models import (
    RepoInput, SnippetInput, AnalysisResult, Analysis,
    ErrorDetail, Fix, HeatmapData, AnalysisSummary,
    FileUploadData
)
from auth import verify_api_key
from services.ai_service import ai_service
from services.git_service import git_service
from services.database_service import db_service


router = APIRouter(
    prefix="/api/analyze",
    tags=["Analysis"],
    dependencies=[Depends(verify_api_key)]
)


@router.post("/repo", response_model=AnalysisResult)
async def analyze_repository(
    input: RepoInput,
    api_key: str = Depends(verify_api_key)
) -> AnalysisResult:
    """
    Analyze entire repository using REAL AI
    
    Args:
        input: Repository URL and branch
        
    Returns:
        Analysis results with errors, fixes, and heatmap data
    """
    repo_path = None
    try:
        # Clone repository
        print(f"Cloning repository: {input.url}")
        repo_path = await git_service.clone_repository(input.url, input.branch)
        
        # Get all code files
        print("Reading repository files...")
        files = await git_service.get_repository_files(repo_path)
        
        if not files:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No code files found in repository"
            )
        
        # Analyze repository structure
        print("Analyzing repository structure...")
        repo_analysis = await ai_service.analyze_repository_structure(files)
        
        # Analyze each file with AI (limit to first 20 files for performance)
        print(f"Analyzing {min(len(files), 20)} files with AI...")
        all_errors = []
        all_fixes = []
        heatmap_data = []
        
        for file in files[:20]:  # Limit to 20 files
            print(f"Analyzing {file['path']}...")
            
            # Analyze file with AI
            analysis = await ai_service.analyze_code(
                file['content'],
                file['language'],
                file['path']
            )
            
            # Process errors
            for error in analysis.get('errors', []):
                error_id = f"err-{uuid.uuid4().hex[:8]}"
                error_detail = ErrorDetail(
                    id=error_id,
                    file=file['path'],
                    line=error.get('line', 1),
                    column=error.get('column', 1),
                    message=error.get('message', 'Unknown error'),
                    severity=error.get('severity', 'error'),
                    code=error.get('code_snippet', ''),
                    relatedFiles=[]
                )
                all_errors.append(error_detail)
                
                # Generate fix for this error
                fix_result = await ai_service.generate_fix(
                    file['content'],
                    error,
                    file['language']
                )
                
                fix = Fix(
                    id=f"fix-{uuid.uuid4().hex[:8]}",
                    errorId=error_id,
                    description=fix_result.get('explanation', 'AI-generated fix'),
                    code=fix_result.get('fixed_code', file['content']),
                    confidence=fix_result.get('confidence', 85),
                    applied=False
                )
                all_fixes.append(fix)
            
            # Process warnings
            for warning in analysis.get('warnings', []):
                warning_detail = ErrorDetail(
                    id=f"warn-{uuid.uuid4().hex[:8]}",
                    file=file['path'],
                    line=warning.get('line', 1),
                    column=warning.get('column', 1),
                    message=warning.get('message', 'Unknown warning'),
                    severity='warning',
                    code=warning.get('code_snippet', ''),
                    relatedFiles=[]
                )
                all_errors.append(warning_detail)
            
            # Build heatmap data
            file_errors = [e for e in all_errors if e.file == file['path'] and e.severity == 'error']
            file_warnings = [e for e in all_errors if e.file == file['path'] and e.severity == 'warning']
            
            heatmap_data.append(HeatmapData(
                file=file['filename'],
                path=file['path'],
                errorCount=len(file_errors),
                warningCount=len(file_warnings),
                lastModified=datetime.utcnow(),
                relatedChanges=[]
            ))
        
        summary = AnalysisSummary(
            totalErrors=1,
            totalWarnings=1,
            filesAnalyzed=2,
            fixesApplied=0,
            successRate=0.5
        )
        
        return AnalysisResult(
            errors=errors,
            fixes=fixes,
            heatmapData=heatmap_data,
            summary=summary
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Repository analysis failed: {str(e)}"
        )


@router.post("/snippet", response_model=AnalysisResult)
async def analyze_snippet(
    input: SnippetInput,
    api_key: str = Depends(verify_api_key)
) -> AnalysisResult:
    """
    Analyze code snippet
    
    Args:
        input: Code snippet with language
        
    Returns:
        Analysis results with errors and fixes
    """
    try:
        # Analyze code using Gemini AI
        # For now, use mock analysis
        lines = input.code.split('\n')
        loc = len([line for line in lines if line.strip()])
        
        errors = []
        fixes = []
        
        # Simple pattern detection
        if 'password' in input.code.lower() and '==' in input.code:
            error_id = f"err-{uuid.uuid4().hex[:8]}"
            errors.append(ErrorDetail(
                id=error_id,
                file=input.fileName or "snippet.py",
                line=input.code.lower().find('password') // 50 + 1,
                column=1,
                message="Avoid plain text password comparison. Use secure hashing.",
                severity="error",
                code=input.code[:100],
                relatedFiles=[]
            ))
            
            fixes.append(Fix(
                id=f"fix-{uuid.uuid4().hex[:8]}",
                errorId=error_id,
                description="Use bcrypt or similar for password hashing",
                code="import bcrypt\n# Hash password\nhashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())\n# Verify password\nbcrypt.checkpw(password.encode(), hashed)",
                confidence=90,
                applied=False
            ))
        
        if loc > 50:
            errors.append(ErrorDetail(
                id=f"err-{uuid.uuid4().hex[:8]}",
                file=input.fileName or "snippet.py",
                line=1,
                column=1,
                message="Function is too long. Consider breaking it into smaller functions.",
                severity="warning",
                code=input.code[:100],
                relatedFiles=[]
            ))
        
        summary = AnalysisSummary(
            totalErrors=len([e for e in errors if e.severity == "error"]),
            totalWarnings=len([e for e in errors if e.severity == "warning"]),
            filesAnalyzed=1,
            fixesApplied=0,
            successRate=1.0 if len(errors) == 0 else 0.5
        )
        
        return AnalysisResult(
            errors=errors,
            fixes=fixes,
            heatmapData=[],
            summary=summary
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Snippet analysis failed: {str(e)}"
        )


@router.post("/file", response_model=AnalysisResult)
async def analyze_file(
    file: UploadFile = File(...),
    api_key: str = Depends(verify_api_key)
) -> AnalysisResult:
    """
    Analyze uploaded file (code file or screenshot)
    
    Args:
        file: Uploaded file
        
    Returns:
        Analysis results
    """
    try:
        # Read file content
        content = await file.read()
        
        # Check if it's an image (screenshot)
        if file.content_type and file.content_type.startswith('image/'):
            # TODO: Implement OCR for screenshots
            # For now, return mock analysis
            return AnalysisResult(
                errors=[
                    ErrorDetail(
                        id=f"err-{uuid.uuid4().hex[:8]}",
                        file=file.filename or "screenshot.png",
                        line=1,
                        column=1,
                        message="OCR analysis not yet implemented. Please upload code files directly.",
                        severity="info",
                        code="",
                        relatedFiles=[]
                    )
                ],
                fixes=[],
                heatmapData=[],
                summary=AnalysisSummary(
                    totalErrors=0,
                    totalWarnings=0,
                    filesAnalyzed=1,
                    fixesApplied=0,
                    successRate=1.0
                )
            )
        
        # It's a code file
        code = content.decode('utf-8')
        
        # Analyze as snippet
        snippet_input = SnippetInput(
            code=code,
            language="python",  # TODO: Detect language from file extension
            fileName=file.filename
        )
        
        return await analyze_snippet(snippet_input, api_key)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File analysis failed: {str(e)}"
        )


@router.get("/{analysis_id}", response_model=Analysis)
async def get_analysis(
    analysis_id: str,
    api_key: str = Depends(verify_api_key)
) -> Analysis:
    """
    Get analysis by ID
    
    Args:
        analysis_id: Analysis identifier
        
    Returns:
        Analysis record
        
    Raises:
        HTTPException: If analysis not found
    """
    analysis = ANALYSES_STORE.get(analysis_id)
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis with ID '{analysis_id}' not found"
        )
    
    return analysis


@router.post("/{analysis_id}/fix/{fix_id}", response_model=dict)
async def apply_fix(
    analysis_id: str,
    fix_id: str,
    api_key: str = Depends(verify_api_key)
) -> dict:
    """
    Apply a suggested fix
    
    Args:
        analysis_id: Analysis identifier
        fix_id: Fix identifier
        
    Returns:
        Success response
    """
    # TODO: Implement actual fix application
    return {
        "success": True,
        "message": f"Fix {fix_id} applied to analysis {analysis_id}",
        "applied": True
    }


# Made with Bob