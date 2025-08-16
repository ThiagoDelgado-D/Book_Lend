import { Category } from 'app-domain';
import React from 'react';

interface CategoryCardProps {
  category: Category & {
    icon?: React.ReactNode;
    color?: string;
  };
  onClick?: () => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  const bgColor = category.color || 'bg-blue-100';
  const textColor = 'text-gray-800';

  return (
    <div
      className={`${bgColor} rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center`}
      onClick={onClick}
    >
      {category.icon || (
        <div className="mb-2 bg-white p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
      )}
      <h3 className={`${textColor} font-semibold text-center`}>{category.name}</h3>
    </div>
  );
};
