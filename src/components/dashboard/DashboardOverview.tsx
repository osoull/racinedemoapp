import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { StatsGrid } from "./stats/StatsGrid"
import { FundingChart } from "./charts/FundingChart"
import { ActivityFeed } from "./activity/ActivityFeed"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardOverview() {
  const { user } = useAuth()

  const { data: profile, isLoading, error } = useQuery({
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
    retry: 1,
    staleTime: 30000,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-destructive">
        حدث خطأ أثناء تحميل البيانات
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
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
        <div className="text-right">
          <p className="text-sm text-muted-foreground">مرحباً بك</p>
          <p className="font-medium">{profile.first_name} {profile.last_name}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Main Content */}
      <div className="grid gap-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="activity">النشاط الحديث</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {profile.user_type === "admin" && (
              <div className="grid gap-4">
                <FundingChart />
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>النشاط الحديث</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityFeed />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}