import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { PageLayout } from '../design-system/components/PageLayout';
import { Card } from '../design-system/components/Card';
import { Stack } from '../design-system/components/Stack';
import { Heading } from '../design-system/components/Heading';
import { Text } from '../design-system/components/Text';
import { Button } from '../design-system/components/Button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <PageLayout title="Page Not Found">
      <Stack spacing={6} style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '48px' }}>
        <Card variant="elevated">
          <Stack spacing={5} style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <AlertCircle size={64} color="var(--color-semantic-warning)" aria-hidden="true" />
            </div>
            
            <Stack spacing={2}>
              <Heading level={1} style={{ fontSize: '48px', fontWeight: 700, margin: 0 }}>
                404
              </Heading>
              <Heading level={2} style={{ fontSize: '24px', margin: 0 }}>
                Page Not Found
              </Heading>
            </Stack>

            <Text variant="body" color="muted">
              The page you're looking for doesn't exist or has been moved.
              Please check the URL or return to the overview page.
            </Text>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '12px' }}>
              <Button
                variant="primary"
                size="medium"
                onClick={() => navigate('/')}
                aria-label="Go to overview page"
              >
                <Home size={18} aria-hidden="true" />
                Back to Overview
              </Button>
              <Button
                variant="secondary"
                size="medium"
                onClick={() => navigate(-1)}
                aria-label="Go back to previous page"
              >
                Go Back
              </Button>
            </div>
          </Stack>
        </Card>
      </Stack>
    </PageLayout>
  );
}

export default NotFound;