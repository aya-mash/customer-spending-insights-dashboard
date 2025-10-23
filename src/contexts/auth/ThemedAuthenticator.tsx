/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Themed Authenticator Component
 * Customizes AWS Amplify Authenticator to match neomorphic design system
 * Uses CSS custom properties from tokens.css for consistent styling
 * @see https://ui.docs.amplify.aws/react/connected-components/authenticator/customization
 */

import { Authenticator, ThemeProvider, type Theme, type AuthenticatorProps } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useTheme as useAppTheme } from '../../design-system';
import { spacing, radius, fontSize, fontWeight } from '../../design-system/tokens';
import type { ReactNode } from 'react';

interface ThemedAuthenticatorProps extends Omit<AuthenticatorProps, 'children'> {
  children: ReactNode | ((props: { signOut?: () => void; user?: any }) => ReactNode);
}

// Move components outside to avoid React Fast Refresh warnings
function AuthHeader({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: `${spacing[8]} ${spacing[6]} ${spacing[4]}`,
      }}
    >
      <img
        src={theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
        alt="Customer Insights Logo"
        style={{
          height: '48px',
          marginBottom: spacing[4],
        }}
      />
      <h1
        style={{
          fontSize: fontSize.h2,
          fontWeight: fontWeight.bold,
          color: 'var(--color-text-strong)',
          marginBottom: spacing[2],
        }}
      >
        Customer Insights
      </h1>
      <p
        style={{
          fontSize: fontSize.body,
          color: 'var(--color-text-muted)',
          margin: 0,
        }}
      >
        Track your spending, achieve your goals
      </p>
    </div>
  );
}

function AuthFooter() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: `${spacing[4]} ${spacing[6]}`,
        fontSize: fontSize.bodySm,
        color: 'var(--color-text-muted)',
      }}
    >
      <p style={{ margin: 0 }}>
        🔒 Your financial data is secured with AWS Cognito
      </p>
    </div>
  );
}

export function ThemedAuthenticator({ children, ...props }: ThemedAuthenticatorProps) {
  const appTheme = useAppTheme();
  const effectiveTheme = appTheme.effective;

  // Custom components
  const components: AuthenticatorProps['components'] = {
    Header() {
      return <AuthHeader theme={effectiveTheme} />;
    },
    Footer() {
      return <AuthFooter />;
    },
  };

  // Configure sign-up fields to match Cognito User Pool requirements
  const formFields = {
    signUp: {
      email: {
        order: 1,
        isRequired: true,
      },
      given_name: {
        order: 2,
        label: 'First Name',
        placeholder: 'Enter your first name',
        isRequired: true,
      },
      family_name: {
        order: 3,
        label: 'Last Name',
        placeholder: 'Enter your last name',
        isRequired: true,
      },
      birthdate: {
        order: 4,
        label: 'Date of Birth',
        placeholder: 'YYYY-MM-DD',
        isRequired: true,
      },
      password: {
        order: 5,
        isRequired: true,
      },
      confirm_password: {
        order: 6,
        isRequired: true,
      },
    },
  };

  // Amplify UI Theme using your CSS custom properties
  const amplifyTheme: Theme = {
    name: 'neomorphic-theme',
    tokens: {
      colors: {
        brand: {
          primary: {
            10: { value: 'var(--brand-primary)' },
            80: { value: 'var(--brand-primary)' },
            90: { value: 'var(--brand-primary)' },
            100: { value: 'var(--brand-primary-hover)' },
          },
        },
        background: {
          primary: { value: 'var(--color-surface)' },
          secondary: { value: 'var(--color-surface-alt)' },
        },
        font: {
          primary: { value: 'var(--color-text)' },
          secondary: { value: 'var(--color-text-muted)' },
          tertiary: { value: 'var(--color-text-muted)' },
        },
        border: {
          primary: { value: 'var(--color-border)' },
          secondary: { value: 'var(--color-border)' },
        },
      },
      space: {
        small: { value: spacing[2] },
        medium: { value: spacing[4] },
        large: { value: spacing[6] },
        xl: { value: spacing[8] },
      },
      radii: {
        small: { value: radius.sm },
        medium: { value: radius.md },
        large: { value: radius.lg },
        xl: { value: radius.xl },
      },
      fontSizes: {
        small: { value: fontSize.bodySm },
        medium: { value: fontSize.body },
        large: { value: fontSize.bodyLg },
        xl: { value: fontSize.h4 },
        xxl: { value: fontSize.h3 },
      },
      fontWeights: {
        normal: { value: fontWeight.regular },
        medium: { value: fontWeight.medium },
        semibold: { value: fontWeight.semibold },
        bold: { value: fontWeight.bold },
      },
    },
  };

  return (
    <>
      <style>
        {`
          /* Override Amplify UI to match neomorphic design system */
          
          /* Auth form wrapper - centered on page */
          [data-amplify-authenticator] {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${effectiveTheme === 'dark'
              ? 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)'
              : 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)'};
            padding: ${spacing[4]};
          }
          
          /* Container card styling - match Card component */
          [data-amplify-authenticator] [data-amplify-container] {
            background-color: var(--color-surface);
            border-radius: ${radius.xl};
            box-shadow: var(--shadow-neumorphic-lg);
            max-width: 520px;
            width: 100%;
          }
          
          [data-amplify-authenticator] > div {
            padding: 0;
          }
          
          [data-amplify-authenticator] form {
            padding: 0 ${spacing[6]} ${spacing[6]};
          }
          
          /* Tab navigation - match Tabs component */
          [data-amplify-authenticator] [role="tablist"] {
            display: flex;
            background-color: var(--color-surface);
            border-radius: ${radius.lg};
            box-shadow: var(--shadow-neumorphic-inset);
            padding: ${spacing[2]};
            gap: ${spacing[2]};
            margin: 0 ${spacing[6]} ${spacing[6]};
          }
          
          [data-amplify-authenticator] [role="tab"] {
            flex: 1;
            border-radius: ${radius.md};
            font-weight: ${fontWeight.regular};
            transition: all 200ms ease;
            padding: ${spacing[3]} ${spacing[4]};
            border: none;
            background-color: transparent !important;
            color: var(--color-text-muted) !important;
            box-shadow: var(--shadow-neumorphic-pressed) !important;
            cursor: pointer;
          }
          
          [data-amplify-authenticator] [role="tab"]:hover:not([aria-selected="true"]) {
            color: var(--color-text) !important;
          }
          
          [data-amplify-authenticator] [role="tab"][aria-selected="true"] {
            background-color: var(--color-surface) !important;
            box-shadow: var(--shadow-neumorphic-sm) !important;
            transform: translateY(-1px);
            color: var(--color-text-strong) !important;
            font-weight: ${fontWeight.semibold} !important;
          }
          
          [data-amplify-authenticator] [role="tab"][data-state="active"] {
            background-color: var(--color-surface) !important;
            box-shadow: var(--shadow-neumorphic-sm) !important;
            transform: translateY(-1px);
            color: var(--color-text-strong) !important;
            font-weight: ${fontWeight.semibold} !important;
          }
          
          /* Input fields - match TextField component */
          [data-amplify-authenticator] input,
          [data-amplify-authenticator] select {
            background-color: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: ${radius.md};
            box-shadow: var(--shadow-neumorphic-inset);
            color: var(--color-text);
            font-size: ${fontSize.body};
            padding: ${spacing[3]} ${spacing[4]};
            transition: all 0.2s ease;
          }
          
          [data-amplify-authenticator] input:focus,
          [data-amplify-authenticator] select:focus {
            border-color: var(--brand-primary);
            box-shadow: 0 0 0 3px rgba(var(--brand-primary-rgb), 0.1), var(--shadow-neumorphic-inset);
            outline: none;
          }
          
          [data-amplify-authenticator] input::placeholder {
            color: var(--color-text-placeholder);
          }
          
          /* Labels */
          [data-amplify-authenticator] label {
            color: var(--color-text);
            font-size: ${fontSize.body};
            font-weight: ${fontWeight.medium};
            margin-bottom: ${spacing[2]};
          }
          
          /* Primary button - match Button component primary variant */
          [data-amplify-authenticator] button[type="submit"],
          [data-amplify-authenticator] button[data-variation="primary"] {
            background-color: var(--brand-primary);
            color: white;
            border: 1px solid var(--brand-primary);
            border-radius: ${radius.md};
            box-shadow: var(--shadow-neumorphic-sm);
            font-weight: ${fontWeight.medium};
            font-size: ${fontSize.body};
            padding: ${spacing[3]} ${spacing[5]};
            transition: all 0.2s ease;
            min-height: 44px;
          }
          
          [data-amplify-authenticator] button[type="submit"]:hover,
          [data-amplify-authenticator] button[data-variation="primary"]:hover {
            background-color: var(--brand-primary-hover);
            box-shadow: var(--shadow-neumorphic-md);
            transform: translateY(-1px);
          }
          
          [data-amplify-authenticator] button[type="submit"]:active,
          [data-amplify-authenticator] button[data-variation="primary"]:active {
            background-color: var(--brand-primary-active);
            box-shadow: var(--shadow-neumorphic-xs);
            transform: translateY(0);
          }
          
          /* Secondary/link buttons - match ghost variant */
          [data-amplify-authenticator] button:not([type="submit"]):not([data-variation="primary"]) {
            background-color: transparent;
            color: var(--brand-primary);
            font-weight: ${fontWeight.medium};
            border: none;
            box-shadow: none;
          }
          
          [data-amplify-authenticator] button:not([type="submit"]):not([data-variation="primary"]):hover {
            color: var(--brand-primary-hover);
            text-decoration: underline;
          }
          
          /* Error messages */
          [data-amplify-authenticator] [role="alert"],
          [data-amplify-authenticator] [data-amplify-error] {
            color: #EF4444;
            font-size: ${fontSize.bodySm};
            margin-top: ${spacing[1]};
          }
          
          /* Field groups spacing */
          [data-amplify-authenticator] [data-amplify-field] {
            margin-bottom: ${spacing[4]};
          }
          
          /* Responsive - match mobile breakpoint */
          @media (max-width: 640px) {
            [data-amplify-authenticator] {
              box-shadow: none;
              border-radius: 0;
              max-width: 100%;
            }
          }
        `}
      </style>
      <ThemeProvider theme={amplifyTheme}>
        <Authenticator components={components} formFields={formFields} {...props}>
          {children as any}
        </Authenticator>
      </ThemeProvider>
    </>
  );
}
