import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FundingRequest } from "@/types/funding";
import { useToast } from "@/components/ui/use-toast";

export function useFundingRequests(status?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["funding-requests", status],
    queryFn: async () => {
      let query = supabase
        .from("funding_requests")
        .select(`
          *,
          owner:profiles(first_name, last_name)
        `)
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as FundingRequest[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { error } = await supabase
        .from("funding_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funding-requests"] });
      toast({
        title: "تم تحديث الحالة",
        description: "تم تحديث حالة طلب التمويل بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الطلب",
        variant: "destructive",
      });
      console.error("Error updating request status:", error);
    },
  });

  return {
    requests,
    isLoading,
    updateStatus,
  };
}