import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InvestmentDetailsDialog } from "./InvestmentDetailsDialog"
import { InvestmentsTable } from "./InvestmentsTable"
import { RefundDialog } from "./RefundDialog"
import { format } from "date-fns"
import { Download } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from 'xlsx'

export function InvestmentManagement() {
  const [search, setSearch] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedInvestor, setSelectedInvestor] = useState<string | null>(null)
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null)
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showRefundDialog, setShowRefundDialog] = useState(false)

  const { data: investments, isLoading } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          user:profiles(
            id,
            first_name,
            last_name
          ),
          investment:investment_opportunities(
            id,
            funding_request:funding_requests(
              title,
              description
            )
          ),
          stripe_payments(
            stripe_session_id,
            status
          ),
          bank_transactions(
            bank_status,
            reference_number
          )
        `)
        .eq("type", "investment")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    }
  })

  const filteredInvestments = investments?.filter(investment => {
    if (search) {
      const searchLower = search.toLowerCase()
      const investorName = `${investment.user.first_name} ${investment.user.last_name}`.toLowerCase()
      const opportunityTitle = investment.investment.funding_request.title.toLowerCase()
      
      if (!investorName.includes(searchLower) && 
          !opportunityTitle.includes(searchLower) && 
          !investment.id.toLowerCase().includes(searchLower)) {
        return false
      }
    }

    if (selectedStatus && investment.status !== selectedStatus) {
      return false
    }

    if (selectedInvestor && investment.user_id !== selectedInvestor) {
      return false
    }

    if (selectedOpportunity && investment.investment.id !== selectedOpportunity) {
      return false
    }

    if (dateRange) {
      const investmentDate = new Date(investment.created_at)
      if (investmentDate < dateRange.from || investmentDate > dateRange.to) {
        return false
      }
    }

    return true
  })

  const handleExportExcel = () => {
    if (!filteredInvestments?.length) {
      toast.error("لا توجد بيانات للتصدير")
      return
    }

    const data = filteredInvestments.map(inv => ({
      "المستثمر": `${inv.user.first_name} ${inv.user.last_name}`,
      "الفرصة": inv.investment.funding_request.title,
      "المبلغ": inv.amount,
      "الحالة": inv.status,
      "التاريخ": format(new Date(inv.created_at), "yyyy-MM-dd"),
      "طريقة الدفع": inv.stripe_payments ? "بطاقة بنكية" : "تحويل بنكي",
      "رقم المعاملة": inv.id
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Investments")
    XLSX.writeFile(wb, `investments-${format(new Date(), "yyyy-MM-dd")}.xlsx`)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">إدارة الاستثمارات</h2>
        <p className="text-muted-foreground">
          متابعة وإدارة استثمارات المنصة
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>الاستثمارات</CardTitle>
            <Button onClick={handleExportExcel}>
              <Download className="ml-2 h-4 w-4" />
              تصدير البيانات
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="بحث..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-right"
              />
              <Select value={selectedStatus || ""} onValueChange={setSelectedStatus}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent className="text-right">
                  <SelectItem value="">جميع الحالات</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="pending">قيد المعالجة</SelectItem>
                  <SelectItem value="failed">فشل</SelectItem>
                </SelectContent>
              </Select>
              <DatePickerWithRange 
                date={dateRange}
                setDate={setDateRange}
              />
            </div>

            <InvestmentsTable 
              investments={filteredInvestments || []}
              isLoading={isLoading}
              onViewDetails={(investment) => {
                setSelectedInvestment(investment)
                setShowDetailsDialog(true)
              }}
              onRefund={(investment) => {
                setSelectedInvestment(investment)
                setShowRefundDialog(true)
              }}
            />
          </div>
        </CardContent>
      </Card>

      {selectedInvestment && (
        <>
          <InvestmentDetailsDialog
            investment={selectedInvestment}
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
          />
          <RefundDialog
            investment={selectedInvestment}
            open={showRefundDialog}
            onOpenChange={setShowRefundDialog}
          />
        </>
      )}
    </div>
  )
}