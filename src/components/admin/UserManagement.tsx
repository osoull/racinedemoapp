import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

const UserManagement = () => {
  const [userType, setUserType] = useState<"investor" | "project_owner">("investor");
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
      return data;
    },
  });

  const deleteAllUsersMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("user_type", userType);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Succès",
        description: "Tous les utilisateurs ont été supprimés",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression des utilisateurs",
        variant: "destructive",
      });
      console.error("Error deleting users:", error);
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>إدارة المستخدمين</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              Supprimer tous les utilisateurs
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Elle supprimera définitivement tous les utilisateurs de type {userType === "investor" ? "investisseur" : "propriétaire de projet"}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteAllUsersMutation.mutate()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="investors" className="space-y-4">
          <TabsList>
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
          </TabsList>

          <TabsContent value="investors">
            {isLoading ? (
              <div>جاري التحميل...</div>
            ) : (
              <div className="space-y-4">
                {users?.map((user) => (
                  <UserCard key={user.id} user={user} />
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
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const UserCard = ({ user }: { user: any }) => {
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
        <div className="space-x-2">
          {/* Add action buttons here */}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;