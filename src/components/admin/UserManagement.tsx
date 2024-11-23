import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { Edit2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type UserType = "investor" | "project_owner" | "investment_manager" | "admin";
type Profile = Tables<"profiles">;

const UserManagement = () => {
  const [userType, setUserType] = useState<UserType>("investor");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", userType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          national_id,
          kyc_status,
          user_type,
          created_at
        `)
        .eq("user_type", userType);

      if (error) throw error;
      return data as Profile[];
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Succès",
        description: "L'utilisateur a été supprimé",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur",
        variant: "destructive",
      });
      console.error("Error deleting user:", error);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة المستخدمين</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="investors" className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-4">
            <TabsTrigger 
              value="investors" 
              onClick={() => setUserType("investor")}
            >
              المستثمرين
            </TabsTrigger>
            <TabsTrigger 
              value="project_owners"
              onClick={() => setUserType("project_owner")}
            >
              أصحاب المشاريع
            </TabsTrigger>
            <TabsTrigger 
              value="investment_managers"
              onClick={() => setUserType("investment_manager")}
            >
              مديري الاستثمار
            </TabsTrigger>
            <TabsTrigger 
              value="admins"
              onClick={() => setUserType("admin")}
            >
              المشرفين
            </TabsTrigger>
          </TabsList>

          <TabsContent value="investors">
            {isLoading ? (
              <div>جاري التحميل...</div>
            ) : (
              <div className="space-y-4">
                {users?.map((user) => (
                  <UserCard 
                    key={user.id} 
                    user={user} 
                    onDelete={() => deleteUserMutation.mutate(user.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="project_owners">
            {isLoading ? (
              <div>جاري التحميل...</div>
            ) : (
              <div className="space-y-4">
                {users?.map((user) => (
                  <UserCard 
                    key={user.id} 
                    user={user}
                    onDelete={() => deleteUserMutation.mutate(user.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="investment_managers">
            {isLoading ? (
              <div>جاري التحميل...</div>
            ) : (
              <div className="space-y-4">
                {users?.map((user) => (
                  <UserCard 
                    key={user.id} 
                    user={user}
                    onDelete={() => deleteUserMutation.mutate(user.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="admins">
            {isLoading ? (
              <div>جاري التحميل...</div>
            ) : (
              <div className="space-y-4">
                {users?.map((user) => (
                  <UserCard 
                    key={user.id} 
                    user={user}
                    onDelete={() => deleteUserMutation.mutate(user.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const UserCard = ({ user, onDelete }: { user: Profile; onDelete: () => void }) => {
  return (
    <Card>
      <CardContent className="flex justify-between items-center p-4">
        <div>
          <h3 className="font-semibold">{user.full_name}</h3>
          <p className="text-sm text-gray-500">
            رقم الهوية: {user.national_id}
          </p>
          <p className="text-sm text-gray-500">
            حالة KYC: {user.kyc_status}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Edit2 className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Elle supprimera définitivement cet utilisateur.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;