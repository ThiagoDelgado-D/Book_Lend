import { useState, useEffect } from 'react';
import { mockBookCategories } from '../mocks/book-mock';
import { Category } from 'app-domain';

export const useBookCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCategories(mockBookCategories);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { categories, isLoading };
};
