'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Palette, Code2 } from 'lucide-react';

export default function SettingsPage() {
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);

  useEffect(() => {
    setCurrentPage('Settings');
  }, [setCurrentPage]);

  return (
    <div className="min-h-full bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Settings
          </h2>
          <p className="text-text-secondary">
            Manage your preferences and application settings
          </p>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* General Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-surface-elevated rounded-xl border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">General</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Auto-analyze on paste</div>
                  <div className="text-sm text-text-secondary">Automatically analyze code when pasted</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-surface-elevated rounded-xl border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Analysis complete</div>
                  <div className="text-sm text-text-secondary">Get notified when analysis is complete</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Error alerts</div>
                  <div className="text-sm text-text-secondary">Receive alerts for critical errors</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-surface-elevated rounded-xl border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-foreground mb-2">Theme</label>
                <select className="w-full px-4 py-3 bg-surface text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Code Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-surface-elevated rounded-xl border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Code Analysis</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-foreground mb-2">Default Language</label>
                <select className="w-full px-4 py-3 bg-surface text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Strict mode</div>
                  <div className="text-sm text-text-secondary">Enable stricter error checking</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Privacy & Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 bg-surface-elevated rounded-xl border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Privacy & Security</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Save analysis history</div>
                  <div className="text-sm text-text-secondary">Store your analysis history locally</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div>
                <button className="px-4 py-2 bg-error/10 hover:bg-error/20 text-error rounded-lg transition-all">
                  Clear All Data
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex justify-end"
        >
          <button className="px-8 py-3 bg-gradient-primary hover:bg-gradient-primary-hover text-white font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all">
            Save Changes
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// Made with Bob
