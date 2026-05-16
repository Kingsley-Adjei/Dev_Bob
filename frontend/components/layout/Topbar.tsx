'use client';

import { useAppStore } from '@/stores/useAppStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Bell, Settings } from 'lucide-react';
import styles from './Topbar.module.css';

export default function Topbar() {
  const { currentPage, isConnected } = useAppStore();

  return (
    <header className={styles.topbar}>
      <div className={styles.container}>
        {/* Page Title */}
        <div>
          <motion.h1
            key={currentPage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.title}
          >
            {currentPage}
          </motion.h1>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.notificationButton}
          >
            <Bell className={styles.notificationIcon} />
            <span className={styles.notificationBadge}></span>
          </motion.button>

          {/* Bob Connection Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
              styles.connectionStatus,
              isConnected ? styles.connected : styles.disconnected
            )}
          >
            <motion.div
              animate={{
                scale: isConnected ? [1, 1.3, 1] : 1,
                opacity: isConnected ? [1, 0.7, 1] : 0.5,
              }}
              transition={{
                duration: 2,
                repeat: isConnected ? Infinity : 0,
                repeatType: 'loop',
              }}
              className={cn(
                styles.connectionDot,
                isConnected ? styles.connected : styles.disconnected
              )}
            />
            <span className={styles.connectionText}>
              Bob {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </motion.div>

          {/* User Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.userAvatar}
          >
            <div className={cn(styles.avatarImage, 'gradient-primary')}>
              B
            </div>
            <div className={styles.avatarStatus}></div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

// Made with Bob
