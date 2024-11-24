import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUserDialog } from "./CreateUserDialog";
import { UserList } from "./UserList";
import { User } from "@/types/user";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as User[];
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (user: User) => {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "نجاح",
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
    },
  });

  const updateUserTypeMutation = useMutation({
    mutationFn: async ({ userId, newType }: { userId: string; newType: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ user_type: newType })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "نجاح",
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
    },
  });

  const editUserMutation = useMutation({
    mutationFn: async ({
      userId,
      updatedData,
    }: {
      userId: string;
      updatedData: Partial<User>;
    }) => {
      const { error } = await supabase
        .from("profiles")
        .update(updatedData)
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث معلومات المستخدم",
        variant: "destructive",
      });
      console.error("Error updating user:", error);
    },
  });

  const handleUserCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="dashboard-content-card w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
        <CreateUserDialog onUserCreated={handleUserCreated} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="all">جميع المستخدمين</TabsTrigger>
          <TabsTrigger value="investor">المستثمرون</TabsTrigger>
          <TabsTrigger value="investment_manager">مدراء الاستثمار</TabsTrigger>
          <TabsTrigger value="admin">المشرفون</TabsTrigger>
        </TabsList>

        <UserList
          users={users}
          onDelete={(user) => deleteUserMutation.mutate(user)}
          onUpdateType={(userId, newType) =>
            updateUserTypeMutation.mutate({ userId, newType })
          }
          onEdit={(userId, updatedData) =>
            editUserMutation.mutate({ userId, updatedData })
          }
        />
      </Tabs>
    </div>
  );
}