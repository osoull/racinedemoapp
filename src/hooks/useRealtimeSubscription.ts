import { useEffect } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type PostgresChangesFilter = {
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  schema?: string;
  table: string;
  filter?: string;
};

export const useRealtimeSubscription = (
  table: string,
  filter?: string,
  onUpdate?: (payload: any) => void,
  onInsert?: (payload: any) => void,
  onDelete?: (payload: any) => void
) => {
  useEffect(() => {
    let subscription: RealtimeChannel;

    const setupSubscription = async () => {
      subscription = supabase
        .channel("table-changes")
        .on("postgres_changes", 
          { event: "UPDATE", schema: "public", table, filter },
          onUpdate || (() => {})
        )
        .on("postgres_changes",
          { event: "INSERT", schema: "public", table, filter },
          onInsert || (() => {})
        )
        .on("postgres_changes",
          { event: "DELETE", schema: "public", table, filter },
          onDelete || (() => {})
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [table, filter, onUpdate, onInsert, onDelete]);
};