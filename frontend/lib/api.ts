import axios from 'axios';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
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
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Analyze repository
  analyzeRepo: async (url: string, branch?: string) => {
    const response = await apiClient.post('/analyze/repo', { url, branch });
    return response.data;
  },

  // Analyze code snippet
  analyzeSnippet: async (code: string, language: string, fileName?: string) => {
    const response = await apiClient.post('/analyze/snippet', {
      code,
      language,
      fileName,
    });
    return response.data;
  },

  // Analyze uploaded file (screenshot or code file)
  analyzeFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/analyze/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get analysis by ID
  getAnalysis: async (id: string) => {
    const response = await apiClient.get(`/analysis/${id}`);
    return response.data;
  },

  // Get heatmap data
  getHeatmap: async (id: string) => {
    const response = await apiClient.get(`/heatmap/${id}`);
    return response.data;
  },

  // Get analytics data
  getAnalytics: async () => {
    const response = await apiClient.get('/analytics');
    return response.data;
  },

  // Apply fix
  applyFix: async (analysisId: string, fixId: string) => {
    const response = await apiClient.post(`/analysis/${analysisId}/fix/${fixId}`);
    return response.data;
  },
};

// Made with Bob
