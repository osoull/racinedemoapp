import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/utils/feeCalculations";

export function DepositDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [amount, setAmount] = useState("");
  const [selectedRequest, setSelectedRequest] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: requests } = useQuery({
    queryKey: ["funding-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funding_requests")
        .select("*")
        .eq("status", "active");

      if (error) throw error;
      return data;
    },
  });

  const handleDeposit = async () => {
    if (!amount || !selectedRequest) {
      toast({
        title: "خطأ",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          amount: Number(amount),
          type: "investment",
          user_id: user?.id,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "تم إنشاء الطلب",
        description: "سيتم تحويلك إلى صفحة الدفع",
      });

      // Reset form
      setAmount("");
      setSelectedRequest("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء معالجة الطلب",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إيداع مبلغ</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">المشروع</label>
            <Select value={selectedRequest} onValueChange={setSelectedRequest}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المشروع" />
              </SelectTrigger>
              <SelectContent>
                {requests?.map((request) => (
                  <SelectItem key={request.id} value={request.id}>
                    {request.title} - {formatCurrency(request.funding_goal)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">المبلغ</label>
            <Input
              type="number"
              placeholder="أدخل المبلغ"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Button onClick={handleDeposit} className="w-full">
            إيداع
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}