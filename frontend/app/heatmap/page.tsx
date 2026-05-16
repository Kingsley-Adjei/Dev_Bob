'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { motion } from 'framer-motion';
import { Activity, FileCode, AlertTriangle, Info, TrendingUp, Flame } from 'lucide-react';
import { getHeatmapColor } from '@/lib/utils';

// Mock heatmap data
const mockHeatmapData = [
  { file: 'src/components/Button.tsx', path: 'src/components', errorCount: 0, warningCount: 1, lastModified: new Date('2024-01-15') },
  { file: 'src/utils/validation.ts', path: 'src/utils', errorCount: 3, warningCount: 2, lastModified: new Date('2024-01-14') },
  { file: 'src/api/auth.ts', path: 'src/api', errorCount: 1, warningCount: 0, lastModified: new Date('2024-01-13') },
  { file: 'src/pages/Dashboard.tsx', path: 'src/pages', errorCount: 5, warningCount: 3, lastModified: new Date('2024-01-12') },
  { file: 'src/hooks/useAuth.ts', path: 'src/hooks', errorCount: 0, warningCount: 0, lastModified: new Date('2024-01-11') },
  { file: 'src/components/Modal.tsx', path: 'src/components', errorCount: 2, warningCount: 1, lastModified: new Date('2024-01-10') },
  { file: 'src/utils/format.ts', path: 'src/utils', errorCount: 1, warningCount: 2, lastModified: new Date('2024-01-09') },
  { file: 'src/api/users.ts', path: 'src/api', errorCount: 4, warningCount: 1, lastModified: new Date('2024-01-08') },
  { file: 'src/components/Table.tsx', path: 'src/components', errorCount: 0, warningCount: 2, lastModified: new Date('2024-01-07') },
  { file: 'src/pages/Settings.tsx', path: 'src/pages', errorCount: 2, warningCount: 0, lastModified: new Date('2024-01-06') },
];

export default function HeatmapPage() {
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage('Heatmap');
  }, [setCurrentPage]);

  const totalErrors = mockHeatmapData.reduce((sum, item) => sum + item.errorCount, 0);
  const totalWarnings = mockHeatmapData.reduce((sum, item) => sum + item.warningCount, 0);
  const criticalFiles = mockHeatmapData.filter(item => item.errorCount > 3).length;

  return (
    <div className="min-h-full bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Error Heatmap</h2>
              <p className="text-text-secondary text-sm">
                Visual representation of errors and warnings across your codebase
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="card p-6 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-error" />
                </div>
                <div>
                  <span className="text-text-secondary text-sm font-medium">Total Errors</span>
                  <div className="text-3xl font-bold text-foreground mt-1">{totalErrors}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-error">
              <TrendingUp className="w-4 h-4" />
              <span>+3 from last scan</span>
            </div>
          </div>

          <div className="card p-6 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Info className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <span className="text-text-secondary text-sm font-medium">Total Warnings</span>
                  <div className="text-3xl font-bold text-foreground mt-1">{totalWarnings}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-warning">
              <TrendingUp className="w-4 h-4" />
              <span>+1 from last scan</span>
            </div>
          </div>

          <div className="card p-6 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span className="text-text-secondary text-sm font-medium">Critical Files</span>
                  <div className="text-3xl font-bold text-foreground mt-1">{criticalFiles}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span>Requires attention</span>
            </div>
          </div>
        </motion.div>

        {/* Heatmap Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-foreground">File Error Distribution</h3>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md shadow-sm" style={{ backgroundColor: '#22c55e' }}></div>
                <span className="text-text-secondary font-medium">No Errors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md shadow-sm" style={{ backgroundColor: '#f59e0b' }}></div>
                <span className="text-text-secondary font-medium">1-2 Errors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md shadow-sm" style={{ backgroundColor: '#f97316' }}></div>
                <span className="text-text-secondary font-medium">3-5 Errors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md shadow-sm" style={{ backgroundColor: '#ef4444' }}></div>
                <span className="text-text-secondary font-medium">5+ Errors</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {mockHeatmapData.map((item, index) => (
              <motion.div
                key={item.file}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, x: 4 }}
                onClick={() => setSelectedFile(item.file)}
                className="cursor-pointer group"
              >
                <div className="flex items-center gap-5 p-5 bg-surface-elevated rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-all group-hover:scale-110"
                    style={{ backgroundColor: getHeatmapColor(item.errorCount) }}
                  >
                    <FileCode className="w-7 h-7 text-white drop-shadow-lg" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground truncate text-base mb-1">{item.file}</div>
                    <div className="text-sm text-text-muted truncate">{item.path}</div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-error mb-1">{item.errorCount}</div>
                      <div className="text-xs text-text-muted font-medium uppercase tracking-wide">Errors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-warning mb-1">{item.warningCount}</div>
                      <div className="text-xs text-text-muted font-medium uppercase tracking-wide">Warnings</div>
                    </div>
                  </div>

                  <div className="text-sm text-text-secondary font-medium px-4 py-2 bg-surface rounded-lg">
                    {item.lastModified.toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Selected File Details */}
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 card p-8 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileCode className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">File Details</h3>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-foreground bg-surface-elevated hover:bg-surface-hover rounded-lg transition-all"
              >
                Close
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-surface-elevated rounded-xl">
                <FileCode className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">{selectedFile}</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed p-4 bg-surface-elevated rounded-xl">
                Click on a file to view detailed error information and suggested fixes. Our AI will analyze the code and provide actionable recommendations.
              </p>
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 bg-primary/10 border border-primary/30 rounded-2xl"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">How to use the heatmap</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                The heatmap shows error distribution across your codebase. Files with more errors appear in warmer colors (red/orange),
                while files with fewer or no errors appear in cooler colors (green). Click on any file to view detailed error information
                and get AI-powered fix suggestions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Made with Bob
