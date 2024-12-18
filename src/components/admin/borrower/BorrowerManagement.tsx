import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export function BorrowerManagement() {
  const { data: borrowers, isLoading } = useQuery({
    queryKey: ["borrowers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_type", "borrower")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary-800">المقترضين</h2>
        <p className="text-muted-foreground">
          إدارة وتتبع جميع المقترضين في المنصة
        </p>
      </div>

      <Tabs defaultValue="all" dir="rtl" className="w-full">
        <TabsList className="tabs-list grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="all" className="tab-trigger">جميع المقترضين</TabsTrigger>
          <TabsTrigger value="active" className="tab-trigger">موثوقون</TabsTrigger>
          <TabsTrigger value="review" className="tab-trigger">قيد المراجعة</TabsTrigger>
          <TabsTrigger value="blocked" className="tab-trigger">المحظورون</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div>جاري التحميل...</div>
          ) : (
            borrowers?.map((borrower) => (
              <Card key={borrower.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1 text-right">
                    <h3 className="text-lg font-semibold">{borrower.company_name}</h3>
                    <p className="text-sm text-muted-foreground">{borrower.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      borrower.kyc_status === 'approved' ? 'bg-green-100 text-green-800' :
                      borrower.kyc_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {borrower.kyc_status === 'approved' ? 'معتمد' :
                       borrower.kyc_status === 'pending' ? 'قيد المراجعة' :
                       'مرفوض'}
                    </span>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
                      معاينة
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="active">
          <div className="text-right">قائمة المقترضين الموثوقين</div>
        </TabsContent>

        <TabsContent value="review">
          <div className="text-right">قائمة المقترضين قيد المراجعة</div>
        </TabsContent>

        <TabsContent value="blocked">
          <div className="text-right">قائمة المقترضين المحظورين</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}