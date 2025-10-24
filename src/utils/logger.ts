/**
 * Logger Utility
 * Environment-aware logging that respects development vs production mode
 */

const isDev = import.meta.env.DEV;

export const logger = {
  /**
   * Log general information (dev only)
   */
  log: (...args: unknown[]): void => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * Log warnings (dev only)
   */
  warn: (...args: unknown[]): void => {
    if (isDev) {
      console.warn(...args);
    }
  },

  /**
   * Log debug information (dev only)
   */
  debug: (...args: unknown[]): void => {
    if (isDev) {
      console.debug(...args);
    }
  },

  /**
   * Log errors (always logged, even in production)
   */
  error: (...args: unknown[]): void => {
    console.error(...args);
  },

  /**
   * Log informational messages (always logged)
   */
  info: (...args: unknown[]): void => {
    console.info(...args);
  },
};
