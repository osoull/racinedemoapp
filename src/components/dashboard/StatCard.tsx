import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
}

export function StatCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  trend,
  iconBgColor = "bg-primary-50",
  iconColor = "text-primary"
}: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className={`rounded-lg ${iconBgColor} p-3`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{trend.value}%</span>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold">{value}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}