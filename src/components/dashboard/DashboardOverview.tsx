import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { StatsGrid } from "./stats/StatsGrid"
import { FundingChart } from "./charts/FundingChart"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

export function DashboardOverview() {
  const { user } = useAuth()

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
        <p className="text-muted-foreground">
          {profile.user_type === "admin"
            ? "نظرة عامة على أداء المنصة"
            : profile.user_type === "borrower"
            ? "نظرة عامة على طلبات التمويل"
            : "نظرة عامة على محفظتك الاستثمارية"}
        </p>
      </div>

      <StatsGrid />
      
      {profile.user_type === "admin" && (
        <div className="grid gap-4">
          <FundingChart />
        </div>
      )}
    </div>
  )
}