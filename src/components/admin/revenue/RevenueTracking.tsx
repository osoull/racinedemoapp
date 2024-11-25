import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, TrendingUp, TrendingDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(amount)
}

export function RevenueTracking() {
  const { data: revenueData, isLoading } = useQuery({
    queryKey: ['revenue-stats'],
    queryFn: async () => {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
          amount,
          type,
          status,
          created_at,
          user:profiles!transactions_user_id_fkey (
            user_type
          )
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

      if (error) throw error

      const calculateFees = (transactions: any[]) => {
        return transactions.reduce((acc, transaction) => {
          if (transaction.type !== 'investment') return acc
          
          const adminFee = transaction.amount * 0.02 // 2% admin fee
          const collectionFee = transaction.amount * 0.01 // 1% collection fee
          const investorFee = transaction.user?.user_type === 'qualified_investor' 
            ? transaction.amount * 0.015 // 1.5% for qualified investors
            : transaction.amount * 0.02 // 2% for basic investors
          
          return acc + adminFee + collectionFee + investorFee
        }, 0)
      }

      const now = new Date()
      const thisMonth = transactions?.filter(t => 
        new Date(t.created_at).getMonth() === now.getMonth() &&
        new Date(t.created_at).getFullYear() === now.getFullYear()
      )
      
      const lastMonth = transactions?.filter(t => {
        const date = new Date(t.created_at)
        const lastMonthDate = new Date()
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
        return date.getMonth() === lastMonthDate.getMonth() &&
               date.getFullYear() === lastMonthDate.getFullYear()
      })

      return {
        currentMonth: calculateFees(thisMonth || []),
        lastMonth: calculateFees(lastMonth || []),
        total: calculateFees(transactions || [])
      }
    }
  })

  if (isLoading) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  const monthlyGrowth = revenueData ? 
    ((revenueData.currentMonth - revenueData.lastMonth) / revenueData.lastMonth) * 100 : 0

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">تتبع الإيرادات</h2>
          <p className="text-muted-foreground">
            متابعة وتحليل إيرادات المنصة من العمولات والرسوم
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  إيرادات الشهر الحالي
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(revenueData?.currentMonth || 0)}
                </p>
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {monthlyGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{Math.abs(monthlyGrowth).toFixed(1)}%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                إيرادات الشهر الماضي
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(revenueData?.lastMonth || 0)}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                إجمالي الإيرادات
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(revenueData?.total || 0)}
              </p>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <Tabs defaultValue="monthly" className="space-y-4">
            <TabsList>
              <TabsTrigger value="monthly">تحليل شهري</TabsTrigger>
              <TabsTrigger value="yearly">تحليل سنوي</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly" className="space-y-4">
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  سيتم إضافة الرسم البياني قريباً
                </p>
              </div>
            </TabsContent>
            <TabsContent value="yearly" className="space-y-4">
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  سيتم إضافة الرسم البياني قريباً
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  )
}