import { Badge } from "@/components/ui/badge";

type KycStatusLabelProps = {
  status: string | null;
};

export function KycStatusLabel({ status }: KycStatusLabelProps) {
  const getKycStatusColor = (status: string | null) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getKycStatusLabel = (status: string | null) => {
    switch (status) {
      case 'approved':
        return 'معتمد';
      case 'pending':
        return 'قيد الانتظار';
      case 'rejected':
        return 'مرفوض';
      default:
        return 'غير محدد';
    }
  };

  return (
    <Badge variant="secondary" className={getKycStatusColor(status)}>
      KYC: {getKycStatusLabel(status)}
    </Badge>
  );
}