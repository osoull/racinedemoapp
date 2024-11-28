import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { StatsGrid } from "./stats/StatsGrid"
import { FundingChart } from "./charts/FundingChart"
import { ActivityFeed } from "./activity/ActivityFeed"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export function DashboardOverview() {
  const { user } = useAuth()
  const { toast } = useToast()

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      try {
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

        if (!data) {
          toast({
            variant: "destructive",
            title: "خطأ في تحميل البيانات",
            description: "لم يتم العثور على الملف الشخصي"
          })
          throw new Error("Profile not found")
        }

        return data
      } catch (err) {
        console.error("Error fetching profile:", err)
        throw err
      }
    },
    enabled: !!user,
    retry: 2,
    staleTime: 30000,
  })

  // Afficher un état de chargement plus visible
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">جاري تحميل البيانات...</p>
      </div>
    )
  }

  // Afficher un message d'erreur plus détaillé
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive font-medium">حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-sm text-muted-foreground">
          يرجى تحديث الصفحة أو المحاولة مرة أخرى لاحقاً
        </p>
      </div>
    )
  }

  // Vérifier que le profil existe
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive font-medium">لم يتم العثور على الملف الشخصي</p>
        <p className="text-sm text-muted-foreground">
          يرجى تسجيل الخروج وإعادة تسجيل الدخول
        </p>
      </div>
    )
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