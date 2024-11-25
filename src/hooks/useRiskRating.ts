import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useRiskRating = (projectId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`project_risk_rating_${projectId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'projects',
          filter: `id=eq.${projectId}`
        }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ["project", projectId] });
          queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient]);

  const { data: project, isLoading } = useQuery({
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

  const updateRiskRating = useMutation({
    mutationFn: async ({ rating, description }: { rating: string; description: string }) => {
      const { error } = await supabase
        .from("projects")
        .update({
          risk_rating: rating,
          risk_description: description,
          updated_at: new Date().toISOString()
        })
        .eq("id", projectId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم تحديث تقييم المخاطر بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
    onError: (error) => {
      toast({
        title: "خطأ في تحديث تقييم المخاطر",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    },
  });

  return {
    riskRating: project?.risk_rating || "",
    riskDescription: project?.risk_description || "",
    isLoading,
    updateRiskRating
  };
};