import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { FundingRequestForm } from "./FundingRequestForm"
import { FundingRequest } from "@/types/funding"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function EditFundingRequest() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [fundingRequest, setFundingRequest] = useState<FundingRequest | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchFundingRequest = async () => {
      if (!id) return

      try {
        const { data, error } = await supabase
          .from("funding_requests")
          .select("*, funding_request_documents(*)")
          .eq("id", id)
          .single()

        if (error) throw error

        // Format the data to match FundingRequest type
        const formattedData: FundingRequest = {
          ...data,
          fund_usage_plan: data.fund_usage_plan ? JSON.stringify(data.fund_usage_plan) : "",
          documents: data.funding_request_documents
        }

        setFundingRequest(formattedData)
      } catch (error: any) {
        console.error("Error fetching funding request:", error)
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل بيانات الطلب",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFundingRequest()
  }, [id, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!fundingRequest) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-900">لم يتم العثور على الطلب</h2>
      </div>
    )
  }

  return <FundingRequestForm initialData={fundingRequest} />
}