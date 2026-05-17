import axios from 'axios';
import type { AnalysisResult, PostMortemData, HeatmapData, AnalyticsData } from '@/types';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 60000, // Increased timeout for long-running analyses
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available (supports both X-API-Key and Bearer token)
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Backend supports both authentication methods
      config.headers['X-API-Key'] = token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token');
      console.error('Authentication failed. Please check your API key.');
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // ============================================
  // ANALYSIS ENDPOINTS
  // ============================================
  
  // Analyze repository
  analyzeRepo: async (url: string, branch: string = 'main'): Promise<AnalysisResult> => {
    const response = await apiClient.post('/api/analyze/repo', {
      url: url,
      branch: branch
    });
    return response.data;
  },

  // Analyze code snippet
  analyzeSnippet: async (
    code: string,
    language: string,
    fileName?: string
  ): Promise<AnalysisResult> => {
    const response = await apiClient.post('/api/analyze/snippet', {
      code: code,
      language: language,
      fileName: fileName,
    });
    return response.data;
  },

  // Analyze uploaded file (screenshot or code file)
  analyzeFile: async (file: File): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/api/analyze/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get analysis by ID
  getAnalysis: async (id: string): Promise<AnalysisResult> => {
    const response = await apiClient.get(`/api/analyze/${id}`);
    return response.data;
  },

  // ============================================
  // POSTMORTEM ENDPOINTS
  // ============================================
  
  // Analyze production error (PostMortem AI)
  analyzePostMortem: async (
    errorLog: string,
    repoUrl?: string,
    environment: string = 'production'
  ): Promise<PostMortemData> => {
    const response = await apiClient.post('/api/postmortem/analyze', {
      errorLog: errorLog,
      repoUrl: repoUrl,
      environment: environment,
    });
    return response.data;
  },

  // Get PostMortem analysis by ID
  getPostMortem: async (id: string): Promise<PostMortemData> => {
    const response = await apiClient.get(`/api/postmortem/${id}`);
    return response.data;
  },

  // ============================================
  // HEATMAP ENDPOINTS
  // ============================================
  
  // Get heatmap data for repository
  getHeatmap: async (repoUrl: string, branch: string = 'main'): Promise<HeatmapData> => {
    const response = await apiClient.post('/api/heatmap/generate', {
      repo_url: repoUrl,
      branch,
    });
    return response.data;
  },

  // Get heatmap by ID
  getHeatmapById: async (id: string): Promise<HeatmapData> => {
    const response = await apiClient.get(`/api/heatmap/${id}`);
    return response.data;
  },

  // ============================================
  // ANALYTICS ENDPOINTS
  // ============================================
  
  // Get analytics dashboard data
  getAnalytics: async (): Promise<AnalyticsData> => {
    const response = await apiClient.get('/api/analytics');
    return response.data;
  },

  // Get analytics trends
  getTrends: async (period: string = '7d'): Promise<any> => {
    const response = await apiClient.get('/api/analytics/trends', {
      params: { period },
    });
    return response.data;
  },

  // ============================================
  // UTILITY ENDPOINTS
  // ============================================
  
  // Health check
  healthCheck: async (): Promise<{ status: string; version: string }> => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Apply fix
  applyFix: async (analysisId: string, fixId: string): Promise<any> => {
    const response = await apiClient.post(`/api/analysis/${analysisId}/fix/${fixId}`);
    return response.data;
  },
};

// Helper function to check if backend is available
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    await api.healthCheck();
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
};

// Made with Bob
