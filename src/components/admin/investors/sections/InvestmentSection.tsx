import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InvestmentsTable } from "../../finance/InvestmentsTable"
import { InvestmentDetailsDialog } from "../../finance/InvestmentDetailsDialog"
import { RefundDialog } from "../../finance/RefundDialog"
import { Filter, Search } from "lucide-react"
import { DateRange } from "react-day-picker"
import { useInvestments } from "@/hooks/useInvestments"
import { filterInvestments } from "@/utils/investmentFilters"
import { Investment } from "@/types/investment"

export function InvestmentSection() {
  const [search, setSearch] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const { data: investments, isLoading: isLoadingInvestments } = useInvestments()

  const filteredInvestments = filterInvestments(investments, {
    search,
    status: selectedStatus,
    dateRange
  })

  return (
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
    </Card>
  )
}