import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RiskRatingBadgeProps {
  rating: string;
  description?: string | null;
}

export const RiskRatingBadge = ({ rating, description }: RiskRatingBadgeProps) => {
  const getRatingInfo = () => {
    switch (rating) {
      case "A":
        return {
          color: "bg-green-500 hover:bg-green-600",
          label: "مخاطر منخفضة"
        };
      case "B":
        return {
          color: "bg-yellow-500 hover:bg-yellow-600",
          label: "مخاطر متوسطة"
        };
      case "C":
        return {
          color: "bg-orange-500 hover:bg-orange-600",
          label: "مخاطر عالية"
        };
      case "D":
        return {
          color: "bg-red-500 hover:bg-red-600",
          label: "مخاطر مرتفعة جداً"
        };
      default:
        return {
          color: "bg-gray-500 hover:bg-gray-600",
          label: "غير محدد"
        };
    }
  };

  const { color, label } = getRatingInfo();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge className={`${color} text-white cursor-help`}>
            {rating}
          </Badge>
        </TooltipTrigger>
        <TooltipContent dir="rtl" className="max-w-xs">
          <p className="font-semibold">{label}</p>
          {description && <p className="text-sm mt-1">{description}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};