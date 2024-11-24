import { DashboardSidebar } from "@/components/dashboard/layout/DashboardSidebar"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { UserAvatar } from "@/components/UserAvatar"
import { useAuth } from "@/contexts/AuthContext"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      {/* Header */}
      <header className="fixed top-0 right-64 left-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">لوحة التحكم</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <UserAvatar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pr-64 pt-16">
        <DashboardOverview />
      </main>
    </div>
  )
}

export default Dashboard