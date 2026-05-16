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
  type: 'repo' | 'snippet';
  input: string;
  status: 'pending' | 'analyzing' | 'completed' | 'error';
  result?: AnalysisResult;
  createdAt: Date;
  completedAt?: Date;
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
