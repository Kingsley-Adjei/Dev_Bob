import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Analysis } from '@/types';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      isConnected: true,
      currentPage: 'Home',
      currentAnalysis: null,
      analyses: [],

      // Actions
      setConnected: (status: boolean) => 
        set({ isConnected: status }),

      setCurrentPage: (page: string) => 
        set({ currentPage: page }),

      setCurrentAnalysis: (analysis: Analysis | null) => 
        set({ currentAnalysis: analysis }),

      addAnalysis: (analysis: Analysis) =>
        set((state) => ({
          analyses: [analysis, ...state.analyses],
          currentAnalysis: analysis,
        })),

      updateAnalysis: (id: string, updates: Partial<Analysis>) =>
        set((state) => ({
          analyses: state.analyses.map((analysis) =>
            analysis.id === id ? { ...analysis, ...updates } : analysis
          ),
          currentAnalysis:
            state.currentAnalysis?.id === id
              ? { ...state.currentAnalysis, ...updates }
              : state.currentAnalysis,
        })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        analyses: state.analyses,
      }),
    }
  )
);

// Made with Bob
