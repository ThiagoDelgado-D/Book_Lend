import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchSectionProps {
  onSearch?: (query: string) => void;
}

export const SearchSection = ({ onSearch }: SearchSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  const popularCategories = ['Ficción', 'Ciencia', 'Historia', 'Arte', 'Tecnología'];

  return (
    <div className="w-full">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Búsqueda rápida</h3>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Título, autor, ISBN..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-700"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 mb-3">Categorías populares</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularCategories.map(category => (
              <button
                key={category}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-emerald-100 hover:text-emerald-700 transition-colors text-sm font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
