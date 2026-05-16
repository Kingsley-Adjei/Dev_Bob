'use client';

import { motion } from 'framer-motion';
import { Copy, Check, AlertCircle, Wrench, Shield, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import type { FixSuggestions } from '@/types';

interface FixSuggestionsDisplayProps {
  fixes: FixSuggestions;
}

export default function FixSuggestionsDisplay({ fixes }: FixSuggestionsDisplayProps) {
  const [copiedTier, setCopiedTier] = useState<string | null>(null);

  const copyToClipboard = async (code: string, tier: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedTier(tier);
      setTimeout(() => setCopiedTier(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getTierConfig = (tier: string) => {
    switch (tier) {
      case 'immediate':
        return {
          color: 'error',
          bgColor: 'bg-error/5',
          borderColor: 'border-error/20',
          textColor: 'text-error',
          icon: AlertCircle,
          label: 'IMMEDIATE - STOP THE CRASH',
        };
      case 'proper':
        return {
          color: 'warning',
          bgColor: 'bg-warning/5',
          borderColor: 'border-warning/20',
          textColor: 'text-warning',
          icon: Wrench,
          label: 'PROPER FIX - NEXT PR',
        };
      case 'systemic':
        return {
          color: 'success',
          bgColor: 'bg-success/5',
          borderColor: 'border-success/20',
          textColor: 'text-success',
          icon: Shield,
          label: 'SYSTEMIC - PREVENT CLASS OF BUG',
        };
      default:
        return {
          color: 'primary',
          bgColor: 'bg-primary/5',
          borderColor: 'border-primary/20',
          textColor: 'text-primary',
          icon: CheckCircle2,
          label: 'FIX',
        };
    }
  };

  const renderFix = (fix: typeof fixes.immediate, index: number) => {
    const config = getTierConfig(fix.tier);
    const Icon = config.icon;
    const isCopied = copiedTier === fix.tier;

    return (
      <motion.div
        key={fix.tier}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`p-5 rounded-xl border ${config.borderColor} ${config.bgColor}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${config.textColor}`} />
            </div>
            <div>
              <h4 className={`text-sm font-bold ${config.textColor} mb-1`}>
                {config.label}
              </h4>
              <p className="text-sm text-foreground font-semibold">{fix.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-background rounded text-xs font-medium text-text-secondary">
              {fix.confidence}% confidence
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary mb-4">{fix.description}</p>

        {/* Code Block */}
        {fix.code && (
          <div className="relative group">
            <pre className="p-4 bg-background rounded-lg border border-border overflow-x-auto">
              <code className="text-sm font-mono text-foreground whitespace-pre">
                {fix.code}
              </code>
            </pre>
            <button
              onClick={() => copyToClipboard(fix.code!, fix.tier)}
              className="absolute top-3 right-3 p-2 bg-surface hover:bg-background rounded-lg border border-border transition-all opacity-0 group-hover:opacity-100"
              title="Copy code"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4 text-text-secondary" />
              )}
            </button>
          </div>
        )}

        {/* File Location */}
        {fix.file && (
          <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
            <span>Apply to:</span>
            <code className="px-2 py-1 bg-background rounded font-mono text-foreground">
              {fix.file}
              {fix.line && `:${fix.line}`}
            </code>
          </div>
        )}

        {/* Reasoning */}
        <div className="mt-4 p-3 bg-background rounded-lg">
          <p className="text-xs font-semibold text-text-muted mb-1">Why this works</p>
          <p className="text-sm text-foreground">{fix.reasoning}</p>
        </div>

        {/* Tradeoffs */}
        {fix.tradeoffs && fix.tradeoffs.length > 0 && (
          <div className="mt-3 p-3 bg-background rounded-lg">
            <p className="text-xs font-semibold text-text-muted mb-2">Tradeoffs to consider</p>
            <ul className="space-y-1.5">
              {fix.tradeoffs.map((tradeoff, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted mt-1.5 flex-shrink-0"></span>
                  {tradeoff}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Test Suggestions */}
        {fix.testSuggestions && fix.testSuggestions.length > 0 && (
          <div className="mt-3 p-3 bg-background rounded-lg">
            <p className="text-xs font-semibold text-text-muted mb-2">Recommended tests</p>
            <ul className="space-y-1.5">
              {fix.testSuggestions.map((test, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  {test}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Estimated Time */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-text-muted">Estimated implementation time:</span>
          <span className="font-semibold text-foreground">{fix.estimatedTime}</span>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">Fix Suggestions</h3>
          <p className="text-sm text-text-secondary">3-tier strategy from immediate to systemic</p>
        </div>
        <div className="px-3 py-1.5 bg-success/10 border border-success/20 rounded-lg">
          <span className="text-sm font-semibold text-success">3 ready</span>
        </div>
      </div>

      {/* Fix Cards */}
      <div className="space-y-4">
        {renderFix(fixes.immediate, 0)}
        {renderFix(fixes.proper, 1)}
        {renderFix(fixes.systemic, 2)}
      </div>

      {/* Summary */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <p className="text-sm text-foreground">
          <span className="font-semibold">💡 Pro Tip:</span> Apply the immediate fix now to restore service,
          then implement the proper fix in your next PR. Schedule the systemic fix to prevent this entire
          class of bugs from happening again.
        </p>
      </div>
    </motion.div>
  );
}

// Made with Bob