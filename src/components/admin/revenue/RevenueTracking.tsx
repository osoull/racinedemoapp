import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { RevenueTable } from "./RevenueTable"
import { formatCurrency } from "@/utils/feeCalculations"

export function RevenueTracking() {
  const { data: feeData, isLoading } = useQuery({
    queryKey: ["revenue-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fee_tracking')
        .select(`
          *,
          transaction:transactions(
            created_at
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  const calculateTotals = () => {
    if (!feeData) return {
      admin: 0,
      collection: 0,
      basic_investor: 0,
      qualified_investor: 0,
      total: 0
    }

    return feeData.reduce((acc, fee) => {
      switch (fee.fee_type) {
        case 'admin_fee':
          acc.admin += fee.fee_amount
          break
        case 'collection_fee':
          acc.collection += fee.fee_amount
          break
        case 'basic_investor_fee':
          acc.basic_investor += fee.fee_amount
          break
        case 'qualified_investor_fee':
          acc.qualified_investor += fee.fee_amount
          break
      }
      acc.total += fee.fee_amount
      return acc
    }, {
      admin: 0,
      collection: 0,
      basic_investor: 0,
      qualified_investor: 0,
      total: 0
    })
  }

  const totals = calculateTotals()

  if (isLoading) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">تتبع الإيرادات</h2>
          <p className="text-muted-foreground">
            متابعة وتحليل إيرادات المنصة من العمولات والرسوم
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">إجمالي الإيرادات</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(totals.total)}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">عمولات الإدارة</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(totals.admin)}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">عمولات التحصيل</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(totals.collection)}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">عمولات المستثمرين</h3>
            <p className="text-2xl font-bold mt-2">
              {formatCurrency(totals.basic_investor + totals.qualified_investor)}
            </p>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">تفاصيل العمولات</h3>
          <RevenueTable revenueData={feeData || []} />
        </Card>
      </div>
    </DashboardLayout>
  )
}