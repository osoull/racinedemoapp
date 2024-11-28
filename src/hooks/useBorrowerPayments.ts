import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface PaymentHistory {
  payment_id: string;
  payment_date: string;
  amount: number;
  status: string;
  payment_type: string;
  funding_request_id: string;
  funding_request_title: string;
}

export function useBorrowerPayments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["borrower-payments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_borrower_payment_history",
        { p_borrower_id: user?.id }
      );

      if (error) throw error;
      return data as PaymentHistory[];
    },
    enabled: !!user,
  });
}