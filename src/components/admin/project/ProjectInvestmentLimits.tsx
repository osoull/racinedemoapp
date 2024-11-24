import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface ProjectInvestmentLimitsProps {
  control: Control<any>;
}

export const ProjectInvestmentLimits = ({ control }: ProjectInvestmentLimitsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="funding_goal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>المبلغ المستهدف *</FormLabel>
            <Input 
              type="number" 
              {...field} 
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="text-right"
              min={1000}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="min_investment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الحد الأدنى للاستثمار *</FormLabel>
            <Input 
              type="number" 
              {...field} 
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="text-right"
              min={1000}
            />
            <p className="text-sm text-muted-foreground">الحد الأدنى المسموح به: 1000 ريال</p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};