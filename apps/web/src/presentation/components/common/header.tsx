import { Logo } from './logo';
import { Navigation } from './navigation';
import { SearchBox } from './search-box';
import { UserActions } from './user-actions';

export interface HeaderProps {
  currentPath?: string;
}

export const Header = ({ currentPath }: HeaderProps) => {
  const navigationItems = [
    { label: 'Catálogo', path: '/catalog' },
    { label: 'Mis Préstamos', path: '/my-loans' },
    { label: 'Reseñas', path: '/reviews' },
    { label: 'Gestión Libros', path: '/book-management' },
    { label: 'Autores', path: '/authors' },
    { label: 'Usuarios', path: '/users' },
    { label: 'Admin Préstamos', path: '/admin-loans' },
  ];

  return (
    <header className="bg-white/98 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <Navigation items={navigationItems} currentPath={currentPath} />
          <div className="flex items-center gap-6">
            <SearchBox />
            <UserActions />
          </div>
        </div>
      </div>
    </header>
  );
};
