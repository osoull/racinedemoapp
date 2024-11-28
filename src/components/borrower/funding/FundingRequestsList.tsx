import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { DataTable } from "@/components/ui/data-table"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { columns } from "./columns"

export function FundingRequestsList() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: requests, isLoading } = useQuery({
    queryKey: ["funding-requests", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funding_requests")
        .select(`
          id,
          title,
          funding_goal,
          current_funding,
          status,
          created_at,
          submitted_at,
          approved_at
        `)
        .eq("owner_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">طلبات التمويل</h2>
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
  )
}