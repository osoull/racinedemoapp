import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle, XCircle } from "lucide-react"
import { KycStatusLabel } from "@/components/admin/KycStatusLabel"
import { KYCVerificationDialog } from "./KYCVerificationDialog"
import { useState } from "react"

interface KYCRequest {
  id: string
  first_name: string
  last_name: string
  email: string
  user_type: string
  kyc_status: string
  created_at: string
  kyc_documents: {
    id: string
    document_type: string
    document_url: string
    status: string
    verification_notes: string | null
  }[]
}

export function KYCVerificationList({ requests }: { requests: KYCRequest[] }) {
  const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(null)

  const columns: ColumnDef<KYCRequest>[] = [
    {
      accessorKey: "first_name",
      header: "الاسم الأول",
    },
    {
      accessorKey: "last_name",
      header: "اسم العائلة",
    },
    {
      accessorKey: "user_type",
      header: "نوع المستخدم",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.user_type === "borrower"
            ? "مقترض"
            : row.original.user_type === "basic_investor"
            ? "مستثمر أساسي"
            : "مستثمر مؤهل"}
        </Badge>
      ),
    },
    {
      accessorKey: "kyc_status",
      header: "الحالة",
      cell: ({ row }) => <KycStatusLabel status={row.original.kyc_status} />,
    },
    {
      accessorKey: "created_at",
      header: "تاريخ الطلب",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("ar-SA"),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedRequest(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={requests} />
      <KYCVerificationDialog
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      />
    </>
  )
}