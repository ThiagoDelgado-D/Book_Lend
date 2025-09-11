interface FooterLink {
  label: string;
  href: string;
  onClick?: () => void;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  onLinkClick?: (href: string) => void;
}

export const Footer = ({ onLinkClick }: FooterProps) => {
  const footerSections: FooterSection[] = [
    {
      title: 'Biblioteca',
      links: [
        { label: 'Catálogo', href: '/catalog' },
        { label: 'Nuevos Ingresos', href: '/new-arrivals' },
        { label: 'Más Populares', href: '/popular' },
        { label: 'Categorías', href: '/categories' },
      ],
    },
    {
      title: 'Mi Cuenta',
      links: [
        { label: 'Mis Préstamos', href: '/my-loans' },
        { label: 'Favoritos', href: '/favorites' },
        { label: 'Historial', href: '/history' },
        { label: 'Configuración', href: '/settings' },
      ],
    },
    {
      title: 'Soporte',
      links: [
        { label: 'Centro de Ayuda', href: '/help' },
        { label: 'Contacto', href: '/contact' },
        { label: 'Términos de Uso', href: '/terms' },
        { label: 'Privacidad', href: '/privacy' },
      ],
    },
  ];

  const handleLinkClick = (href: string) => {
    onLinkClick?.(href);
  };

  return (
    <footer className="border-t border-border/50 py-12 mt-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <span className="text-white font-bold text-sm">BL</span>
              </div>
              <span className="font-bold text-xl text-foreground">BookLend</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tu biblioteca digital moderna para gestionar préstamos y descubrir nuevos libros.
            </p>
          </div>

          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-semibold text-gray-900">{section.title}</h4>
              <div className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <button
                    key={linkIndex}
                    onClick={() => handleLinkClick(link.href)}
                    className="block text-sm text-gray-600 text-left hover:text-accent cursor-pointer transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-border/30 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 BookLend. Desarrollado con ❤️ para amantes de los libros.</p>
        </div>
      </div>
    </footer>
  );
};
