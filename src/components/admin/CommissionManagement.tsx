import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

type Commission = Tables<"commissions">;

const CommissionManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: commissions, isLoading } = useQuery({
    queryKey: ["commissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commissions")
        .select("*");

      if (error) throw error;
      return data as Commission[];
    },
  });

  // Set up realtime subscription for commission updates
  useRealtimeSubscription(
    "commissions",
    undefined,
    () => {
      queryClient.invalidateQueries({ queryKey: ["commissions"] });
    }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة العمولات</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>جاري التحميل...</div>
        ) : (
          <div className="space-y-4">
            {commissions?.map((commission) => (
              <CommissionCard 
                key={commission.commission_id} 
                commission={commission}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CommissionCard = ({ commission }: { commission: Commission }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [newRate, setNewRate] = useState(commission.rate.toString());

  const updateCommissionMutation = useMutation({
    mutationFn: async (newRate: number) => {
      const { error } = await supabase
        .from("commissions")
        .update({ rate: newRate })
        .eq("commission_id", commission.commission_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commissions"] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث معدل العمولة بنجاح",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث معدل العمولة",
        variant: "destructive",
      });
      console.error("Error updating commission rate:", error);
    },
  });

  const handleSave = () => {
    const rateNumber = parseFloat(newRate);
    if (isNaN(rateNumber) || rateNumber < 0 || rateNumber > 100) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال نسبة صحيحة بين 0 و 100",
        variant: "destructive",
      });
      return;
    }
    updateCommissionMutation.mutate(rateNumber);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">
              {commission.commission_type}
            </h3>
            {isEditing ? (
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="number"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  className="w-24"
                  min="0"
                  max="100"
                  step="0.01"
                />
                <span>%</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                النسبة: {commission.rate}%
              </p>
            )}
          </div>
          <div className="space-x-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setNewRate(commission.rate.toString());
                  }}
                  className="ml-2"
                >
                  إلغاء
                </Button>
                <Button onClick={handleSave}>
                  حفظ
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                تعديل
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionManagement;