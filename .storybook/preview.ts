import React from 'react';
import type { Preview } from '@storybook/react';
import '../src/styles/global.css';
import '../src/styles/tokens.css';
import '../src/index.css';
import '../src/App.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
    a11y: { disable: false },
    backgrounds: {
      default: 'app-bg',
      values: [
        { name: 'app-bg', value: 'var(--color-bg)' },
        { name: 'surface', value: 'var(--color-surface)' },
        { name: 'brand', value: 'var(--color-brand)' }
      ]
    }
  },
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => React.createElement('div', { style: { padding: '1rem' } }, React.createElement(Story))
  ]
};
export default preview;