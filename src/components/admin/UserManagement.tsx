import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur.",
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
        title: "Type d'utilisateur mis à jour",
        description: "Le type d'utilisateur a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du type d'utilisateur.",
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
    <div className="container mx-auto p-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            <Users className="mr-2 h-4 w-4" />
            Tous
          </TabsTrigger>
          <TabsTrigger value="investor">
            <Users className="mr-2 h-4 w-4" />
            Investisseurs
          </TabsTrigger>
          <TabsTrigger value="investment_manager">
            <UserCog className="mr-2 h-4 w-4" />
            Managers
          </TabsTrigger>
          <TabsTrigger value="admin">
            <UserCog className="mr-2 h-4 w-4" />
            Administrateurs
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
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à cet utilisateur seront supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}