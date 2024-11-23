import { Badge } from "@/components/ui/badge";

type UserTypeLabelProps = {
  type: string | null;
};

export function UserTypeLabel({ type }: UserTypeLabelProps) {
  const getUserTypeColor = (type: string | null) => {
    switch (type) {
      case 'admin':
        return 'bg-red-500';
      case 'investment_manager':
        return 'bg-blue-500';
      case 'investor':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getUserTypeLabel = (type: string | null) => {
    switch (type) {
      case 'admin':
        return 'مشرف';
      case 'investment_manager':
        return 'مدير استثمار';
      case 'investor':
        return 'مستثمر';
      default:
        return 'غير محدد';
    }
  };

  return (
    <Badge variant="secondary" className={getUserTypeColor(type)}>
      {getUserTypeLabel(type)}
    </Badge>
  );
}