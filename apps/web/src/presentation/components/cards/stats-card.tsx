interface StatsCardProps {
  value: string | number;
  label: string;
}

export const StatsCard = ({ value, label }: StatsCardProps) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <p className="text-3xl font-bold">{value}</p>
    <p className="text-gray-600">{label}</p>
  </div>
);
