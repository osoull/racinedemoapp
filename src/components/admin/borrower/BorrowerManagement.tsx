import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/user";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

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

          <div className="mt-4">
            {borrowers && borrowers.length > 0 ? (
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-right">الاسم</th>
                      <th className="p-2 text-right">البريد الإلكتروني</th>
                      <th className="p-2 text-right">حالة التحقق</th>
                      <th className="p-2 text-right">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowers.map((borrower) => (
                      <tr key={borrower.id} className="border-b">
                        <td className="p-2">
                          {borrower.first_name} {borrower.last_name}
                        </td>
                        <td className="p-2">{borrower.email}</td>
                        <td className="p-2">{borrower.kyc_status}</td>
                        <td className="p-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(borrower)}
                          >
                            حذف
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">لا يوجد مقترضين</p>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}