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
        <div className="flex h-16 items-center justify-between px-8 border-b">
          <div className="flex items-center gap-2">
            <img 
              src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg" 
              alt="Raseen Logo" 
              className="h-8 object-contain dark:hidden" 
            />
            <img 
              src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logoblnc.svg" 
              alt="Raseen Logo" 
              className="h-8 object-contain hidden dark:block" 
            />
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
        <div className="p-8">
          <DashboardOverview />
        </div>
      </main>
    </div>
  )
}

export default Dashboard