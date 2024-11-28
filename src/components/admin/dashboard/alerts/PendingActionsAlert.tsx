import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, FileText, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export function PendingActionsAlert() {
  const navigate = useNavigate()
  
  const { data: pendingActions } = useQuery({
    queryKey: ["pending-actions"],
    queryFn: async () => {
      const [{ count: pendingRequests }, { count: pendingPayments }, { count: pendingDocs }] = await Promise.all([
        supabase
          .from("funding_requests")
          .select("*", { count: 'exact', head: true })
          .eq("status", "submitted"),
        supabase
          .from("transactions")
          .select("*", { count: 'exact', head: true })
          .eq("status", "pending"),
        supabase
          .from("funding_request_documents")
          .select("*", { count: 'exact', head: true })
          .eq("document_type", "required")
          .is("document_url", null)
      ])

      return {
        pendingRequests: pendingRequests || 0,
        pendingPayments: pendingPayments || 0,
        pendingDocs: pendingDocs || 0
      }
    }
  })

  if (!pendingActions) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>الإجراءات المعلقة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingActions.pendingRequests > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>طلبات تمويل جديدة</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{pendingActions.pendingRequests} طلبات بانتظار المراجعة</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/admin/funding-requests")}
              >
                مراجعة
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {pendingActions.pendingPayments > 0 && (
          <Alert>
            <CreditCard className="h-4 w-4" />
            <AlertTitle>مدفوعات معلقة</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{pendingActions.pendingPayments} معاملات بانتظار التأكيد</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/admin/finance")}
              >
                مراجعة
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {pendingActions.pendingDocs > 0 && (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>وثائق ناقصة</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{pendingActions.pendingDocs} مشاريع تحتاج لوثائق إضافية</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/admin/documents")}
              >
                مراجعة
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}