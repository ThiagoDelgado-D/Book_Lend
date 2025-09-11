import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Footer } from './footer';

const meta: Meta<typeof Footer> = {
  title: 'Components/Common/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
El Footer es un componente reutilizable que contiene la información de la empresa,
enlaces de navegación organizados por secciones, y el copyright.

**Características:**
- Logo y descripción de la empresa
- Enlaces organizados por categorías
- Diseño responsive
- Navegación consistente con el resto de la aplicación
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onLinkClick: {
      description: 'Callback cuando se hace clic en cualquier enlace del footer',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onLinkClick: action('onLinkClick'),
  },
};

export const WithNavigation: Story = {
  args: {
    onLinkClick: (href: string) => console.log('Navegando a:', href),
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer con navegación funcional que muestra las rutas en consola.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    onLinkClick: action('footer-link-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer interactivo donde puedes hacer clic en cualquier enlace para ver la acción.',
      },
    },
  },
};
