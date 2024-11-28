import { Badge } from "@/components/ui/badge"

interface KycStatusLabelProps {
  status: string
}

export function KycStatusLabel({ status }: KycStatusLabelProps) {
  return (
    <Badge
      variant={
        status === "approved"
          ? "default"
          : status === "pending"
          ? "secondary"
          : "destructive"
      }
    >
      {status === "approved"
        ? "معتمد"
        : status === "pending"
        ? "قيد المراجعة"
        : "مرفوض"}
    </Badge>
  )
}