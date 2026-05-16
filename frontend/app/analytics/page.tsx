'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, CheckCircle2, AlertCircle, Clock, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data
const timeSeriesData = [
  { date: 'Jan 1', analyses: 12, errors: 45, fixes: 38 },
  { date: 'Jan 8', analyses: 18, errors: 52, fixes: 48 },
  { date: 'Jan 15', analyses: 25, errors: 38, fixes: 35 },
  { date: 'Jan 22', analyses: 32, errors: 28, fixes: 26 },
  { date: 'Jan 29', analyses: 28, errors: 22, fixes: 20 },
  { date: 'Feb 5', analyses: 35, errors: 18, fixes: 17 },
];

const errorTypeData = [
  { type: 'Syntax', count: 45 },
  { type: 'Type', count: 38 },
  { type: 'Logic', count: 30 },
  { type: 'Runtime', count: 22 },
  { type: 'Other', count: 15 },
];

const fileTypeData = [
  { name: 'TypeScript', value: 45, color: '#8b5cf6' },
  { name: 'JavaScript', value: 30, color: '#f59e0b' },
  { name: 'Python', value: 15, color: '#22c55e' },
  { name: 'Java', value: 10, color: '#3b82f6' },
];

export default function AnalyticsPage() {
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);

  useEffect(() => {
    setCurrentPage('Analytics');
  }, [setCurrentPage]);

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
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
              <p className="text-text-secondary text-sm">
                Track your code quality metrics and improvement trends
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card p-6 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">150</div>
            <div className="text-sm text-text-secondary mb-3 font-medium">Total Analyses</div>
            <div className="flex items-center gap-2 text-sm text-success font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>+12% from last week</span>
            </div>
          </div>

          <div className="card p-6 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">94.5%</div>
            <div className="text-sm text-text-secondary mb-3 font-medium">Success Rate</div>
            <div className="flex items-center gap-2 text-sm text-success font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>+2.3% improvement</span>
            </div>
          </div>

          <div className="card p-6 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">184</div>
            <div className="text-sm text-text-secondary mb-3 font-medium">Errors Fixed</div>
            <div className="flex items-center gap-2 text-sm text-error font-medium">
              <TrendingDown className="w-4 h-4" />
              <span>-8% from last week</span>
            </div>
          </div>

          <div className="card p-6 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-info" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">2.4m</div>
            <div className="text-sm text-text-secondary mb-3 font-medium">Avg Fix Time</div>
            <div className="flex items-center gap-2 text-sm text-success font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>15% faster</span>
            </div>
          </div>
        </motion.div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Time Series Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-8 shadow-xl"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">Analysis Trends</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFixes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#a1a1aa" style={{ fontSize: '13px', fontWeight: 500 }} />
                <YAxis stroke="#a1a1aa" style={{ fontSize: '13px', fontWeight: 500 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '12px',
                    color: '#fafafa',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="analyses" stroke="#8b5cf6" strokeWidth={3} name="Analyses" fill="url(#colorAnalyses)" />
                <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={3} name="Errors" fill="url(#colorErrors)" />
                <Line type="monotone" dataKey="fixes" stroke="#22c55e" strokeWidth={3} name="Fixes" fill="url(#colorFixes)" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Error Types Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-8 shadow-xl"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">Common Error Types</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={errorTypeData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6d28d9" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="type" stroke="#a1a1aa" style={{ fontSize: '13px', fontWeight: 500 }} />
                <YAxis stroke="#a1a1aa" style={{ fontSize: '13px', fontWeight: 500 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '12px',
                    color: '#fafafa',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  }}
                />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* File Type Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-8 shadow-xl"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">File Type Distribution</h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={fileTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#18181b"
                  strokeWidth={3}
                >
                  {fileTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '12px',
                    color: '#fafafa',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-8 shadow-xl"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'Repository analyzed', repo: 'user/project-alpha', time: '2 minutes ago', status: 'success' },
                { action: 'Code snippet fixed', file: 'utils.ts', time: '15 minutes ago', status: 'success' },
                { action: 'Analysis failed', repo: 'user/project-beta', time: '1 hour ago', status: 'error' },
                { action: 'Heatmap generated', repo: 'user/project-gamma', time: '2 hours ago', status: 'success' },
                { action: 'Repository analyzed', repo: 'user/project-delta', time: '3 hours ago', status: 'success' },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex items-start gap-4 p-4 bg-surface-elevated rounded-xl hover:bg-surface-hover transition-all group"
                >
                  <div className={`w-2.5 h-2.5 rounded-full mt-2 ${activity.status === 'success' ? 'bg-success shadow-lg shadow-success/50' : 'bg-error shadow-lg shadow-error/50'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground text-sm mb-1">{activity.action}</div>
                    <div className="text-xs text-text-muted truncate">{activity.repo || activity.file}</div>
                  </div>
                  <div className="text-xs text-text-secondary whitespace-nowrap font-medium">{activity.time}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-6 bg-primary/10 border border-primary/30 rounded-2xl"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">Performance Insights</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Your code quality has improved by 12% this week. Most common issues are syntax errors in TypeScript files.
                Consider enabling stricter linting rules to catch these errors earlier in development.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Made with Bob
