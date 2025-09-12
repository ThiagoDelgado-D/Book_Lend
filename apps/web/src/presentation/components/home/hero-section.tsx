import { Search, BookOpen } from 'lucide-react';
import { Button } from '../../ui/button';
import heroImage from '../../../assets/library-hero.webp';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Biblioteca moderna con ambiente acogedor"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-foreground">Tu biblioteca</span>
              <br />
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                digital perfecta
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Gestiona préstamos, descubre nuevos libros y mantén organizados tus favoritos en el
              sistema más moderno y fácil de usar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-hero text-white hover:opacity-90 transition-smooth shadow-medium hover:shadow-strong text-lg px-8 py-6"
              onClick={() => navigate('/catalog')}
            >
              <Search className="mr-2 h-5 w-5" />
              Explorar Catálogo
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-smooth text-lg px-8 py-6"
              onClick={() => navigate('/my-loans')}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Mis Préstamos
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-accent">1,247</div>
              <div className="text-sm text-muted-foreground">Libros disponibles</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-library-green">342</div>
              <div className="text-sm text-muted-foreground">Usuarios activos</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-vintage-gold">89%</div>
              <div className="text-sm text-muted-foreground">Satisfacción</div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block relative animate-slide-up">
          <div className="absolute inset-0 bg-gradient-accent rounded-2xl opacity-20 blur-3xl transform rotate-6"></div>
          <div className="relative bg-card rounded-2xl p-8 shadow-strong border border-border/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-6 text-foreground">Búsqueda rápida</h3>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Título, autor, ISBN..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                />
              </div>
              <Button className="w-full bg-gradient-hero text-white hover:opacity-90 transition-smooth">
                Buscar Libros
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Categorías populares</h4>
              <div className="flex flex-wrap gap-2">
                {['Ficción', 'Ciencia', 'Historia', 'Arte', 'Tecnología'].map(category => (
                  <span
                    key={category}
                    className="px-3 py-1 text-xs bg-secondary rounded-full text-secondary-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer transition-smooth"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
