import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvestorList } from "./InvestorList"
import { InvestmentsTable } from "../finance/InvestmentsTable"
import { InvestmentDetailsDialog } from "../finance/InvestmentDetailsDialog"
import { RefundDialog } from "../finance/RefundDialog"
import { Download, Filter, Search, Users, Wallet } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from 'xlsx'
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useInvestments } from "@/hooks/useInvestments"
import { filterInvestments } from "@/utils/investmentFilters"
import { Investment } from "@/types/investment"

export function InvestorManagement() {
  const [search, setSearch] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedInvestor, setSelectedInvestor] = useState<string | null>(null)
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const { data: investors, isLoading: isLoadingInvestors } = useQuery({
    queryKey: ["investors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          investor_kyc (*)
        `)
        .in("user_type", ["basic_investor", "qualified_investor"])

      if (error) throw error
      return data
    }
  })

  const { data: investments, isLoading: isLoadingInvestments } = useInvestments()

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
      "الفرصة": inv.funding_request.title,
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">إدارة المستثمرين والاستثمارات</h2>
          <p className="text-muted-foreground">
            إدارة وتتبع المستثمرين واستثماراتهم في المنصة
          </p>
        </div>
        <Button onClick={handleExportExcel}>
          <Download className="ml-2 h-4 w-4" />
          تصدير البيانات
        </Button>
      </div>

      <Tabs defaultValue="investors" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="investors">
            <Users className="h-4 w-4 ml-2" />
            المستثمرون
          </TabsTrigger>
          <TabsTrigger value="investments">
            <Wallet className="h-4 w-4 ml-2" />
            الاستثمارات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="investors">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>المستثمرون</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="بحث..."
                  className="w-[300px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingInvestors ? (
                <div className="flex items-center justify-center h-96">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : (
                <InvestorList investors={investors || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>الاستثمارات</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 ml-2" />
                  الفلترة
                </Button>
                <Input
                  placeholder="بحث..."
                  className="w-[300px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
            </CardHeader>
            <CardContent>
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Select value={selectedStatus || ""} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
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
              )}

              <InvestmentsTable 
                investments={filteredInvestments || []}
                isLoading={isLoadingInvestments}
                onViewDetails={(investment) => {
                  setSelectedInvestment(investment)
                  setShowDetailsDialog(true)
                }}
                onRefund={(investment) => {
                  setSelectedInvestment(investment)
                  setShowRefundDialog(true)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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