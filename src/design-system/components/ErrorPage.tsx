/**
 * ERROR PAGE COMPONENT
 * Design system error page using React Router's useRouteError hook
 * Handles different error types (404, network errors, generic errors)
 */

import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { PageLayout } from './PageLayout';
import { Card } from './Card';
import { Stack } from './Stack';
import { Heading } from './Heading';
import { Text } from './Text';
import { Button } from './Button';

export function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'Error';
  let message = 'An unexpected error occurred.';
  let details: string | undefined;

  if (isRouteErrorResponse(error)) {
    // React Router error response (e.g., 404, loader errors)
    title = error.status === 404 ? 'Page Not Found' : `Error ${error.status}`;
    message = error.statusText || message;
    if (error.data?.message) {
      details = error.data.message;
    }
  } else if (error instanceof Error) {
    // JavaScript Error object
    title = 'Application Error';
    message = error.message;
    details = import.meta.env.DEV ? error.stack : undefined;
  } else if (typeof error === 'string') {
    message = error;
  }

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <PageLayout title={title}>
      <Stack spacing={6} style={{ maxWidth: '700px', margin: '0 auto', paddingTop: '48px' }}>
        <Card variant="elevated">
          <Stack spacing={5} style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <AlertTriangle size={64} color="var(--color-semantic-danger)" aria-hidden="true" />
            </div>
            
            <Stack spacing={2}>
              <Heading level={1} style={{ fontSize: '32px', fontWeight: 700, margin: 0 }}>
                {title}
              </Heading>
              <Text variant="body" style={{ fontSize: '18px' }}>
                {message}
              </Text>
            </Stack>

            {details && (
              <Card variant="default" style={{ textAlign: 'left', marginTop: '12px' }}>
                <Text variant="bodySm" color="muted" style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {details}
                </Text>
              </Card>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                size="medium"
                onClick={() => navigate('/')}
                aria-label="Go to overview page"
              >
                <Home size={18} aria-hidden="true" />
                Go to Overview
              </Button>
              <Button
                variant="secondary"
                size="medium"
                onClick={handleReload}
                aria-label="Reload the page"
              >
                <RefreshCw size={18} aria-hidden="true" />
                Try Again
              </Button>
              {window.history.length > 1 && (
                <Button
                  variant="ghost"
                  size="medium"
                  onClick={() => navigate(-1)}
                  aria-label="Go back to previous page"
                >
                  Go Back
                </Button>
              )}
            </div>
          </Stack>
        </Card>
      </Stack>
    </PageLayout>
  );
}

export default ErrorPage;
