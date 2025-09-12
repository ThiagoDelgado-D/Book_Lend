import { Heart, BookOpen, Clock, Star } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { BookStatus } from 'app-domain';

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    status: BookStatus.AVAILABLE | BookStatus.BORROWED | BookStatus.RESERVED;
    rating: number;
    genre: string;
    description: string;
    coverUrl?: string;
    publishedYear: number;
  };
}
export interface FeaturedBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  status: BookStatus.AVAILABLE | BookStatus.BORROWED | BookStatus.RESERVED;
  rating: number;
  genre: string;
  description: string;
  publishedYear: number;
}

export const BookCard = ({ book }: BookCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-library-green text-white';
      case 'borrowed':
        return 'bg-destructive text-white';
      case 'reserved':
        return 'bg-vintage-gold text-deep-brown';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: BookStatus) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'borrowed':
        return 'Prestado';
      case 'reserved':
        return 'Reservado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="group bg-card border border-border rounded-xl p-6 hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-20 h-28 bg-gradient-card rounded-lg border border-border/50 flex items-center justify-center shadow-soft">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={`Portada de ${book.title}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                {book.title}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                por {book.author} • {book.publishedYear}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-8 w-8 hover:bg-accent/10"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isFavorite ? 'fill-accent text-accent' : 'text-muted-foreground hover:text-accent'
                }`}
              />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {book.genre}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(book.status)}`}>
              {getStatusText(book.status)}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-vintage-gold text-vintage-gold" />
            <span className="text-sm font-medium text-foreground">{book.rating}</span>
            <span className="text-xs text-muted-foreground ml-1">ISBN: {book.isbn}</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {book.description}
          </p>

          <div className="flex gap-2 pt-2">
            {book.status === 'available' ? (
              <Button
                size="sm"
                className="bg-library-green hover:bg-library-green/90 text-white transition-smooth flex-1"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Solicitar Préstamo
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-smooth flex-1"
              >
                <Clock className="h-4 w-4 mr-2" />
                Reservar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="px-3"
              onClick={() => navigate(`/book/${book.id}`)}
            >
              Ver Detalles
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
