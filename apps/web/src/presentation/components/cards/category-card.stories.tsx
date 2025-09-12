import { Meta, StoryObj } from '@storybook/react';
import { CategoryCard } from './category-card';

const meta: Meta<typeof CategoryCard> = {
  title: 'Components/Cards/CategoryCard',
  component: CategoryCard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    category: {
      id: 1,
      name: 'Ficción',
      bookCount: 342,
    },
  },
};

export const WithCustomColor: Story = {
  args: {
    category: {
      id: 2,
      name: 'Tecnología',
      bookCount: 198,
      color: 'bg-green-100',
    },
  },
};

export const WithIcon: Story = {
  args: {
    category: {
      id: 3,
      name: 'Arte',
      bookCount: 87,
      color: 'bg-purple-100',
      icon: (
        <div className="mb-2 bg-white p-2 rounded-full">
          <svg className="h-8 w-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ),
    },
  },
};
