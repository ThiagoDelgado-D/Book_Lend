import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from './stats-card';

const meta: Meta<typeof StatCard> = {
  title: 'Components/Cards/StatCard',
  component: StatCard,
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
