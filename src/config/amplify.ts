import { Amplify } from 'aws-amplify';

/**
 * Configure AWS Amplify with Cognito settings.
 * This module is imported early to ensure Amplify is configured before any auth operations.
 */
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || '',
    },
  },
});
