import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RevenueCardProps {
  title: string;
  amount: number;
  className?: string;
}

export function RevenueCard({ title, amount, className }: RevenueCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
      </CardContent>
    </Card>
  );
}