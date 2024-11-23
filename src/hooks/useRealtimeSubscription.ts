import { useEffect } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionConfig {
  schema?: string;
  table: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
}

export const useRealtimeSubscription = (
  config: SubscriptionConfig,
  callback: (payload: any) => void
) => {
  useEffect(() => {
    let subscription: RealtimeChannel;

    const setupSubscription = async () => {
      const { schema = "public", table, event = "*", filter } = config;

      subscription = supabase
        .channel("table-changes")
        .on(
          "postgres_changes" as const,
          {
            event,
            schema,
            table,
            filter,
          },
          callback
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [config, callback]);
};