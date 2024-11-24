import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ icon: Icon, title, value, trend }: StatCardProps) {
  return (
    <Card className="p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span>{trend.value}%</span>
            <span className="text-xs">
              {trend.isPositive ? '↑' : '↓'}
            </span>
          </div>
        )}
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </Card>
  );
}