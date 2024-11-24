import { Badge } from "@/components/ui/badge";

interface RiskRatingBadgeProps {
  rating: string;
}

export const RiskRatingBadge = ({ rating }: RiskRatingBadgeProps) => {
  const getColor = () => {
    switch (rating) {
      case "A":
        return "bg-green-500 hover:bg-green-600";
      case "B":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "C":
        return "bg-orange-500 hover:bg-orange-600";
      case "D":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Badge className={`${getColor()} text-white`}>
      {rating}
    </Badge>
  );
};