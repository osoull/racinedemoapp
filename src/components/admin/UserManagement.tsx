import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { UserCard } from './UserCard';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, UserCog, Users } from 'lucide-react';

type User = {
  id: string;
  email: string;
  full_name: string | null;
  user_type: string | null;
  kyc_status: string | null;
};

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as User[];
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "تم حذف المستخدم",
        description: "تم حذف المستخدم بنجاح",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المستخدم",
        variant: "destructive",
      });
    },
  });

  const updateUserTypeMutation = useMutation({
    mutationFn: async ({ userId, userType }: { userId: string; userType: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: userType })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "تم تحديث نوع المستخدم",
        description: "تم تحديث نوع المستخدم بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث نوع المستخدم",
        variant: "destructive",
      });
    },
  });

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  const handleUpdateUserType = (userId: string, newType: string) => {
    updateUserTypeMutation.mutate({ userId, userType: newType });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const filterUsersByType = (type: string) => {
    return users?.filter(user => user.user_type === type) || [];
  };

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            <Users className="ml-2 h-4 w-4" />
            الكل
          </TabsTrigger>
          <TabsTrigger value="investor">
            <Users className="ml-2 h-4 w-4" />
            المستثمرون
          </TabsTrigger>
          <TabsTrigger value="investment_manager">
            <UserCog className="ml-2 h-4 w-4" />
            مدراء الاستثمار
          </TabsTrigger>
          <TabsTrigger value="admin">
            <UserCog className="ml-2 h-4 w-4" />
            المشرفون
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users?.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDelete={() => handleDeleteUser(user)}
                onUpdateType={handleUpdateUserType}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="investor" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterUsersByType('investor').map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDelete={() => handleDeleteUser(user)}
                onUpdateType={handleUpdateUserType}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="investment_manager" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterUsersByType('investment_manager').map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDelete={() => handleDeleteUser(user)}
                onUpdateType={handleUpdateUserType}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="admin" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterUsersByType('admin').map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDelete={() => handleDeleteUser(user)}
                onUpdateType={handleUpdateUserType}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المستخدم؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع البيانات المرتبطة بهذا المستخدم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>تأكيد</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}