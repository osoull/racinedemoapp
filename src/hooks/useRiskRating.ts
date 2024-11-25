import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useRiskRating = (projectId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('risk_ratings_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'risk_ratings',
          filter: `project_id=eq.${projectId}`
        }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ["risk-rating", projectId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient]);

  const { data: riskRating, isLoading } = useQuery({
    queryKey: ["risk-rating", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("risk_ratings")
        .select("*")
        .eq("project_id", projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateRiskRating = useMutation({
    mutationFn: async ({ rating, description }: { rating: string; description: string }) => {
      const { error } = await supabase
        .from("risk_ratings")
        .insert({
          project_id: projectId,
          rating,
          description,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم تحديث تقييم المخاطر بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["risk-rating", projectId] });
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
    riskRating,
    isLoading,
    updateRiskRating
  };
};