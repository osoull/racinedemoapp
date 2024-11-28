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
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {profile?.first_name ? `مرحباً بك ${profile.first_name}` : 'مرحباً بك'}
          </h2>
          <p className="text-muted-foreground">
            أكمل ملفك الشخصي للبدء في استخدام المنصة
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-sm">
          <BorrowerKYCForm />
        </div>
      </div>
    </DashboardLayout>
  )
}