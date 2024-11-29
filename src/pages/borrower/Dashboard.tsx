import { BorrowerDashboardLayout } from "@/components/borrower/BorrowerDashboardLayout"
import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview"
import { Card, CardContent } from "@/components/ui/card"
import { Handshake, Rocket } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function BorrowerDashboard() {
  const { user } = useAuth()
  const firstName = user?.user_metadata?.first_name || ""

  return (
    <BorrowerDashboardLayout>
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-none">
          <CardContent className="flex items-center gap-6 p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {firstName ? `أهلاً بك، ${firstName}` : 'أهلاً بك'}
              </h1>
              <p className="text-muted-foreground">
                نحن هنا لمساعدتك في تحقيق أهدافك التمويلية. استكشف الفرص المتاحة وابدأ رحلة نمو مشروعك معنا
              </p>
            </div>
          </CardContent>
        </Card>
        <BorrowerDashboardOverview />
      </div>
    </BorrowerDashboardLayout>
  )
}