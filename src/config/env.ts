/**
 * Environment Configuration
 * 
 * This file provides type-safe access to environment variables.
 * All environment variables must be prefixed with VITE_ to be exposed to the client.
 */

import { logger } from '../utils/logger';

interface AppConfig {
  env: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  appName: string;
  enableMocks: boolean;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
}

// Helper to get environment variable with fallback
const getEnvVar = (key: string, fallback: string = ''): string => {
  return import.meta.env[key] || fallback;
};

// Helper to parse boolean from string
const parseBool = (value: string): boolean => {
  return value === 'true' || value === '1';
};

// Determine environment
const env = (getEnvVar('VITE_ENV', 'development') as AppConfig['env']);

export const config: AppConfig = {
  env,
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', '/api'),
  appName: getEnvVar('VITE_APP_NAME', 'Customer Spending Insights'),
  enableMocks: parseBool(getEnvVar('VITE_ENABLE_MOCKS', 'true')),
  isDevelopment: env === 'development',
  isStaging: env === 'staging',
  isProduction: env === 'production',
};

// Log configuration in non-production environments
if (!config.isProduction) {
  logger.log('[Config] Environment:', config.env);
  logger.log('[Config] API Base URL:', config.apiBaseUrl);
  logger.log('[Config] Mocks Enabled:', config.enableMocks);
}

// Freeze config to prevent modifications
Object.freeze(config);
