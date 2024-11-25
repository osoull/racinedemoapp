import { Badge } from "@/components/ui/badge";

type UserTypeLabelProps = {
  type: string | null;
};

export function UserTypeLabel({ type }: UserTypeLabelProps) {
  const getUserTypeColor = (type: string | null) => {
    switch (type) {
      case 'admin':
        return 'bg-purple-500';
      case 'investment_manager':
        return 'bg-blue-500';
      case 'basic_investor':
        return 'bg-green-500';
      case 'qualified_investor':
        return 'bg-green-700';
      case 'borrower':
        return 'bg-orange-500';
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
      case 'basic_investor':
        return 'مستثمر أساسي';
      case 'qualified_investor':
        return 'مستثمر مؤهل';
      case 'borrower':
        return 'طالب تمويل';
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