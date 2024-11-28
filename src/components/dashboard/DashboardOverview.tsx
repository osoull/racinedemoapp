import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { StatsGrid } from "./stats/StatsGrid"
import { FundingChart } from "./charts/FundingChart"
import { useAuth } from "@/hooks/useAuth"

export function DashboardOverview() {
  const { user } = useAuth()

  const { data: profile } = useQuery({
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
        <p className="text-muted-foreground">
          {profile?.user_type === "admin"
            ? "نظرة عامة على أداء المنصة"
            : profile?.user_type === "borrower"
            ? "نظرة عامة على طلبات التمويل"
            : "نظرة عامة على محفظتك الاستثمارية"}
        </p>
      </div>

      <StatsGrid />
      
      {profile?.user_type === "admin" && (
        <div className="grid gap-4">
          <FundingChart />
        </div>
      )}
    </div>
  )
}