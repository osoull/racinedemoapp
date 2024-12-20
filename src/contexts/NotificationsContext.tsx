import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

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
    {
      onUpdate: (payload) => {
        if (payload.new && typeof payload.new === 'object' && 'notification_id' in payload.new) {
          const newNotification = payload.new as Notification;
          setNotifications(prev =>
            prev.map(n =>
              n.notification_id === newNotification.notification_id ? newNotification : n
            )
          );
        }
      },
      onInsert: (payload) => {
        if (payload.new && typeof payload.new === 'object' && 'notification_id' in payload.new) {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast(newNotification.title, {
            description: newNotification.message,
          });
        }
      },
      onDelete: (payload) => {
        if (payload.old && typeof payload.old === 'object' && 'notification_id' in payload.old) {
          const oldNotification = payload.old as Notification;
          setNotifications(prev =>
            prev.filter(n => n.notification_id !== oldNotification.notification_id)
          );
        }
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