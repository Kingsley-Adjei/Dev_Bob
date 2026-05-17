"""
Pydantic models for request/response validation
Updated to match frontend TypeScript types
"""
from datetime import datetime
from typing import List, Optional, Dict, Any, Literal
from enum import Enum
from pydantic import BaseModel, Field


# Enums
class ProgrammingLanguage(str, Enum):
    """Supported programming languages"""
    PYTHON = "python"
    JAVASCRIPT = "javascript"
    TYPESCRIPT = "typescript"
    JAVA = "java"
    CSHARP = "csharp"
    GO = "go"
    RUST = "rust"
    CPP = "cpp"
    PHP = "php"
    RUBY = "ruby"


class ReviewStatus(str, Enum):
    """Review status options"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REJECTED = "rejected"


class IssueSeverity(str, Enum):
    """Issue severity levels"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


# ============================================================================
# ANALYSIS MODELS (matching frontend types)
# ============================================================================

class ErrorDetail(BaseModel):
    """Error detail matching frontend ErrorDetail type"""
    id: str = Field(..., description="Unique error identifier")
    file: str = Field(..., description="File where error occurred")
    line: int = Field(..., description="Line number", ge=1)
    column: int = Field(..., description="Column number", ge=1)
    message: str = Field(..., description="Error message")
    severity: Literal["error", "warning", "info"] = Field(..., description="Error severity")
    code: Optional[str] = Field(None, description="Error code snippet")
    relatedFiles: Optional[List[str]] = Field(None, description="Related files")


class Fix(BaseModel):
    """Fix suggestion matching frontend Fix type"""
    id: str = Field(..., description="Unique fix identifier")
    errorId: str = Field(..., description="Related error ID")
    description: str = Field(..., description="Fix description")
    code: str = Field(..., description="Fix code")
    confidence: int = Field(..., description="Confidence score 0-100", ge=0, le=100)
    applied: bool = Field(default=False, description="Whether fix was applied")


class HeatmapData(BaseModel):
    """Heatmap data matching frontend HeatmapData type"""
    file: str = Field(..., description="File name")
    path: str = Field(..., description="File path")
    errorCount: int = Field(..., description="Number of errors", ge=0)
    warningCount: int = Field(..., description="Number of warnings", ge=0)
    lastModified: datetime = Field(..., description="Last modified timestamp")
    relatedChanges: List[str] = Field(default_factory=list, description="Related changes")


class AnalysisSummary(BaseModel):
    """Analysis summary matching frontend AnalysisSummary type"""
    totalErrors: int = Field(..., description="Total errors found", ge=0)
    totalWarnings: int = Field(..., description="Total warnings found", ge=0)
    filesAnalyzed: int = Field(..., description="Number of files analyzed", ge=0)
    fixesApplied: int = Field(default=0, description="Number of fixes applied", ge=0)
    successRate: float = Field(..., description="Success rate 0-1", ge=0, le=1)


class AnalysisResult(BaseModel):
    """Analysis result matching frontend AnalysisResult type"""
    errors: List[ErrorDetail] = Field(default_factory=list, description="List of errors")
    fixes: List[Fix] = Field(default_factory=list, description="List of fixes")
    heatmapData: List[HeatmapData] = Field(default_factory=list, description="Heatmap data")
    summary: AnalysisSummary = Field(..., description="Analysis summary")


class FileUploadData(BaseModel):
    """File upload data matching frontend FileUploadData type"""
    fileName: str = Field(..., description="File name")
    fileType: str = Field(..., description="File MIME type")
    fileSize: int = Field(..., description="File size in bytes", ge=0)
    preview: Optional[str] = Field(None, description="Base64 preview for images")
    extractedText: Optional[str] = Field(None, description="OCR text from screenshots")


# ============================================================================
# POSTMORTEM MODELS (matching frontend types)
# ============================================================================

class UserImpact(BaseModel):
    """User impact data"""
    affectedUsers: int = Field(..., description="Number of affected users", ge=0)
    revenueImpact: Optional[float] = Field(None, description="Revenue impact in dollars")
    duration: Optional[int] = Field(None, description="Duration in minutes")


class StackFrame(BaseModel):
    """Stack trace frame"""
    function: str = Field(..., description="Function name")
    file: str = Field(..., description="File path")
    line: int = Field(..., description="Line number", ge=1)
    column: int = Field(..., description="Column number", ge=1)
    context: Optional[str] = Field(None, description="Code context")


class ParsedError(BaseModel):
    """Parsed error data"""
    errorType: str = Field(..., description="Error type")
    errorMessage: str = Field(..., description="Error message")
    stackTrace: List[StackFrame] = Field(default_factory=list, description="Stack trace")
    affectedFiles: List[str] = Field(default_factory=list, description="Affected files")
    primaryFile: str = Field(..., description="Primary file where error occurred")
    primaryLine: int = Field(..., description="Primary line number", ge=1)
    environment: str = Field(..., description="Environment (production/staging/dev)")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Error timestamp")
    severity: Literal["P0", "P1", "P2", "P3"] = Field(..., description="Severity level")
    userImpact: UserImpact = Field(..., description="User impact data")


class RootCauseAnalysis(BaseModel):
    """Root cause analysis"""
    description: str = Field(..., description="Root cause description")
    actualLocation: Dict[str, Any] = Field(..., description="Actual location of root cause")
    errorLocation: Dict[str, Any] = Field(..., description="Where error manifested")
    triggeringEvent: str = Field(..., description="What triggered the error")
    introducedIn: Dict[str, Any] = Field(..., description="When/how it was introduced")
    reasoning: Dict[str, Any] = Field(..., description="Reasoning chain")
    impact: Dict[str, Any] = Field(..., description="Impact analysis")


class PostMortemFix(BaseModel):
    """PostMortem fix suggestion"""
    tier: Literal["immediate", "proper", "systemic"] = Field(..., description="Fix tier")
    title: str = Field(..., description="Fix title")
    description: str = Field(..., description="Fix description")
    code: Optional[str] = Field(None, description="Fix code")
    file: Optional[str] = Field(None, description="File to fix")
    line: Optional[int] = Field(None, description="Line to fix", ge=1)
    reasoning: str = Field(..., description="Why this fix works")
    tradeoffs: List[str] = Field(default_factory=list, description="Tradeoffs")
    estimatedTime: str = Field(..., description="Estimated time to implement")
    confidence: int = Field(..., description="Confidence 0-100", ge=0, le=100)
    testSuggestions: Optional[List[str]] = Field(None, description="Test suggestions")


class FixSuggestions(BaseModel):
    """3-tier fix suggestions"""
    immediate: PostMortemFix = Field(..., description="Immediate fix")
    proper: PostMortemFix = Field(..., description="Proper fix")
    systemic: PostMortemFix = Field(..., description="Systemic fix")


class TimelineEvent(BaseModel):
    """Timeline event"""
    timestamp: datetime = Field(..., description="Event timestamp")
    event: str = Field(..., description="Event description")
    actor: Optional[str] = Field(None, description="Who performed the action")
    details: Optional[str] = Field(None, description="Additional details")


class PostMortemReport(BaseModel):
    """PostMortem incident report"""
    incidentId: str = Field(..., description="Incident ID")
    title: str = Field(..., description="Incident title")
    severity: Literal["P0", "P1", "P2", "P3"] = Field(..., description="Severity")
    status: Literal["investigating", "resolved", "monitoring"] = Field(..., description="Status")
    timeline: List[TimelineEvent] = Field(default_factory=list, description="Timeline")
    impact: Dict[str, Any] = Field(..., description="Impact data")
    rootCause: str = Field(..., description="Root cause summary")
    fixApplied: str = Field(..., description="Fix that was applied")
    prevention: Dict[str, Any] = Field(..., description="Prevention recommendations")
    detectedAt: datetime = Field(..., description="When detected")
    resolvedAt: Optional[datetime] = Field(None, description="When resolved")
    detectedBy: str = Field(..., description="Who detected it")
    resolvedBy: Optional[str] = Field(None, description="Who resolved it")


class SimilarIncident(BaseModel):
    """Similar past incident"""
    id: str = Field(..., description="Incident ID")
    title: str = Field(..., description="Incident title")
    date: datetime = Field(..., description="Incident date")
    similarity: float = Field(..., description="Similarity score 0-1", ge=0, le=1)
    resolution: str = Field(..., description="How it was resolved")
    timeSaved: float = Field(..., description="Time saved in hours", ge=0)


class PostMortemData(BaseModel):
    """Complete PostMortem analysis data"""
    errorLog: str = Field(..., description="Original error log")
    repoUrl: Optional[str] = Field(None, description="Repository URL")
    branch: Optional[str] = Field(None, description="Branch name")
    environment: Optional[str] = Field(None, description="Environment")
    timestamp: Optional[datetime] = Field(None, description="Timestamp")
    userImpact: Optional[UserImpact] = Field(None, description="User impact")
    parsedError: Optional[ParsedError] = Field(None, description="Parsed error")
    rootCause: Optional[RootCauseAnalysis] = Field(None, description="Root cause")
    fixes: Optional[FixSuggestions] = Field(None, description="Fix suggestions")
    report: Optional[PostMortemReport] = Field(None, description="Incident report")
    similarIncidents: Optional[List[SimilarIncident]] = Field(None, description="Similar incidents")


# ============================================================================
# INPUT MODELS
# ============================================================================

class RepoInput(BaseModel):
    """Repository analysis input"""
    url: str = Field(..., description="Repository URL")
    branch: Optional[str] = Field("main", description="Branch name")
    accessToken: Optional[str] = Field(None, description="Access token")


class SnippetInput(BaseModel):
    """Code snippet analysis input"""
    code: str = Field(..., description="Code to analyze", min_length=1)
    language: str = Field(..., description="Programming language")
    fileName: Optional[str] = Field(None, description="Optional file name")


class PostMortemInput(BaseModel):
    """PostMortem analysis input"""
    errorLog: str = Field(..., description="Error log or stack trace", min_length=1)
    repoUrl: Optional[str] = Field(None, description="Repository URL")
    environment: Optional[str] = Field("production", description="Environment")
    timestamp: Optional[datetime] = Field(None, description="Error timestamp")
    userImpact: Optional[UserImpact] = Field(None, description="User impact data")


class Analysis(BaseModel):
    """Analysis record"""
    id: str = Field(..., description="Analysis ID")
    type: Literal["repo", "snippet", "file", "postmortem"] = Field(..., description="Analysis type")
    input: str = Field(..., description="Input data")
    status: Literal["pending", "analyzing", "completed", "error"] = Field(..., description="Status")
    result: Optional[AnalysisResult] = Field(None, description="Analysis result")
    createdAt: datetime = Field(default_factory=datetime.utcnow, description="Created timestamp")
    completedAt: Optional[datetime] = Field(None, description="Completed timestamp")
    fileData: Optional[FileUploadData] = Field(None, description="File upload data")
    postmortemData: Optional[PostMortemData] = Field(None, description="PostMortem data")


# ============================================================================
# LEGACY MODELS (for backward compatibility with existing code)
# ============================================================================

class CodeSnippet(BaseModel):
    """Input code for analysis (legacy)"""
    code: str = Field(..., description="The code to analyze", min_length=1)
    language: ProgrammingLanguage = Field(..., description="Programming language")
    filename: Optional[str] = Field(None, description="Optional filename")


class Issue(BaseModel):
    """Code issue found during analysis (legacy)"""
    line_number: int = Field(..., description="Line number where issue occurs", ge=1)
    message: str = Field(..., description="Issue description")
    severity: IssueSeverity = Field(..., description="Issue severity level")
    rule_id: Optional[str] = Field(None, description="Rule identifier")


class CodeMetrics(BaseModel):
    """Code quality metrics (legacy)"""
    lines_of_code: int = Field(..., description="Total lines of code", ge=0)
    cyclomatic_complexity: int = Field(..., description="Cyclomatic complexity score", ge=1)
    maintainability_index: float = Field(..., description="Maintainability index (0-100)", ge=0, le=100)
    comment_ratio: float = Field(..., description="Ratio of comments to code", ge=0, le=1)


class AnalysisResultLegacy(BaseModel):
    """Analysis output (legacy)"""
    complexity_score: int = Field(..., description="Overall complexity score", ge=0, le=100)
    issues: List[Issue] = Field(default_factory=list, description="List of found issues")
    metrics: CodeMetrics = Field(..., description="Code metrics")
    suggestions: List[str] = Field(default_factory=list, description="Improvement suggestions")
    analyzed_at: datetime = Field(default_factory=datetime.utcnow, description="Analysis timestamp")


# ============================================================================
# CODE REVIEW MODELS
# ============================================================================

class ReviewRequest(BaseModel):
    """Submit code for review"""
    code: str = Field(..., description="Code to review", min_length=1)
    language: ProgrammingLanguage = Field(..., description="Programming language")
    title: str = Field(..., description="Review title", min_length=1, max_length=200)
    description: Optional[str] = Field(None, description="Optional description", max_length=1000)


class Comment(BaseModel):
    """Review comment"""
    comment_id: str = Field(..., description="Unique comment identifier")
    line_number: int = Field(..., description="Code line reference", ge=1)
    message: str = Field(..., description="Comment text", min_length=1)
    severity: IssueSeverity = Field(..., description="Issue severity")
    author: str = Field(default="DevAssist", description="Comment author")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Comment timestamp")


class AIAnalysis(BaseModel):
    """AI-powered code analysis results"""
    quality_score: int = Field(..., description="Code quality score (0-100)", ge=0, le=100)
    issues: List[Dict[str, Any]] = Field(default_factory=list, description="List of issues found")
    suggestions: List[str] = Field(default_factory=list, description="Improvement suggestions")
    summary: str = Field(..., description="Overall analysis summary")
    powered_by: str = Field(default="IBM Bob + Gemini AI", description="AI provider")


class ReviewResponse(BaseModel):
    """Review details"""
    review_id: str = Field(..., description="Unique review identifier")
    title: str = Field(..., description="Review title")
    status: ReviewStatus = Field(..., description="Review status")
    language: ProgrammingLanguage = Field(..., description="Programming language")
    code: str = Field(..., description="Code being reviewed")
    comments: List[Comment] = Field(default_factory=list, description="Review comments")
    description: Optional[str] = Field(None, description="Review description")
    ai_analysis: Optional[AIAnalysis] = Field(None, description="AI-powered analysis results")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Last update timestamp")


class ReviewListItem(BaseModel):
    """Simplified review item for list view"""
    review_id: str = Field(..., description="Unique review identifier")
    title: str = Field(..., description="Review title")
    status: ReviewStatus = Field(..., description="Review status")
    language: ProgrammingLanguage = Field(..., description="Programming language")
    comment_count: int = Field(default=0, description="Number of comments", ge=0)
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")


class AddCommentRequest(BaseModel):
    """Add comment to a review"""
    line_number: int = Field(..., description="Code line reference", ge=1)
    message: str = Field(..., description="Comment text", min_length=1, max_length=500)
    severity: IssueSeverity = Field(default=IssueSeverity.INFO, description="Issue severity")


# ============================================================================
# DOCUMENTATION MODELS
# ============================================================================

class Rule(BaseModel):
    """Coding rule"""
    rule_id: str = Field(..., description="Rule identifier")
    title: str = Field(..., description="Rule title")
    description: str = Field(..., description="Rule description")
    examples: List[str] = Field(default_factory=list, description="Code examples")


class GuidelineResponse(BaseModel):
    """Coding guidelines"""
    category: str = Field(..., description="Guideline category")
    rules: List[Rule] = Field(..., description="List of rules")
    language: Optional[ProgrammingLanguage] = Field(None, description="Specific language")


class BestPractice(BaseModel):
    """Best practice item"""
    practice_id: str = Field(..., description="Practice identifier")
    title: str = Field(..., description="Practice title")
    description: str = Field(..., description="Practice description")
    category: str = Field(..., description="Category")
    language: Optional[ProgrammingLanguage] = Field(None, description="Specific language")
    code_example: Optional[str] = Field(None, description="Code example")


class SearchRequest(BaseModel):
    """Documentation search"""
    query: str = Field(..., description="Search query", min_length=1, max_length=200)
    category: Optional[str] = Field(None, description="Filter by category")
    language: Optional[ProgrammingLanguage] = Field(None, description="Filter by language")


class SearchResult(BaseModel):
    """Search result item"""
    result_type: str = Field(..., description="Type of result (guideline/practice)")
    title: str = Field(..., description="Result title")
    description: str = Field(..., description="Result description")
    relevance_score: float = Field(..., description="Relevance score", ge=0, le=1)


# ============================================================================
# RESPONSE MODELS
# ============================================================================

class ErrorResponse(BaseModel):
    """Error response"""
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    type: str = Field(..., description="Exception type")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")


class SuccessResponse(BaseModel):
    """Generic success response"""
    success: bool = Field(default=True, description="Operation success status")
    message: str = Field(..., description="Success message")
    data: Optional[Dict[str, Any]] = Field(None, description="Additional data")


# Made with Bob
