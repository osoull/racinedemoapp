import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { BorrowerDetailsDialog } from "./BorrowerDetailsDialog"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export function BorrowerManagement() {
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<string | null>(null)

  const { data: borrowers, isLoading } = useQuery({
    queryKey: ["borrowers"],
    queryFn: async () => {
      const { data: borrowers, error } = await supabase
        .from("profiles")
        .select(`
          *,
          borrower_kyc (
            company_registration_number,
            tax_identification_number,
            annual_revenue,
            number_of_employees,
            industry_sector,
            company_website,
            verification_status
          )
        `)
        .eq("user_type", "borrower")
        .order("created_at", { ascending: false })

      if (error) throw error
      return borrowers
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">إدارة المقترضين</h2>
        <p className="text-muted-foreground">
          إدارة ومراقبة المقترضين وطلباتهم
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">جميع المقترضين</TabsTrigger>
          <TabsTrigger value="active">النشطون</TabsTrigger>
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
                <div className="space-y-4">
                  {borrowers?.map((borrower) => (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>المقترضون النشطون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {borrowers?.filter(b => b.kyc_status === 'approved').map((borrower) => (
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
                      <Badge>معتمد</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>المقترضون قيد المراجعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {borrowers?.filter(b => b.kyc_status === 'pending').map((borrower) => (
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
                      <Badge variant="secondary">قيد المراجعة</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>المقترضون المرفوضون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {borrowers?.filter(b => b.kyc_status === 'rejected').map((borrower) => (
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
                      <Badge variant="destructive">مرفوض</Badge>
                    </div>
                  </div>
                ))}
              </div>
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