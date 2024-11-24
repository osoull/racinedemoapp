import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "@/components/dashboard/stats/StatCard";
import { ProjectCard } from "@/components/dashboard/projects/ProjectCard";
import { ActivityFeed } from "@/components/dashboard/activity/ActivityFeed";
import { UserAvatar } from "@/components/UserAvatar";
import { BackButton } from "@/components/BackButton";
import { Briefcase, Wallet, Users, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              {profile?.first_name ? `مرحباً بك, ${profile.first_name}` : "مرحباً بك"}
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Briefcase}
            title="المشاريع النشطة"
            value={projects?.length || 0}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            icon={Wallet}
            title="إجمالي التمويل"
            value="1.2M ريال"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            icon={Users}
            title="المستثمرون"
            value="245"
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            icon={TrendingUp}
            title="معدل النمو"
            value="24%"
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">المشاريع النشطة</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {projects?.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description || ''}
                  progress={(project.current_funding / project.funding_goal) * 100}
                  status={project.status}
                  fundingGoal={project.funding_goal}
                  currentFunding={project.current_funding || 0}
                />
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed
              activities={[
                {
                  id: '1',
                  type: 'تمويل جديد',
                  description: 'تم استلام تمويل جديد بقيمة 50,000 ريال',
                  date: 'منذ ساعتين'
                },
                {
                  id: '2',
                  type: 'تحديث المشروع',
                  description: 'تم تحديث حالة المشروع إلى "قيد التنفيذ"',
                  date: 'منذ 4 ساعات'
                },
                // Add more activities as needed
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
