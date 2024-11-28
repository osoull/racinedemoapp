import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { PaymentDefault } from "@/types/payment-defaults";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/feeCalculations";
import { DefaultActionsCell } from "./DefaultActionsCell";

interface PaymentDefaultsListProps {
  defaults: PaymentDefault[];
}

const columns: ColumnDef<PaymentDefault>[] = [
  {
    accessorKey: "borrower",
    header: "المقترض",
    cell: ({ row }) => (
      <span>
        {row.original.borrower?.first_name} {row.original.borrower?.last_name}
      </span>
    ),
  },
  {
    accessorKey: "funding_request.title",
    header: "المشروع",
  },
  {
    accessorKey: "total_amount_due",
    header: "المبلغ المتأخر",
    cell: ({ row }) => formatCurrency(row.original.total_amount_due),
  },
  {
    accessorKey: "start_date",
    header: "تاريخ البداية",
    cell: ({ row }) => new Date(row.original.start_date).toLocaleDateString("ar-SA"),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={
            status === "active"
              ? "bg-red-500"
              : status === "resolved"
              ? "bg-green-500"
              : "bg-gray-500"
          }
        >
          {status === "active"
            ? "نشط"
            : status === "resolved"
            ? "تمت التسوية"
            : "مؤرشف"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DefaultActionsCell default={row.original} />,
  },
];

export function PaymentDefaultsList({ defaults }: PaymentDefaultsListProps) {
  return (
    <DataTable
      columns={columns}
      data={defaults}
    />
  );
}