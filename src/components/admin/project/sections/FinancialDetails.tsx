import { Control } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InfoIcon, Coins, TrendingUp } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface FinancialDetailsProps {
  control: Control<any>;
}

export function FinancialDetails({ control }: FinancialDetailsProps) {
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
          <FormField
            control={control}
            name="funding_goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المبلغ المستهدف (ريال)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1000}
                    placeholder="مثال: 100,000"
                    {...field}
                  />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  الحد الأدنى 1000 ريال
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="min_investment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الحد الأدنى للاستثمار (ريال)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1000}
                    placeholder="مثال: 5,000"
                    {...field}
                  />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  الحد الأدنى المسموح به 1000 ريال
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="funding_usage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>خطة استخدام التمويل</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="اشرح بالتفصيل كيف سيتم استخدام التمويل في المشروع"
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">التوقعات المالية</h3>
        </div>
        <div className="space-y-4">
          <FormField
            control={control}
            name="expected_return"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العائد المتوقع</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="النسبة المئوية المتوقعة للعائد"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="investment_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>فترة الاستثمار المتوقعة (بالأشهر)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="عدد الأشهر"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>
    </div>
  );
}