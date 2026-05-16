// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon: string;
  isActive?: boolean;
}

// Analysis types
export interface Analysis {
  id: string;
  type: 'repo' | 'snippet' | 'file' | 'postmortem';
  input: string;
  status: 'pending' | 'analyzing' | 'completed' | 'error';
  result?: AnalysisResult;
  createdAt: Date;
  completedAt?: Date;
  fileData?: FileUploadData;
  postmortemData?: PostMortemData;
}

// PostMortem types
export interface PostMortemData {
  errorLog: string;
  repoUrl?: string;
  branch?: string;
  environment?: string;
  timestamp?: Date;
  userImpact?: UserImpact;
  parsedError?: ParsedError;
  rootCause?: RootCauseAnalysis;
  fixes?: FixSuggestions;
  report?: PostMortemReport;
  similarIncidents?: SimilarIncident[];
}

export interface UserImpact {
  affectedUsers: number;
  revenueImpact?: number;
  duration?: number; // in minutes
}

export interface ParsedError {
  errorType: string;
  errorMessage: string;
  stackTrace: StackFrame[];
  affectedFiles: string[];
  primaryFile: string;
  primaryLine: number;
  environment: string;
  timestamp: Date;
  severity: 'P0' | 'P1' | 'P2' | 'P3';
  userImpact: UserImpact;
}

export interface StackFrame {
  function: string;
  file: string;
  line: number;
  column: number;
  context?: string;
}

export interface RootCauseAnalysis {
  description: string;
  actualLocation: {
    file: string;
    line: number;
    reason: string;
  };
  errorLocation: {
    file: string;
    line: number;
  };
  triggeringEvent: string;
  introducedIn: {
    commit: string;
    date: Date;
    author: string;
    prNumber?: string;
    feature: string;
  };
  reasoning: {
    whatBroke: string;
    whyItBroke: string;
    whyNow: string;
    whatWasAssumed: string;
    whatActuallyHappened: string;
  };
  impact: {
    affectedCodePaths: string[];
    potentialSideEffects: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface FixSuggestions {
  immediate: PostMortemFix;
  proper: PostMortemFix;
  systemic: PostMortemFix;
}

export interface PostMortemFix {
  tier: 'immediate' | 'proper' | 'systemic';
  title: string;
  description: string;
  code?: string;
  file?: string;
  line?: number;
  reasoning: string;
  tradeoffs: string[];
  estimatedTime: string;
  confidence: number;
  testSuggestions?: string[];
}

export interface PostMortemReport {
  incidentId: string;
  title: string;
  severity: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'investigating' | 'resolved' | 'monitoring';
  timeline: TimelineEvent[];
  impact: {
    duration: number;
    usersAffected: number;
    revenueImpact?: number;
    servicesAffected: string[];
  };
  rootCause: string;
  fixApplied: string;
  prevention: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  detectedAt: Date;
  resolvedAt?: Date;
  detectedBy: string;
  resolvedBy?: string;
}

export interface TimelineEvent {
  timestamp: Date;
  event: string;
  actor?: string;
  details?: string;
}

export interface SimilarIncident {
  id: string;
  title: string;
  date: Date;
  similarity: number;
  resolution: string;
  timeSaved: number;
}

export interface FileUploadData {
  fileName: string;
  fileType: string;
  fileSize: number;
  preview?: string; // Base64 preview for images
  extractedText?: string; // OCR text from screenshots
}

export interface AnalysisResult {
  errors: ErrorDetail[];
  fixes: Fix[];
  heatmapData: HeatmapData[];
  summary: AnalysisSummary;
}

export interface ErrorDetail {
  id: string;
  file: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code?: string;
  relatedFiles?: string[];
}

export interface Fix {
  id: string;
  errorId: string;
  description: string;
  code: string;
  confidence: number;
  applied: boolean;
}

export interface HeatmapData {
  file: string;
  path: string;
  errorCount: number;
  warningCount: number;
  lastModified: Date;
  relatedChanges: string[];
}

export interface AnalysisSummary {
  totalErrors: number;
  totalWarnings: number;
  filesAnalyzed: number;
  fixesApplied: number;
  successRate: number;
}

// Analytics types
export interface AnalyticsData {
  totalAnalyses: number;
  successRate: number;
  averageFixTime: number;
  commonErrors: ErrorType[];
  fileTypeDistribution: FileTypeData[];
  timeSeriesData: TimeSeriesPoint[];
}

export interface ErrorType {
  type: string;
  count: number;
  percentage: number;
}

export interface FileTypeData {
  extension: string;
  count: number;
  errorRate: number;
}

export interface TimeSeriesPoint {
  date: string;
  analyses: number;
  errors: number;
  fixes: number;
}

// App state types
export interface AppState {
  isConnected: boolean;
  currentPage: string;
  currentAnalysis: Analysis | null;
  analyses: Analysis[];
  setConnected: (status: boolean) => void;
  setCurrentPage: (page: string) => void;
  setCurrentAnalysis: (analysis: Analysis | null) => void;
  addAnalysis: (analysis: Analysis) => void;
  updateAnalysis: (id: string, updates: Partial<Analysis>) => void;
}

// Input types
export interface RepoInput {
  url: string;
  branch?: string;
  accessToken?: string;
}

export interface SnippetInput {
  code: string;
  language: string;
  fileName?: string;
}

// Made with Bob
