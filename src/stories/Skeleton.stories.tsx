import type { Meta, StoryObj } from '@storybook/react';
import { AsyncSection } from '../components/Skeleton';
import type { ReactNode } from 'react';

async function loadContent(): Promise<ReactNode> {
  await new Promise(r => setTimeout(r, 300));
  return <div><h2>Loaded Content</h2><p>This content replaced the skeleton after a delay.</p></div>;
}

const meta: Meta<typeof AsyncSection> = {
  title: 'Feedback/Skeleton/AsyncSection',
  component: AsyncSection,
};
export default meta;

type Story = StoryObj<typeof AsyncSection>;
export const Default: Story = { render: () => <AsyncSection load={loadContent} /> };