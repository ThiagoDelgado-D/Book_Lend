import React from 'react';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  change: string;
  changeType: 'positive' | 'negative';
  color: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType,
  color,
}: StatCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center gap-1">
          <TrendingUp
            className={`h-3 w-3 ${changeType === 'positive' ? 'text-emerald-500' : 'text-red-500'}`}
          />
          <span
            className={`text-xs font-medium ${changeType === 'positive' ? 'text-emerald-500' : 'text-red-500'}`}
          >
            {change}
          </span>
          <span className="text-xs text-gray-500">vs mes anterior</span>
        </div>
      </div>
      <div className={`p-3 rounded-xl bg-gray-50 ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);
