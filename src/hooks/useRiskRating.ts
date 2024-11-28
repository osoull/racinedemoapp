import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRiskRating(requestId: string) {
  const queryClient = useQueryClient();

  const { data: riskRating, isLoading } = useQuery({
    queryKey: ["funding-request-risk", requestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funding_requests")
        .select(`
          risk_rating,
          risk_description
        `)
        .eq("id", requestId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateRiskRating = useMutation({
    mutationFn: async ({
      rating,
      description,
    }: {
      rating: string;
      description: string;
    }) => {
      const { error } = await supabase
        .from("funding_requests")
        .update({
          risk_rating: rating,
          risk_description: description,
        })
        .eq("id", requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funding-request-risk"] });
    },
  });

  return {
    riskRating: riskRating?.risk_rating,
    riskDescription: riskRating?.risk_description,
    isLoading,
    updateRiskRating,
  };
}