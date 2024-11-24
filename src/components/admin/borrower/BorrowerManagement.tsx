import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { UserList } from "../UserList";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/user";

export default function BorrowerManagement() {
  const { toast } = useToast();

  const { data: borrowers, isLoading } = useQuery({
    queryKey: ["borrowers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          borrower_kyc (
            company_registration_number,
            tax_identification_number,
            verification_status
          )
        `)
        .eq("user_type", "borrower");

      if (error) throw error;
      return data as User[];
    },
  });

  const handleDelete = async (user: User) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم حذف المستخدم بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المستخدم",
        variant: "destructive",
      });
    }
  };

  const handleUpdateType = async (userId: string, newType: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ user_type: newType })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم تحديث نوع المستخدم بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث نوع المستخدم",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (userId: string, updatedData: Partial<User>) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updatedData)
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم تحديث بيانات المستخدم بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث بيانات المستخدم",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة المقترضين</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full" dir="rtl">
          <TabsList className="mb-4">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="pending">في انتظار التحقق</TabsTrigger>
            <TabsTrigger value="verified">تم التحقق</TabsTrigger>
            <TabsTrigger value="rejected">مرفوض</TabsTrigger>
          </TabsList>

          <UserList
            users={borrowers}
            onDelete={handleDelete}
            onUpdateType={handleUpdateType}
            onEdit={handleEdit}
          />
        </Tabs>
      </CardContent>
    </Card>
  );
}