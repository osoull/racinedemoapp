import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface RiskRatingManagerProps {
  projectId: string;
}

export function RiskRatingManager({ projectId }: RiskRatingManagerProps) {
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ['funding_requests', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funding_requests')
        .select(`
          *,
          risk_ratings:funding_request_status_history(
            new_status,
            notes
          )
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { mutate: updateRiskRating, isLoading: isUpdating } = useMutation({
    mutationFn: async ({ rating, description }: { rating: string; description: string }) => {
      const { error } = await supabase
        .from('funding_request_status_history')
        .insert({
          request_id: projectId,
          new_status: rating,
          notes: description,
          changed_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funding_requests', projectId] });
      toast({
        title: "تم تحديث تقييم المخاطر",
        description: "تم تحديث تقييم المخاطر بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث تقييم المخاطر",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const latestRiskRating = project?.risk_ratings?.[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>تقييم المخاطر</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">درجة المخاطر</label>
          <Select
            defaultValue={latestRiskRating?.new_status || "medium"}
            onValueChange={(value) =>
              updateRiskRating({
                rating: value,
                description: latestRiskRating?.notes || "",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر درجة المخاطر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">منخفضة</SelectItem>
              <SelectItem value="medium">متوسطة</SelectItem>
              <SelectItem value="high">عالية</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">وصف المخاطر</label>
          <Textarea
            defaultValue={latestRiskRating?.notes || ""}
            onChange={(e) =>
              updateRiskRating({
                rating: latestRiskRating?.new_status || "medium",
                description: e.target.value,
              })
            }
            placeholder="اكتب وصفاً للمخاطر المحتملة"
            className="min-h-[100px]"
          />
        </div>

        <Button disabled={isUpdating} className="w-full">
          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          حفظ التقييم
        </Button>
      </CardContent>
    </Card>
  );
}