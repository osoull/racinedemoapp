import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type FundingRequest = {
  id: string
  title: string
  description: string
  funding_goal: number
  status: string
  created_at: string
  owner: {
    first_name: string
    last_name: string
  }
}

export function FundingRequestList() {
  const { toast } = useToast()
  const [selectedRequest, setSelectedRequest] = useState<FundingRequest | null>(null)

  const { data: requests, isLoading } = useQuery({
    queryKey: ["funding-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funding_requests")
        .select(`
          *,
          owner:profiles(first_name, last_name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as FundingRequest[]
    },
  })

  const updateRequestStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("funding_requests")
      .update({ status })
      .eq("id", id)

    if (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الطلب",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "تم التحديث",
      description: "تم تحديث حالة الطلب بنجاح",
    })
  }

  const columns = [
    {
      accessorKey: "title",
      header: "عنوان المشروع",
    },
    {
      accessorKey: "owner",
      header: "مقدم الطلب",
      cell: ({ row }) => (
        <span>
          {row.original.owner.first_name} {row.original.owner.last_name}
        </span>
      ),
    },
    {
      accessorKey: "funding_goal",
      header: "المبلغ المطلوب",
      cell: ({ row }) => (
        <span>{row.original.funding_goal.toLocaleString()} ريال</span>
      ),
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            variant={
              status === "approved"
                ? "success"
                : status === "rejected"
                ? "destructive"
                : "default"
            }
          >
            {status === "submitted"
              ? "قيد المراجعة"
              : status === "approved"
              ? "تمت الموافقة"
              : status === "rejected"
              ? "مرفوض"
              : status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const request = row.original
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedRequest(request)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {request.status === "submitted" && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => updateRequestStatus(request.id, "approved")}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => updateRequestStatus(request.id, "rejected")}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">طلبات التمويل</h2>
        <p className="text-muted-foreground">
          إدارة ومراجعة طلبات التمويل المقدمة
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <DataTable columns={columns} data={requests || []} />
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>تفاصيل طلب التمويل</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">عنوان المشروع</h3>
                <p>{selectedRequest.title}</p>
              </div>
              <div>
                <h3 className="font-semibold">وصف المشروع</h3>
                <p>{selectedRequest.description}</p>
              </div>
              <div>
                <h3 className="font-semibold">المبلغ المطلوب</h3>
                <p>{selectedRequest.funding_goal.toLocaleString()} ريال</p>
              </div>
              <div>
                <h3 className="font-semibold">مقدم الطلب</h3>
                <p>
                  {selectedRequest.owner.first_name} {selectedRequest.owner.last_name}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}