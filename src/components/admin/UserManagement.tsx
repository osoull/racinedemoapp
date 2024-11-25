import { FC, useEffect } from 'react';
import { UserList } from './UserList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateUserDialog } from './CreateUserDialog';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/user";
import { Loader2 } from "lucide-react";

interface UserManagementProps {
  userType?: 'investor' | 'borrower';
}

const UserManagement: FC<UserManagementProps> = ({ userType }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mise à jour de la requête pour inclure toutes les informations nécessaires
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users', userType],
    queryFn: async () => {
      let query = supabase.from('profiles').select(`
        *,
        investor_kyc (*),
        borrower_kyc (*)
      `);
      
      // Filtrer par type d'utilisateur si spécifié
      if (userType) {
        query = query.eq('user_type', userType);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      return data as User[];
    },
  });

  // Configuration de la souscription en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['users'] });
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "مستخدم جديد",
              description: "تم إضافة مستخدم جديد إلى المنصة",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  const deleteUserMutation = useMutation({
    mutationFn: async (user: User) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "تم الحذف",
        description: "تم حذف المستخدم بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المستخدم",
        variant: "destructive",
      });
      console.error("Error deleting user:", error);
    }
  });

  const updateUserTypeMutation = useMutation({
    mutationFn: async ({ userId, newType }: { userId: string; newType: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: newType })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث نوع المستخدم بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث نوع المستخدم",
        variant: "destructive",
      });
      console.error("Error updating user type:", error);
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<User> }) => {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث معلومات المستخدم بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث معلومات المستخدم",
        variant: "destructive",
      });
      console.error("Error updating user:", error);
    }
  });

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          حدث خطأ أثناء تحميل المستخدمين
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>إدارة المستخدمين</CardTitle>
        <CreateUserDialog onUserCreated={() => queryClient.invalidateQueries({ queryKey: ['users'] })} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <UserList 
            users={users} 
            onDelete={(user) => {
              if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
                deleteUserMutation.mutate(user);
              }
            }}
            onUpdateType={(userId, newType) => updateUserTypeMutation.mutate({ userId, newType })}
            onEdit={(userId, updatedData) => updateUserMutation.mutate({ userId, data: updatedData })}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;