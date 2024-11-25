import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm"
import { BorrowerSidebar } from "@/components/borrower/BorrowerSidebar"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export default function BorrowerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user?.id)
        .single()
      return data
    },
    enabled: !!user?.id
  })

  useEffect(() => {
    if (!user) {
      navigate("/auth")
    }
  }, [user, navigate])

  return (
    <DashboardLayout sidebar={<BorrowerSidebar />}>
      <div className="space-y-8">
        {profile?.first_name && (
          <div className="p-6 bg-card rounded-lg shadow-sm border">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg" 
                alt="شركة رسين للاستثمار"
                className="h-8 object-contain dark:hidden" 
              />
              <img 
                src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logoblnc.svg" 
                alt="شركة رسين للاستثمار"
                className="h-8 object-contain hidden dark:block" 
              />
              <h2 className="text-2xl font-bold text-foreground">
                مرحباً بك {profile.first_name}
              </h2>
            </div>
          </div>
        )}

        <div className="bg-card rounded-lg shadow-sm">
          <BorrowerKYCForm />
        </div>
      </div>
    </DashboardLayout>
  )
}