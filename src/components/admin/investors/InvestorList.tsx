import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

interface Investor {
  id: string
  first_name: string
  last_name: string
  email: string
  kyc_status: string
  user_type: string
  created_at: string
  investor_kyc?: {
    verification_status: string
  }[]
}

const columns: ColumnDef<Investor>[] = [
  {
    accessorKey: "first_name",
    header: "الاسم الأول",
  },
  {
    accessorKey: "last_name",
    header: "اسم العائلة",
  },
  {
    accessorKey: "email",
    header: "البريد الإلكتروني",
  },
  {
    accessorKey: "user_type",
    header: "نوع المستثمر",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.user_type === "basic_investor"
          ? "مستثمر أساسي"
          : "مستثمر مؤهل"}
      </Badge>
    ),
  },
  {
    accessorKey: "kyc_status",
    header: "حالة KYC",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.kyc_status === "approved"
            ? "default"
            : row.original.kyc_status === "pending"
            ? "secondary"
            : "destructive"
        }
      >
        {row.original.kyc_status === "approved"
          ? "معتمد"
          : row.original.kyc_status === "pending"
          ? "قيد المراجعة"
          : "مرفوض"}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "تاريخ التسجيل",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("ar-SA"),
  },
]

interface InvestorListProps {
  investors: Investor[]
}

export function InvestorList({ investors }: InvestorListProps) {
  return (
    <DataTable
      columns={columns}
      data={investors}
    />
  )
}