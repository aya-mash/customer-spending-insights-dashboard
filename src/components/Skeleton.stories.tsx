import type { Meta, StoryObj } from '@storybook/react';
import { AsyncSection } from './Skeleton';
import type { ReactNode } from 'react';

const meta: Meta<typeof AsyncSection> = {
  title: 'Feedback/AsyncSection',
  component: AsyncSection,
};
export default meta;
type Story = StoryObj<typeof AsyncSection>;

function mockLoad(): Promise<ReactNode> { return new Promise(r => setTimeout(()=>r(<div>Loaded content</div>), 500)); }

export const Loading: Story = { args: { load: mockLoad, fallbackRows: 3 } };