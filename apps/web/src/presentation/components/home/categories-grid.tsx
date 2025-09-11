import React from 'react';
import {
  BookOpen,
  Microscope,
  Clock,
  Palette,
  Computer,
  Heart,
  Globe,
  Lightbulb,
} from 'lucide-react';

interface Category {
  name: string;
  icon: React.ReactNode;
  count: number;
  gradient: string;
}

const CategoryCard = ({ category }: { category: Category }) => (
  <div className="group cursor-pointer">
    <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-border hover:border-border/70 h-full">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${category.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {category.icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-emerald-700 transition-colors">
        {category.name}
      </h3>
      <p className="text-sm text-muted-foreground font-medium">
        {category.count} libros disponibles
      </p>
    </div>
  </div>
);

export const CategoriesGrid = () => {
  const categories: Category[] = [
    {
      name: 'Ficción',
      icon: <BookOpen className="w-6 h-6 text-white" />,
      count: 324,
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
    {
      name: 'Ciencia',
      icon: <Microscope className="w-6 h-6 text-white" />,
      count: 198,
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      name: 'Historia',
      icon: <Clock className="w-6 h-6 text-white" />,
      count: 156,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-500',
    },
    {
      name: 'Arte',
      icon: <Palette className="w-6 h-6 text-white" />,
      count: 89,
      gradient: 'bg-gradient-to-br from-pink-500 to-rose-500',
    },
    {
      name: 'Tecnología',
      icon: <Computer className="w-6 h-6 text-white" />,
      count: 167,
      gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    },
    {
      name: 'Romance',
      icon: <Heart className="w-6 h-6 text-white" />,
      count: 234,
      gradient: 'bg-gradient-to-br from-red-500 to-pink-500',
    },
    {
      name: 'Geografía',
      icon: <Globe className="w-6 h-6 text-white" />,
      count: 78,
      gradient: 'bg-gradient-to-br from-teal-500 to-cyan-500',
    },
    {
      name: 'Filosofía',
      icon: <Lightbulb className="w-6 h-6 text-white" />,
      count: 45,
      gradient: 'bg-gradient-to-br from-indigo-500 to-purple-500',
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
            Explora por categorías
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Descubre una amplia variedad de libros organizados por temas de tu interés
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.map(category => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};
