import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserList } from "./users/UserList";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { AddUserDialog } from "./users/AddUserDialog";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

export function UserManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", activeTab],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (activeTab !== "all") {
        query = query.eq("user_type", activeTab);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Utilisation du hook useRealtimeSubscription pour les mises à jour en temps réel
  useRealtimeSubscription(
    "profiles",
    {
      onInsert: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast({
          title: "تم إضافة مستخدم جديد",
          description: "تم تحديث قائمة المستخدمين"
        });
      },
      onUpdate: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast({
          title: "تم تحديث بيانات المستخدم",
          description: "تم تحديث قائمة المستخدمين"
        });
      },
      onDelete: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast({
          title: "تم حذف المستخدم",
          description: "تم تحديث قائمة المستخدمين"
        });
      }
    }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة المستخدمين</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">جميع المستخدمين</TabsTrigger>
            <TabsTrigger value="basic_investor">المستثمرون الأساسيون</TabsTrigger>
            <TabsTrigger value="qualified_investor">المستثمرون المؤهلون</TabsTrigger>
            <TabsTrigger value="borrower">طالبو التمويل</TabsTrigger>
            <TabsTrigger value="investment_manager">مديرو الاستثمار</TabsTrigger>
            <TabsTrigger value="admin">المشرفون</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="flex justify-between items-center">
              <AddUserDialog />
            </div>
            <UserList users={users} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="basic_investor">
            <UserList 
              users={users?.filter(u => u.user_type === "basic_investor")} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="qualified_investor">
            <UserList 
              users={users?.filter(u => u.user_type === "qualified_investor")} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="borrower">
            <UserList 
              users={users?.filter(u => u.user_type === "borrower")} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="investment_manager">
            <UserList 
              users={users?.filter(u => u.user_type === "investment_manager")} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="admin">
            <UserList 
              users={users?.filter(u => u.user_type === "admin")} 
              isLoading={isLoading} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}