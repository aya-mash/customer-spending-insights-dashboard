import type { Meta, StoryObj } from '@storybook/react';
import { ContrastCheckerPanel } from './ContrastCheckerPanel';

const meta: Meta<typeof ContrastCheckerPanel> = {
  title: 'Accessibility/ContrastCheckerPanel',
  component: ContrastCheckerPanel,
};
export default meta;
type Story = StoryObj<typeof ContrastCheckerPanel>;
export const Default: Story = { args: {} };