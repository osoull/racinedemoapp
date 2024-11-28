"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, PencilIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

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
      const request = row.original
      
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/borrower/funding-requests/${request.id}/edit`)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    },
  },
]