import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ChartBar, 
  FileText, 
  MessageSquare, 
  Settings, 
  Shield,
  AlertCircle,
  ArrowUpRight
} from "lucide-react"
import { UserAvatar } from "@/components/UserAvatar"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { BackButton } from "@/components/BackButton"

const Dashboard = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: projects } = useQuery({
    queryKey: ["user-projects", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("owner_id", user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: investments } = useQuery({
    queryKey: ["user-investments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .eq("investor_id", user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        {/* Header Section */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {profile?.first_name ? `مرحباً بك, ${profile.first_name}` : "مرحباً بك"}
              </h1>
              <p className="text-gray-500">
                {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <UserAvatar />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary-50 rounded-lg">
                <ChartBar className="h-6 w-6 text-primary" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="font-semibold text-lg mb-1">المشاريع النشطة</h3>
            <p className="text-3xl font-bold text-primary">
              {projects?.length || 0}
            </p>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="font-semibold text-lg mb-1">الاستثمارات</h3>
            <p className="text-3xl font-bold text-purple-600">
              {investments?.length || 0}
            </p>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-xs font-medium bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                معلق
              </span>
            </div>
            <h3 className="font-semibold text-lg mb-1">حالة KYC</h3>
            <p className="text-lg font-medium text-gray-600">
              {profile?.kyc_status === 'approved' ? 'موثق' : 'قيد المراجعة'}
            </p>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary-50">
              <ChartBar className="h-4 w-4 mr-2" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="investments" className="data-[state=active]:bg-primary-50">
              <FileText className="h-4 w-4 mr-2" />
              مشاريعي
            </TabsTrigger>
            <TabsTrigger value="kyc" className="data-[state=active]:bg-primary-50">
              <Shield className="h-4 w-4 mr-2" />
              التحقق
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-primary-50">
              <MessageSquare className="h-4 w-4 mr-2" />
              الدعم
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary-50">
              <Settings className="h-4 w-4 mr-2" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">نظرة عامة على الحساب</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">نوع الحساب</p>
                    <p className="font-medium">{profile?.user_type === 'investor' ? 'مستثمر' : 'مالك مشروع'}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    تحديث
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">حالة التوثيق</p>
                    <p className="font-medium">{profile?.kyc_status === 'approved' ? 'موثق' : 'قيد المراجعة'}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    إكمال التوثيق
                  </Button>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">التوثيق بخطوتين</p>
                    <p className="font-medium">غير مفعل</p>
                  </div>
                  <Button variant="outline" size="sm">
                    تفعيل
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="investments">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">مشاريعي</h2>
                <Button>
                  إضافة مشروع جديد
                </Button>
              </div>
              {projects?.length ? (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-gray-500">{project.status}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        عرض التفاصيل
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">لا توجد مشاريع حالية</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="kyc">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">حالة التحقق</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <Shield className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">حالة التحقق</p>
                      <p className="text-sm text-gray-500">
                        {profile?.kyc_status === 'approved' ? 'موثق' : 'قيد المراجعة'}
                      </p>
                    </div>
                  </div>
                  <Button className="w-32">
                    رفع المستندات
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">الدعم الفني</h2>
              <div className="text-center space-y-4">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-gray-600 mb-4">هل تحتاج إلى مساعدة؟ فريق الدعم الفني متواجد على مدار الساعة</p>
                  <Button>
                    فتح تذكرة جديدة
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">إعدادات الحساب</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">التوثيق بخطوتين</p>
                    <p className="text-sm text-gray-500">تأمين إضافي لحسابك</p>
                  </div>
                  <Button variant="outline">
                    تفعيل
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">تغيير كلمة المرور</p>
                    <p className="text-sm text-gray-500">تحديث كلمة المرور الخاصة بك</p>
                  </div>
                  <Button variant="outline">
                    تغيير
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;