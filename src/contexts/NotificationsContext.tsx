import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

type Notification = Tables<'notifications'>;

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('notification_id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n =>
          n.notification_id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useRealtimeSubscription(
    'notifications',
    undefined,
    (payload) => {
      // Handle updates
      if (payload.new && 'notification_id' in payload.new) {
        setNotifications(prev =>
          prev.map(n =>
            n.notification_id === payload.new.notification_id ? payload.new : n
          )
        );
      }
    },
    (payload) => {
      // Handle new notifications
      if (payload.new && 'notification_id' in payload.new) {
        setNotifications(prev => [payload.new, ...prev]);
        setUnreadCount(prev => prev + 1);
        toast(payload.new.title, {
          description: payload.new.message,
        });
      }
    },
    (payload) => {
      // Handle deletions
      if (payload.old && 'notification_id' in payload.old) {
        setNotifications(prev =>
          prev.filter(n => n.notification_id !== payload.old.notification_id)
        );
      }
    }
  );

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};