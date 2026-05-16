'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2, AlertCircle, CheckCircle2, Zap, Activity } from 'lucide-react';
import { generateId } from '@/lib/utils';
import type { Analysis, PostMortemData } from '@/types';
import AgentPlan from '@/components/ui/agent-plan';
import RootCauseDisplay from '@/components/postmortem/RootCauseDisplay';
import FixSuggestionsDisplay from '@/components/postmortem/FixSuggestionsDisplay';
import PostMortemReportDisplay from '@/components/postmortem/PostMortemReportDisplay';
import SimilarIncidentsDisplay from '@/components/postmortem/SimilarIncidentsDisplay';
import { simulatePostMortemAnalysis } from '@/lib/simulatedPostMortem';
import type { AnalysisTask } from '@/lib/simulatedAnalysis';

export default function PostMortemPage() {
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);
  const addAnalysis = useAppStore((state) => state.addAnalysis);

  const [errorLog, setErrorLog] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [environment, setEnvironment] = useState('production');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [analysisTasks, setAnalysisTasks] = useState<AnalysisTask[]>([]);
  const [showPlan, setShowPlan] = useState(false);
  const [postMortemData, setPostMortemData] = useState<PostMortemData | null>(null);

  useEffect(() => {
    setCurrentPage('PostMortem');
  }, [setCurrentPage]);

  // Sample error log for demo
  const loadSampleError = () => {
    setErrorLog(`TypeError: Cannot read property 'price' of undefined
    at calculateTotal (checkout.js:47:12)
    at processOrder (orders.js:112:8)
    at async handlePayment (payments.js:89:15)
    at async POST /api/checkout (server.js:203:5)

Environment: production
Timestamp: ${new Date().toISOString()}
Users affected: ~12,400
Revenue impact: ~$47,000`);
    setRepoUrl('https://github.com/acme-corp/checkout-service');
  };

  const handlePostMortemAnalysis = async () => {
    setError('');
    setSuccess('');
    setShowPlan(false);
    setPostMortemData(null);

    if (!errorLog.trim()) {
      setError('Please enter an error log or stack trace');
      return;
    }

    setIsAnalyzing(true);
    setShowPlan(true);

    try {
      const analysis: Analysis = {
        id: generateId(),
        type: 'postmortem',
        input: errorLog,
        status: 'analyzing',
        createdAt: new Date(),
        postmortemData: {
          errorLog,
          repoUrl: repoUrl || undefined,
          environment,
        },
      };

      addAnalysis(analysis);

      // Run PostMortem analysis
      const result = await simulatePostMortemAnalysis(errorLog, repoUrl, (tasks) => {
        setAnalysisTasks(tasks);
      });

      setPostMortemData(result);
      setSuccess('PostMortem analysis completed! Root cause identified and fixes generated.');
    } catch (err) {
      setError('Failed to analyze error. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

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
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">PostMortem AI</h2>
              <p className="text-text-secondary text-sm">
                From production error to fix in 20 minutes, not 4 hours
              </p>
            </div>
          </div>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-8 shadow-xl mb-8"
        >
          <div className="space-y-6">
            {/* Error Log Input */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  Production Error Log *
                </label>
                <button
                  onClick={loadSampleError}
                  className="text-xs text-primary hover:text-primary/80 font-medium"
                  disabled={isAnalyzing}
                >
                  Load Sample Error
                </button>
              </div>
              <textarea
                value={errorLog}
                onChange={(e) => setErrorLog(e.target.value)}
                placeholder="Paste your error log, stack trace, or monitoring alert here...

Example:
TypeError: Cannot read property 'price' of undefined
    at calculateTotal (checkout.js:47)
    at processOrder (orders.js:112)
    at handlePayment (payments.js:89)"
                rows={12}
                className="w-full font-mono text-sm resize-none"
                disabled={isAnalyzing}
              />
              <p className="mt-2.5 text-sm text-text-muted flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary"></span>
                Paste error logs from Sentry, Datadog, CloudWatch, or any monitoring tool
              </p>
            </div>

            {/* Repository URL */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Repository URL (Optional)
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full"
                disabled={isAnalyzing}
              />
              <p className="mt-2.5 text-sm text-text-muted flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary"></span>
                Provide repo URL for deeper analysis with Git history
              </p>
            </div>

            {/* Environment */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Environment
              </label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full"
                disabled={isAnalyzing}
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
              </select>
            </div>

            {/* Analyze Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handlePostMortemAnalysis}
              disabled={isAnalyzing}
              className="w-full btn-primary py-4 text-base flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Production Error...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  Investigate Production Error
                </>
              )}
            </motion.button>

            {/* Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="p-4 bg-error/10 border border-error/30 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-error font-medium">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="p-4 bg-success/10 border border-success/30 rounded-xl flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-success font-medium">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Analysis Progress */}
        <AnimatePresence>
          {showPlan && analysisTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Bob's Investigation Progress
                </h3>
                <p className="text-sm text-text-secondary">
                  Watch as Bob analyzes your error through 6 layers of intelligence
                </p>
              </div>
              <AgentPlan tasks={analysisTasks} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* PostMortem Results */}
        {postMortemData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Impact Metrics */}
            {postMortemData.parsedError && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-error" />
                    <p className="text-xs font-semibold text-text-muted">SEVERITY</p>
                  </div>
                  <p className="text-3xl font-bold text-error mb-1">
                    {postMortemData.parsedError.severity}
                  </p>
                  <p className="text-xs text-text-secondary">Production down</p>
                </div>

                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-text-muted" />
                    <p className="text-xs font-semibold text-text-muted">USERS HIT</p>
                  </div>
                  <p className="text-3xl font-bold text-warning mb-1">
                    {(postMortemData.parsedError.userImpact.affectedUsers / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-text-secondary">Last 25 min</p>
                </div>

                {postMortemData.parsedError.userImpact.revenueImpact && (
                  <div className="card p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-text-muted" />
                      <p className="text-xs font-semibold text-text-muted">EST. IMPACT</p>
                    </div>
                    <p className="text-3xl font-bold text-error mb-1">
                      ${(postMortemData.parsedError.userImpact.revenueImpact / 1000).toFixed(0)}k
                    </p>
                    <p className="text-xs text-text-secondary">Revenue Loss</p>
                  </div>
                )}

                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-text-muted" />
                    <p className="text-xs font-semibold text-text-muted">MTTR</p>
                  </div>
                  <p className="text-3xl font-bold text-success mb-1">
                    {postMortemData.parsedError.userImpact.duration}m
                  </p>
                  <p className="text-xs text-text-secondary">avg</p>
                </div>
              </motion.div>
            )}

            {/* Root Cause Analysis */}
            {postMortemData.rootCause && (
              <RootCauseDisplay rootCause={postMortemData.rootCause} />
            )}

            {/* Fix Suggestions */}
            {postMortemData.fixes && (
              <FixSuggestionsDisplay fixes={postMortemData.fixes} />
            )}

            {/* PostMortem Report */}
            {postMortemData.report && (
              <PostMortemReportDisplay report={postMortemData.report} />
            )}

            {/* Similar Incidents */}
            {postMortemData.similarIncidents && postMortemData.similarIncidents.length > 0 && (
              <SimilarIncidentsDisplay incidents={postMortemData.similarIncidents} />
            )}
          </motion.div>
        )}

        {/* Info Cards */}
        {!postMortemData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className="card p-6 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-error" />
                </div>
                <h3 className="font-bold text-foreground">Layer 1-2</h3>
              </div>
              <p className="text-sm text-text-secondary mb-3">Error Parser & Codebase Investigation</p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                  Parse stack trace & extract context
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                  Cross-reference with repository
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                  Analyze Git history & commits
                </li>
              </ul>
            </div>

            <div className="card p-6 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-warning" />
                </div>
                <h3 className="font-bold text-foreground">Layer 3-4</h3>
              </div>
              <p className="text-sm text-text-secondary mb-3">Root Cause & Fix Generation</p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
                  Senior engineer-level reasoning
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
                  3-tier fix strategy
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
                  Immediate, proper & systemic fixes
                </li>
              </ul>
            </div>

            <div className="card p-6 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <h3 className="font-bold text-foreground">Layer 5-6</h3>
              </div>
              <p className="text-sm text-text-secondary mb-3">Report & Learning</p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  Auto-generated incident report
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  Prevention recommendations
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  Institutional memory & learning
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Made with Bob