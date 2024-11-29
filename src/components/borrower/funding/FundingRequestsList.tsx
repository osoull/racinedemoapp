import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BorrowerDashboardLayout } from "../BorrowerDashboardLayout"
import { columns } from "./columns"

export function FundingRequestsList() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: requests, isLoading } = useQuery({
    queryKey: ["funding-requests", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funding_requests")
        .select("*")
        .eq("owner_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user?.id,
  })

  if (isLoading) {
    return (
      <BorrowerDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </BorrowerDashboardLayout>
    )
  }

  return (
    <BorrowerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">طلبات التمويل</h2>
          <p className="text-muted-foreground">
            إدارة ومتابعة طلبات التمويل الخاصة بك
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => navigate("/borrower/funding-requests/new")}>
            <Plus className="h-4 w-4 ml-2" />
            طلب تمويل جديد
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={requests || []} />
          </CardContent>
        </Card>
      </div>
    </BorrowerDashboardLayout>
  )
}