import { BorrowerDashboardLayout } from "@/components/borrower/BorrowerDashboardLayout"
import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview"
import { Card, CardContent } from "@/components/ui/card"
import { Handshake } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function BorrowerDashboard() {
  const { user } = useAuth()
  const firstName = user?.user_metadata?.first_name || ""

  return (
    <BorrowerDashboardLayout>
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-none">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Handshake className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {firstName ? `مرحباً بك، ${firstName}` : 'مرحباً بك'}
              </h1>
              <p className="text-muted-foreground">
                مرحباً بك في لوحة التحكم الخاصة بك. هنا يمكنك إدارة طلبات التمويل والاطلاع على الإحصائيات
              </p>
            </div>
          </CardContent>
        </Card>
        <BorrowerDashboardOverview />
      </div>
    </BorrowerDashboardLayout>
  )
}