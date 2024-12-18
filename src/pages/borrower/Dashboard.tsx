import { BorrowerDashboardLayout } from "@/components/borrower/BorrowerDashboardLayout"
import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview"
import { Card, CardContent } from "@/components/ui/card"
import { Handshake, Rocket } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function BorrowerDashboard() {
  const { user } = useAuth()
  const firstName = user?.user_metadata?.first_name || ""

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "صباح الخير"
    if (hour < 17) return "مساء الخير"
    return "مساء النور"
  }

  return (
    <BorrowerDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-lg">
          <p className="text-xl text-primary-800 font-medium">
            {getGreeting()}, {firstName}! 👋
          </p>
          <p className="text-muted-foreground mt-1">
            نتمنى لك يوماً موفقاً ومليئاً بالإنجازات
          </p>
        </div>

        <BorrowerDashboardOverview />
      </div>
    </BorrowerDashboardLayout>
  )
}