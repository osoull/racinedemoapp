import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { FundingRequestFormData } from "../types"
import { FundingRequest } from "@/types/funding"

export const useFundingRequestSubmit = (
  initialData?: FundingRequest,
  onSuccess?: () => void
) => {
  const { toast } = useToast()

  const handleSubmit = async (values: FundingRequestFormData, userId?: string) => {
    if (!userId) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول لإتمام العملية",
        variant: "destructive",
      })
      return
    }

    try {
      if (initialData) {
        // Update existing request
        const { error } = await supabase
          .from("funding_requests")
          .update({
            title: values.title,
            category: values.category,
            funding_goal: values.funding_goal,
            campaign_duration: values.campaign_duration,
            description: values.description,
            fund_usage_plan: values.fund_usage_plan,
            status: "draft",
            completion_steps: {
              basic_info: true,
              documents: !!values.business_plan && !!values.financial_statements,
              payment: false,
            },
          })
          .eq("id", initialData.id)
          .eq("owner_id", userId)

        if (error) throw error

        // Update documents if changed
        if (values.business_plan || values.financial_statements || values.additional_documents) {
          const documents = []
          if (values.business_plan && values.business_plan !== initialData.business_plan) {
            documents.push({
              request_id: initialData.id,
              document_type: "business_plan",
              document_url: values.business_plan,
            })
          }
          if (values.financial_statements && values.financial_statements !== initialData.financial_statements) {
            documents.push({
              request_id: initialData.id,
              document_type: "financial_statements",
              document_url: values.financial_statements,
            })
          }
          if (values.additional_documents && values.additional_documents !== initialData.additional_documents) {
            documents.push({
              request_id: initialData.id,
              document_type: "additional",
              document_url: values.additional_documents,
            })
          }

          if (documents.length > 0) {
            const { error: docsError } = await supabase
              .from("funding_request_documents")
              .upsert(documents, { onConflict: "request_id,document_type" })

            if (docsError) throw docsError
          }
        }
      } else {
        // Create new request
        const { data: request, error } = await supabase
          .from("funding_requests")
          .insert({
            owner_id: userId,
            title: values.title,
            category: values.category,
            funding_goal: values.funding_goal,
            campaign_duration: values.campaign_duration,
            description: values.description,
            fund_usage_plan: values.fund_usage_plan,
            status: "draft",
            completion_steps: {
              basic_info: true,
              documents: !!values.business_plan && !!values.financial_statements,
              payment: false,
            },
          })
          .select()
          .single()

        if (error) throw error

        if (values.business_plan || values.financial_statements || values.additional_documents) {
          const documents = []
          if (values.business_plan) {
            documents.push({
              request_id: request.id,
              document_type: "business_plan",
              document_url: values.business_plan,
            })
          }
          if (values.financial_statements) {
            documents.push({
              request_id: request.id,
              document_type: "financial_statements",
              document_url: values.financial_statements,
            })
          }
          if (values.additional_documents) {
            documents.push({
              request_id: request.id,
              document_type: "additional",
              document_url: values.additional_documents,
            })
          }

          const { error: docsError } = await supabase
            .from("funding_request_documents")
            .insert(documents)

          if (docsError) throw docsError
        }
      }

      toast({
        title: initialData ? "تم تحديث الطلب" : "تم حفظ الطلب",
        description: initialData ? "تم تحديث طلب التمويل بنجاح" : "تم حفظ طلب التمويل بنجاح",
      })

      onSuccess?.()
    } catch (error) {
      console.error("Error submitting funding request:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الطلب",
        variant: "destructive",
      })
    }
  }

  return { handleSubmit }
}