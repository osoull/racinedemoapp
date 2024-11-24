import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/UserAvatar";
import { BackButton } from "@/components/BackButton";
import { 
  Briefcase, 
  Wallet, 
  Users, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  LineChart
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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

  const StatCard = ({ icon: Icon, title, value, trend, trendValue }: any) => (
    <Card className="dashboard-stat-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-xl bg-primary-50 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {trend && (
            <Badge variant={trend === 'up' ? 'default' : 'destructive'} className="px-2 py-1">
              {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {trendValue}%
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );

  const ProjectCard = ({ project }: { project: any }) => (
    <Card className="dashboard-card">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{project.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {project.description || 'No description available'}
            </p>
          </div>
          <Badge variant={
            project.status === 'approved' ? 'default' :
            project.status === 'pending' ? 'secondary' :
            'destructive'
          }>
            {project.status}
          </Badge>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {Math.round((project.current_funding / project.funding_goal) * 100)}%
            </span>
          </div>
          <Progress 
            value={(project.current_funding / project.funding_goal) * 100} 
            className="h-2"
          />
          <div className="flex justify-between text-sm pt-2">
            <span className="text-muted-foreground">
              {project.current_funding?.toLocaleString()} SAR
            </span>
            <span className="font-medium">
              {project.funding_goal?.toLocaleString()} SAR
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ icon: Icon, title, time, description, color }: any) => (
    <div className="flex gap-4 items-start">
      <div className={`rounded-full p-2 ${color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{title}</p>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <BackButton />
            <h1 className="text-3xl font-bold text-primary mt-4">
              {profile?.first_name ? `مرحباً، ${profile.first_name}` : "مرحباً بك"}
            </h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('ar-SA', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <UserAvatar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Briefcase}
            title="المشاريع النشطة"
            value={projects?.length || 0}
            trend="up"
            trendValue={12}
          />
          <StatCard
            icon={Wallet}
            title="إجمالي التمويل"
            value="1.2M ريال"
            trend="up"
            trendValue={8}
          />
          <StatCard
            icon={Users}
            title="المستثمرون"
            value="245"
            trend="up"
            trendValue={15}
          />
          <StatCard
            icon={TrendingUp}
            title="معدل النمو"
            value="24%"
            trend="up"
            trendValue={5}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="dashboard-content-card">
              <CardHeader>
                <CardTitle>المشاريع النشطة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  {projects?.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="dashboard-content-card h-full">
              <CardHeader>
                <CardTitle>النشاط الأخير</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    <ActivityItem
                      icon={Wallet}
                      title="تمويل جديد"
                      time="منذ ساعتين"
                      description="تم استلام تمويل جديد بقيمة 50,000 ريال"
                      color="bg-primary"
                    />
                    <ActivityItem
                      icon={Activity}
                      title="تحديث المشروع"
                      time="منذ 4 ساعات"
                      description='تم تحديث حالة المشروع إلى "قيد التنفيذ"'
                      color="bg-secondary"
                    />
                    <ActivityItem
                      icon={LineChart}
                      title="تقرير أداء"
                      time="منذ 6 ساعات"
                      description="تم إصدار تقرير الأداء الشهري"
                      color="bg-accent"
                    />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;