import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentDefault } from "@/types/payment-defaults";
import { formatCurrency } from "@/utils/feeCalculations";

interface DefaultsAnalyticsProps {
  defaults: PaymentDefault[];
}

export function DefaultsAnalytics({ defaults }: DefaultsAnalyticsProps) {
  const totalAmount = defaults.reduce((sum, d) => sum + d.total_amount_due, 0);
  const activeAmount = defaults
    .filter((d) => d.status === "active")
    .reduce((sum, d) => sum + d.total_amount_due, 0);
  const resolvedAmount = defaults
    .filter((d) => d.status === "resolved")
    .reduce((sum, d) => sum + d.total_amount_due, 0);

  const stats = [
    {
      title: "إجمالي المبالغ المتأخرة",
      value: formatCurrency(totalAmount),
      description: "المبلغ الإجمالي لجميع حالات التأخر عن السداد",
    },
    {
      title: "المبالغ المتأخرة النشطة",
      value: formatCurrency(activeAmount),
      description: "إجمالي المبالغ المتأخرة قيد المعالجة",
    },
    {
      title: "المبالغ المسواة",
      value: formatCurrency(resolvedAmount),
      description: "إجمالي المبالغ التي تمت تسويتها",
    },
    {
      title: "معدل التسوية",
      value: `${((resolvedAmount / (resolvedAmount + activeAmount)) * 100).toFixed(1)}%`,
      description: "نسبة المبالغ التي تمت تسويتها من إجمالي المتأخرات",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}