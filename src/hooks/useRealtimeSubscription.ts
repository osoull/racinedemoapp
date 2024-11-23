import { useEffect } from "react"
import { RealtimeChannel } from "@supabase/supabase-js"
import { supabase } from "@/integrations/supabase/client"

type PostgresChangesFilter = {
  event: "INSERT" | "UPDATE" | "DELETE" | "*"
  schema?: string
  table: string
  filter?: string
}

type SubscriptionCallbacks = {
  onUpdate?: (payload: any) => void
  onInsert?: (payload: any) => void
  onDelete?: (payload: any) => void
}

export const useRealtimeSubscription = (
  tables: string | string[],
  callbacks: SubscriptionCallbacks,
  filter?: string
) => {
  useEffect(() => {
    let channel: RealtimeChannel

    const setupSubscription = async () => {
      const tableList = Array.isArray(tables) ? tables : [tables]
      
      channel = supabase.channel("table-changes")

      tableList.forEach(table => {
        if (callbacks.onUpdate) {
          channel = channel.on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table, filter },
            callbacks.onUpdate
          )
        }

        if (callbacks.onInsert) {
          channel = channel.on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table, filter },
            callbacks.onInsert
          )
        }

        if (callbacks.onDelete) {
          channel = channel.on(
            "postgres_changes",
            { event: "DELETE", schema: "public", table, filter },
            callbacks.onDelete
          )
        }
      })

      channel.subscribe()
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [tables, callbacks, filter])
}