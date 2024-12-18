import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { FundingRequestForm } from "./FundingRequestForm"
import { Loader2 } from "lucide-react"
import type { FundingRequest } from "@/types/funding"

export function EditFundingRequest() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: request, isLoading } = useQuery({
    queryKey: ["funding-request", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funding_requests")
        .select(`
          *,
          documents:funding_request_documents(
            document_type,
            document_url
          )
        `)
        .eq("id", id)
        .single()

      if (error) throw error

      const formattedData: FundingRequest = {
        ...data,
        fund_usage_plan: typeof data.fund_usage_plan === 'object' 
          ? JSON.stringify(data.fund_usage_plan)
          : data.fund_usage_plan,
        documents: data.documents
      }

      return formattedData
    },
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!request) {
    return <div>طلب التمويل غير موجود</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">تعديل طلب التمويل</h2>
        <p className="text-muted-foreground">
          قم بتعديل بيانات طلب التمويل الخاص بك
        </p>
      </div>

      <FundingRequestForm
        initialData={request}
        onSuccess={() => navigate("/borrower/funding-requests")}
        onCancel={() => navigate("/borrower/funding-requests")}
      />
    </div>
  )
}