import { Badge } from "@/components/ui/badge"

interface TransactionStatusBadgeProps {
  status: string | null
}

export const TransactionStatusBadge = ({ status }: TransactionStatusBadgeProps) => {
  return (
    <Badge variant={
      status === 'completed' ? 'default' :
      status === 'pending' ? 'secondary' : 'destructive'
    }>
      {status === 'completed' ? 'مكتمل' :
       status === 'pending' ? 'قيد المعالجة' : 'ملغي'}
    </Badge>
  )
}