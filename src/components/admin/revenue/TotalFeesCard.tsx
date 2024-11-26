import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/utils/feeCalculations";

export function TotalFeesCard() {
  const { data: totalFees, isLoading } = useQuery({
    queryKey: ["total-fees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fee_tracking')
        .select('fee_type, fee_amount');

      if (error) throw error;

      return data.reduce((acc: any, fee) => {
        acc.total += fee.fee_amount;
        
        switch (fee.fee_type) {
          case 'admin_fee':
            acc.admin += fee.fee_amount;
            break;
          case 'collection_fee':
            acc.collection += fee.fee_amount;
            break;
          case 'basic_investor_fee':
            acc.basic_investor += fee.fee_amount;
            break;
          case 'qualified_investor_fee':
            acc.qualified_investor += fee.fee_amount;
            break;
        }
        
        return acc;
      }, {
        admin: 0,
        collection: 0,
        basic_investor: 0,
        qualified_investor: 0,
        total: 0
      });
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">إجمالي الإيرادات</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalFees?.total || 0)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">عمولات الإدارة</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalFees?.admin || 0)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">عمولات التحصيل</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalFees?.collection || 0)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">عمولات المستثمر الأساسي</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalFees?.basic_investor || 0)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">عمولات المستثمر المؤهل</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalFees?.qualified_investor || 0)}</p>
        </div>
      </div>
    </Card>
  );
}