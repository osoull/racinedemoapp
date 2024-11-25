import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/feeCalculations";

interface ProjectFeeBreakdownProps {
  amount: number;
  fees: {
    admin: number;
    collection: number;
    total: number;
  };
}

export const ProjectFeeBreakdown = ({ amount, fees }: ProjectFeeBreakdownProps) => {
  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-semibold text-lg">تفاصيل المبالغ</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>المبلغ الأساسي:</span>
          <span>{formatCurrency(amount)}</span>
        </div>

        <div className="flex justify-between">
          <span>رسوم الإدارة:</span>
          <span>{formatCurrency(fees.admin)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>رسوم التحصيل:</span>
          <span>{formatCurrency(fees.collection)}</span>
        </div>
        
        <div className="flex justify-between font-semibold border-t pt-2">
          <span>المبلغ الإجمالي للرسوم:</span>
          <span>{formatCurrency(fees.total)}</span>
        </div>
      </div>
    </Card>
  );
};