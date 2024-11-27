import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";

interface FinancialDetailsProps {
  control: Control<any>;
}

export function FinancialDetails({ control }: FinancialDetailsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">التفاصيل المالية</h2>
        <p className="text-muted-foreground mb-6">
          حدد احتياجاتك المالية وكيفية استخدام التمويل. كن واقعياً في تقديراتك.
        </p>
      </div>

      <Card className="p-4 bg-muted/50">
        <div className="flex items-start gap-3">
          <InfoIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">نصائح مهمة</h3>
            <p className="text-sm text-muted-foreground">
              - حدد مبلغاً واقعياً يتناسب مع حجم مشروعك
              <br />
              - فكر في جميع التكاليف المحتملة
              <br />
              - ضع في اعتبارك مصاريف التشغيل الأولية
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="funding_goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المبلغ المستهدف (ريال) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  min={1000}
                  placeholder="مثال: 100000"
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">الحد الأدنى 1000 ريال</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="min_investment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الحد الأدنى للاستثمار (ريال) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  min={1000}
                  placeholder="مثال: 5000"
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">الحد الأدنى المسموح به 1000 ريال</p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="funding_usage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>خطة استخدام التمويل *</FormLabel>
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
  );
}