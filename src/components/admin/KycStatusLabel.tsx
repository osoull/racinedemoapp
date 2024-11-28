import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type KycStatusLabelProps = {
  status: string | null
}

export function KycStatusLabel({ status }: KycStatusLabelProps) {
  const getKycStatusColor = (status: string | null) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
      case 'rejected':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
    }
  }

  const getKycStatusLabel = (status: string | null) => {
    switch (status) {
      case 'approved':
        return 'معتمد'
      case 'pending':
        return 'قيد الانتظار'
      case 'rejected':
        return 'مرفوض'
      default:
        return 'غير محدد'
    }
  }

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "font-medium",
        getKycStatusColor(status)
      )}
    >
      KYC: {getKycStatusLabel(status)}
    </Badge>
  )
}