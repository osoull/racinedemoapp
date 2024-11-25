import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { RiskRatingBadge } from "./RiskRatingBadge";

interface RiskRatingManagerProps {
  projectId: string;
  currentRating?: string | null;
  currentDescription?: string | null;
  onUpdate?: () => void;
  onClose: () => void;
}

export function RiskRatingManager({
  projectId,
  currentRating,
  currentDescription,
  onUpdate,
  onClose,
}: RiskRatingManagerProps) {
  const [rating, setRating] = useState<string>(currentRating || "");
  const [description, setDescription] = useState<string>(currentDescription || "");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("risk_rating, risk_description")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (project) {
      setRating(project.risk_rating || "");
      setDescription(project.risk_description || "");
    }
  }, [project]);

  useEffect(() => {
    const channel = supabase
      .channel('risk_rating_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`,
        },
        (payload) => {
          if (payload.new) {
            setRating(payload.new.risk_rating || "");
            setDescription(payload.new.risk_description || "");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  const updateRiskRating = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('update_risk_rating', {
        p_project_id: projectId,
        p_rating: rating,
        p_description: description,
        p_evaluator_id: null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم تحديث تقييم المخاطر",
        description: "تم تحديث تقييم المخاطر بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      if (onUpdate) onUpdate();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "خطأ في تحديث تقييم المخاطر",
        description: "حدث خطأ أثناء محاولة تحديث تقييم المخاطر",
        variant: "destructive",
      });
      console.error("Error updating risk rating:", error);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={rating} onValueChange={setRating}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="اختر تقييم المخاطر" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">منخفض</SelectItem>
            <SelectItem value="medium">متوسط</SelectItem>
            <SelectItem value="high">مرتفع</SelectItem>
          </SelectContent>
        </Select>
        {rating && <RiskRatingBadge rating={rating} />}
      </div>

      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="وصف المخاطر..."
        className="min-h-[100px]"
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          إلغاء
        </Button>
        <Button 
          onClick={() => updateRiskRating.mutate()}
          disabled={!rating || updateRiskRating.isPending}
        >
          {updateRiskRating.isPending ? "جاري التحديث..." : "تحديث تقييم المخاطر"}
        </Button>
      </div>
    </div>
  );
}