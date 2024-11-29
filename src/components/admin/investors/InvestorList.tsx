import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Investor } from "@/types/investor"

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

export function InvestorList({ investors }: { investors: Investor[] }) {
  return (
    <div className="text-right" dir="rtl">
      <DataTable
        columns={columns}
        data={investors}
      />
    </div>
  )
}
