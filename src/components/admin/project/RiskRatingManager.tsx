import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRiskRating } from "@/hooks/useRiskRating";
import { Loader2 } from "lucide-react";

interface RiskRatingManagerProps {
  projectId: string;
  onClose?: () => void;
}

export const RiskRatingManager = ({ projectId, onClose }: RiskRatingManagerProps) => {
  const { riskRating, riskDescription, isLoading, updateRiskRating } = useRiskRating(projectId);
  const [selectedRating, setSelectedRating] = useState<string>(riskRating);
  const [description, setDescription] = useState<string>(riskDescription);

  // Update local state when the risk rating changes from the server
  useEffect(() => {
    setSelectedRating(riskRating);
    setDescription(riskDescription);
  }, [riskRating, riskDescription]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = () => {
    if (!selectedRating) return;
    
    updateRiskRating.mutate(
      { rating: selectedRating, description },
      {
        onSuccess: () => {
          if (onClose) onClose();
        }
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>تقييم المخاطر</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">تصنيف المخاطر</label>
          <Select
            value={selectedRating}
            onValueChange={setSelectedRating}
          >
            <SelectTrigger className="w-full text-right">
              <SelectValue placeholder="اختر تصنيف المخاطر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A - مخاطر منخفضة</SelectItem>
              <SelectItem value="B">B - مخاطر متوسطة</SelectItem>
              <SelectItem value="C">C - مخاطر عالية</SelectItem>
              <SelectItem value="D">D - مخاطر مرتفعة جداً</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">تفاصيل التقييم</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="أدخل تفاصيل تقييم المخاطر"
            className="text-right"
          />
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={updateRiskRating.isPending || !selectedRating}
          className="w-full"
        >
          {updateRiskRating.isPending ? "جاري الحفظ..." : "حفظ التقييم"}
        </Button>
      </CardContent>
    </Card>
  );
};