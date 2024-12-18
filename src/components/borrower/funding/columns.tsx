"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, PencilIcon, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "عنوان المشروع",
  },
  {
    accessorKey: "funding_goal",
    header: "المبلغ المطلوب",
    cell: ({ row }) => (
      <span>{row.original.funding_goal.toLocaleString()} ريال</span>
    ),
  },
  {
    accessorKey: "current_funding",
    header: "المبلغ المجمع",
    cell: ({ row }) => (
      <span>{(row.original.current_funding || 0).toLocaleString()} ريال</span>
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
          {status === "draft"
            ? "مسودة"
            : status === "submitted"
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
      const navigate = useNavigate()
      const { toast } = useToast()
      const request = row.original
      
      const handleDelete = async (id: string) => {
        try {
          const { error } = await supabase
            .from("funding_requests")
            .delete()
            .eq("id", id)
            .eq("status", "draft")

          if (error) throw error

          toast({
            title: "تم الحذف",
            description: "تم حذف المسودة بنجاح",
          })

          // Refresh the page to update the list
          window.location.reload()
        } catch (error) {
          toast({
            title: "خطأ",
            description: "حدث خطأ أثناء حذف المسودة",
            variant: "destructive",
          })
        }
      }
      
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/borrower/funding-requests/${request.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          {request.status === "draft" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/borrower/funding-requests/${request.id}/edit`)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(request.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </>
          )}
        </div>
      )
    },
  },
]