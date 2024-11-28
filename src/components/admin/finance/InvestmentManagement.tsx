import { useState } from "react"
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
import { DateRange } from "react-day-picker"
import { useInvestments } from "@/hooks/useInvestments"
import { filterInvestments } from "@/utils/investmentFilters"
import { Investment } from "@/types/investment"

export function InvestmentManagement() {
  const [search, setSearch] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedInvestor, setSelectedInvestor] = useState<string | null>(null)
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showRefundDialog, setShowRefundDialog] = useState(false)

  const { data: investments, isLoading } = useInvestments()

  const filteredInvestments = filterInvestments(investments, {
    search,
    status: selectedStatus,
    investor: selectedInvestor,
    opportunity: selectedOpportunity,
    dateRange
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
              investments={filteredInvestments}
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