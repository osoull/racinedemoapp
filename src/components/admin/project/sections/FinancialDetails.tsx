import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FinancialDetailsProps {
  control: Control<any>;
}

export function FinancialDetails({ control }: FinancialDetailsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="funding_goal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>المبلغ المستهدف *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={(e) => field.onChange(Number(e.target.value))}
                min={1000}
              />
            </FormControl>
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
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={(e) => field.onChange(Number(e.target.value))}
                min={1000}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}