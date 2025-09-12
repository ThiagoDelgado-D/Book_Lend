import type { Meta, StoryObj } from '@storybook/react';
import { StatsCard } from './stats-card';

const meta: Meta<typeof StatsCard> = {
  title: 'Components/Cards/StatsCard',
  component: StatsCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '1.247',
    label: 'Libros disponibles',
  },
};

export const Percentage: Story = {
  args: {
    value: '89%',
    label: 'Satisfacción',
  },
};

export const LargeNumber: Story = {
  args: {
    value: '10,000+',
    label: 'Usuarios registrados',
  },
};
