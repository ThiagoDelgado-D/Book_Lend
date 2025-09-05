import { Search, BookOpen } from 'lucide-react';
import { SearchSection } from './search-section';
import { Button } from '../../ui/button';

export const HeroSection = () => {
  return (
    <section
      className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%), url('/src/assets/library-bg.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60"></div>

      <div className="container mx-auto px-6 text-center text-white relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 tracking-tight">
            Tu biblioteca
            <span className="block mt-2 font-normal text-emerald-400">digital perfecta</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl mb-12 max-w-3xl mx-auto opacity-90 font-light leading-relaxed">
            Gestiona préstamos, descubre nuevos libros y mantén organizados tus favoritos en el
            sistema más moderno y fácil de usar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4"
            >
              <Search className="mr-3 h-5 w-5" />
              Explorar Catálogo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-gray-900 transition-all duration-300 px-8 py-4"
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Mis Préstamos
            </Button>
          </div>

          <div className="max-w-2xl mx-auto">
            <SearchSection />
          </div>
        </div>
      </div>
    </section>
  );
};
