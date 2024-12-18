import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useFundingRequests } from "@/hooks/useFundingRequests"
import { useAuth } from "@/hooks/useAuth"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"

export function FundingRequestsList() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: requests, isLoading, error } = useFundingRequests(user?.id)

  useEffect(() => {
    if (error) {
      console.error("Error fetching funding requests:", error)
    }
  }, [error])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">طلبات التمويل</h2>
          <p className="text-muted-foreground">
            إدارة ومتابعة طلبات التمويل الخاصة بك
          </p>
        </div>
        <Button onClick={() => navigate("new")}>
          <Plus className="ml-2 h-4 w-4" />
          طلب جديد
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={requests || []}
        isLoading={isLoading}
      />
    </div>
  )
}