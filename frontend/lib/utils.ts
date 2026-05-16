import { type ClassValue, clsx } from "clsx";

/**
 * Merge CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Format duration in milliseconds to readable string
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

/**
 * Validate GitHub repository URL
 */
export function isValidGitHubUrl(url: string): boolean {
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
  return githubRegex.test(url);
}

/**
 * Validate GitLab repository URL
 */
export function isValidGitLabUrl(url: string): boolean {
  const gitlabRegex = /^https?:\/\/(www\.)?gitlab\.com\/[\w-]+\/[\w.-]+\/?$/;
  return gitlabRegex.test(url);
}

/**
 * Validate any Git repository URL
 */
export function isValidGitUrl(url: string): boolean {
  return isValidGitHubUrl(url) || isValidGitLabUrl(url);
}

/**
 * Extract repository name from URL
 */
export function extractRepoName(url: string): string {
  const match = url.match(/\/([^\/]+)\/([^\/]+?)(\.git)?$/);
  return match ? `${match[1]}/${match[2]}` : url;
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get color based on severity
 */
export function getSeverityColor(severity: 'error' | 'warning' | 'info'): string {
  switch (severity) {
    case 'error':
      return 'text-error';
    case 'warning':
      return 'text-warning';
    case 'info':
      return 'text-primary';
    default:
      return 'text-text-secondary';
  }
}

/**
 * Get heatmap color based on error count
 */
export function getHeatmapColor(errorCount: number): string {
  if (errorCount === 0) return '#10b981'; // green
  if (errorCount <= 2) return '#f59e0b'; // amber
  if (errorCount <= 5) return '#f97316'; // orange
  return '#ef4444'; // red
}

// Made with Bob
