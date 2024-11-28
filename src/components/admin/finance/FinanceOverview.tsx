import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeesManagement } from "./FeesManagement"
import { FinancialReports } from "./FinancialReports"
import { InvestmentTracking } from "./InvestmentTracking"
import { BorrowerPayments } from "./BorrowerPayments"
import { FeesChart } from "./FeesChart"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function FinanceOverview() {
  const handleExportExcel = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
    XLSX.writeFile(wb, `${filename}.xlsx`)
  }

  const handleExportPDF = (data: any[], columns: string[], filename: string) => {
    const doc = new jsPDF()
    
    autoTable(doc, {
      head: [columns],
      body: data.map(item => columns.map(col => item[col])),
      styles: { font: "courier", fontSize: 8, halign: "right" },
      headStyles: { fillColor: [41, 128, 185] },
    })

    doc.save(`${filename}.pdf`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">الإدارة المالية</h2>
        <p className="text-muted-foreground">
          إدارة ومراقبة العمليات المالية للمنصة
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>رسوم المنصة</CardTitle>
          </CardHeader>
          <CardContent>
            <FeesChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>متابعة الاستثمارات الشهرية</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <InvestmentTracking showOnlyChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>تتبع المدفوعات الشهرية</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BorrowerPayments showOnlyChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>إدارة العمليات المالية</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fees" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="fees">إدارة الرسوم</TabsTrigger>
              <TabsTrigger value="reports">التقارير المالية</TabsTrigger>
              <TabsTrigger value="investments">متابعة الاستثمارات</TabsTrigger>
              <TabsTrigger value="payments">مدفوعات المقترضين</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fees">
              <div className="flex justify-end space-x-2 mb-4 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportPDF([], ['id', 'amount', 'fee_type', 'status'], 'fees-report')}
                >
                  <Download className="h-4 w-4 ml-2 rtl:mr-2" />
                  تصدير PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportExcel([], 'fees-report')}
                >
                  <Download className="h-4 w-4 ml-2 rtl:mr-2" />
                  تصدير Excel
                </Button>
              </div>
              <FeesManagement onExportData={(data) => {
                handleExportExcel(data, 'fees-report')
                handleExportPDF(data, ['id', 'amount', 'fee_type', 'status'], 'fees-report')
              }} />
            </TabsContent>
            
            <TabsContent value="reports">
              <div className="flex justify-end space-x-2 mb-4 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportPDF([], ['period', 'total_investments', 'total_fees'], 'financial-reports')}
                >
                  <Download className="h-4 w-4 ml-2 rtl:mr-2" />
                  تصدير PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportExcel([], 'financial-reports')}
                >
                  <Download className="h-4 w-4 ml-2 rtl:mr-2" />
                  تصدير Excel
                </Button>
              </div>
              <FinancialReports onExportData={(data) => {
                handleExportExcel(data, 'financial-reports')
                handleExportPDF(data, ['period', 'total_investments', 'total_fees'], 'financial-reports')
              }} />
            </TabsContent>
            
            <TabsContent value="investments">
              <div className="flex justify-end space-x-2 mb-4 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportPDF([], ['id', 'amount', 'status', 'created_at'], 'investments-report')}
                >
                  <Download className="h-4 w-4 ml-2 rtl:mr-2" />
                  تصدير PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportExcel([], 'investments-report')}
                >
                  <Download className="h-4 w-4 ml-2 rtl:mr-2" />
                  تصدير Excel
                </Button>
              </div>
              <InvestmentTracking onExportData={(data) => {
                handleExportExcel(data, 'investments-report')
                handleExportPDF(data, ['id', 'amount', 'status', 'created_at'], 'investments-report')
              }} />
            </TabsContent>
            
            <TabsContent value="payments">
              <div className="flex justify-end space-x-2 mb-4 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportPDF([], ['id', 'amount', 'status', 'created_at'], 'payments-report')}
                >
                  <Download className="h-4 w-4 ml-2 rtl:mr-2" />
                  تصدير PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportExcel([], 'payments-report')}
                >
                  <Download className="h-4 w-4 ml-2 rtl:mr-2" />
                  تصدير Excel
                </Button>
              </div>
              <BorrowerPayments onExportData={(data) => {
                handleExportExcel(data, 'payments-report')
                handleExportPDF(data, ['id', 'amount', 'status', 'created_at'], 'payments-report')
              }} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}