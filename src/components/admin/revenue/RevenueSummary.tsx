import { RevenueCard } from "./RevenueCard";

interface RevenueSummaryProps {
  totals: {
    admin_fees: number;
    collection_fees: number;
    basic_investor_fees: number;
    qualified_investor_fees: number;
    total_fees: number;
  };
}

export function RevenueSummary({ totals }: RevenueSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <RevenueCard title="رسوم الإدارة" amount={totals.admin_fees} />
      <RevenueCard title="رسوم التحصيل" amount={totals.collection_fees} />
      <RevenueCard title="رسوم المستثمرين الأساسيين" amount={totals.basic_investor_fees} />
      <RevenueCard title="رسوم المستثمرين المؤهلين" amount={totals.qualified_investor_fees} />
      <RevenueCard 
        title="إجمالي الإيرادات" 
        amount={totals.total_fees}
        className="md:col-span-2 lg:col-span-3"
      />
    </div>
  );
}