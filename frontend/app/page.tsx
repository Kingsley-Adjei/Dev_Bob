'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { motion } from 'framer-motion';
import { Sparkles, GitBranch, Code2, TrendingUp, Zap, Shield, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);

  useEffect(() => {
    setCurrentPage('Home');
  }, [setCurrentPage]);

  const features = [
    {
      icon: GitBranch,
      title: 'Repository Analysis',
      description: 'Analyze entire Git repositories to identify bugs and errors across multiple files with deep code inspection.',
      href: '/investigate',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Code2,
      title: 'Code Snippet Fixes',
      description: 'Paste code snippets and get instant AI-powered bug fixes and improvements with detailed explanations.',
      href: '/investigate',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track your code quality metrics and see improvement trends over time with beautiful visualizations.',
      href: '/analytics',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-full bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-8 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 shadow-lg shadow-primary/10"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">AI-Powered Code Analysis</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight"
          >
            Fix Bugs Faster with
            <br />
            <span className="text-gradient">AI Intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Analyze your code repositories and snippets to identify bugs, get AI-powered fixes,
            and track your code quality improvements over time with beautiful insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center justify-center gap-4"
          >
            <Link href="/investigate">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-8 py-4 text-base flex items-center gap-3"
              >
                <Zap className="w-5 h-5" />
                Start Analyzing
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/analytics">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-surface-elevated hover:bg-surface-hover text-foreground font-semibold rounded-xl border border-border hover:border-border-hover transition-all text-base"
              >
                View Analytics
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
            >
              <Link href={feature.href}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="card h-full p-8 hover:shadow-2xl group cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="card p-10 shadow-2xl mb-20"
        >
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="text-5xl font-bold text-gradient mb-3">10K+</div>
              <div className="text-text-secondary font-medium">Bugs Fixed</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gradient mb-3">95%</div>
              <div className="text-text-secondary font-medium">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gradient mb-3">24/7</div>
              <div className="text-text-secondary font-medium">AI Availability</div>
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-text-secondary text-lg">Simple, fast, and powerful code analysis in three steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Submit Code', desc: 'Paste a snippet or provide a Git repository URL', icon: Code2 },
              { step: '02', title: 'AI Analysis', desc: 'Our AI analyzes your code for bugs and errors', icon: Sparkles },
              { step: '03', title: 'Get Fixes', desc: 'Receive detailed fixes and improvements instantly', icon: Zap },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
                className="card p-8 text-center hover:shadow-xl"
              >
                <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-text-secondary leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="card p-10 shadow-2xl"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3">Why Choose BugFix AI?</h2>
            <p className="text-text-secondary">Powerful features that make code analysis effortless</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Get results in seconds, not hours' },
              { icon: Shield, title: 'Secure & Private', desc: 'Your code is analyzed securely' },
              { icon: Clock, title: 'Save Time', desc: 'Automate bug detection and fixing' },
            ].map((item, index) => (
              <div key={item.title} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Made with Bob
