import { useEffect, useState } from 'react';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type SubscriptionCallback = (payload: RealtimePostgresChangesPayload<any>) => void;

export const useRealtimeSubscription = (
  table: string,
  filters?: Record<string, any>,
  onUpdate?: SubscriptionCallback,
  onInsert?: SubscriptionCallback,
  onDelete?: SubscriptionCallback
) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    let subscription = supabase.channel(`public:${table}`);

    const config = {
      schema: 'public',
      table: table,
      ...(filters && { filter: filters }),
    };

    // Fix: Use the correct type for the channel event
    subscription = subscription.on(
      'postgres_changes' as 'INSERT' | 'UPDATE' | 'DELETE',
      config,
      (payload) => {
        try {
          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload);
              break;
            case 'UPDATE':
              onUpdate?.(payload);
              break;
            case 'DELETE':
              onDelete?.(payload);
              break;
          }
        } catch (error) {
          console.error('Error handling realtime update:', error);
          toast.error('Error handling realtime update');
        }
      }
    );

    subscription.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to ${table} changes`);
      }
    });

    setChannel(subscription);

    return () => {
      subscription.unsubscribe();
    };
  }, [table, JSON.stringify(filters), onUpdate, onInsert, onDelete]);

  return channel;
};