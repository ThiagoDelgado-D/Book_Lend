import React from 'react';
import { Book, Users, TrendingUp } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  gradient: string;
}

const StatItem = ({ icon, value, label, gradient }: StatItemProps) => (
  <div className="group">
    <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-border hover:border-border/70">
      <div
        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <div className="text-4xl font-light text-foreground mb-2">{value}</div>
      <div className="text-muted-foreground font-medium">{label}</div>
    </div>
  </div>
);

export const StatsSection = () => {
  const stats = [
    {
      icon: <Book className="w-8 h-8 text-white" />,
      value: '1,247',
      label: 'Libros disponibles',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      value: '342',
      label: 'Usuarios activos',
      gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      value: '89%',
      label: 'Satisfacción',
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-500',
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
            Nuestra biblioteca en números
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Descubre por qué somos la opción preferida para gestión de bibliotecas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              gradient={stat.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
