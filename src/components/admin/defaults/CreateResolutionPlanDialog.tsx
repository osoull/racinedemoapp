import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentDefault } from "@/types/payment-defaults";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/feeCalculations";

interface CreateResolutionPlanDialogProps {
  defaultCase: PaymentDefault;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateResolutionPlanDialog({
  defaultCase,
  open,
  onOpenChange,
}: CreateResolutionPlanDialogProps) {
  const { toast } = useToast();
  const [installments, setInstallments] = useState(3);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await supabase.auth.getUser();
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + installments);

      // Créer le plan de résolution
      const { data: plan, error: planError } = await supabase
        .from("payment_resolution_plans")
        .insert({
          default_id: defaultCase.id,
          proposed_by: user.data.user?.id,
          original_amount: defaultCase.total_amount_due,
          new_amount: defaultCase.total_amount_due,
          installments_count: installments,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        })
        .select()
        .single();

      if (planError) throw planError;

      // Créer les échéances
      const installmentAmount = defaultCase.total_amount_due / installments;
      const installmentPromises = Array.from({ length: installments }).map((_, i) => {
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + i + 1);
        
        return supabase.from("resolution_plan_installments").insert({
          plan_id: plan.id,
          due_date: dueDate.toISOString(),
          amount: installmentAmount,
        });
      });

      await Promise.all(installmentPromises);

      // Notifier l'emprunteur
      await supabase.from("notifications").insert({
        user_id: defaultCase.borrower_id,
        title: "خطة تسوية جديدة",
        message: `تم إنشاء خطة تسوية جديدة للمبلغ المتأخر ${formatCurrency(defaultCase.total_amount_due)} على ${installments} دفعات`,
      });

      toast({
        title: "تم إنشاء الخطة",
        description: "تم إنشاء خطة التسوية بنجاح",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء خطة التسوية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إنشاء خطة تسوية</DialogTitle>
          <DialogDescription>
            إنشاء خطة تسوية للمبلغ المتأخر {formatCurrency(defaultCase.total_amount_due)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="installments" className="text-right">
                عدد الأقساط
              </Label>
              <Input
                id="installments"
                type="number"
                className="col-span-3"
                value={installments}
                onChange={(e) => setInstallments(parseInt(e.target.value))}
                min={1}
                max={12}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">قيمة القسط</Label>
              <div className="col-span-3">
                {formatCurrency(defaultCase.total_amount_due / installments)}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "جاري الإنشاء..." : "إنشاء الخطة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}