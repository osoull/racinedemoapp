import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface BorrowerStats {
  total_requested: number;
  total_funded: number;
  active_requests: number;
  total_requests: number;
  pending_payments: number;
  success_rate: number;
  average_funding_time: string;
  total_fees_paid: number;
}

export function useBorrowerStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["borrower-stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "calculate_borrower_detailed_stats",
        { p_borrower_id: user?.id }
      );

      if (error) throw error;
      return data as BorrowerStats;
    },
    enabled: !!user,
  });
}