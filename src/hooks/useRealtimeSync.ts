import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type TableConfig = {
  name: string;
  queryKey: string[];
};

const tables: TableConfig[] = [
  { name: "profiles", queryKey: ["profiles"] },
  { name: "projects", queryKey: ["projects"] },
  { name: "investments", queryKey: ["investments"] },
  { name: "transactions", queryKey: ["transactions"] },
  { name: "commissions", queryKey: ["commissions"] },
  { name: "notifications", queryKey: ["notifications"] },
  { name: "support_tickets", queryKey: ["support-tickets"] },
  { name: "risk_ratings", queryKey: ["risk-ratings"] },
  { name: "platform_statistics", queryKey: ["platform-statistics"] },
  { name: "platform_settings", queryKey: ["platform-settings"] },
  { name: "regulatory_reports", queryKey: ["regulatory-reports"] },
  { name: "kyc_documents", queryKey: ["kyc-documents"] },
  { name: "investor_kyc", queryKey: ["investor-kyc"] },
  { name: "borrower_kyc", queryKey: ["borrower-kyc"] },
];

export function useRealtimeSync() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    // Create a channel for all tables
    const channel = supabase.channel("db-changes");

    // Subscribe to changes for each table
    tables.forEach(({ name, queryKey }) => {
      channel
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: name,
          },
          (payload) => {
            // Invalidate the relevant query to trigger a refetch
            queryClient.invalidateQueries({ queryKey });

            // Show toast notification for important changes
            if (payload.eventType === "INSERT") {
              toast({
                title: "Nouvelle donnée",
                description: `Une nouvelle entrée a été ajoutée dans ${name}`,
              });
            } else if (payload.eventType === "DELETE") {
              toast({
                title: "Donnée supprimée",
                description: `Une entrée a été supprimée de ${name}`,
              });
            }
          }
        );
    });

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Connected to real-time changes");
      }
    });

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);
}