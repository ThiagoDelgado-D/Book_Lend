import { BookOpen } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-2.5 rounded-xl shadow-lg">
        <BookOpen className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-semibold text-gray-900 tracking-tight">BookLend</span>
    </div>
  );
};
