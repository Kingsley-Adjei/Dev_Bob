'use client';

import { motion } from 'framer-motion';
import { History, TrendingUp, Clock, ExternalLink } from 'lucide-react';
import type { SimilarIncident } from '@/types';

interface SimilarIncidentsDisplayProps {
  incidents: SimilarIncident[];
}

export default function SimilarIncidentsDisplay({ incidents }: SimilarIncidentsDisplayProps) {
  if (!incidents || incidents.length === 0) {
    return null;
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return 'text-error';
    if (similarity >= 75) return 'text-warning';
    if (similarity >= 60) return 'text-success';
    return 'text-text-secondary';
  };

  const getSimilarityBg = (similarity: number) => {
    if (similarity >= 90) return 'bg-error/10 border-error/20';
    if (similarity >= 75) return 'bg-warning/10 border-warning/20';
    if (similarity >= 60) return 'bg-success/10 border-success/20';
    return 'bg-surface border-border';
  };

  const totalTimeSaved = incidents.reduce((sum, inc) => sum + inc.timeSaved, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Similar Incidents</h3>
            <p className="text-sm text-text-secondary">
              Bob found {incidents.length} similar incident{incidents.length !== 1 ? 's' : ''} in your history
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted mb-1">Total time saved</p>
          <p className="text-2xl font-bold text-success">{totalTimeSaved.toFixed(1)}h</p>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {incidents.map((incident, index) => (
          <motion.div
            key={incident.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${getSimilarityBg(incident.similarity)} hover:shadow-lg transition-all cursor-pointer group`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-text-muted">{incident.id}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${getSimilarityColor(incident.similarity)}`}>
                    {incident.similarity}% match
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {incident.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(incident.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {incident.timeSaved.toFixed(1)}h saved
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors flex-shrink-0" />
            </div>

            {/* Resolution */}
            <div className="p-3 bg-background rounded-lg">
              <p className="text-xs font-semibold text-text-muted mb-1">Resolution</p>
              <p className="text-sm text-foreground">{incident.resolution}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pattern Analysis CTA */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <History className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-1">
              💡 Pattern Detected
            </p>
            <p className="text-sm text-text-secondary mb-3">
              These incidents share similar root causes. Consider implementing the systemic fix
              to prevent this entire class of bugs from recurring.
            </p>
            <button className="btn-secondary text-sm px-4 py-2">
              View Pattern Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground mb-1">{incidents.length}</p>
          <p className="text-xs text-text-muted">Similar Cases</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-success mb-1">
            {Math.round(incidents.reduce((sum, inc) => sum + inc.similarity, 0) / incidents.length)}%
          </p>
          <p className="text-xs text-text-muted">Avg Similarity</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary mb-1">{totalTimeSaved.toFixed(1)}h</p>
          <p className="text-xs text-text-muted">Time Saved</p>
        </div>
      </div>
    </motion.div>
  );
}

// Made with Bob