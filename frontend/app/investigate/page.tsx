'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Code2, Loader2, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { isValidGitUrl, generateId } from '@/lib/utils';
import type { Analysis } from '@/types';
import AgentPlan from '@/components/ui/agent-plan';
import { simulateRepoAnalysis, simulateSnippetAnalysis, type AnalysisTask } from '@/lib/simulatedAnalysis';

export default function InvestigatePage() {
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);
  const addAnalysis = useAppStore((state) => state.addAnalysis);

  const [activeTab, setActiveTab] = useState<'repo' | 'snippet'>('repo');
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [analysisTasks, setAnalysisTasks] = useState<AnalysisTask[]>([]);
  const [showPlan, setShowPlan] = useState(false);

  useEffect(() => {
    setCurrentPage('Investigate');
  }, [setCurrentPage]);

  const handleRepoAnalysis = async () => {
    setError('');
    setSuccess('');
    setShowPlan(false);

    if (!repoUrl) {
      setError('Please enter a repository URL');
      return;
    }

    if (!isValidGitUrl(repoUrl)) {
      setError('Please enter a valid GitHub or GitLab repository URL');
      return;
    }

    setIsAnalyzing(true);
    setShowPlan(true);

    try {
      const analysis: Analysis = {
        id: generateId(),
        type: 'repo',
        input: repoUrl,
        status: 'analyzing',
        createdAt: new Date(),
      };

      addAnalysis(analysis);

      // Use simulated analysis with progress callback
      const result = await simulateRepoAnalysis(repoUrl, branch, (tasks) => {
        setAnalysisTasks(tasks);
      });

      setSuccess(`Repository analysis completed! Found ${result.summary?.totalErrors} errors and ${result.summary?.totalWarnings} warnings.`);
      setRepoUrl('');
      setBranch('main');
    } catch (err) {
      setError('Failed to analyze repository. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSnippetAnalysis = async () => {
    setError('');
    setSuccess('');
    setShowPlan(false);

    if (!code.trim()) {
      setError('Please enter code to analyze');
      return;
    }

    setIsAnalyzing(true);
    setShowPlan(true);

    try {
      const analysis: Analysis = {
        id: generateId(),
        type: 'snippet',
        input: code,
        status: 'analyzing',
        createdAt: new Date(),
      };

      addAnalysis(analysis);

      // Use simulated analysis with progress callback
      const result = await simulateSnippetAnalysis(code, language, fileName, (tasks) => {
        setAnalysisTasks(tasks);
      });

      setSuccess(`Code analysis completed! Found ${result.summary?.totalErrors} errors and ${result.summary?.totalWarnings} warnings.`);
      setCode('');
      setFileName('');
    } catch (err) {
      setError('Failed to analyze code snippet. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-full bg-background p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Code Investigation</h2>
              <p className="text-text-secondary text-sm">
                Analyze your code for bugs and errors using AI-powered insights
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tab Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-8 p-1.5 bg-surface rounded-2xl w-fit border border-border"
        >
          <button
            onClick={() => setActiveTab('repo')}
            className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold transition-all ${activeTab === 'repo'
              ? 'text-white'
              : 'text-text-secondary hover:text-foreground'
              }`}
          >
            {activeTab === 'repo' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 gradient-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <GitBranch className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Repository</span>
          </button>
          <button
            onClick={() => setActiveTab('snippet')}
            className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold transition-all ${activeTab === 'snippet'
              ? 'text-white'
              : 'text-text-secondary hover:text-foreground'
              }`}
          >
            {activeTab === 'snippet' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 gradient-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Code2 className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Code Snippet</span>
          </button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="card p-8 shadow-xl"
          >
            {activeTab === 'repo' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-primary" />
                    Repository URL *
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
                    Enter a GitHub or GitLab repository URL
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Branch (Optional)
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="main"
                    className="w-full"
                    disabled={isAnalyzing}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleRepoAnalysis}
                  disabled={isAnalyzing}
                  className="w-full btn-primary py-4 text-base flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Repository...
                    </>
                  ) : (
                    <>
                      <GitBranch className="w-5 h-5" />
                      Analyze Repository
                    </>
                  )}
                </motion.button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-primary" />
                    Code Snippet *
                  </label>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your code here..."
                    rows={14}
                    className="w-full font-mono text-sm resize-none"
                    disabled={isAnalyzing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Language *
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full"
                      disabled={isAnalyzing}
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="csharp">C#</option>
                      <option value="go">Go</option>
                      <option value="rust">Rust</option>
                      <option value="php">PHP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      File Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="example.js"
                      className="w-full"
                      disabled={isAnalyzing}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSnippetAnalysis}
                  disabled={isAnalyzing}
                  className="w-full btn-primary py-4 text-base flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Code...
                    </>
                  ) : (
                    <>
                      <Code2 className="w-5 h-5" />
                      Analyze Code
                    </>
                  )}
                </motion.button>
              </div>
            )}

            {/* Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mt-6 p-4 bg-error/10 border border-error/30 rounded-xl flex items-start gap-3"
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
                  className="mt-6 p-4 bg-success/10 border border-success/30 rounded-xl flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-success font-medium">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Analysis Progress Plan */}
        <AnimatePresence>
          {showPlan && analysisTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground mb-2">Analysis Progress</h3>
                <p className="text-sm text-text-secondary">
                  Watch as Bob analyzes your code step by step
                </p>
              </div>
              <AgentPlan tasks={analysisTasks} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6 mt-8"
        >
          <div className="card p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground">What we analyze</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Syntax errors and bugs
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Code quality issues
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Security vulnerabilities
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Performance bottlenecks
              </li>
            </ul>
          </div>
          <div className="card p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <h3 className="font-bold text-foreground">Analysis includes</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                Detailed error reports
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                AI-powered fix suggestions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                Code improvement tips
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                Related file analysis
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Made with Bob
