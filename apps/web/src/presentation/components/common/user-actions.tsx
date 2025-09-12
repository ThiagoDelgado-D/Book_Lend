import { Bell, Settings, User } from 'lucide-react';

export const UserActions = () => {
  return (
    <div className="flex items-center gap-3">
      <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          3
        </span>
      </button>

      <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
        <Settings className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-3 ml-3 pl-3 border-l border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center shadow-sm">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900">Juan Pérez</p>
          <p className="text-xs text-gray-500">Administrador</p>
        </div>
      </div>
    </div>
  );
};
