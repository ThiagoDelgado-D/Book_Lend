import { BookOpen, User, Settings, LogOut, Search, BookMarked } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/button';

export const Header = () => {
  const [isAuthenticated] = useState(true);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-foreground">BookLend</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6 ml-8">
            <Button variant="ghost" className="text-foreground hover:text-accent" asChild>
              <a href="/catalog">Catálogo</a>
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-accent" asChild>
              <a href="/my-loans">Mis Préstamos</a>
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-accent" asChild>
              <a href="/reviews">Reseñas</a>
            </Button>

            <div className="h-4 border-l border-border mx-2"></div>
            <Button variant="ghost" className="text-foreground hover:text-accent" asChild>
              <a href="/books">Gestión Libros</a>
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-accent" asChild>
              <a href="/authors">Autores</a>
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-accent" asChild>
              <a href="/users">Usuarios</a>
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-accent" asChild>
              <a href="/loans">Admin Préstamos</a>
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar libros..."
                className="pl-10 pr-4 py-2 w-64 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
              />
            </div>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-foreground hover:text-accent">
                <BookMarked className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-accent"
                asChild
              >
                <a href="/profile">
                  <User className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground hover:text-accent">
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/80"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="text-foreground">
                Iniciar Sesión
              </Button>
              <Button className="bg-gradient-hero text-white hover:opacity-90 transition-smooth">
                Registrarse
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
