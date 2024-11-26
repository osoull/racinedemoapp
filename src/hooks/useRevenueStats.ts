import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface RevenueStats {
  totalRevenue: number;
  monthlyGrowth: number;
}

export function useRevenueStats() {
  return useQuery({
    queryKey: ["revenue-stats"],
    queryFn: async () => {
      // Obtenir le mois actuel et le mois précédent
      const now = new Date();
      const currentMonth = now.toISOString().slice(0, 7);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
        .toISOString()
        .slice(0, 7);

      // Obtenir les revenus totaux
      const { data: currentMonthData, error: currentError } = await supabase
        .from("fee_tracking")
        .select("fee_amount")
        .gte("created_at", `${currentMonth}-01`)
        .lt("created_at", `${currentMonth}-31`);

      const { data: lastMonthData, error: lastError } = await supabase
        .from("fee_tracking")
        .select("fee_amount")
        .gte("created_at", `${lastMonth}-01`)
        .lt("created_at", `${lastMonth}-31`);

      if (currentError || lastError) throw new Error("Failed to fetch revenue data");

      const currentTotal = currentMonthData?.reduce((sum, fee) => sum + (fee.fee_amount || 0), 0) || 0;
      const lastTotal = lastMonthData?.reduce((sum, fee) => sum + (fee.fee_amount || 0), 0) || 0;

      // Calculer la croissance mensuelle
      const monthlyGrowth = lastTotal === 0 ? 0 : ((currentTotal - lastTotal) / lastTotal) * 100;

      return {
        totalRevenue: currentTotal,
        monthlyGrowth
      };
    }
  });
}