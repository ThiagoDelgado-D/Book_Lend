import { clx } from '../../../utils/styles/clx';

interface NavigationItem {
  label: string;
  path: string;
}

interface NavigationProps {
  items: NavigationItem[];
  currentPath?: string;
}

export const Navigation = ({ items, currentPath }: NavigationProps) => {
  return (
    <nav className="hidden lg:flex items-center gap-2">
      {items.map(item => (
        <a
          key={item.path}
          href={item.path}
          className={clx(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50',
            currentPath === item.path
              ? 'text-emerald-700 bg-emerald-50 border border-emerald-100'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
};
