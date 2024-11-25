import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface RiskRatingManagerProps {
  projectId: string;
  onClose?: () => void;
}

export const RiskRatingManager = ({ projectId, onClose }: RiskRatingManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [description, setDescription] = useState("");
  const [selectedRating, setSelectedRating] = useState<string>("");

  const { data: riskRating, isLoading } = useQuery({
    queryKey: ["risk-rating", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("risk_ratings")
        .select("*")
        .eq("project_id", projectId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateRiskRating = useMutation({
    mutationFn: async () => {
      if (!selectedRating) throw new Error("يجب اختيار تصنيف المخاطر");

      const { error } = await supabase
        .from("risk_ratings")
        .upsert({
          project_id: projectId,
          rating: selectedRating,
          description,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم تحديث تصنيف المخاطر بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["risk-rating", projectId] });
      if (onClose) {
        onClose();
      }
    },
    onError: (error) => {
      toast({
        title: "خطأ في تحديث تصنيف المخاطر",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>تقييم المخاطر</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">تصنيف المخاطر</label>
          <Select
            value={selectedRating || riskRating?.rating || ""}
            onValueChange={setSelectedRating}
          >
            <SelectTrigger className="w-full text-right">
              <SelectValue placeholder="اختر تصنيف المخاطر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A - مخاطر منخفضة</SelectItem>
              <SelectItem value="B">B - مخاطر متوسطة</SelectItem>
              <SelectItem value="C">C - مخاطر عالية</SelectItem>
              <SelectItem value="D">D - مخاطر مرتفعة جداً</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">تفاصيل التقييم</label>
          <Textarea
            value={description || riskRating?.description || ""}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="أدخل تفاصيل تقييم المخاطر"
            className="text-right"
          />
        </div>

        <Button 
          onClick={() => updateRiskRating.mutate()}
          disabled={updateRiskRating.isPending}
          className="w-full"
        >
          {updateRiskRating.isPending ? "جاري الحفظ..." : "حفظ التقييم"}
        </Button>
      </CardContent>
    </Card>
  );
};