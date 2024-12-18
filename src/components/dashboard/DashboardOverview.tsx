import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { StatsGrid } from "./stats/StatsGrid"
import { FundingChart } from "./charts/FundingChart"
import { ActivityFeed } from "./activity/ActivityFeed"
import { useAuth } from "@/hooks/useAuth"
import { Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DashboardOverview() {
  const { user } = useAuth()
  const { toast } = useToast()

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single()

      if (error) {
        toast({
          variant: "destructive",
          title: "خطأ في تحميل البيانات",
          description: error.message
        })
        throw error
      }

      return data
    },
    enabled: !!user,
    retry: 1,
  })

  // Loading state
  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">جاري تحميل البيانات...</p>
      </div>
    )
  }

  // No profile state
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive font-medium">لم يتم العثور على الملف الشخصي</p>
        <p className="text-sm text-muted-foreground">
          يرجى تحديث الصفحة أو المحاولة مرة أخرى لاحقاً
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* KYC Alert for investors */}
      {(profile.user_type === 'basic_investor' || profile.user_type === 'qualified_investor') && 
       profile.kyc_status !== "approved" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-bold text-destructive">
            يرجى استكمال عملية التحقق من الهوية للاستفادة من جميع خدمات المنصة
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary-800">لوحة التحكم</h2>
        <p className="text-muted-foreground">
          {profile.user_type === "admin" 
            ? "نظرة عامة على أداء المنصة"
            : profile.user_type === "borrower"
            ? "نظرة عامة على طلبات التمويل"
            : "نظرة عامة على محفظتك الاستثمارية"}
        </p>
      </div>

      {/* Stats */}
      <StatsGrid />

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="activity">النشاط الحديث</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
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
  )
}