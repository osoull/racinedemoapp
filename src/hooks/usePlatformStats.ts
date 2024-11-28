import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const usePlatformStats = () => {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      // Get total fees from completed transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from("transactions")
        .select(`
          amount,
          type,
          user:profiles!transactions_user_id_fkey (
            user_type
          )
        `)
        .eq("status", "completed");

      if (transactionsError) throw transactionsError;

      // Get commission rates
      const { data: commissions, error: commissionsError } = await supabase
        .from("commissions")
        .select("*");

      if (commissionsError) throw commissionsError;

      // Calculate total fees
      const totalFees = transactions?.reduce((sum, transaction) => {
        if (transaction.type !== 'investment') return sum;

        const adminFee = commissions?.find(c => c.commission_type === 'admin_fee')?.rate || 0;
        const collectionFee = commissions?.find(c => c.commission_type === 'collection_fee')?.rate || 0;
        const investorFeeType = transaction.user?.user_type === 'qualified_investor' 
          ? 'qualified_investor_fee' 
          : 'basic_investor_fee';
        const investorFee = commissions?.find(c => c.commission_type === investorFeeType)?.rate || 0;

        const totalFeeRate = (adminFee + collectionFee + investorFee) / 100;
        return sum + (transaction.amount * totalFeeRate);
      }, 0) || 0;

      // Get number of unique investors
      const { data: investors, error: investorsError } = await supabase
        .from("profiles")
        .select("count")
        .eq("user_type", "investor")
        .single();

      if (investorsError) throw investorsError;

      return {
        totalInvestors: investors?.count || 0,
        transactionVolume: totalFees,
        totalFees
      };
    }
  });

  useEffect(() => {
    const transactionsChannel = supabase
      .channel('transactions_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' },
        () => refetch()
      )
      .subscribe();

    const profilesChannel = supabase
      .channel('profiles_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, [refetch]);

  return {
    stats,
    isLoading
  };
};