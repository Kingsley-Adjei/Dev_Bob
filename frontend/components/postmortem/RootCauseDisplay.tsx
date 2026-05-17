'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, GitCommit, User, Calendar, FileCode, ArrowDown, Target } from 'lucide-react';
import type { RootCauseAnalysis } from '@/types';

interface RootCauseDisplayProps {
  rootCause: RootCauseAnalysis;
}

export default function RootCauseDisplay({ rootCause }: RootCauseDisplayProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Bob's Root Cause Analysis</h3>
          <p className="text-sm text-text-secondary">Senior engineer-level reasoning</p>
        </div>
      </div>

      {/* Main Description */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <p className="text-foreground leading-relaxed">{rootCause.description}</p>
      </div>

      {/* Error Flow Visualization */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <FileCode className="w-4 h-4 text-primary" />
          Error Flow
        </h4>

        {/* Error Location */}
        <div className="flex items-start gap-3 p-4 bg-error/5 border border-error/20 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <code className="text-sm font-mono text-error font-semibold">
                {rootCause.errorLocation.file}:{rootCause.errorLocation.line}
              </code>
            </div>
            <p className="text-sm text-text-secondary">Where the error manifested</p>
          </div>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center">
          <ArrowDown className="w-5 h-5 text-text-muted" />
        </div>

        {/* Actual Root Cause */}
        <div className="flex items-start gap-3 p-4 bg-warning/5 border border-warning/20 rounded-xl">
          <Target className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <code className="text-sm font-mono text-warning font-semibold">
                {rootCause.actualLocation.file}:{rootCause.actualLocation.line}
              </code>
            </div>
            <p className="text-sm text-foreground font-medium mb-2">Root Cause Location</p>
            <p className="text-sm text-text-secondary">{rootCause.actualLocation.reason}</p>
          </div>
        </div>
      </div>

      {/* Introduced In */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-primary" />
          Introduced In
        </h4>
        <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
          <div className="flex items-center gap-3">
            <code className="px-2 py-1 bg-background rounded text-sm font-mono text-primary">
              {rootCause.introducedIn.commit}
            </code>
            {rootCause.introducedIn.prNumber && (
              <span className="px-2 py-1 bg-primary/10 rounded text-sm font-medium text-primary">
                {rootCause.introducedIn.prNumber}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-text-muted" />
              <span className="text-text-secondary">Author:</span>
              <span className="text-foreground font-medium">{rootCause.introducedIn.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-text-muted" />
              <span className="text-text-secondary">Date:</span>
              <span className="text-foreground font-medium">
                {new Date(rootCause.introducedIn.date).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-text-secondary">
              <span className="font-medium text-foreground">Feature:</span> {rootCause.introducedIn.feature}
            </p>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">The Reasoning</h4>
        <div className="space-y-3">
          <div className="p-3 bg-surface rounded-lg border border-border">
            <p className="text-xs font-semibold text-text-muted mb-1">What Broke</p>
            <p className="text-sm text-foreground">{rootCause.reasoning.whatBroke}</p>
          </div>
          <div className="p-3 bg-surface rounded-lg border border-border">
            <p className="text-xs font-semibold text-text-muted mb-1">Why It Broke</p>
            <p className="text-sm text-foreground">{rootCause.reasoning.whyItBroke}</p>
          </div>
          <div className="p-3 bg-surface rounded-lg border border-border">
            <p className="text-xs font-semibold text-text-muted mb-1">Why Now</p>
            <p className="text-sm text-foreground">{rootCause.reasoning.whyNow}</p>
          </div>
          <div className="p-3 bg-surface rounded-lg border border-border">
            <p className="text-xs font-semibold text-text-muted mb-1">What Was Assumed</p>
            <p className="text-sm text-foreground">{rootCause.reasoning.whatWasAssumed}</p>
          </div>
          <div className="p-3 bg-surface rounded-lg border border-border">
            <p className="text-xs font-semibold text-text-muted mb-1">What Actually Happened</p>
            <p className="text-sm text-foreground">{rootCause.reasoning.whatActuallyHappened}</p>
          </div>
        </div>
      </div>

      {/* Impact Analysis */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Impact Analysis</h4>
        <div className="p-4 bg-surface rounded-xl border border-border space-y-4">
          <div>
            <p className="text-xs font-semibold text-text-muted mb-2">Risk Level</p>
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background font-semibold text-sm ${getRiskColor(rootCause.impact.riskLevel)}`}>
              <AlertTriangle className="w-4 h-4" />
              {rootCause.impact.riskLevel.toUpperCase()}
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-muted mb-2">Affected Code Paths</p>
            <div className="flex flex-wrap gap-2">
              {rootCause.impact.affectedCodePaths.map((path, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-background rounded text-xs font-medium text-foreground"
                >
                  {path}
                </span>
              ))}
            </div>
          </div>

          {rootCause.impact.potentialSideEffects.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-muted mb-2">Potential Side Effects</p>
              <ul className="space-y-1.5">
                {rootCause.impact.potentialSideEffects.map((effect, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0"></span>
                    {effect}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Triggering Event */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <p className="text-xs font-semibold text-text-muted mb-2">Triggering Event</p>
        <p className="text-sm text-foreground">{rootCause.triggeringEvent}</p>
      </div>
    </motion.div>
  );
}

// Made with Bob