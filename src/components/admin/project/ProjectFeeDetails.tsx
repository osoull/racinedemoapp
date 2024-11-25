import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/utils/feeCalculations";

interface ProjectFeeDetailsProps {
  amount: number;
}

export const ProjectFeeDetails = ({ amount }: ProjectFeeDetailsProps) => {
  const { data: commissions, isLoading } = useQuery({
    queryKey: ["commissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commissions")
        .select("*")
      
      if (error) throw error
      return data
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const adminFee = commissions?.find(c => c.commission_type === 'admin_fee')?.rate || 0;
  const collectionFee = commissions?.find(c => c.commission_type === 'collection_fee')?.rate || 0;

  const calculatedAdminFee = (amount * adminFee) / 100;
  const calculatedCollectionFee = (amount * collectionFee) / 100;
  const totalFees = calculatedAdminFee + calculatedCollectionFee;

  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-semibold text-lg">تفاصيل المبالغ</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>المبلغ الأساسي:</span>
          <span>{formatCurrency(amount)}</span>
        </div>

        <div className="flex justify-between">
          <span>رسوم الإدارة ({adminFee}%):</span>
          <span>{formatCurrency(calculatedAdminFee)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>رسوم التحصيل ({collectionFee}%):</span>
          <span>{formatCurrency(calculatedCollectionFee)}</span>
        </div>
        
        <div className="flex justify-between font-semibold border-t pt-2">
          <span>المبلغ الإجمالي للرسوم:</span>
          <span>{formatCurrency(totalFees)}</span>
        </div>
      </div>
    </Card>
  );
};