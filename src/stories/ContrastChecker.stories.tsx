import type { Meta, StoryObj } from '@storybook/react';
import { ContrastCheckerPanel } from '../components/ContrastChecker/ContrastCheckerPanel';

const meta: Meta<typeof ContrastCheckerPanel> = {
  title: 'DevTools/ContrastCheckerPanel',
  component: ContrastCheckerPanel,
  parameters: { docs: { description: { component: 'Dev-only contrast checker with token selection.' } } }
};
export default meta;

type Story = StoryObj<typeof ContrastCheckerPanel>;
export const Default: Story = { render: () => <ContrastCheckerPanel /> };