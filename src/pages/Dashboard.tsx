import { DashboardSidebar } from "@/components/dashboard/layout/DashboardSidebar"
import { StatsGrid } from "@/components/dashboard/stats/StatsGrid"
import { FundingChart } from "@/components/dashboard/charts/FundingChart"
import { ActivityFeed } from "@/components/dashboard/activity/ActivityFeed"
import { UserAvatar } from "@/components/UserAvatar"
import { useAuth } from "@/contexts/AuthContext"

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="pr-64 pl-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {`مرحباً، ${user?.user_metadata?.first_name || 'مستخدم'}`}
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
          <StatsGrid />

          {/* Charts and Activity */}
          <div className="grid lg:grid-cols-3 gap-8">
            <FundingChart />
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard