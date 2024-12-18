import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { FundingRequestForm } from "./FundingRequestForm"
import { FundingRequest } from "@/types/funding"

export function EditFundingRequest() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()

  const { data: request, isLoading } = useQuery({
    queryKey: ["funding-request", id],
    queryFn: async () => {
      // Fetch the funding request
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
        .eq("owner_id", user?.id)
        .single()

      if (error) throw error

      // Convert fund_usage_plan to string regardless of its type
      const formattedData: FundingRequest = {
        ...data,
        fund_usage_plan: typeof data.fund_usage_plan === 'object' 
          ? JSON.stringify(data.fund_usage_plan)
          : String(data.fund_usage_plan), // Convert any primitive value to string
        business_plan: data.documents?.find(d => d.document_type === 'business_plan')?.document_url,
        financial_statements: data.documents?.find(d => d.document_type === 'financial_statements')?.document_url,
        additional_documents: data.documents?.find(d => d.document_type === 'additional')?.document_url,
      }
      
      return formattedData
    },
    enabled: !!id && !!user,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!request || request.status !== "draft") {
    navigate("/borrower/funding-requests")
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">تعديل طلب التمويل</h2>
        <p className="text-muted-foreground">
          قم بتعديل معلومات طلب التمويل
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