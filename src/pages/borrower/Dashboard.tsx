import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm"
import { BorrowerSidebar } from "@/components/borrower/BorrowerSidebar"

export default function BorrowerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/auth")
    }
  }, [user, navigate])

  return (
    <DashboardLayout sidebar={<BorrowerSidebar />}>
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-8">
          <img 
            src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg" 
            alt="رسين"
            className="h-8 object-contain dark:hidden" 
          />
          <img 
            src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logoblnc.svg" 
            alt="رسين"
            className="h-8 object-contain hidden dark:block" 
          />
          <h1 className="text-2xl font-bold text-foreground">لوحة تحكم المقترض</h1>
        </div>
        <div className="bg-card rounded-lg shadow-sm">
          <BorrowerKYCForm />
        </div>
      </div>
    </DashboardLayout>
  )
}