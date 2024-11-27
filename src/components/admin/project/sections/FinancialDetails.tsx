import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InfoIcon, Coins, TrendingUp } from "lucide-react";

interface FinancialDetailsProps {
  project?: any;
}

export function FinancialDetails({ project }: FinancialDetailsProps) {
  return (
    <div className="space-y-8">
      <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
        <div className="flex items-center gap-3 mb-6">
          <Coins className="w-5 h-5 text-green-600" />
          <div>
            <h3 className="font-semibold">التفاصيل المالية</h3>
            <p className="text-sm text-muted-foreground mt-1">
              حدد احتياجاتك المالية وكيفية استخدام التمويل
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <Label>المبلغ المستهدف (ريال)</Label>
            <Input
              type="number"
              min={1000}
              placeholder="مثال: 100,000"
              defaultValue={project?.funding_goal}
            />
            <p className="text-sm text-muted-foreground">
              الحد الأدنى 1000 ريال
            </p>
          </div>

          <div className="space-y-2">
            <Label>الحد الأدنى للاستثمار (ريال)</Label>
            <Input
              type="number"
              min={1000}
              placeholder="مثال: 5,000"
              defaultValue={project?.min_investment}
            />
            <p className="text-sm text-muted-foreground">
              الحد الأدنى المسموح به 1000 ريال
            </p>
          </div>

          <div className="space-y-2">
            <Label>خطة استخدام التمويل</Label>
            <Textarea
              placeholder="اشرح بالتفصيل كيف سيتم استخدام التمويل في المشروع"
              className="min-h-[150px]"
              defaultValue={project?.funding_usage}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">التوقعات المالية</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>العائد المتوقع</Label>
            <Input
              type="number"
              placeholder="النسبة المئوية المتوقعة للعائد"
              defaultValue={project?.expected_return}
            />
          </div>
          <div className="space-y-2">
            <Label>فترة الاستثمار المتوقعة (بالأشهر)</Label>
            <Input
              type="number"
              placeholder="عدد الأشهر"
              defaultValue={project?.investment_period}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}