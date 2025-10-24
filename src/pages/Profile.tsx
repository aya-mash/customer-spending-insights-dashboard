/**
 * PROFILE PAGE
 * Mobile: Full page profile view
 */

import { Stack, Text, Card } from '../design-system/components';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useQuery } from '@tanstack/react-query';
import { User, Mail, LogOut } from 'lucide-react';
import { useTheme } from '../design-system';

export function Profile() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const { isMobile } = useTheme();
  const { data: userAttributes, isLoading } = useQuery({
    queryKey: ['userAttributes', user?.username],
    queryFn: async () => await fetchUserAttributes(),
  });

  const fullName = userAttributes?.given_name && userAttributes?.family_name
    ? `${userAttributes.given_name} ${userAttributes.family_name}`
    : userAttributes?.email || user?.username || 'User';

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div style={{ padding: isMobile ? '16px' : '24px' }}>
      <Stack spacing={6}>
        <Text variant="bodyLg" style={{ fontWeight: 600, fontSize: '24px' }}>
          Profile
        </Text>

        <Card padding={6}>
          <Stack spacing={6}>
            {/* Avatar */}
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              fontSize: '40px',
              fontWeight: 600,
              color: 'white',
            }}>
              {fullName.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <Stack spacing={4}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <User size={20} color="#6B7280" />
                <div style={{ flex: 1 }}>
                  <Text variant="caption" color="muted">Name</Text>
                  <Text variant="body">{isLoading ? '...' : fullName}</Text>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={20} color="#6B7280" />
                <div style={{ flex: 1 }}>
                  <Text variant="caption" color="muted">Email</Text>
                  <Text variant="body">{userAttributes?.email || user?.username || '...'}</Text>
                </div>
              </div>
            </Stack>

            {/* Actions */}
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                width: '100%',
                marginTop: '24px',
              }}
              onClick={handleSignOut}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                e.currentTarget.style.borderColor = '#EF4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }}
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </Stack>
        </Card>
      </Stack>
    </div>
  );
}
