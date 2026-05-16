'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Activity,
  BarChart3,
  Settings,
  BookOpen,
  MessageCircle,
  Sparkles,
  Command,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import styles from './Sidebar.module.css';

const mainNavItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Investigate', href: '/investigate', icon: Search },
  { name: 'PostMortem', href: '/postmortem', icon: AlertTriangle, badge: 'NEW' },
  { name: 'Heatmap', href: '/heatmap', icon: Activity },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const otherNavItems = [
  { name: 'Documentation', href: '/docs', icon: BookOpen },
  { name: 'Support', href: '/support', icon: MessageCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className={cn(styles.logoIcon, 'gradient-primary shadow-glow')}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <span className={styles.logoText}>BugFix AI</span>
          <div className={styles.logoVersion}>v2.0.0</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
          />
          <div className={styles.searchKbd}>
            <kbd className={styles.kbd}>⌘</kbd>
            <kbd className={styles.kbd}>K</kbd>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navList}>
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(styles.navItem, isActive && styles.active)}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={cn(styles.navItemBg, 'gradient-primary')}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={cn(styles.navIcon, isActive && styles.active)} />
                  <span className={styles.navLabel}>{item.name}</span>
                  {'badge' in item && item.badge && (
                    <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-primary text-white rounded">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={styles.navDot}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* OTHER Section */}
        <div className={styles.otherSection}>
          <div className={styles.otherHeader}>
            <span className={styles.otherTitle}>
              Other
            </span>
          </div>
          <div className={styles.navList}>
            {otherNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={styles.navItem}
                  >
                    <Icon className={styles.navIcon} />
                    <span className={styles.navLabel}>{item.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Boost with AI Section */}
      <div className={styles.boostSection}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={cn(styles.boostCard, 'glass')}
        >
          <div className={cn(styles.boostBg, 'gradient-primary')}></div>
          <div className={styles.boostContent}>
            <div className={styles.boostHeader}>
              <div className={cn(styles.boostIcon, 'gradient-primary')}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className={styles.boostTitle}>Boost with AI</span>
            </div>
            <p className={styles.boostDescription}>
              AI-powered replies, tag insights, and tools that save hours.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(styles.boostButton, 'btn-primary')}
            >
              Upgrade to Pro
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* User Profile */}
      <div className={styles.profileSection}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={styles.profileCard}
        >
          <div className={styles.profileAvatarWrapper}>
            <div className={cn(styles.profileAvatar, 'gradient-primary')}>
              B
            </div>
            <div className={styles.profileStatus}></div>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>
              Bob AI
            </div>
            <div className={styles.profileEmail}>
              bob@bugfix.ai
            </div>
          </div>
          <Settings className={styles.profileSettings} />
        </motion.div>
      </div>
    </aside>
  );
}

// Made with Bob
