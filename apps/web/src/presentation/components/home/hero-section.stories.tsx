import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { HeroSection } from './hero-section';

const meta: Meta<typeof HeroSection> = {
  title: 'Components/Home/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
El HeroSection es el componente principal de la página de inicio que muestra el mensaje principal 
de la biblioteca digital, botones de acción y una búsqueda rápida con categorías populares.

**Características:**
- Imagen de fondo con overlays
- Título principal con texto destacado
- Botones de acción para explorar catálogo y préstamos
- Búsqueda integrada con placeholder
- Categorías populares como tags clicables
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onExploreClick: {
      description: 'Callback cuando se hace clic en "Explorar Catálogo"',
    },
    onMyLoansClick: {
      description: 'Callback cuando se hace clic en "Mis Préstamos"',
    },
    onSearch: {
      description: 'Callback cuando se envía el formulario de búsqueda',
    },
    onCategoryClick: {
      description: 'Callback cuando se hace clic en una categoría',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onExploreClick: action('onExploreClick'),
    onMyLoansClick: action('onMyLoansClick'),
    onSearch: action('onSearch'),
    onCategoryClick: action('onCategoryClick'),
  },
};

export const WithCustomActions: Story = {
  args: {
    onExploreClick: () => console.log('Navegando al catálogo...'),
    onMyLoansClick: () => console.log('Navegando a mis préstamos...'),
    onSearch: (query: string) => console.log('Buscando:', query),
    onCategoryClick: (category: string) => console.log('Categoría seleccionada:', category),
  },
  parameters: {
    docs: {
      description: {
        story: 'Ejemplo con callbacks personalizados que se ejecutan en la consola.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    onExploreClick: action('navigate-to-catalog'),
    onMyLoansClick: action('navigate-to-loans'),
    onSearch: action('search-performed'),
    onCategoryClick: action('category-selected'),
  },
  parameters: {
    docs: {
      description: {
        story: `
Historia interactiva donde puedes probar todas las funcionalidades:
- Hacer clic en los botones principales
- Escribir en el campo de búsqueda y enviar
- Hacer clic en las categorías populares
        `,
      },
    },
  },
};
