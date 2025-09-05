import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from './search-bar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/Landing/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSearch: (query: string) => console.log('Buscando:', query),
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Buscar libros por título...',
    onSearch: (query: string) => console.log('Buscando:', query),
  },
};
