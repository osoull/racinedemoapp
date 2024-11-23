import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChartBar, 
  FileText, 
  MessageSquare, 
  Settings, 
  Shield,
  User
} from "lucide-react";

const Dashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfile(profile);
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل الملف الشخصي",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-14">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <Button variant="outline" onClick={() => navigate("/profile")}>
          <User className="ml-2 h-4 w-4" />
          الملف الشخصي
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="investments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {profile.user_type === 'investor' ? 'استثماراتي' : 'مشاريعي'}
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
              <p className="text-gray-600">
                {profile.kyc_status === 'approved' ? 'حساب موثق' : 'في انتظار التحقق'}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">التوثيق بخطوتين</h3>
              <p className="text-gray-600">
                {profile.two_factor_enabled ? 'مفعل' : 'غير مفعل'}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">نوع الحساب</h3>
              <p className="text-gray-600">
                {profile.user_type === 'investor' ? 'مستثمر' : 'صاحب مشروع'}
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="investments">
          <Card className="p-6">
            {profile.user_type === 'investor' ? (
              <div>
                <h3 className="font-semibold mb-4">استثماراتي</h3>
                <p className="text-gray-600">لا توجد استثمارات حالية</p>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold mb-4">مشاريعي</h3>
                <p className="text-gray-600">لا توجد مشاريع حالية</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="kyc">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">حالة التحقق</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>حالة KYC:</span>
                <span className={`px-3 py-1 rounded-full ${
                  profile.kyc_status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {profile.kyc_status === 'approved' ? 'موثق' : 'قيد المراجعة'}
                </span>
              </div>
              {profile.kyc_status !== 'approved' && (
                <Button className="w-full">
                  رفع المستندات
                </Button>
              )}
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
                  {profile.two_factor_enabled ? 'تعطيل' : 'تفعيل'}
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