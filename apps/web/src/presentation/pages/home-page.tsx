import { useBookCategories } from '../../application/hooks/use-book-categories';
import { CategoryCard } from '../components/cards/category-card';
import { StatsCard } from '../components/cards/stats-card';
import { SearchBar } from '../components/landing/search-bar';

export const HomePage = () => {
  const { categories, isLoading } = useBookCategories();

  const handleSearch = (query: string) => {
    console.log('Realizando búsqueda:', query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Tu biblioteca digital perfecta</h1>
        <p className="text-xl mb-8">
          Gestiona préstamos, descubre nuevos libros y mantén organizados tus favoritos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard value="1.247" label="Libros disponibles" />
          <StatsCard value="342" label="Usuarios activos" />
          <StatsCard value="89%" label="Satisfacción" />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Búsqueda rápida</h2>
        <SearchBar placeholder="Título, autor, ISBN..." onSearch={handleSearch} />

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Categorías populares</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {isLoading ? (
              <p>Cargando categorías...</p>
            ) : (
              categories.map(category => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => console.log('Categoría seleccionada:', category.name)}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
