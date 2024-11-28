import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { BorrowerDetailsDialog } from "./BorrowerDetailsDialog"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function BorrowerManagement() {
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const { data: borrowers, isLoading } = useQuery({
    queryKey: ["borrowers", activeTab],
    queryFn: async () => {
      const status = activeTab === "all" ? null : activeTab
      const { data, error } = await supabase.rpc('get_borrowers_by_status', {
        status_filter: status
      })

      if (error) throw error
      return data
    }
  })

  const renderBorrowerList = (filteredBorrowers: typeof borrowers) => {
    if (!filteredBorrowers?.length) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          لا يوجد مقترضون في هذه الفئة
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {filteredBorrowers.map((borrower) => (
          <div 
            key={borrower.id} 
            className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
            onClick={() => setSelectedBorrowerId(borrower.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{borrower.company_name || `${borrower.first_name} ${borrower.last_name}`}</h3>
                <p className="text-sm text-muted-foreground">{borrower.email}</p>
              </div>
              <Badge variant={
                borrower.kyc_status === 'approved' ? 'default' :
                borrower.kyc_status === 'pending' ? 'secondary' : 'destructive'
              }>
                {borrower.kyc_status === 'approved' ? 'معتمد' :
                 borrower.kyc_status === 'pending' ? 'قيد المراجعة' : 'مرفوض'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">إدارة المقترضين</h2>
        <p className="text-muted-foreground">
          إدارة ومراقبة المقترضين وطلباتهم
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">جميع المقترضين</TabsTrigger>
          <TabsTrigger value="approved">النشطون</TabsTrigger>
          <TabsTrigger value="pending">قيد المراجعة</TabsTrigger>
          <TabsTrigger value="rejected">مرفوضون</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>جميع المقترضين</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                renderBorrowerList(borrowers)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>المقترضون النشطون</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                renderBorrowerList(borrowers)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>المقترضون قيد المراجعة</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                renderBorrowerList(borrowers)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>المقترضون المرفوضون</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                renderBorrowerList(borrowers)
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {borrowers?.map((borrower) => (
        <BorrowerDetailsDialog 
          key={borrower.id}
          borrowerId={borrower.id}
          open={selectedBorrowerId === borrower.id}
          onOpenChange={(open) => {
            if (!open) setSelectedBorrowerId(null)
          }}
        />
      ))}
    </div>
  )
}