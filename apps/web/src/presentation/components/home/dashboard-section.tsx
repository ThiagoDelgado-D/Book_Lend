import { BookStatus } from 'app-domain';
import { BookOpen, Clock, Users, Heart, BookMarked } from 'lucide-react';
import { BookCard, FeaturedBook } from '../cards/book-card';
import { StatCard } from '../cards/stats-card';

interface DashboardSectionProps {
  onRequestLoan?: (bookId: string) => void;
  onViewDetails?: (bookId: string) => void;
  onViewAllBooks?: () => void;
}

export const DashboardSection = ({
  onRequestLoan,
  onViewDetails,
  onViewAllBooks,
}: DashboardSectionProps) => {
  const stats = [
    {
      title: 'Libros Disponibles',
      value: '1,247',
      icon: BookOpen,
      change: '+12%',
      changeType: 'positive' as const,
      color: 'text-emerald-600',
    },
    {
      title: 'Préstamos Activos',
      value: '156',
      icon: Clock,
      change: '+8%',
      changeType: 'positive' as const,
      color: 'text-amber-500',
    },
    {
      title: 'Usuarios Registrados',
      value: '342',
      icon: Users,
      change: '+23%',
      changeType: 'positive' as const,
      color: 'text-blue-600',
    },
    {
      title: 'Libros Favoritos',
      value: '89',
      icon: Heart,
      change: '+5%',
      changeType: 'positive' as const,
      color: 'text-red-500',
    },
  ];

  const featuredBooks: FeaturedBook[] = [
    {
      id: '1',
      title: "Clean Architecture: A Craftsman's Guide to Software Structure and Design",
      author: 'Robert C. Martin',
      isbn: '978-0134494166',
      status: BookStatus.AVAILABLE,
      rating: 4.8,
      genre: 'Tecnología',
      description:
        'Una guía completa sobre arquitectura de software que enseña principios fundamentales para crear sistemas mantenibles y escalables.',
      publishedYear: 2017,
    },
    {
      id: '2',
      title: 'Domain-Driven Design: Tackling Complexity in the Heart of Software',
      author: 'Eric Evans',
      isbn: '978-0321125217',
      status: BookStatus.BORROWED,
      rating: 4.6,
      genre: 'Tecnología',
      description:
        'El libro definitivo sobre diseño dirigido por dominio, una metodología para modelar software complejo.',
      publishedYear: 2003,
    },
    {
      id: '3',
      title: 'The Pragmatic Programmer: Your Journey to Mastery',
      author: 'David Thomas, Andrew Hunt',
      isbn: '978-0135957059',
      status: BookStatus.AVAILABLE,
      rating: 4.9,
      genre: 'Tecnología',
      description:
        'Una colección de consejos prácticos y técnicas para convertirse en un programador más efectivo.',
      publishedYear: 2019,
    },
    {
      id: '4',
      title: 'Patterns of Enterprise Application Architecture',
      author: 'Martin Fowler',
      isbn: '978-0321127426',
      status: BookStatus.RESERVED,
      rating: 4.5,
      genre: 'Tecnología',
      description:
        'Patrones fundamentales para el diseño de aplicaciones empresariales robustas y mantenibles.',
      publishedYear: 2002,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-900">Libros Destacados</h2>
                <p className="text-gray-600">Los libros más populares y recién agregados</p>
              </div>
              <button
                onClick={onViewAllBooks}
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <BookMarked className="h-5 w-5" />
                <span className="text-sm">Ver todos</span>
              </button>
            </div>

            <div className="grid gap-6">
              {featuredBooks.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onRequestLoan={onRequestLoan}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
