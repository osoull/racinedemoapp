import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChartBar, 
  FileText, 
  MessageSquare, 
  Settings, 
  Shield,
} from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="container mx-auto px-4 py-8 mt-14">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground mt-1">
            {profile?.full_name ? `مرحباً بك, ${profile.full_name}` : "مرحباً بك"}
          </p>
        </div>
        <UserAvatar />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="investments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            مشاريعي
          </TabsTrigger>
          <TabsTrigger value="kyc" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            التحقق
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            الدعم
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            الإعدادات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">الحالة</h3>
              <p className="text-gray-600">غير موثق</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">التوثيق بخطوتين</h3>
              <p className="text-gray-600">غير مفعل</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">نوع الحساب</h3>
              <p className="text-gray-600">مستخدم</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="investments">
          <Card className="p-6">
            <div>
              <h3 className="font-semibold mb-4">مشاريعي</h3>
              <p className="text-gray-600">لا توجد مشاريع حالية</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="kyc">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">حالة التحقق</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>حالة التحقق:</span>
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  غير موثق
                </span>
              </div>
              <Button className="w-full">
                رفع المستندات
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">الدعم الفني</h3>
            <Button className="w-full">
              فتح تذكرة جديدة
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">إعدادات الحساب</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>التوثيق بخطوتين</span>
                <Button variant="outline">
                  تفعيل
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>تغيير كلمة المرور</span>
                <Button variant="outline">
                  تغيير
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;